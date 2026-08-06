"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { iconNames, DynamicIcon } from "lucide-react/dynamic";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(iconNames.slice(0, 100));
      return;
    }
    const q = search.toLowerCase().replace(/-/g, "");
    const result = iconNames.filter((name) =>
      name.replace(/-/g, "").includes(q),
    );
    setFiltered(result.slice(0, 200));
  }, [search]);

  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = useCallback(
    (name: string) => {
      onChange(name);
      setOpen(false);
      setSearch("");
    },
    [onChange],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="icon">
          {value ? (
            <DynamicIcon name={value as any} className="w-5 h-5" />
          ) : (
            <div className="text-muted-foreground">?</div>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          {value ? `Change Icon (${value})` : "Choose Icon"}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh]"
          onClick={() => setOpen(false)}
        >
          <div
            className="fixed inset-0 bg-black/50"
            aria-hidden="true"
          />
          <div
            className="relative z-10 w-full max-w-3xl max-h-[80vh] bg-background rounded-xl border shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 p-4 border-b">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={searchRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search icons..."
                  className="pl-9"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {filtered.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">
                  No icons found
                </p>
              ) : (
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                  {filtered.map((name) => (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors cursor-pointer",
                        value === name
                          ? "border-primary bg-primary/10"
                          : "border-transparent hover:border-border hover:bg-muted",
                      )}
                      onClick={() => handleSelect(name)}
                    >
                      <DynamicIcon name={name as any} className="w-5 h-5" />
                      <span className="text-[9px] text-muted-foreground leading-tight truncate w-full text-center">
                        {name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filtered.length > 0 && (
              <div className="border-t px-4 py-2 text-xs text-muted-foreground text-center">
                {filtered.length === iconNames.length
                  ? `Showing first 100 of ${iconNames.length} icons`
                  : `${filtered.length} icon${filtered.length !== 1 ? "s" : ""} found`}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
