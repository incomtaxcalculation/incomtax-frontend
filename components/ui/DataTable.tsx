"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "@/hooks/useRouter";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { ImageModal } from "@/components/ui/ImageModal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (
    value: any,
    row: any,
    openModal: (src: string, alt: string) => void,
  ) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  fetchUrl?: string;
  onDelete?: (id: number) => void;
  editUrlPattern?: string;
  showPagination?: boolean;
  lastColumnSticky?: boolean;
}

export function DataTable({
  columns,
  data,
  onDelete,
  editUrlPattern,
  showPagination = true,
  lastColumnSticky = true,
}: DataTableProps) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  console.log("LastColumnSticky:", lastColumnSticky);

  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [modalImage, setModalImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  /* =========================
     REFS (INDICATE STATE)
  ========================== */

  const openModal = (src: string, alt: string) => setModalImage({ src, alt });

  const closeModal = () => setModalImage(null);

  /* =========================
     RESET PAGE ON LIMIT CHANGE
  ========================== */
  useEffect(() => {
    setPage(1);
  }, [perPage]);

  /* =========================
     SORTED DATA
  ========================== */
  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const comp = aVal < bVal ? -1 : 1;
      return sortOrder === "asc" ? comp : -comp;
    });
  }, [data, sortKey, sortOrder]);

  /* =========================
     PAGINATION
  ========================== */
  const totalPages = Math.max(1, Math.ceil(data.length / perPage));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * perPage;
    return sortedData.slice(start, start + perPage);
  }, [sortedData, page, perPage]);

  /* =========================
     CHECKBOX STATES
  ========================== */
  const isAllSelected =
    paginatedData.length > 0 && selectedRows.length === paginatedData.length;

  const isSomeSelected = selectedRows.length > 0 && !isAllSelected;

  /* =========================
     SELECT HANDLERS
  ========================== */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map((r) => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number | string, checked: boolean) => {
    setSelectedRows((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id),
    );
  };

  /* =========================
     SORT
  ========================== */
  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortOrder("asc");
      return;
    }

    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      // RESET TO DEFAULT (no sorting)
      setSortKey(null);
      setSortOrder("asc");
    }
  };

  /* =========================
     PAGE NUMBERS
  ========================== */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const renderCell = (column: Column, row: any) => {
    const value = row[column.key];
    if (column.render) return column.render(value, row, openModal);
    return value;
  };

  return (
    <div className="relative rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto relative">
        {/* ================= TABLE ================= */}
        <Table className="min-w-full">
          <TableHeader className="relative">
            <TableRow className="relative">
              {/* SELECT ALL */}
              <TableHead
                className="w-12 cursor-pointer"
                onClick={() => handleSelectAll(!isAllSelected)}
              >
                <Checkbox
                  checked={
                    isAllSelected
                      ? true
                      : isSomeSelected
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={handleSelectAll}
                  onClick={(e) => e.stopPropagation()} // prevent double trigger
                />
              </TableHead>

              {columns.map((col, index) => {
                const isLastColumn =
                  index === columns.length - 1 && !(editUrlPattern || onDelete);
                return (
                  <TableHead
                    key={col.key}
                    className={cn(
                      col.sortable ? "cursor-pointer" : "",
                      lastColumnSticky &&
                        isLastColumn &&
                        "sticky right-0 z-20 bg-card border-l shadow-[-4px_0_10px_rgba(0,0,0,0.04)]",
                    )}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable &&
                        (sortKey === col.key ? (
                          sortOrder === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <div className="flex flex-col -space-y-1">
                            <ArrowUp className="h-2.5 w-2.5 opacity-40" />
                            <ArrowDown className="h-2.5 w-2.5 opacity-40" />
                          </div>
                        ))}
                    </div>
                  </TableHead>
                );
              })}

              {(editUrlPattern || onDelete) && (
                <TableHead
                  className={cn(
                    "text-right",
                    lastColumnSticky
                      ? "sticky right-0 z-20 bg-card border-l shadow-[-4px_0_10px_rgba(0,0,0,0.04)]"
                      : "",
                  )}
                >
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length + 1 + (editUrlPattern || onDelete ? 1 : 0)
                  }
                  className="text-center py-8 text-muted-foreground"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row._id ?? row.id}>
                  {/* ROW CHECKBOX */}
                  <TableCell
                    className="cursor-pointer"
                    onClick={() =>
                      handleSelectRow(row.id, !selectedRows.includes(row.id))
                    }
                  >
                    <Checkbox
                      checked={selectedRows.includes(row.id)}
                      onCheckedChange={(v) => handleSelectRow(row.id, !!v)}
                      onClick={(e) => e.stopPropagation()} // prevents double toggle
                    />
                  </TableCell>

                  {columns.map((col, index) => {
                    const isLastColumn =
                      index === columns.length - 1 && !(editUrlPattern || onDelete);

                    return (
                      <TableCell
                        key={col.key}
                        className={cn(
                          lastColumnSticky &&
                            isLastColumn &&
                            "sticky right-0 z-50 bg-card border-l! shadow-[-4px_0_10px_rgba(0,0,0,0.04)]",
                        )}
                      >
                        {renderCell(col, row)}
                      </TableCell>
                    );
                  })}

                  {/* ACTIONS */}
                  {(editUrlPattern || onDelete) && (
                    <TableCell
                      className={cn(
                        "text-right",
                        lastColumnSticky
                          ? "sticky right-0 z-50 bg-card border-l-3 shadow-md"
                          : "",
                      )}
                    >
                      {editUrlPattern && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            router.push(
                              editUrlPattern.replace(":slug", row.slug),
                            )
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}

                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-red-600 ml-2"
                          onClick={() => onDelete(row.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ================= FOOTER ================= */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t bg-muted/50 gap-4">
          {/* Left: Selection info */}
          <div className="text-sm text-muted-foreground">
            {selectedRows.length} of {data.length} row(s) selected
          </div>

          {/* Right: Page navigation */}
          {showPagination && (
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
              {/* Rows per page - hide on very small screens */}
              <div className="items-center gap-2 text-sm hidden sm:flex">
                <span className="text-muted-foreground">Rows per page:</span>
                <Select
                  value={String(perPage)}
                  onValueChange={(v) => setPerPage(Number(v))}
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

              {/* Page info */}
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>

              {/* Pagination buttons */}
              <div className="flex items-center gap-1">
                {/* First page - hide on mobile */}
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="h-8 w-8 hidden md:flex"
                  title="First page"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-3" />
                </Button>

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

                {/* Page numbers - limit on mobile */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((p, i) =>
                    typeof p === "number" ? (
                      <Button
                        key={i}
                        variant={page === p ? "default" : "outline"}
                        size="icon-sm"
                        onClick={() => setPage(p)}
                        className={cn("h-8 w-8", page === p && "")}
                      >
                        {p}
                      </Button>
                    ) : (
                      <span
                        key={i}
                        className="px-2 text-sm text-muted-foreground hidden sm:inline"
                      >
                        ...
                      </span>
                    ),
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="h-8 w-8"
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last page - hide on mobile */}
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="h-8 w-8 hidden md:flex"
                  title="Last page"
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-3" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ================= IMAGE MODAL ================= */}
        {modalImage && (
          <ImageModal
            src={modalImage.src}
            alt={modalImage.alt}
            isOpen
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
}
