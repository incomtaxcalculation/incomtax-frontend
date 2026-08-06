"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "@/hooks/useRouter";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { AdminEditProvider, useAdminEdit } from "@/components/service-detail/AdminEditContext";
import ServicePageBody from "@/components/service-detail/ServicePageBody";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import type { TemplateData } from "@/components/service-detail/types";
import defaultTemplateData from "@/components/service-detail/default-template-data";

function EditorToolbar() {
  const { saveChanges, saving, slug } = useAdminEdit();

  return (
    <div className="sticky top-0 z-50 border-b bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-sm font-semibold">Visual Editor</h1>
            <p className="text-xs text-muted-foreground">/{slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={saveChanges}
            disabled={saving}
            className="bg-[#006666] hover:bg-[#005555]"
          >
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Saving..." : "Publish Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditorPreview({ templateData, slug: serviceSlug }: { templateData: TemplateData; slug: string }) {
  return (
    <AdminEditProvider initialData={templateData} serviceSlug={serviceSlug}>
      <div className="min-h-screen bg-white">
        <EditorToolbar />
        <PublicHeader />
        <ServicePageBody templateData={templateData} />
        <Footer />
      </div>
    </AdminEditProvider>
  );
}

function EditorLoader({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [service, setService] = useState<{
    title: string;
    template_data: TemplateData | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/services/${slug}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Service not found");
        const data = await res.json();
        if (!cancelled) {
          const svc = data.service;
          setService({
            title: svc.title,
            template_data: svc.template_data || null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load service");
          toast.error("Failed to load service data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !service) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">{error || "Service not found"}</p>
          <Button variant="outline" onClick={() => router.push("/admin/services")}>
            Back to Services
          </Button>
        </div>
      </AdminLayout>
    );
  }

  if (!service.template_data) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4 max-w-md mx-auto text-center">
          <p className="text-muted-foreground">
            This service doesn&apos;t have template data yet. Initialize it with default content to start editing visually.
          </p>
          <Button
            onClick={async () => {
              try {
                const res = await fetch(`/api/services/${slug}/template`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    use_template: true,
                    template_data: defaultTemplateData,
                  }),
                });
                if (res.ok) {
                  toast.success("Template initialized! Reloading...");
                  window.location.reload();
                } else {
                  toast.error("Failed to initialize template");
                }
              } catch {
                toast.error("Something went wrong");
              }
            }}
          >
            Initialize Template
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin/services")}>
            Back to Services
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return <EditorPreview templateData={service.template_data} slug={slug} />;
}

export default function EditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return <EditorLoader slug={slug} />;
}
