"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/hooks/useRouter";
import { Loader2, ArrowLeft, Save, Eye, EyeOff, LayoutTemplate } from "lucide-react";
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
import { IconPicker } from "@/components/ui/IconPicker";
import {
  ImageDropZone,
  getCurrentFile,
  clearAllFiles,
} from "@/components/ui/ImageDropZone";
import { uploadFile } from "@/lib/upload";
import { slugify, liveSlugify } from "@/lib/slugify";
import { validate } from "@/lib/validation";
import { AdminEditProvider, useAdminEdit } from "@/components/service-detail/AdminEditContext";
import ServicePageBody from "@/components/service-detail/ServicePageBody";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import defaultTemplateData from "@/components/service-detail/default-template-data";
import type { TemplateData } from "@/components/service-detail/types";

function CreateEditorToolbar({
  title,
  slug,
  shortDescription,
  icon,
  status,
  onTitleChange,
  onSlugChange,
  onShortDescriptionChange,
  onIconChange,
  onStatusChange,
}: {
  title: string;
  slug: string;
  shortDescription: string;
  icon: string;
  status: string;
  onTitleChange: (v: string) => void;
  onSlugChange: (v: string) => void;
  onShortDescriptionChange: (v: string) => void;
  onIconChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}) {
  const { saveChanges, saving } = useAdminEdit();
  const router = useRouter();
  const [preview, setPreview] = useState(true);
  const slugEdited = useRef(false);
  const [localSlug, setLocalSlug] = useState(slug);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  useEffect(() => {
    setLocalSlug(slug);
  }, [slug]);

  useEffect(() => {
    if (slugEdited.current) return;
    const source = title;
    if (source) {
      const generatedSlug = slugify(source);
      if (generatedSlug !== localSlug) {
        setLocalSlug(generatedSlug);
        onSlugChange(generatedSlug);
      }
    }
  }, [title]);

  useEffect(() => {
    const checkSlug = async () => {
      if (!localSlug || localSlug.length < 2) return;
      setIsCheckingSlug(true);
      try {
        const res = await fetch(`/api/services/check-slug/${localSlug}`, {
          credentials: "include",
        });
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
  }, [localSlug]);

  const handleCreate = async (publishStatus: string) => {
    if (!validate(title, "required").valid) {
      toast.error("Title is required");
      return;
    }
    if (!validate(localSlug, "slug").valid) {
      toast.error("Slug must be lowercase with hyphens (e.g. my-service)");
      return;
    }
    if (slugAvailable === false) {
      toast.error("Slug is already taken");
      return;
    }
    if (!validate(shortDescription, "required").valid) {
      toast.error("Short description is required");
      return;
    }

    try {
      const res = await fetch(`/api/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: localSlug,
          short_description: shortDescription,
          long_description: "",
          icon: icon || undefined,
          status: publishStatus,
          use_template: true,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.msg || "Failed to create service");
        return;
      }

      const result = await res.json();

      const templateRes = await fetch(`/api/services/${localSlug}/template`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_template: true,
          template_data: defaultTemplateData,
        }),
        credentials: "include",
      });

      if (templateRes.ok) {
        toast.success(
          publishStatus === "active"
            ? "Service published successfully!"
            : "Draft saved successfully!"
        );
        clearAllFiles();
        router.push(`/admin/services/editor/${localSlug}`);
      } else {
        toast.error("Service created but failed to save template data");
        router.push("/admin/services");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="sticky top-0 z-50 border-b bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/services")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-[#006666]" />
              <h1 className="text-sm font-semibold">Create Service with Template</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreview(!preview)}
            >
              {preview ? (
                <EyeOff className="h-4 w-4 mr-1" />
              ) : (
                <Eye className="h-4 w-4 mr-1" />
              )}
              {preview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCreate("inactive")}
            >
              <Save className="h-4 w-4 mr-1" />
              Save as Draft
            </Button>
            <Button
              size="sm"
              onClick={() => handleCreate("active")}
              className="bg-[#006666] hover:bg-[#005555]"
            >
              <Save className="h-4 w-4 mr-1" />
              Create Service
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Title</Label>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Service title"
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Slug</Label>
            <div className="relative">
              <Input
                value={localSlug}
                onChange={(e) => {
                  slugEdited.current = true;
                  const val = liveSlugify(e.target.value);
                  setLocalSlug(val);
                  onSlugChange(val);
                }}
                placeholder="service-slug"
                className="h-8 text-sm pr-7"
              />
              {isCheckingSlug && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2" />
              )}
              {!isCheckingSlug && slugAvailable === false && (
                <span className="text-[10px] text-red-500 absolute -bottom-4 left-0">
                  Slug taken
                </span>
              )}
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Icon</Label>
            <IconPicker
              value={icon}
              onChange={onIconChange}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Status</Label>
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Short Description</Label>
          <Textarea
            value={shortDescription}
            onChange={(e) => onShortDescriptionChange(e.target.value)}
            placeholder="Brief overview of the service"
            rows={2}
            className="text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function CreateEditorPageContent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [status, setStatus] = useState("draft");

  return (
    <AdminEditProvider initialData={defaultTemplateData} serviceSlug={slug || "new"}>
      <div className="min-h-screen bg-white">
        <CreateEditorToolbar
          title={title}
          slug={slug}
          shortDescription={shortDescription}
          icon={icon}
          status={status}
          onTitleChange={setTitle}
          onSlugChange={setSlug}
          onShortDescriptionChange={setShortDescription}
          onIconChange={setIcon}
          onStatusChange={setStatus}
        />
        <PublicHeader />
        <ServicePageBody templateData={defaultTemplateData} />
        <Footer />
      </div>
    </AdminEditProvider>
  );
}

export default function CreateEditorPage() {
  return <CreateEditorPageContent />;
}
