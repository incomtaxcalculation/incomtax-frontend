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
  clearAllFiles,
} from "@/components/ui/ImageDropZone";
import { TiptapEditor } from "@/components/ui/TiptapEditor";
import { IconPicker } from "@/components/ui/IconPicker";
import { uploadFile } from "@/lib/upload";
import StatusIcon from "@/components/reusable/StatusIcon";
import { slugify, liveSlugify } from "@/lib/slugify";
import { validate } from "@/lib/validation";
import SeoPanel from "@/components/services/SeoPanel";

export default function EditServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: oldSlug } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const slugEdited = useRef(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    long_description: "",
    icon: "",
    featureImage: "",
    featureImageAlt: "",
    status: "active",
    seo_title: "",
    seo_description: "",
    focus_keyword: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services/${oldSlug}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const s = data.service;
          setInitialData(s);
          setForm({
            title: s.title || "",
            slug: s.slug || "",
            short_description: s.short_description || "",
            long_description: s.long_description || "",
            icon: s.icon || "",
            featureImage: s.featureImage || "",
            featureImageAlt: s.featureImageAlt || "",
            status: s.status || "active",
            seo_title: s.seo_title || "",
            seo_description: s.seo_description || "",
            focus_keyword: s.focus_keyword || "",
          });
        } else {
          toast.error("Service not found");
          router.push("/admin/services");
        }
      } catch {
        toast.error("Failed to fetch service");
        router.push("/admin/services");
      }
    };
    if (oldSlug && !initialData) {
      fetchService();
    }
  }, [oldSlug, router, initialData]);

  useEffect(() => {
    if (slugEdited.current || !initialData) return;
    const source = form.seo_title || form.title;
    if (source) {
      const generatedSlug = slugify(source);
      if (generatedSlug !== form.slug) {
        setForm((prev) => ({ ...prev, slug: generatedSlug }));
      }
    }
  }, [form.seo_title, form.title, form.slug, initialData]);

  useEffect(() => {
    const checkSlug = async () => {
      if (!form.slug || form.slug.length < 2) return;
      if (initialData && form.slug === initialData.slug) {
        setSlugAvailable(true);
        return;
      }
      setIsCheckingSlug(true);
      try {
        const res = await fetch(`/api/services/check-slug/${form.slug}`, { credentials: "include" });
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
      toast.error("Slug must be lowercase with hyphens (e.g. my-service)");
      return false;
    }
    if (slugAvailable === false) {
      toast.error("Slug is already taken");
      return false;
    }
    if (!validate(form.short_description, "required").valid) {
      toast.error("Short description is required");
      return false;
    }
    if (!validate(form.long_description, "required").valid || form.long_description === "<p></p>") {
      toast.error("Full description is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const featureFile = getCurrentFile("featureImage");
      const featureImageUrl = featureFile ? await uploadFile(featureFile, "services") : null;

      const res = await fetch(
        `/api/services/${oldSlug}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            slug: form.slug,
            short_description: form.short_description,
            long_description: form.long_description,
            icon: form.icon || undefined,
            status: form.status,
            featureImageAlt: form.featureImageAlt,
            featureImage: featureImageUrl,
            existingFeatureImage: !featureFile && form.featureImage === "" ? "" : undefined,
            seo_title: form.seo_title,
            seo_description: form.seo_description,
            focus_keyword: form.focus_keyword,
          }),
          credentials: "include",
        },
      );

      if (res.ok) {
        toast.success("Service updated successfully!");
        clearAllFiles();
        router.push("/admin/services");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update service");
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
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading service data...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-7xl space-y-6">
          <h1 className="text-2xl font-bold">Edit Service</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - 60% */}
            <div className="lg:col-span-3 bg-card space-y-6">
              <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-2xl space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Service Title <StatusIcon value={form.title} type="required" />
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Enter service title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Icon
                    </Label>
                    <IconPicker
                      value={form.icon}
                      onChange={(val) => setForm({ ...form, icon: val })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">
                    Short Description{" "}
                    <StatusIcon value={form.short_description} type="required" />
                  </Label>
                  <Textarea
                    id="short_description"
                    value={form.short_description}
                    onChange={(e) =>
                      setForm({ ...form, short_description: e.target.value })
                    }
                    placeholder="Brief overview of the service"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Full Description{" "}
                    <StatusIcon
                      condition={
                        !!form.long_description &&
                        form.long_description !== "<p></p>"
                      }
                    />
                  </Label>
                  <TiptapEditor
                    value={form.long_description}
                    onChange={(val) => setForm({ ...form, long_description: val })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Featured Image <StatusIcon value={form.featureImage} type="required" />
                  </Label>
                  <ImageDropZone
                    value={form.featureImage}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, featureImage: value }))
                    }
                    alt={form.featureImageAlt}
                    onAltChange={(value) =>
                      setForm((prev) => ({ ...prev, featureImageAlt: value }))
                    }
                    fileKey="featureImage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <StatusIcon condition={true} />
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(val) => setForm({ ...form, status: val })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Service Status</SelectLabel>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 justify-end bg-card border-t borer-gray-200 px-4 py-3 sticky bottom-0 rounded-b-lg z-10">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Update Service"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/services")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - 40% (SEO Panel) */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-gray-300 dark:border-gray-600 p-4 rounded-2xl sticky top-24">
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
                  onSeoTitleChange={(val) =>
                    setForm({ ...form, seo_title: val })
                  }
                  seoDescription={form.seo_description}
                  onSeoDescriptionChange={(val) =>
                    setForm({ ...form, seo_description: val })
                  }
                  focusKeyword={form.focus_keyword}
                  onFocusKeywordChange={(val) =>
                    setForm({ ...form, focus_keyword: val })
                  }
                  title={form.title}
                  shortDescription={form.short_description}
                  featureImage={form.featureImage}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
