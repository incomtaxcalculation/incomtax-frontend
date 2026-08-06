"use client";

import { useState } from "react";
import { useRouter } from "@/hooks/useRouter";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/upload";
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
import { ImageDropZone, getCurrentFile } from "@/components/ui/ImageDropZone";
import StatusIcon from "@/components/reusable/StatusIcon";
import { validate } from "@/lib/validation";

export default function CreateVideoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    short_description: "",
    thumbnail: null as File | null,
    thumbnailAlt: "",
    videoUrl: "",
    status: "draft",
  });

  // Store thumbnail preview URL
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const handleThumbnailChange = (file: File | null) => {
    setForm((prev) => ({ ...prev, thumbnail: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview("");
    }
  };

  const validateForm = () => {
    if (!validate(form.title, "required").valid) {
      toast.error("Title is required");
      return false;
    }
    if (!validate(form.short_description, "required").valid) {
      toast.error("Short description is required");
      return false;
    }
    if (!validate(form.videoUrl, "videoUrl").valid) {
      toast.error("Enter a valid YouTube or Vimeo URL");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let thumbnailUrl = null;
      const currentFile = getCurrentFile("thumbnail");
      if (currentFile) {
        thumbnailUrl = await uploadFile(currentFile, "videos");
      }

      const res = await fetch(
        `/api/videos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            short_description: form.short_description,
            videoUrl: form.videoUrl,
            status: form.status,
            thumbnailAlt: form.thumbnailAlt,
            thumbnail: thumbnailUrl,
          }),
          credentials: "include",
        },
      );

      if (res.ok) {
        toast.success("Video created successfully!");
        router.push("/admin/videos");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to create video");
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
        <form onSubmit={handleSubmit} className="w-full max-w-7xl space-y-6">
          <h1 className="text-2xl font-bold">Add New Video</h1>

          <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-2xl space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Video Title <StatusIcon value={form.title} type="required" />
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter video title"
              />
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
                placeholder="Brief overview of the video"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">
                Video URL <StatusIcon value={form.videoUrl} type="videoUrl" />
              </Label>
              <Input
                id="videoUrl"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="Enter YouTube or Vimeo URL"
              />
            </div>

            <div className="space-y-2">
              <Label>
                Thumbnail <StatusIcon value={thumbnailPreview} type="required" />
              </Label>
              <ImageDropZone
                value={thumbnailPreview}
                fileKey="thumbnail"
                onChange={(value) => {
                  if (!value) {
                    handleThumbnailChange(null);
                  } else {
                    const file = getCurrentFile("thumbnail");
                    handleThumbnailChange(file);
                  }
                }}
                alt={form.thumbnailAlt}
                onAltChange={(value) =>
                  setForm((prev) => ({ ...prev, thumbnailAlt: value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status <StatusIcon condition={true} />
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
                    <SelectLabel>Video Status</SelectLabel>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end bg-card border-t borer-gray-200 px-4 py-3 sticky bottom-0 rounded-b-lg z-10">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Video"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/videos")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
