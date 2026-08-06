"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { toast } from "sonner";
import type { TemplateData } from "./types";

interface AdminEditContextType {
  isEditing: boolean;
  templateData: TemplateData | null;
  setTemplateData: (data: TemplateData) => void;
  updateField: (path: string, value: any) => void;
  saveChanges: () => Promise<void>;
  saving: boolean;
  slug: string;
}

const AdminEditContext = createContext<AdminEditContextType | null>(null);

export function AdminEditProvider({
  children,
  initialData,
  serviceSlug,
}: {
  children: ReactNode;
  initialData: TemplateData | null;
  serviceSlug: string;
}) {
  const [templateData, setTemplateData] = useState<TemplateData | null>(initialData);
  const [saving, setSaving] = useState(false);

  const updateField = useCallback((path: string, value: any) => {
    setTemplateData((prev) => {
      if (!prev) return prev;
      const keys = path.split(".");
      const newData = structuredClone(prev);
      let obj: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newData;
    });
  }, []);

  const saveChanges = useCallback(async () => {
    if (!templateData) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/services/${serviceSlug}/template`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_data: templateData,
          use_template: true,
        }),
        credentials: "include",
      });
      if (res.ok) {
        toast.success("Template saved successfully!");
      } else {
        const data = await res.json();
        toast.error(data.msg || "Failed to save template");
      }
    } catch {
      toast.error("Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  }, [templateData, serviceSlug]);

  return (
    <AdminEditContext.Provider
      value={{
        isEditing: true,
        templateData,
        setTemplateData,
        updateField,
        saveChanges,
        saving,
        slug: serviceSlug,
      }}
    >
      {children}
    </AdminEditContext.Provider>
  );
}

export function useAdminEdit() {
  const ctx = useContext(AdminEditContext);
  if (!ctx) {
    return { isEditing: false } as AdminEditContextType;
  }
  return ctx;
}
