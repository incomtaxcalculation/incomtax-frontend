"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "@/hooks/useRouter";
import { format } from "date-fns";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
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
import { Edit, Trash2, Mail, MailOpen, Search } from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "gi");
  const lowerQuery = query.toLowerCase();
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === lowerQuery ? (
      <span key={i} className="bg-yellow-200 text-black rounded">{part}</span>
    ) : (part)
  );
};

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isReadFilter, setIsReadFilter] = useState("all");

  const stats = useMemo(() => ({
    total: messages.length,
    read: messages.filter((m) => m.isRead).length,
    unread: messages.filter((m) => !m.isRead).length,
  }), [messages]);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/messages`, { credentials: "include" });
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Message marked as read");
        fetchMessages();
      } else {
        toast.error("Failed to update message");
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
      toast.error("Something went wrong");
    }
  }, [fetchMessages]);

  const filteredMessages = useMemo(() => {
    let filtered = messages;

    if (isReadFilter !== "all") {
      filtered = filtered.filter((m) =>
        isReadFilter === "read" ? m.isRead : !m.isRead
      );
    }

    const q = search.toLowerCase().trim();
    if (!q) return filtered;

    return filtered.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.phone?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q)
    );
  }, [search, isReadFilter, messages]);

  const columns = useMemo(() => [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (value: any) => <span>{highlightText(String(value), search)}</span>,
    },
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
      key: "phone",
      label: "Phone",
      render: (value: any) => (
        <span className="text-muted-foreground">
          {value || <span className="italic text-xs">No phone</span>}
        </span>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      sortable: true,
      render: (value: any) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 max-w-[200px] truncate">
          {value || <span className="italic">No subject</span>}
        </span>
      ),
    },
    {
      key: "message",
      label: "Message",
      render: (value: any) => (
        <span className="line-clamp-1 max-w-xs text-muted-foreground">
          {highlightText(String(value), search)}
        </span>
      ),
    },
    {
      key: "isRead",
      label: "Status",
      sortable: true,
      render: (value: any) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {value ? (
            <>
              <MailOpen className="w-3 h-3" /> Read
            </>
          ) : (
            <>
              <Mail className="w-3 h-3" /> Unread
            </>
          )}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Received",
      sortable: true,
      render: (value: any) => format(new Date(value), "dd MMM yyyy, HH:mm"),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (_: any, row: Message) => (
        <div className="flex items-center gap-2">
          {!row.isRead && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleMarkAsRead(row._id)}
                  >
                    <MailOpen className="h-4 w-4" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark as read</p>
              </TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
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
      ),
    },
  ], [search, handleMarkAsRead]);

  const handleDelete = async () => {
    if (!selectedId) return;
    setLoadingDelete(true);
    try {
      await fetch(`/api/messages/${selectedId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setMessages(messages.filter((m) => m._id !== selectedId));
      setDeleteOpen(false);
      setSelectedId(null);
    } catch (err) {
      console.error("Failed to delete message:", err);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground">
              Manage contact form submissions
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unread
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.unread}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting response
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Read
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.read}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Reviewed messages
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <InputGroup className="flex-1">
            <InputGroupAddon>
              <Search className="h-4 w-4" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <div className="flex items-center gap-2">
            <Button
              variant={isReadFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setIsReadFilter("all")}
            >
              All
            </Button>
            <Button
              variant={isReadFilter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setIsReadFilter("unread")}
            >
              Unread
            </Button>
            <Button
              variant={isReadFilter === "read" ? "default" : "outline"}
              size="sm"
              onClick={() => setIsReadFilter("read")}
            >
              Read
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d7a7a]" />
          </div>
        ) : (
          <DataTable columns={columns} data={filteredMessages} showPagination />
        )}

        <DeleteModel
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Message"
          description="This action cannot be undone."
          onDelete={handleDelete}
          loading={loadingDelete}
          acceptLabel="I understand this will permanently delete the message"
          confirmLabel="Delete"
        />
      </div>
    </AdminLayout>
  );
}