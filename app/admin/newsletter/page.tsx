"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
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
import { Button } from "@/components/ui/button";
import { Trash2, Mail, Search, Users } from "lucide-react";

interface Subscriber {
  _id: string;
  email: string;
  ip: string;
  deviceType: string;
  browser: string;
  os: string;
  location: string;
  createdAt: string;
}

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "gi");
  const lowerQuery = query.toLowerCase();
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === lowerQuery ? (
      <span key={i} className="bg-yellow-200 text-black rounded">
        {part}
      </span>
    ) : (
      part
    ),
  );
};

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const stats = useMemo(
    () => ({
      total: subscribers.length,
    }),
    [subscribers],
  );

  const fetchSubscribers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/newsletter`, { credentials: "include" });
      const data = await res.json();
      console.log("Fetched subscribers:", data);
      setSubscribers(data.subscribers || []);
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const filteredSubscribers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return subscribers;

    return subscribers.filter((s) => s.email?.toLowerCase().includes(q));
  }, [search, subscribers]);

  const columns = useMemo(
    () => [
      {
        key: "email",
        label: "Email",
        sortable: true,
        render: (value: any) => (
          <a
            href={`mailto:${value}`}
            className="text-[#0d7a7a] hover:underline"
          >
            {highlightText(String(value), search)}
          </a>
        ),
      },
      {
        key: "deviceType",
        label: "Device",
        render: (value: any) => <span className="text-xs">{value || "-"}</span>,
      },
      {
        key: "browser",
        label: "Browser",
        render: (value: any) => <span className="text-xs">{value || "-"}</span>,
      },
      {
        key: "os",
        label: "OS",
        render: (value: any) => <span className="text-xs">{value || "-"}</span>,
      },
      {
        key: "location",
        label: "Location",
        render: (value: any) => (
          <span className="text-xs text-muted-foreground">
            {value || <span className="italic">Unknown</span>}
          </span>
        ),
      },
      {
        key: "ip",
        label: "IP",
        render: (value: any) => (
          <span className="text-xs text-muted-foreground">{value || "-"}</span>
        ),
      },
      {
        key: "createdAt",
        label: "Subscribed",
        sortable: true,
        render: (value: any) => format(new Date(value), "dd MMM yyyy, HH:mm"),
      },
    ],
    [search],
  );

  const handleDelete = async () => {
    if (!selectedId) return;
    setLoadingDelete(true);
    try {
      await fetch(`/api/newsletter/${selectedId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setSubscribers(subscribers.filter((s) => s._id !== selectedId));
      setDeleteOpen(false);
      setSelectedId(null);
      toast.success("Subscriber deleted successfully");
    } catch (err) {
      console.error("Failed to delete subscriber:", err);
      toast.error("Failed to delete subscriber");
    } finally {
      setLoadingDelete(false);
    }
  };

  const customRender = useCallback(
    (key: string, value: any, row: Subscriber) => {
      if (key === "actions") {
        return (
          <div className="inline-flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-red-600"
                    onClick={() => {
                      setSelectedId(row._id);
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
        );
      }
      return null;
    },
    [],
  );

  const columnsWithActions = useMemo(
    () => [
      ...columns,
      {
        key: "actions",
        label: "Actions",
        sortable: false,
        render: (_: any, row: Subscriber) => customRender("actions", _, row),
      },
    ],
    [columns, customRender],
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Newsletter</h1>
            <p className="text-muted-foreground">Manage email subscribers</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <InputGroup className="flex-1">
            <InputGroupAddon>
              <Search className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d7a7a]" />
          </div>
        ) : (
          <DataTable
            columns={columnsWithActions}
            data={filteredSubscribers}
            showPagination
            lastColumnSticky={false}
          />
        )}

        <DeleteModel
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Subscriber"
          description="This action cannot be undone."
          onDelete={handleDelete}
          loading={loadingDelete}
          acceptLabel="I understand this will permanently delete the subscriber"
          confirmLabel="Delete"
        />
      </div>
    </AdminLayout>
  );
}
