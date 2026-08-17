"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "@/hooks/useRouter";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImageDropZone,
  getCurrentFile,
  clearCurrentFile,
  clearAllFiles,
} from "@/components/ui/ImageDropZone";
import { TiptapEditor } from "@/components/ui/TiptapEditor";
import { useImageModal } from "@/context/ImageModalContext";
import { uploadFile } from "@/lib/upload";
import StatusIcon from "@/components/reusable/StatusIcon";
import { slugify, liveSlugify } from "@/lib/slugify";
import { validate } from "@/lib/validation";
import SeoPanel from "@/components/services/SeoPanel";

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const slugEdited = useRef(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    slugChecked: false,
    shortDescription: "",
    description: "",
    coverImage: "",
    coverImageAlt: "",
    status: "draft",
    seo_title: "",
    seo_description: "",
    focus_keyword: "",
    schemaMarkup: "",
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${slug}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const blog = data.blog;
          setInitialData(blog);
          setForm({
            title: blog.title || "",
            slug: blog.slug || "",
            slugChecked: true,
            shortDescription:
              blog.short_description || blog.shortDescription || "",
            description: blog.details || blog.description || "",
            coverImage: blog.coverImage || "",
            coverImageAlt: blog.coverImageAlt || "",
            status: blog.status || "draft",
            seo_title: blog.seo_title || "",
            seo_description: blog.seo_description || "",
            focus_keyword: blog.focus_keyword || "",
            schemaMarkup: blog.schemaMarkup || "",
          });
        }
      } catch (err) {
        toast.error("Failed to fetch blog");
        router.push("/admin/blogs");
      }
    };
    if (slug && !initialData) {
      fetchBlog();
    }
  }, [slug, router, initialData]);

  useEffect(() => {
    if (slugEdited.current) return;
    if (!initialData) return;
    const source = form.seo_title || form.title;
    if (source && (form.seo_title !== initialData.seo_title || form.title !== initialData.title)) {
      const newSlug = slugify(source);
      if (newSlug !== form.slug) {
        setForm((prev) => ({ ...prev, slug: newSlug, slugChecked: false }));
        setSlugAvailable(null);
      }
    }
  }, [form.seo_title, form.title, initialData]);

  useEffect(() => {
    const checkSlug = async () => {
      if (!form.slug || form.slug.length < 2) return;
      if (initialData && form.slug === initialData.slug) {
        setSlugAvailable(true);
        return;
      }
      setIsCheckingSlug(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/check-slug/${form.slug}`, { credentials: "include" });
        const data = await res.json();
        setSlugAvailable(!data.exists);
      } catch {
        setSlugAvailable(null);
      } finally {
        setIsCheckingSlug(false);
      }
    };
    const timer = setTimeout(checkSlug, 500);
    return () => clearTimeout(timer);
  }, [form.slug, initialData]);

  const validateForm = () => {
    if (!validate(form.title, "required").valid) {
      toast.error("Title is required");
      return false;
    }
    if (!validate(form.slug, "slug").valid) {
      toast.error("Slug must be lowercase with hyphens (e.g. my-blog-post)");
      return false;
    }
    if (slugAvailable === false) {
      toast.error("Slug is already taken");
      return false;
    }
    if (!validate(form.shortDescription, "required").valid) {
      toast.error("Short description is required");
      return false;
    }
    if (!validate(form.description, "required").valid || form.description === "<p></p>") {
      toast.error("Description is required");
      return false;
    }
    if (!validate(form.coverImageAlt, "required").valid) {
      toast.error("Cover image alt text is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let coverImageUrl = form.coverImage;
      const currentFile = getCurrentFile("blog-cover");
      if (currentFile) {
        coverImageUrl = await uploadFile(currentFile, "blogs");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${slug}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            slug: form.slug,
            short_description: form.shortDescription,
            description: form.description,
            status: form.status,
            coverImageAlt: form.coverImageAlt,
            coverImage: currentFile ? coverImageUrl : undefined,
            existingImage: !currentFile && form.coverImage === "" ? "" : undefined,
            seo_title: form.seo_title,
            seo_description: form.seo_description,
            focus_keyword: form.focus_keyword,
            schemaMarkup: form.schemaMarkup,
          }),
          credentials: "include",
        },
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Blog updated successfully!");
        clearAllFiles();
        router.push("/admin/blogs");
      } else {
        toast.error(data.message || "Failed to update blog");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-7xl space-y-6">
          <h1 className="text-2xl font-bold">Edit Blog</h1>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-card border border-gray-300 dark:border-gray-600 p-4 rounded-2xl space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Title <StatusIcon value={form.title} type="required" />
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Enter blog title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      Slug <StatusIcon value={form.slug} type="slug" />
                      {isCheckingSlug && (
                        <span className="text-xs text-muted-foreground">
                          (checking...)
                        </span>
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        id="slug"
                        value={form.slug}
                        onChange={(e) => {
                          slugEdited.current = true;
                          setForm({ ...form, slug: liveSlugify(e.target.value) });
                        }}
                        placeholder="blog-slug"
                      />
                      {slugAvailable === true && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-green-500">
                          Available
                        </span>
                      )}
                      {slugAvailable === false && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500">
                          Taken
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">
                    Short Description{" "}
                    <StatusIcon value={form.shortDescription} type="required" />
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="shortDescription"
                      value={form.shortDescription}
                      maxLength={200}
                      rows={3}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const value = e.target.value.slice(0, 200);
                        setForm({ ...form, shortDescription: value });
                      }}
                      placeholder="Enter short description"
                      className="max-h-30 overflow-y-auto"
                    />

                    <div className="absolute bottom-1 right-3 text-sm text-muted-foreground text-right">
                      {form.shortDescription.length}/200
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Description <StatusIcon value={form.description} type="required" />
                  </Label>
                  <TiptapEditor
                    value={form.description}
                    onChange={(value) => setForm({ ...form, description: value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Cover Image <StatusIcon value={form.coverImage} type="required" />
                  </Label>
                  <ImageDropZone
                    value={form.coverImage}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, coverImage: value }))
                    }
                    alt={form.coverImageAlt}
                    onAltChange={(value) =>
                      setForm((prev) => ({ ...prev, coverImageAlt: value }))
                    }
                    fileKey="blog-cover"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <StatusIcon condition={!!form.status} />
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) => setForm({ ...form, status: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Blog Status</SelectLabel>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 justify-end bg-card border-t borer-gray-200 px-4 py-3 sticky bottom-0 rounded-b-lg">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Update Blog"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/blogs")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-card border border-gray-300 dark:border-gray-600 p-4 rounded-2xl sticky top-24 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
                  <SeoPanel
                    slug={form.slug}
                    onSlugChange={(val) => {
                      slugEdited.current = true;
                      setForm({ ...form, slug: liveSlugify(val) });
                    }}
                    slugAvailable={slugAvailable}
                    isCheckingSlug={isCheckingSlug}
                    seoTitle={form.seo_title}
                    onSeoTitleChange={(val) => setForm({ ...form, seo_title: val })}
                    seoDescription={form.seo_description}
                    onSeoDescriptionChange={(val) => setForm({ ...form, seo_description: val })}
                    focusKeyword={form.focus_keyword}
                    onFocusKeywordChange={(val) => setForm({ ...form, focus_keyword: val })}
                    title={form.title}
                    shortDescription={form.shortDescription}
                    featureImage={form.coverImage}
                    previewPath="blog"
                  />
                </div>

                <hr className="border-gray-200 dark:border-gray-600" />

                <div>
                  <h2 className="text-lg font-semibold mb-4">Schema Markup (JSON-LD)</h2>
                  <div className="space-y-2">
                    <Label htmlFor="schemaMarkup">
                      Schema Markup (JSON-LD)
                    </Label>
                    <Textarea
                      id="schemaMarkup"
                      value={form.schemaMarkup}
                      onChange={(e) => setForm({ ...form, schemaMarkup: e.target.value })}
                      placeholder={`{\n  "@context": "https://schema.org",\n  "@graph": []\n}`}
                      rows={12}
                      className="font-mono text-xs leading-relaxed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Add structured data markup. This will be injected as JSON-LD in the page head.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
