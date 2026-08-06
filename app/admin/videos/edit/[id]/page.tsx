"use client";

import { useState, useEffect, use } from "react";
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
import StatusIcon from "@/components/reusable/StatusIcon";
import { uploadFile } from "@/lib/upload";
import { validate } from "@/lib/validation";

export default function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: videoId } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    short_description: "",
    thumbnail: "",
    thumbnailAlt: "",
    videoUrl: "",
    status: "draft",
  });

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/videos/${videoId}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const v = data.video;
          setInitialData(v);

          setForm({
            title: v.title || "",
            short_description: v.short_description || "",
            thumbnail: v.thumbnail || "",
            thumbnailAlt: v.thumbnailAlt || "",
            videoUrl: v.videoUrl || "",
            status: v.status || "draft",
          });
        } else {
          toast.error("Video not found");
          router.push("/admin/videos");
        }
      } catch (err) {
        toast.error("Failed to fetch video");
        router.push("/admin/videos");
      }
    };
    if (videoId && !initialData) {
      fetchVideo();
    }
  }, [videoId, router, initialData]);

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
        `/api/videos/${videoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            short_description: form.short_description,
            videoUrl: form.videoUrl,
            status: form.status,
            thumbnailAlt: form.thumbnailAlt,
            thumbnail: thumbnailUrl,
            existingThumbnail: !currentFile && form.thumbnail === "" ? "" : undefined,
          }),
          credentials: "include",
        },
      );

      if (res.ok) {
        toast.success("Video updated successfully!");
        clearAllFiles();
        router.push("/admin/videos");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update video");
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
          Loading video data...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-7xl space-y-6">
          <h1 className="text-2xl font-bold">Edit Video</h1>
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
                Thumbnail <StatusIcon value={form.thumbnail} type="required" />
              </Label>
              <ImageDropZone
                value={form.thumbnail}
                fileKey="thumbnail"
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, thumbnail: value }))
                }
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
                {isLoading ? "Saving..." : "Update Video"}
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
