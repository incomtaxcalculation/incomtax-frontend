"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "@/hooks/useRouter";
import { format } from "date-fns";
import {
  CalendarIcon,
  Search,
  X,
  FileText,
  CheckCircle2,
  PencilLine,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Edit,
  Trash2,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DeleteModel } from "@/components/reusable/DeleteModel";

interface Blog {
  _id: string;
  id: string;
  title: string;
  slug: string;
  short_description: string;
  status: string;
  created_at: string;
  updated_at: string;
  coverImage?: string;
  coverImageAlt?: string;
}

interface BlogsResponse {
  blogs: Blog[];
  totalBlogs: number;
  allTotalBlogs: number;
  allPublishedBlogs: number;
  allDraftBlogs: number;
  currentPage: number;
  totalPages: number;
  limit: number;
}

export default function BlogsPage() {
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [meta, setMeta] = useState({
    totalBlogs: 0,
    allTotalBlogs: 0,
    allPublishedBlogs: 0,
    allDraftBlogs: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState("all");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* =========================
     DELETE MODAL STATE
  ========================== */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  /* =========================
     DEBOUNCED SEARCH
  ========================== */
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  /* =========================
     RESET PAGE ON FILTER CHANGE
  ========================== */
  useEffect(() => {
    setPage(1);
  }, [limit, statusFilter, dateRange]);

  /* =========================
     FETCH BLOGS
  ========================== */
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", String(page));
      queryParams.append("limit", String(limit));
      if (debouncedSearch) queryParams.append("search", debouncedSearch);
      if (dateRange?.from) {
        queryParams.append("from_date", format(dateRange.from, "yyyy-MM-dd"));
      }
      if (dateRange?.to) {
        queryParams.append("to_date", format(dateRange.to, "yyyy-MM-dd"));
      }
      if (statusFilter && statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }

      const res = await fetch(`/api/blogs?${queryParams.toString()}`, {
        credentials: "include",
      });
      const data: BlogsResponse = await res.json();

      setBlogs(data.blogs || []);
      setMeta({
        totalBlogs: data.totalBlogs,
        allTotalBlogs: data.allTotalBlogs,
        allPublishedBlogs: data.allPublishedBlogs,
        allDraftBlogs: data.allDraftBlogs,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        limit: data.limit,
      });
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      toast.error("Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, debouncedSearch, dateRange, statusFilter]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  /* =========================
     STATUS CHANGE
  ========================== */
  const handleStatusChange = useCallback(
    async (slug: string, newStatus: string) => {
      try {
        const res = await fetch(`/api/blogs/${slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        });

        if (res.ok) {
          toast.success(`Status updated to ${newStatus}`);
          fetchBlogs();
        } else {
          toast.error("Failed to update status");
        }
      } catch {
        toast.error("Something went wrong");
      }
    },
    [fetchBlogs],
  );

  /* =========================
     DELETE BLOG
  ========================== */
  const handleDelete = async () => {
    if (!selectedId) return;
    setLoadingDelete(true);
    try {
      const res = await fetch(`/api/blogs/${selectedId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Blog deleted successfully");
        setDeleteOpen(false);
        setSelectedId(null);
        fetchBlogs();
      } else {
        const data = await res.json();
        toast.error(data.msg || "Failed to delete blog");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoadingDelete(false);
    }
  };

  const from = (meta.currentPage - 1) * meta.limit + 1;
  const to = Math.min(meta.currentPage * meta.limit, meta.totalBlogs);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blogs</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>
          <Button onClick={() => router.push("/admin/blogs/create")}>
            Add Blog
          </Button>
        </div>

        {/* KPI CARDS */}
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Blogs
              </CardTitle>
              <FileText className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {meta.allTotalBlogs}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All time posts
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
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {meta.allPublishedBlogs}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Live articles
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Drafts
              </CardTitle>
              <PencilLine className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-700">
                {meta.allDraftBlogs}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Work in progress
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <InputGroup className="flex-1">
            <InputGroupAddon>
              <Search className="h-4 w-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search by title or slug..."
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
                </SelectGroup>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="min-w-[260px] justify-start px-2.5 font-normal text-left"
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
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range: DateRange | undefined) => {
                    setDateRange(range);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {dateRange && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDateRange(undefined)}
                title="Clear date filter"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">No blogs found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">
                        Sr. No
                      </TableHead>
                      <TableHead className="w-16">Image</TableHead>
                      <TableHead className="min-w-[200px] max-w-[300px]">
                        Title
                      </TableHead>
                      <TableHead className="min-w-[140px] max-w-[200px]">
                        Slug
                      </TableHead>
                      <TableHead className="w-28">Status</TableHead>
                      <TableHead className="w-32 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.map((blog, index) => {
                      const serialNo =
                        (meta.currentPage - 1) * meta.limit + index + 1;
                      return (
                        <TableRow key={blog._id ?? blog.id}>
                          <TableCell className="text-center text-muted-foreground text-sm">
                            {serialNo}
                          </TableCell>
                          <TableCell>
                            <Image
                              src={blog.coverImage || "/image_not_found.webp"}
                              alt={blog.coverImageAlt || ""}
                              className="w-10 h-10 object-cover rounded-md"
                              unoptimized
                              width={40}
                              height={40}
                            />
                          </TableCell>
                          <TableCell className="max-w-[300px]">
                            <span className="block truncate font-medium">
                              {blog.title}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="block truncate text-muted-foreground text-sm">
                                  /{blog.slug}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>/{blog.slug}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={blog.status}
                              onValueChange={(newStatus) =>
                                handleStatusChange(blog.slug, newStatus)
                              }
                            >
                              <SelectTrigger
                                className={`w-28 h-8 ${
                                  blog.status === "published"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-muted text-foreground"
                                }`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Blog Status</SelectLabel>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="published">
                                    Published
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={`/blog/${blog.slug}`}
                                    target="_blank"
                                  >
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() =>
                                      router.push(
                                        `/admin/blogs/edit/${blog.slug}`,
                                      )
                                    }
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit</p>
                                </TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => {
                                      setSelectedId(String(blog.id));
                                      setDeleteOpen(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* PAGINATION FOOTER */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t bg-muted/50 gap-4">
                <div className="text-sm text-muted-foreground">
                  Showing {from} to {to} of {meta.totalBlogs} blogs
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground whitespace-nowrap">
                      Rows per page:
                    </span>
                    <Select
                      value={String(limit)}
                      onValueChange={(v) => setLimit(Number(v))}
                    >
                      <SelectTrigger className="w-20 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="h-8 w-8"
                      title="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm text-muted-foreground px-2 min-w-[80px] text-center">
                      Page {meta.currentPage} of {meta.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() =>
                        setPage((p) => Math.min(meta.totalPages, p + 1))
                      }
                      disabled={page === meta.totalPages}
                      className="h-8 w-8"
                      title="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* DELETE MODAL */}
        <DeleteModel
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Blog"
          description="This action cannot be undone. The blog will be permanently removed."
          onDelete={handleDelete}
          loading={loadingDelete}
          acceptLabel="I understand this will permanently delete the blog"
          confirmLabel="Delete"
        />
      </div>
    </AdminLayout>
  );
}