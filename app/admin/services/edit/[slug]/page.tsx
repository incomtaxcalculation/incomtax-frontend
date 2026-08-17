"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "@/hooks/useRouter";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
import { TiptapEditor } from "@/components/ui/TiptapEditor";
import { IconPicker } from "@/components/ui/IconPicker";
import { uploadFile } from "@/lib/upload";
import StatusIcon from "@/components/reusable/StatusIcon";
import { slugify, liveSlugify } from "@/lib/slugify";
import { validate } from "@/lib/validation";
import SeoPanel from "@/components/services/SeoPanel";

/* ------------------------------------------------------------------ */
/* Small section wrapper - matches the existing bordered-card look    */
/* ------------------------------------------------------------------ */

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Draft persistence (protects against long form-fill + token expiry) */
/* ------------------------------------------------------------------ */

function loadDraft(key: string): any | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveDraft(key: string, data: any) {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // storage unavailable/full - draft just won't persist
  }
}

function removeDraft(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

/* ------------------------------------------------------------------ */
/* Auth-aware fetch: refreshes the session and retries once on a      */
/* 401 (expired token) instead of failing the whole submit outright.  */
/* ------------------------------------------------------------------ */

async function refreshSession(): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/refresh-token/`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchWithAuthRetry(input: string, init?: RequestInit) {
  let res = await fetch(input, init);
  if (res.status === 401) {
    const refreshed = await refreshSession();
    if (refreshed) {
      res = await fetch(input, init);
    }
  }
  return res;
}

export default function EditServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: oldSlug } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const slugEdited = useRef(false);
  const draftKey = `edit-service-draft-${oldSlug}`;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    long_description: "",
    icon: "",
    featureImage: "",
    featureImageAlt: "",
    status: "active",
    seo_title: "",
    seo_description: "",
    focus_keyword: "",

    // -------- Hero section --------
    author: "",
    badge: "",
    heroDescription: "",
    primaryButton: "",
    secondaryButton: "",
    trustPoints: [] as string[],

    // -------- Problem & solution --------
    struggleHeadingBefore: "",
    struggleHeadingHighlight: "",
    solutionIntro: "",
    commonProblems: [] as { text: string }[],
    solutions: [] as { text: string }[],

    // -------- Included services --------
    servicesHeadingBefore: "",
    servicesHeadingHighlight: "",
    servicesHeadingAfter: "",
    includedServices: [] as { title: string; description: string; icon: string }[],

    // -------- Process steps --------
    processHeadingBefore: "",
    processHeadingHighlight: "",
    processSteps: [] as {
      step: number;
      title: string;
      description: string;
      icon: string;
    }[],

    // -------- Document requirements --------
    requiredDocsTitle: "",
    documentRequirements: [] as {
      applicantType: string;
      icon: string;
      documents: string[];
    }[],

    // -------- Timeline --------
    timeRequiredTitle: "",
    fastProcessingText: "",
    timelineMetrics: [] as { label: string; value: string; icon: string }[],

    // -------- Why choose us --------
    whyChooseHeadingBefore: "",
    whyChooseHeadingHighlight: "",
    whyChooseFeatures: [] as { title: string; description: string; icon: string }[],

    // -------- Testimonials --------
    testimonialsTitle: "",
    testimonials: [] as {
      name: string;
      designation: string;
      content: string;
      avatar: string;
    }[],

    // -------- CTA --------
    ctaTitle: "",
    ctaHighlight: "",
    ctaDescription: "",
    ctaApplyButton: "",
    ctaPhone: "",
    ctaWhatsapp: "",
    ctaCallButton: "",
    ctaWhatsappButton: "",
  });

  /* ---------------- generic array helpers ---------------- */

  const addItem = (key: keyof typeof form, item: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: [...(prev[key] || []), item],
    }));
  };

  const removeItem = (key: keyof typeof form, index: number) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: prev[key].filter((_: any, i: number) => i !== index),
    }));
  };

  const updateItem = (key: keyof typeof form, index: number, patch: any) => {
    setForm((prev: any) => ({
      ...prev,
      [key]: prev[key].map((item: any, i: number) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  };

  const addTrustPoint = () => addItem("trustPoints", "");
  const updateTrustPoint = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      trustPoints: prev.trustPoints.map((t, i) => (i === index ? value : t)),
    }));
  };
  const removeTrustPoint = (index: number) => removeItem("trustPoints", index);

  const addDocument = (reqIndex: number) => {
    setForm((prev) => ({
      ...prev,
      documentRequirements: prev.documentRequirements.map((r, i) =>
        i === reqIndex ? { ...r, documents: [...r.documents, ""] } : r,
      ),
    }));
  };
  const updateDocument = (reqIndex: number, docIndex: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      documentRequirements: prev.documentRequirements.map((r, i) =>
        i === reqIndex
          ? {
              ...r,
              documents: r.documents.map((d, di) =>
                di === docIndex ? value : d,
              ),
            }
          : r,
      ),
    }));
  };
  const removeDocument = (reqIndex: number, docIndex: number) => {
    setForm((prev) => ({
      ...prev,
      documentRequirements: prev.documentRequirements.map((r, i) =>
        i === reqIndex
          ? { ...r, documents: r.documents.filter((_, di) => di !== docIndex) }
          : r,
      ),
    }));
  };

  /* ---------------- fetch existing service ---------------- */

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/${oldSlug}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const s = data.service;
          setInitialData(s);
          setForm((prev) => ({
            ...prev,
            title: s.title || "",
            slug: s.slug || "",
            short_description: s.short_description || "",
            long_description: s.long_description || "",
            icon: s.icon || "",
            featureImage: s.featureImage || "",
            featureImageAlt: s.featureImageAlt || "",
            status: s.status || "active",
            seo_title: s.seo_title || "",
            seo_description: s.seo_description || "",
            focus_keyword: s.focus_keyword || "",

            author: s.author || "",
            badge: s.badge || "",
            heroDescription: s.heroDescription || "",
            primaryButton: s.primaryButton || "",
            secondaryButton: s.secondaryButton || "",
            trustPoints: s.trustPoints || [],

            struggleHeadingBefore: s.struggleHeadingBefore || "",
            struggleHeadingHighlight: s.struggleHeadingHighlight || "",
            solutionIntro: s.solutionIntro || "",
            commonProblems: s.commonProblems || [],
            solutions: s.solutions || [],

            servicesHeadingBefore: s.servicesHeadingBefore || "",
            servicesHeadingHighlight: s.servicesHeadingHighlight || "",
            servicesHeadingAfter: s.servicesHeadingAfter || "",
            includedServices: s.includedServices || [],

            processHeadingBefore: s.processHeadingBefore || "",
            processHeadingHighlight: s.processHeadingHighlight || "",
            processSteps: s.processSteps || [],

            requiredDocsTitle: s.requiredDocsTitle || "",
            documentRequirements: s.documentRequirements || [],

            timeRequiredTitle: s.timeRequiredTitle || "",
            fastProcessingText: s.fastProcessingText || "",
            timelineMetrics: s.timelineMetrics || [],

            whyChooseHeadingBefore: s.whyChooseHeadingBefore || "",
            whyChooseHeadingHighlight: s.whyChooseHeadingHighlight || "",
            whyChooseFeatures: s.whyChooseFeatures || [],

            testimonialsTitle: s.testimonialsTitle || "",
            testimonials: s.testimonials || [],

            ctaTitle: s.ctaTitle || "",
            ctaHighlight: s.ctaHighlight || "",
            ctaDescription: s.ctaDescription || "",
            ctaApplyButton: s.ctaApplyButton || "",
            ctaPhone: s.ctaPhone || "",
            ctaWhatsapp: s.ctaWhatsapp || "",
            ctaCallButton: s.ctaCallButton || "",
            ctaWhatsappButton: s.ctaWhatsappButton || "",
          }));

          // If the user had unsaved local changes from an earlier session
          // (e.g. their token expired mid-edit), restore them on top of
          // the freshly fetched record.
          const draft = loadDraft(draftKey);
          if (draft) {
            setForm((prev) => ({ ...prev, ...draft }));
            toast.message("Restored your unsaved changes", {
              description: "Pick up where you left off, or clear it below.",
            });
          }
        } else {
          toast.error("Service not found");
          router.push("/admin/services");
        }
      } catch {
        toast.error("Failed to fetch service");
        router.push("/admin/services");
      }
    };
    if (oldSlug && !initialData) {
      fetchService();
    }
  }, [oldSlug, router, initialData, draftKey]);

  useEffect(() => {
    if (slugEdited.current || !initialData) return;
    const source = form.seo_title || form.title;
    if (source) {
      const generatedSlug = slugify(source);
      if (generatedSlug !== form.slug) {
        setForm((prev) => ({ ...prev, slug: generatedSlug }));
      }
    }
  }, [form.seo_title, form.title, form.slug, initialData]);

  useEffect(() => {
    const checkSlug = async () => {
      if (!form.slug || form.slug.length < 2) return;
      if (initialData && form.slug === initialData.slug) {
        setSlugAvailable(true);
        return;
      }
      setIsCheckingSlug(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/check-slug/${form.slug}`, { credentials: "include" });
        const data = await res.json();
        setSlugAvailable(!data.exists);
      } catch {
        setSlugAvailable(null);
      } finally {
        setIsCheckingSlug(false);
      }
    };
    const timer = setTimeout(checkSlug, 500);
    return () => clearTimeout(timer);
  }, [form.slug, initialData]);

  // Auto-save as the user edits, so nothing is lost if the session
  // expires or the tab closes before they hit "Update Service".
  useEffect(() => {
    if (!initialData) return;
    const timeout = setTimeout(() => {
      saveDraft(draftKey, form);
    }, 500);
    return () => clearTimeout(timeout);
  }, [form, initialData, draftKey]);

  // Keep the session alive in the background while this long form is
  // open, so editing slowly doesn't cause the token to expire by the
  // time the user clicks "Update Service".
  useEffect(() => {
    const interval = setInterval(() => {
      refreshSession();
    }, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleClearDraft = () => {
    removeDraft(draftKey);
    if (initialData) {
      const s = initialData;
      setForm((prev) => ({
        ...prev,
        title: s.title || "",
        short_description: s.short_description || "",
        long_description: s.long_description || "",
      }));
    }
    toast.message("Draft cleared - reverted to the saved version");
  };

  const validateForm = () => {
    if (!validate(form.title, "required").valid) {
      toast.error("Title is required");
      return false;
    }
    if (!validate(form.slug, "slug").valid) {
      toast.error("Slug must be lowercase with hyphens (e.g. my-service)");
      return false;
    }
    if (slugAvailable === false) {
      toast.error("Slug is already taken");
      return false;
    }
    if (!validate(form.short_description, "required").valid) {
      toast.error("Short description is required");
      return false;
    }
    if (!validate(form.long_description, "required").valid || form.long_description === "<p></p>") {
      toast.error("Full description is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Refresh the session up front - this form can take a while to
      // fill out, so the token may be close to (or past) expiry by
      // the time the user submits.
      await refreshSession();

      const featureFile = getCurrentFile("featureImage");
      const featureImageUrl = featureFile ? await uploadFile(featureFile, "services") : null;

      // Upload any newly-selected testimonial avatars
      const testimonials = await Promise.all(
        form.testimonials.map(async (t, i) => {
          const avatarFile = getCurrentFile(`testimonial-avatar-${i}`);
          if (avatarFile) {
            const uploadedAvatar = await uploadFile(avatarFile, "services");
            return { ...t, avatar: uploadedAvatar };
          }
          return t;
        }),
      );

      const res = await fetchWithAuthRetry(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/${oldSlug}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title,
            slug: form.slug,
            short_description: form.short_description,
            long_description: form.long_description,
            icon: form.icon || undefined,
            status: form.status,
            featureImageAlt: form.featureImageAlt,
            featureImage: featureImageUrl,
            existingFeatureImage: !featureFile && form.featureImage === "" ? "" : undefined,
            seo_title: form.seo_title,
            seo_description: form.seo_description,
            focus_keyword: form.focus_keyword,

            author: form.author,
            badge: form.badge,
            heroDescription: form.heroDescription,
            primaryButton: form.primaryButton,
            secondaryButton: form.secondaryButton,
            trustPoints: form.trustPoints,

            struggleHeadingBefore: form.struggleHeadingBefore,
            struggleHeadingHighlight: form.struggleHeadingHighlight,
            solutionIntro: form.solutionIntro,
            commonProblems: form.commonProblems,
            solutions: form.solutions,

            servicesHeadingBefore: form.servicesHeadingBefore,
            servicesHeadingHighlight: form.servicesHeadingHighlight,
            servicesHeadingAfter: form.servicesHeadingAfter,
            includedServices: form.includedServices,

            processHeadingBefore: form.processHeadingBefore,
            processHeadingHighlight: form.processHeadingHighlight,
            processSteps: form.processSteps.map((step, i) => ({
              ...step,
              step: i + 1,
            })),

            requiredDocsTitle: form.requiredDocsTitle,
            documentRequirements: form.documentRequirements,

            timeRequiredTitle: form.timeRequiredTitle,
            fastProcessingText: form.fastProcessingText,
            timelineMetrics: form.timelineMetrics,

            whyChooseHeadingBefore: form.whyChooseHeadingBefore,
            whyChooseHeadingHighlight: form.whyChooseHeadingHighlight,
            whyChooseFeatures: form.whyChooseFeatures,

            testimonialsTitle: form.testimonialsTitle,
            testimonials,

            ctaTitle: form.ctaTitle,
            ctaHighlight: form.ctaHighlight,
            ctaDescription: form.ctaDescription,
            ctaApplyButton: form.ctaApplyButton,
            ctaPhone: form.ctaPhone,
            ctaWhatsapp: form.ctaWhatsapp,
            ctaCallButton: form.ctaCallButton,
            ctaWhatsappButton: form.ctaWhatsappButton,
          }),
          credentials: "include",
        },
      );

      if (res.ok) {
        toast.success("Service updated successfully!");
        clearAllFiles();
        removeDraft(draftKey);
        router.push("/admin/services");
      } else if (res.status === 401) {
        // Session couldn't be refreshed - don't lose the user's work.
        // The draft is already auto-saved, so it'll be there after re-login.
        toast.error(
          "Your session expired. Your changes are saved as a draft — please log in again to continue.",
        );
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update service");
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
          Loading service data...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit Service</h1>
            <Button type="button" variant="ghost" onClick={handleClearDraft}>
              Clear Draft
            </Button>
          </div>
          <p className="text-xs text-muted-foreground -mt-4">
            Your changes are saved automatically as you type, so it's safe to
            take your time.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - 60% */}
            <div className="lg:col-span-3 bg-card space-y-6">
              <div className="border border-gray-300 dark:border-gray-600 p-4 rounded-2xl space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Service Title <StatusIcon value={form.title} type="required" />
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Enter service title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Icon
                    </Label>
                    <IconPicker
                      value={form.icon}
                      onChange={(val) => setForm({ ...form, icon: val })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">
                    Short Description{" "}
                    <StatusIcon value={form.short_description} type="required" />
                  </Label>
                  <TiptapEditor
                    value={form.short_description}
                    onChange={(val) =>
                      setForm({ ...form, short_description: val })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Full Description{" "}
                    <StatusIcon
                      condition={
                        !!form.long_description &&
                        form.long_description !== "<p></p>"
                      }
                    />
                  </Label>
                  <TiptapEditor
                    value={form.long_description}
                    onChange={(val) => setForm({ ...form, long_description: val })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Featured Image <StatusIcon value={form.featureImage} type="required" />
                  </Label>
                  <ImageDropZone
                    value={form.featureImage}
                    onChange={(value) =>
                      setForm((prev) => ({ ...prev, featureImage: value }))
                    }
                    alt={form.featureImageAlt}
                    onAltChange={(value) =>
                      setForm((prev) => ({ ...prev, featureImageAlt: value }))
                    }
                    fileKey="featureImage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">
                    Status <StatusIcon condition={true} />
                  </Label>
                  <Select
                    value={form.status}
                    onValueChange={(val) => setForm({ ...form, status: val })}
                  >
                    <SelectTrigger className="w-full">
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
                </div>

                <div className="flex gap-2 justify-end bg-card border-t borer-gray-200 px-4 py-3 sticky bottom-0 rounded-b-lg z-10">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Update Service"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/services")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* ---------------- Basic Info (additional) ---------------- */}
              <SectionCard title="Additional Details">
                <FieldBlock label="Author">
                  <Input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="Navigate Business"
                  />
                </FieldBlock>
              </SectionCard>

              {/* ---------------- Hero Section ---------------- */}
              <SectionCard
                title="Hero Section"
                description="Top banner content on the service page"
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <FieldBlock label="Badge">
                    <Input
                      value={form.badge}
                      onChange={(e) => setForm({ ...form, badge: e.target.value })}
                      placeholder="FBR REGISTRATION SERVICE"
                    />
                  </FieldBlock>
                  <FieldBlock label="Primary Button Text">
                    <Input
                      value={form.primaryButton}
                      onChange={(e) =>
                        setForm({ ...form, primaryButton: e.target.value })
                      }
                    />
                  </FieldBlock>
                  <FieldBlock label="Secondary Button Text">
                    <Input
                      value={form.secondaryButton}
                      onChange={(e) =>
                        setForm({ ...form, secondaryButton: e.target.value })
                      }
                    />
                  </FieldBlock>
                </div>

                <FieldBlock label="Hero Description">
                  <Textarea
                    rows={3}
                    value={form.heroDescription}
                    onChange={(e) =>
                      setForm({ ...form, heroDescription: e.target.value })
                    }
                  />
                </FieldBlock>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Trust Points</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addTrustPoint}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {form.trustPoints.map((point, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={point}
                          onChange={(e) => updateTrustPoint(i, e.target.value)}
                          placeholder="FBR Compliant"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-red-600 shrink-0"
                          onClick={() => removeTrustPoint(i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {form.trustPoints.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No trust points added yet.
                      </p>
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* ---------------- Problem & Solution ---------------- */}
              <SectionCard
                title="Problem & Solution"
                description="Pain points customers face and how the service solves them"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldBlock label="Struggle Heading (before highlight)">
                    <Input
                      value={form.struggleHeadingBefore}
                      onChange={(e) =>
                        setForm({ ...form, struggleHeadingBefore: e.target.value })
                      }
                      placeholder="Why People Struggle With"
                    />
                  </FieldBlock>
                  <FieldBlock label="Struggle Heading (highlight)">
                    <Input
                      value={form.struggleHeadingHighlight}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          struggleHeadingHighlight: e.target.value,
                        })
                      }
                      placeholder="Income Tax Registration"
                    />
                  </FieldBlock>
                </div>

                <FieldBlock label="Solution Intro">
                  <Textarea
                    rows={2}
                    value={form.solutionIntro}
                    onChange={(e) =>
                      setForm({ ...form, solutionIntro: e.target.value })
                    }
                  />
                </FieldBlock>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Common Problems</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addItem("commonProblems", { text: "" })}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {form.commonProblems.map((problem, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={problem.text}
                          onChange={(e) =>
                            updateItem("commonProblems", i, {
                              text: e.target.value,
                            })
                          }
                          placeholder="Confusing FBR registration process"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-red-600 shrink-0"
                          onClick={() => removeItem("commonProblems", i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {form.commonProblems.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No problems added yet.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Solutions</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addItem("solutions", { text: "" })}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {form.solutions.map((solution, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={solution.text}
                          onChange={(e) =>
                            updateItem("solutions", i, { text: e.target.value })
                          }
                          placeholder="Expert guidance at every step"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-red-600 shrink-0"
                          onClick={() => removeItem("solutions", i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {form.solutions.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No solutions added yet.
                      </p>
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* ---------------- Included Services ---------------- */}
              <SectionCard
                title="Included Services"
                description="What is included as part of this service"
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <FieldBlock label="Heading (before highlight)">
                    <Input
                      value={form.servicesHeadingBefore}
                      onChange={(e) =>
                        setForm({ ...form, servicesHeadingBefore: e.target.value })
                      }
                      placeholder="Our Income Tax Registration"
                    />
                  </FieldBlock>
                  <FieldBlock label="Heading (highlight)">
                    <Input
                      value={form.servicesHeadingHighlight}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          servicesHeadingHighlight: e.target.value,
                        })
                      }
                      placeholder="Services"
                    />
                  </FieldBlock>
                  <FieldBlock label="Heading (after highlight)">
                    <Input
                      value={form.servicesHeadingAfter}
                      onChange={(e) =>
                        setForm({ ...form, servicesHeadingAfter: e.target.value })
                      }
                      placeholder=" Include"
                    />
                  </FieldBlock>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Items</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      addItem("includedServices", {
                        title: "",
                        description: "",
                        icon: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {form.includedServices.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap gap-2 md:grid-cols-[1fr_1fr_160px_auto] items-start rounded-md border p-3"
                    >
                      <Input
                        value={item.title}
                        onChange={(e) =>
                          updateItem("includedServices", i, {
                            title: e.target.value,
                          })
                        }
                        placeholder="Title"
                      />
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateItem("includedServices", i, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Description"
                      />
                      <IconPicker
                        value={item.icon}
                        onChange={(icon) =>
                          updateItem("includedServices", i, { icon })
                        }
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => removeItem("includedServices", i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {form.includedServices.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No included services added yet.
                    </p>
                  )}
                </div>
              </SectionCard>

              {/* ---------------- Process Steps ---------------- */}
              <SectionCard
                title="Process Steps"
                description="Step-by-step flow shown on the service page (numbered automatically)"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldBlock label="Heading (before highlight)">
                    <Input
                      value={form.processHeadingBefore}
                      onChange={(e) =>
                        setForm({ ...form, processHeadingBefore: e.target.value })
                      }
                      placeholder="Our Simple Registration"
                    />
                  </FieldBlock>
                  <FieldBlock label="Heading (highlight)">
                    <Input
                      value={form.processHeadingHighlight}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          processHeadingHighlight: e.target.value,
                        })
                      }
                      placeholder="Process"
                    />
                  </FieldBlock>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Steps</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      addItem("processSteps", {
                        step: form.processSteps.length + 1,
                        title: "",
                        description: "",
                        icon: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Step
                  </Button>
                </div>
                <div className="space-y-3">
                  {form.processSteps.map((step, i) => (
                    <div key={i} className="rounded-md border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Step {i + 1}
                        </span>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => removeItem("processSteps", i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-2 md:grid-cols-3">
                        <Input
                          value={step.title}
                          onChange={(e) =>
                            updateItem("processSteps", i, { title: e.target.value })
                          }
                          placeholder="Title"
                        />
                        <IconPicker
                          value={step.icon}
                          onChange={(icon) =>
                            updateItem("processSteps", i, { icon })
                          }
                        />
                        <Input
                          value={step.description}
                          onChange={(e) =>
                            updateItem("processSteps", i, {
                              description: e.target.value,
                            })
                          }
                          placeholder="Description"
                        />
                      </div>
                    </div>
                  ))}
                  {form.processSteps.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No process steps added yet.
                    </p>
                  )}
                </div>
              </SectionCard>

              {/* ---------------- Document Requirements ---------------- */}
              <SectionCard
                title="Document Requirements"
                description="Required documents grouped by applicant type"
              >
                <FieldBlock label="Section Title">
                  <Input
                    value={form.requiredDocsTitle}
                    onChange={(e) =>
                      setForm({ ...form, requiredDocsTitle: e.target.value })
                    }
                    placeholder="Required Documents for Income Tax Registration"
                  />
                </FieldBlock>

                <div className="flex items-center justify-between">
                  <Label>Applicant Types</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      addItem("documentRequirements", {
                        applicantType: "",
                        icon: "",
                        documents: [],
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Applicant Type
                  </Button>
                </div>

                <div className="space-y-3">
                  {form.documentRequirements.map((req, i) => (
                    <div key={i} className="rounded-md border p-3 space-y-2">
                      <div className="flex flex-wrap md:grid-cols-[1fr_160px_auto] items-start">
                        
                        <Input
                          value={req.applicantType}
                          onChange={(e) =>
                            updateItem("documentRequirements", i, {
                              applicantType: e.target.value,
                            })
                          }
                          placeholder="Individual (Sole Proprietor)"
                        />
                        <IconPicker
                          value={req.icon}
                          onChange={(icon) =>
                            updateItem("documentRequirements", i, { icon })
                          }
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => removeItem("documentRequirements", i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="pl-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Documents</Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => addDocument(i)}
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" /> Add Document
                          </Button>
                        </div>
                        {req.documents.map((doc, di) => (
                          <div key={di} className="flex gap-2">
                            <Input
                              value={doc}
                              onChange={(e) =>
                                updateDocument(i, di, e.target.value)
                              }
                              placeholder="CNIC Copy"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="text-red-600 shrink-0"
                              onClick={() => removeDocument(i, di)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {req.documents.length === 0 && (
                          <p className="text-xs text-muted-foreground">
                            No documents added yet.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {form.documentRequirements.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No applicant types added yet.
                    </p>
                  )}
                </div>
              </SectionCard>

              {/* ---------------- Timeline ---------------- */}
              <SectionCard title="Timeline" description="Processing time metrics">
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldBlock label="Section Title">
                    <Input
                      value={form.timeRequiredTitle}
                      onChange={(e) =>
                        setForm({ ...form, timeRequiredTitle: e.target.value })
                      }
                      placeholder="Time Required for Income Tax Registration"
                    />
                  </FieldBlock>
                  <FieldBlock label="Fast Processing Text">
                    <Input
                      value={form.fastProcessingText}
                      onChange={(e) =>
                        setForm({ ...form, fastProcessingText: e.target.value })
                      }
                    />
                  </FieldBlock>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Metrics</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      addItem("timelineMetrics", {
                        label: "",
                        value: "",
                        icon: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Metric
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.timelineMetrics.map((metric, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap md:grid-cols-[1fr_1fr_160px_auto] items-center rounded-md border p-3"
                    >
                      <Input
                        value={metric.label}
                        onChange={(e) =>
                          updateItem("timelineMetrics", i, {
                            label: e.target.value,
                          })
                        }
                        placeholder="Application Submission"
                      />
                      <Input
                        value={metric.value}
                        onChange={(e) =>
                          updateItem("timelineMetrics", i, {
                            value: e.target.value,
                          })
                        }
                        placeholder="Same Day"
                      />
                      <IconPicker
                        value={metric.icon}
                        onChange={(icon) =>
                          updateItem("timelineMetrics", i, { icon })
                        }
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => removeItem("timelineMetrics", i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {form.timelineMetrics.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No metrics added yet.
                    </p>
                  )}
                </div>
              </SectionCard>

              {/* ---------------- Why Choose Us ---------------- */}
              <SectionCard title="Why Choose Us" description="Key differentiators">
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldBlock label="Heading (before highlight)">
                    <Input
                      value={form.whyChooseHeadingBefore}
                      onChange={(e) =>
                        setForm({ ...form, whyChooseHeadingBefore: e.target.value })
                      }
                      placeholder="Why Choose"
                    />
                  </FieldBlock>
                  <FieldBlock label="Heading (highlight)">
                    <Input
                      value={form.whyChooseHeadingHighlight}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          whyChooseHeadingHighlight: e.target.value,
                        })
                      }
                      placeholder="Us?"
                    />
                  </FieldBlock>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Features</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      addItem("whyChooseFeatures", {
                        title: "",
                        description: "",
                        icon: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Feature
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.whyChooseFeatures.map((feature, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap md:grid-cols-[1fr_1fr_160px_auto] items-start rounded-md border p-3"
                    >
                      <Input
                        value={feature.title}
                        onChange={(e) =>
                          updateItem("whyChooseFeatures", i, {
                            title: e.target.value,
                          })
                        }
                        placeholder="Title"
                      />
                      <Input
                        value={feature.description}
                        onChange={(e) =>
                          updateItem("whyChooseFeatures", i, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Description"
                      />
                      <IconPicker
                        value={feature.icon}
                        onChange={(icon) =>
                          updateItem("whyChooseFeatures", i, { icon })
                        }
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => removeItem("whyChooseFeatures", i)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {form.whyChooseFeatures.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No features added yet.
                    </p>
                  )}
                </div>
              </SectionCard>

              {/* ---------------- Testimonials ---------------- */}
              <SectionCard
                title="Testimonials"
                description="Client reviews shown on the page"
              >
                <FieldBlock label="Section Title">
                  <Input
                    value={form.testimonialsTitle}
                    onChange={(e) =>
                      setForm({ ...form, testimonialsTitle: e.target.value })
                    }
                    placeholder="What Our Clients Say"
                  />
                </FieldBlock>

                <div className="flex items-center justify-between">
                  <Label>Testimonials</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      addItem("testimonials", {
                        name: "",
                        designation: "",
                        content: "",
                        avatar: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Testimonial
                  </Button>
                </div>
                <div className="space-y-3">
                  {form.testimonials.map((t, i) => (
                    <div key={i} className="rounded-md border p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Testimonial {i + 1}
                        </span>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => removeItem("testimonials", i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <Input
                          value={t.name}
                          onChange={(e) =>
                            updateItem("testimonials", i, { name: e.target.value })
                          }
                          placeholder="Name"
                        />
                        <Input
                          value={t.designation}
                          onChange={(e) =>
                            updateItem("testimonials", i, {
                              designation: e.target.value,
                            })
                          }
                          placeholder="Designation"
                        />
                      </div>
                      <Textarea
                        rows={2}
                        value={t.content}
                        onChange={(e) =>
                          updateItem("testimonials", i, {
                            content: e.target.value,
                          })
                        }
                        placeholder="Testimonial content"
                      />
                      <div className="space-y-2">
                        <Label className="text-sm">Avatar</Label>
                        <ImageDropZone
                          value={t.avatar}
                          onChange={(value) =>
                            updateItem("testimonials", i, { avatar: value })
                          }
                          alt=""
                          onAltChange={() => {}}
                          fileKey={`testimonial-avatar-${i}`}
                        />
                      </div>
                    </div>
                  ))}
                  {form.testimonials.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No testimonials added yet.
                    </p>
                  )}
                </div>
              </SectionCard>

              {/* ---------------- Call To Action ---------------- */}
              <SectionCard
                title="Call To Action"
                description="Bottom-of-page CTA and contact details"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldBlock label="CTA Title">
                    <Input
                      value={form.ctaTitle}
                      onChange={(e) => setForm({ ...form, ctaTitle: e.target.value })}
                      placeholder="Ready to Register Your"
                    />
                  </FieldBlock>
                  <FieldBlock label="CTA Highlight">
                    <Input
                      value={form.ctaHighlight}
                      onChange={(e) =>
                        setForm({ ...form, ctaHighlight: e.target.value })
                      }
                      placeholder="Tax?"
                    />
                  </FieldBlock>
                  <div className="md:col-span-2">
                    <FieldBlock label="CTA Description">
                      <Textarea
                        rows={2}
                        value={form.ctaDescription}
                        onChange={(e) =>
                          setForm({ ...form, ctaDescription: e.target.value })
                        }
                      />
                    </FieldBlock>
                  </div>
                  <FieldBlock label="Apply Button Text">
                    <Input
                      value={form.ctaApplyButton}
                      onChange={(e) =>
                        setForm({ ...form, ctaApplyButton: e.target.value })
                      }
                    />
                  </FieldBlock>
                  <FieldBlock label="Call Button Text">
                    <Input
                      value={form.ctaCallButton}
                      onChange={(e) =>
                        setForm({ ...form, ctaCallButton: e.target.value })
                      }
                    />
                  </FieldBlock>
                  <FieldBlock label="WhatsApp Button Text">
                    <Input
                      value={form.ctaWhatsappButton}
                      onChange={(e) =>
                        setForm({ ...form, ctaWhatsappButton: e.target.value })
                      }
                    />
                  </FieldBlock>
                  <FieldBlock label="Phone">
                    <Input
                      value={form.ctaPhone}
                      onChange={(e) => setForm({ ...form, ctaPhone: e.target.value })}
                      placeholder="+923137937530"
                    />
                  </FieldBlock>
                  <FieldBlock label="WhatsApp Number">
                    <Input
                      value={form.ctaWhatsapp}
                      onChange={(e) =>
                        setForm({ ...form, ctaWhatsapp: e.target.value })
                      }
                      placeholder="923137937530"
                    />
                  </FieldBlock>
                </div>
              </SectionCard>

              <div className="flex gap-2 justify-end bg-card border-t borer-gray-200 px-4 py-3 sticky bottom-0 rounded-b-lg z-10">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Update Service"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/services")}
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Right Column - 40% (SEO Panel) */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-gray-300 dark:border-gray-600 p-4 rounded-2xl sticky top-24">
                <h2 className="text-lg font-semibold mb-4">SEO Settings</h2>
                <SeoPanel
                  slug={form.slug}
                  onSlugChange={(val) => {
                    slugEdited.current = true;
                    setForm({ ...form, slug: liveSlugify(val) });
                  }}
                  slugAvailable={slugAvailable}
                  isCheckingSlug={isCheckingSlug}
                  seoTitle={form.seo_title}
                  onSeoTitleChange={(val) =>
                    setForm({ ...form, seo_title: val })
                  }
                  seoDescription={form.seo_description}
                  onSeoDescriptionChange={(val) =>
                    setForm({ ...form, seo_description: val })
                  }
                  focusKeyword={form.focus_keyword}
                  onFocusKeywordChange={(val) =>
                    setForm({ ...form, focus_keyword: val })
                  }
                  title={form.title}
                  shortDescription={form.short_description}
                  featureImage={form.featureImage}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}