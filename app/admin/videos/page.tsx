"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "@/hooks/useRouter";
import { format } from "date-fns";
import {
  CalendarIcon,
  Search,
  X,
  Video,
  CheckCircle2,
  Archive,
  FileText,
  Play,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import Image from "next/image";
import { formatId } from "@/lib/format-id";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { DeleteModel } from "@/components/reusable/DeleteModel";
import { Edit, Trash2 } from "lucide-react";
import { VideoModal } from "@/components/ui/VideoModal";
import { useImageModal } from "@/context/ImageModalContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface Video {
  id: number;
  title: string;
  short_description: string;
  thumbnail?: string;
  video_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-yellow-200 text-black rounded">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

export default function VideosPage() {
  const router = useRouter();
  const { openImageModal } = useImageModal();

  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState("all");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{
    src: string;
    title: string;
  } | null>(null);

  const stats = {
    total: videos.length,
    published: videos.filter((v) => v.status === "published").length,
    draft: videos.filter((v) => v.status === "draft").length,
    archived: videos.filter((v) => v.status === "archived").length,
  };

  const columns = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      render: (v: any) => <span>#{formatId(v)}</span>,
    },
    {
      key: "thumbnail",
      label: "Thumbnail",
      render: (_value: any, row: Video) => {
        // if (!row.thumbnail) return "-";
        return (
          <div className="relative w-15 h-15 rounded-md overflow-hidden cursor-pointer group">
            <Image
              src={row.thumbnail || "/image_not_found.webp"}
              alt={row.title}
              className="w-full h-full object-cover"
              unoptimized
              fill
              onClick={() => {
                openImageModal(row.thumbnail || "", row.title);
              }}
            />
          </div>
        );
      },
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (value: any) => (
        <span className="font-medium">
          {highlightText(String(value), search)}
        </span>
      ),
    },
    {
      key: "video",
      label: "Video",
      render: (_value: any, row: Video) => {
        if (!row.video_url) return "-";
        return (
          <Button
            variant="link"
            size="sm"
            className="text-blue-600 dark:text-white h-auto p-0"
            onClick={() => {
              setSelectedVideo({
                src: row.video_url || "",
                title: row.title,
              });
              setVideoModalOpen(true);
            }}
          >
            <Play className="h-4 w-4 mr-1" />
            Open Video
          </Button>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value: any, row: Video) => {
        const status = String(value).toLowerCase();
        return (
          <Select
            value={status}
            onValueChange={(newStatus) => handleStatusChange(row.id, newStatus)}
          >
            <SelectTrigger
              className={`w-28 ${
                status === "published"
                  ? "bg-green-100 text-green-700"
                  : status === "draft"
                    ? "bg-muted text-foreground"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
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
        );
      },
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (value: any) => format(new Date(value), "dd MMM yyyy"),
    },
    {
      key: "updatedAt",
      label: "Updated At",
      sortable: true,
      render: (value: any) =>
        value ? format(new Date(value), "dd MMM yyyy, HH:mm") : "-",
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_value: any, row: Video) => (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => router.push(`/admin/videos/edit/${row.id}`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-red-600"
                  onClick={() => {
                    setSelectedId(row.id);
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (dateRange?.from)
        queryParams.append("from_date", format(dateRange.from, "yyyy-MM-dd"));
      if (dateRange?.to)
        queryParams.append("to_date", format(dateRange.to, "yyyy-MM-dd"));
      if (statusFilter && statusFilter !== "all")
        queryParams.append("status", statusFilter);

      const res = await fetch(
        `/api/videos?${queryParams.toString()}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setVideos(data.videos || []);
      setFilteredVideos(data.videos || []);
    } catch (err) {
      toast.error("Failed to fetch videos");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, statusFilter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });

      if (res.ok) {
        toast.success(`Status updated to ${newStatus}`);
        fetchVideos();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    const q = search.toLowerCase();
    const filtered = videos.filter(
      (v) =>
        v.title?.toLowerCase().includes(q) ||
        v.short_description?.toLowerCase().includes(q) ||
        formatId(v.id).toLowerCase().includes(q) ||
        `#${formatId(v.id).toLowerCase()}`.includes(q),
    );
    setFilteredVideos(filtered);
  }, [search, videos]);

  const handleDelete = async () => {
    if (!selectedId) return;
    setLoadingDelete(true);
    try {
      await fetch(`/api/videos/${selectedId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const updated = videos.filter((v) => v.id !== selectedId);
      setVideos(updated);
      setDeleteOpen(false);
      toast.success("Video deleted");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Videos</h1>
            <p className="text-muted-foreground">Manage your videos</p>
          </div>
          <Button onClick={() => router.push("/admin/videos/create")}>
            Add Video
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Videos
              </CardTitle>
              <Video className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-foreground">
                {stats.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All uploaded videos
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Published
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-green-600">
                {stats.published}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Live videos</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Drafts
              </CardTitle>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-foreground">
                {stats.draft}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Work in progress
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Archived
              </CardTitle>
              <Archive className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold text-yellow-600">
                {stats.archived}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Archived videos
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <InputGroup className="flex-1">
            <InputGroupAddon>
              <Search className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filter by Status</SelectLabel>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[260px] justify-start px-2.5 font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} –{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {dateRange && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDateRange(undefined)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
            Loading...
          </div>
        ) : (
          <DataTable columns={columns} data={filteredVideos} />
        )}

        <DeleteModel
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Video"
          description="This action cannot be undone. The video will be permanently removed."
          onDelete={handleDelete}
          loading={loadingDelete}
          confirmLabel="Delete"
        />

        {selectedVideo && (
          <VideoModal
            src={selectedVideo.src}
            title={selectedVideo.title}
            isOpen={videoModalOpen}
            onClose={() => {
              setVideoModalOpen(false);
              setSelectedVideo(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
