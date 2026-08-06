"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "@/hooks/useRouter";
import { format } from "date-fns";
import {
  CalendarIcon,
  Search,
  X,
  Briefcase,
  CheckCircle2,
  XCircle,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  status: string;
  created_at: string;
  updated_at: string;
  featureImage?: string;
  featureImageAlt?: string;
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

export default function ServicesPage() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [statusFilter, setStatusFilter] = useState("all");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const stats = {
    total: services.length,
    active: services.filter((s) => s.status === "active").length,
    inactive: services.filter((s) => s.status === "inactive").length,
  };

  const columns = [
    { key: "id", label: "ID", sortable: true, render: (v: any) => <span>#{formatId(v)}</span> },
    {
      key: "featureImage",
      label: "Featured Image",
      render: (_value: any, row: Service, openModal: any) => {
        return (
          <Image
            src={row.featureImage || "/image_not_found.webp"}
            alt={row.featureImageAlt || ""}
            className="w-15 h-15 object-cover rounded-md cursor-pointer"
            unoptimized
            width={60}
            height={60}
            onClick={(e) => {
              e.stopPropagation();
              openModal(row.featureImage!, row.featureImageAlt || "");
            }}
          />
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
      key: "status",
      label: "Status",
      render: (value: any, row: Service) => {
        const status = String(value).toLowerCase();
        return (
          <Select
            value={status}
            onValueChange={(newStatus) =>
              handleStatusChange(row.slug, newStatus)
            }
          >
            <SelectTrigger
              className={`w-28  ${
                status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
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
      render: (_value: any, row: Service) => (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() =>
                    router.push(`/admin/services/edit/${row.slug}`)
                  }
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

  const fetchServices = useCallback(async () => {
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
        `/api/services?${queryParams.toString()}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setServices(data.services || []);
      setFilteredServices(data.services || []);
    } catch (err) {
      toast.error("Failed to fetch services");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, statusFilter]);

  const handleStatusChange = async (slug: string, newStatus: string) => {
    try {
      const res = await fetch(
        `/api/services/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
          credentials: "include",
        },
      );

      if (res.ok) {
        toast.success(`Status updated to ${newStatus}`);
        fetchServices();
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    const q = search.toLowerCase();
    const filtered = services.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.slug?.toLowerCase().includes(q) ||
        s.short_description?.toLowerCase().includes(q) ||
        formatId(s.id).toLowerCase().includes(q) ||
        `#${formatId(s.id).toLowerCase()}`.includes(q),
    );
    setFilteredServices(filtered);
  }, [search, services]);

  const handleDelete = async () => {
    if (!selectedId) return;
    setLoadingDelete(true);
    try {
      await fetch(
        `/api/services/${selectedId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const updated = services.filter((s) => s.id !== selectedId);
      setServices(updated);
      setDeleteOpen(false);
      toast.success("Service deleted");
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
            <h1 className="text-3xl font-bold">Services</h1>
            <p className="text-muted-foreground">Manage your services</p>
          </div>
          <Button onClick={() => router.push("/admin/services/create")}>
            Add Service
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {/* Total Services */}
          <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Services
              </CardTitle>
              <Briefcase className="h-5 w-5 text-blue-500" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All listed services
              </p>
            </CardContent>
          </Card>

          {/* Active */}
          <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {stats.active}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently running
              </p>
            </CardContent>
          </Card>

          {/* Inactive */}
          <Card className="relative overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Inactive
              </CardTitle>
              <XCircle className="h-5 w-5 text-red-500" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {stats.inactive}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Not available
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
              placeholder="Search services..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
          <DataTable columns={columns} data={filteredServices} />
        )}

        <DeleteModel
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Service"
          description="This action cannot be undone. The service will be permanently removed."
          onDelete={handleDelete}
          loading={loadingDelete}
          confirmLabel="Delete"
        />
      </div>
    </AdminLayout>
  );
}
