"use client";

import { useState, useEffect, useRef } from "react";
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
} from "@/components/ui/ImageDropZone";
import { TiptapEditor } from "@/components/ui/TiptapEditor";
import { useImageModal } from "@/context/ImageModalContext";
import { uploadFile } from "@/lib/upload";
import { slugify, liveSlugify } from "@/lib/slugify";
import StatusIcon from "@/components/reusable/StatusIcon";
import { validate } from "@/lib/validation";
import SeoPanel from "@/components/services/SeoPanel";

export default function CreateBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
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
    if (slugEdited.current) return;
    const source = form.seo_title || form.title;
    if (source) {
      const newSlug = slugify(source);
      if (newSlug !== form.slug) {
        setForm((prev) => ({ ...prev, slug: newSlug, slugChecked: false }));
        setSlugAvailable(null);
      }
    }
  }, [form.seo_title, form.title]);

  useEffect(() => {
    const checkSlug = async () => {
      if (!form.slug || form.slug.length < 2) return;
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
  }, [form.slug]);

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
    if (!form.coverImage) {
      toast.error("Cover image is required");
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
      const currentFile = getCurrentFile();
      if (currentFile) {
        coverImageUrl = await uploadFile(currentFile, "blogs");
      }

      const res = await fetch(
        `/api/blogs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            slug: form.slug,
            short_description: form.shortDescription,
            description: form.description,
            status: form.status,
            coverImageAlt: form.coverImageAlt,
            coverImage: coverImageUrl,
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
        toast.success("Blog created successfully!");
        clearCurrentFile();
        router.push("/admin/blogs");
      } else {
        toast.error(data.message || "Failed to create blog");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full space-y-6 max-w-7xl">
          <h1 className="text-2xl font-bold">Create Blog</h1>
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
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const value = e.target.value.slice(0, 200);
                        setForm({ ...form, shortDescription: value });
                      }}
                      placeholder="Enter short description"
                      rows={3}
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
                    <SelectTrigger id="status" className="w-full">
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
                    {isLoading ? "Saving..." : "Create Blog"}
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
