"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/hooks/useRouter";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

interface CommonProblem {
  text: string;
}

interface Solution {
  text: string;
}

interface IncludedService {
  title: string;
  description: string;
  icon: string;
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

interface DocumentRequirement {
  applicantType: string;
  icon: string;
  documents: string[];
}

interface TimelineMetric {
  label: string;
  value: string;
  icon: string;
}

interface WhyChooseFeature {
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  name: string;
  designation: string;
  content: string;
  avatar: string;
}

interface ServiceFormData {
  // Basic info
  title: string;
  slug: string;
  short_description: string;
  icon: string;
  status: string;
  featureImage: string;
  featureImageAlt: string;
  author: string;
  

  // SEO
  seo_title: string;
  seo_description: string;
  focus_keyword: string;

  // Hero section
  badge: string;
  heroDescription: string;
  primaryButton: string;
  secondaryButton: string;
  trustPoints: string[];

  // Problem / solution
  struggleHeadingBefore: string;
  struggleHeadingHighlight: string;
  solutionIntro: string;
  commonProblems: CommonProblem[];
  solutions: Solution[];

  // Included services
  servicesHeadingBefore: string;
  servicesHeadingHighlight: string;
  servicesHeadingAfter: string;
  includedServices: IncludedService[];

  // Process
  processHeadingBefore: string;
  processHeadingHighlight: string;
  processSteps: ProcessStep[];

  // Document requirements
  requiredDocsTitle: string;
  documentRequirements: DocumentRequirement[];

  // Timeline
  timeRequiredTitle: string;
  fastProcessingText: string;
  timelineMetrics: TimelineMetric[];

  // Why choose us
  whyChooseHeadingBefore: string;
  whyChooseHeadingHighlight: string;
  whyChooseFeatures: WhyChooseFeature[];

  // Testimonials
  testimonialsTitle: string;
  testimonials: Testimonial[];

  // CTA
  ctaTitle: string;
  ctaHighlight: string;
  ctaDescription: string;
  ctaApplyButton: string;
  ctaPhone: string;
  ctaWhatsapp: string;
  ctaCallButton: string;
  ctaWhatsappButton: string;
}

const initialFormData: ServiceFormData = {
  title: "",
  slug: "",
  short_description: "",
  icon: "",
  status: "active",
  featureImage: "",
  featureImageAlt: "",
  author: "",

  seo_title: "",
  seo_description: "",
  focus_keyword: "",

  badge: "",
  heroDescription: "",
  primaryButton: "",
  secondaryButton: "",
  trustPoints: [],

  struggleHeadingBefore: "",
  struggleHeadingHighlight: "",
  solutionIntro: "",
  commonProblems: [],
  solutions: [],

  servicesHeadingBefore: "",
  servicesHeadingHighlight: "",
  servicesHeadingAfter: "",
  includedServices: [],

  processHeadingBefore: "",
  processHeadingHighlight: "",
  processSteps: [],

  requiredDocsTitle: "",
  documentRequirements: [],

  timeRequiredTitle: "",
  fastProcessingText: "",
  timelineMetrics: [],

  whyChooseHeadingBefore: "",
  whyChooseHeadingHighlight: "",
  whyChooseFeatures: [],

  testimonialsTitle: "",
  testimonials: [],

  ctaTitle: "",
  ctaHighlight: "",
  ctaDescription: "",
  ctaApplyButton: "",
  ctaPhone: "",
  ctaWhatsapp: "",
  ctaCallButton: "",
  ctaWhatsappButton: "",
};

/* ------------------------------------------------------------------ */
/* Small reusable field wrapper                                       */
/* ------------------------------------------------------------------ */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Draft persistence (protects against long form-fill + token expiry) */
/* ------------------------------------------------------------------ */

const DRAFT_STORAGE_KEY = "create-service-draft";

function loadDraft(): ServiceFormData {
  if (typeof window === "undefined") return initialFormData;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (raw) return { ...initialFormData, ...JSON.parse(raw) };
  } catch {
    // corrupt / unavailable draft - fall back to a blank form
  }
  return initialFormData;
}

function hasDraft(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(DRAFT_STORAGE_KEY);
}

function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
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
    const res = await fetch("/api/admin/refresh-token/", {
      method: "POST",
      credentials: "include",
    });
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

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CreateServicePage() {
  const router = useRouter();

  const [formData, setFormData] = useState<ServiceFormData>(loadDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const draftRestoredRef = useRef(hasDraft());

  // Let the user know their in-progress data was recovered.
  useEffect(() => {
    if (draftRestoredRef.current) {
      toast.message("Restored your unsaved draft", {
        description: "Pick up where you left off, or clear it below.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save as the user fills the form, so nothing is lost if the
  // session expires or the tab closes before they hit "Create Service".
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        window.localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify(formData),
        );
      } catch {
        // storage unavailable/full - draft just won't persist
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData]);

  // Keep the session alive in the background while this long form is
  // open, so filling it out slowly doesn't cause the token to expire
  // by the time the user clicks "Create Service".
  useEffect(() => {
    const interval = setInterval(() => {
      refreshSession();
    }, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleClearDraft = () => {
    clearDraft();
    setFormData(initialFormData);
    toast.message("Draft cleared");
  };

  const setField = <K extends keyof ServiceFormData>(
    key: K,
    value: ServiceFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug:
        prev.slug === "" || prev.slug === slugify(prev.title)
          ? slugify(value)
          : prev.slug,
    }));
  };

  /* ---------------- generic array helpers ---------------- */

  const addItem = <K extends keyof ServiceFormData>(
    key: K,
    item: ServiceFormData[K] extends (infer U)[] ? U : never,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...(prev[key] as any[]), item],
    }));
  };

  const removeItem = <K extends keyof ServiceFormData>(key: K, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [key]: (prev[key] as any[]).filter((_, i) => i !== index),
    }));
  };

  const updateItem = <K extends keyof ServiceFormData>(
    key: K,
    index: number,
    patch: Partial<any>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: (prev[key] as any[]).map((item, i) =>
        i === index ? { ...item, ...patch } : item,
      ),
    }));
  };

  /* trustPoints and documentRequirements.documents are plain string arrays */

  const addTrustPoint = () => addItem("trustPoints", "");
  const updateTrustPoint = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      trustPoints: prev.trustPoints.map((t, i) => (i === index ? value : t)),
    }));
  };
  const removeTrustPoint = (index: number) => removeItem("trustPoints", index);

  const addDocument = (reqIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      documentRequirements: prev.documentRequirements.map((r, i) =>
        i === reqIndex ? { ...r, documents: [...r.documents, ""] } : r,
      ),
    }));
  };
  const updateDocument = (reqIndex: number, docIndex: number, value: string) => {
    setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      documentRequirements: prev.documentRequirements.map((r, i) =>
        i === reqIndex
          ? { ...r, documents: r.documents.filter((_, di) => di !== docIndex) }
          : r,
      ),
    }));
  };

  /* ---------------- submit ---------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Refresh the session up front - the form can take a while to fill
      // out, so the token may be close to (or past) expiry by submit time.
      await refreshSession();

      // Upload the dropped feature image (if the user selected a new one)
      let featureImage = formData.featureImage;
      const featureImageFile = getCurrentFile("featureImage");
      if (featureImageFile) {
        const uploadedUrl = await uploadFile(featureImageFile);
        featureImage = uploadedUrl;
      }

      // processSteps.step should follow display order
      const payload = {
        ...formData,
        featureImage,
        processSteps: formData.processSteps.map((step, i) => ({
          ...step,
          step: i + 1,
        })),
      };

      const res = await fetchWithAuthRetry("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Service created successfully");
        clearAllFiles();
        clearDraft();
        router.push("/admin/services");
      } else if (res.status === 401) {
        // Session couldn't be refreshed - don't lose the user's work.
        // The draft is already auto-saved, so it'll be there after re-login.
        toast.error(
          "Your session expired. Your form data is saved as a draft — please log in again to continue.",
        );
      } else {
        toast.error("Failed to create service");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add Service</h1>
            <p className="text-muted-foreground">
              Create a new service listing
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClearDraft}
            >
              Clear Draft
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/services")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Create Service"}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground -mt-4">
          Your progress is saved automatically as you type, so it's safe to
          take your time filling this out.
        </p>

        {/* ---------------- Basic Information ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Core details shown in the services list</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <Input
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Income Tax Registration in Pakistan"
              />
            </Field>
            <Field label="Slug">
              <Input
                value={formData.slug}
                onChange={(e) => setField("slug", e.target.value)}
                placeholder="tax-registration"
              />
            </Field>
            <Field label="Icon">
              <IconPicker
                value={formData.icon}
                onChange={(icon: string) => setField("icon", icon)}
              />
            </Field>
            <Field label="Status">
              <Select
                value={formData.status}
                onValueChange={(v) => setField("status", v)}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <StatusIcon status={formData.status} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Service Status</SelectLabel>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Feature Image Alt Text">
              <Input
                value={formData.featureImageAlt}
                onChange={(e) => setField("featureImageAlt", e.target.value)}
              />
            </Field>
            <Field label="Author">
              <Input
                value={formData.author}
                onChange={(e) => setField("author", e.target.value)}
                placeholder="Navigate Business"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Feature Image">
                <ImageDropZone
                  id="featureImage"
                  label="Feature Image"
                  existingImageUrl={formData.featureImage}
                  onAltChange={()=>{}}
                  onChange={()=>{}}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Short Description">
                <TiptapEditor
                  value={formData.short_description}
                  onChange={(html: string) =>
                    setField("short_description", html)
                  }
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* ---------------- SEO ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
            <CardDescription>Search engine metadata</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="SEO Title">
              <Input
                value={formData.seo_title}
                onChange={(e) => setField("seo_title", e.target.value)}
              />
            </Field>
            <Field label="Focus Keyword">
              <Input
                value={formData.focus_keyword}
                onChange={(e) => setField("focus_keyword", e.target.value)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="SEO Description">
                <Textarea
                  rows={2}
                  value={formData.seo_description}
                  onChange={(e) =>
                    setField("seo_description", e.target.value)
                  }
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* ---------------- Hero Section ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Top banner content on the service page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Badge">
                <Input
                  value={formData.badge}
                  onChange={(e) => setField("badge", e.target.value)}
                  placeholder="FBR REGISTRATION SERVICE"
                />
              </Field>
              <Field label="Primary Button Text">
                <Input
                  value={formData.primaryButton}
                  onChange={(e) => setField("primaryButton", e.target.value)}
                />
              </Field>
              <Field label="Secondary Button Text">
                <Input
                  value={formData.secondaryButton}
                  onChange={(e) =>
                    setField("secondaryButton", e.target.value)
                  }
                />
              </Field>
            </div>
            <Field label="Full Description">
              <TiptapEditor
                value={formData.heroDescription}
                onChange={(html: string) =>
                  setField("heroDescription", html)
                }
              />
            </Field>

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
                {formData.trustPoints.map((point, i) => (
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
                {formData.trustPoints.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No trust points added yet.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---------------- Problem & Solution ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Problem &amp; Solution</CardTitle>
            <CardDescription>
              Pain points customers face and how the service solves them
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Struggle Heading (before highlight)">
                <Input
                  value={formData.struggleHeadingBefore}
                  onChange={(e) =>
                    setField("struggleHeadingBefore", e.target.value)
                  }
                  placeholder="Why People Struggle With"
                />
              </Field>
              <Field label="Struggle Heading (highlight)">
                <Input
                  value={formData.struggleHeadingHighlight}
                  onChange={(e) =>
                    setField("struggleHeadingHighlight", e.target.value)
                  }
                  placeholder="Income Tax Registration"
                />
              </Field>
            </div>

            <Field label="Solution Intro">
              <Textarea
                rows={2}
                value={formData.solutionIntro}
                onChange={(e) => setField("solutionIntro", e.target.value)}
              />
            </Field>

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
                {formData.commonProblems.map((problem, i) => (
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
                {formData.commonProblems.length === 0 && (
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
                {formData.solutions.map((solution, i) => (
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
                {formData.solutions.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No solutions added yet.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---------------- Included Services ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Included Services</CardTitle>
            <CardDescription>
              What is included as part of this service
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Heading (before highlight)">
                <Input
                  value={formData.servicesHeadingBefore}
                  onChange={(e) =>
                    setField("servicesHeadingBefore", e.target.value)
                  }
                  placeholder="Our Income Tax Registration"
                />
              </Field>
              <Field label="Heading (highlight)">
                <Input
                  value={formData.servicesHeadingHighlight}
                  onChange={(e) =>
                    setField("servicesHeadingHighlight", e.target.value)
                  }
                  placeholder="Services"
                />
              </Field>
              <Field label="Heading (after highlight)">
                <Input
                  value={formData.servicesHeadingAfter}
                  onChange={(e) =>
                    setField("servicesHeadingAfter", e.target.value)
                  }
                  placeholder=" Include"
                />
              </Field>
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
              {formData.includedServices.map((item, i) => (
                <div
                  key={i}
                  className="grid gap-2 md:grid-cols-[1fr_1fr_120px_auto] items-start rounded-md border p-3"
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
                    onChange={(icon: string) =>
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
              {formData.includedServices.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No included services added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---------------- Process Steps ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Process Steps</CardTitle>
            <CardDescription>
              Step-by-step flow shown on the service page (numbered automatically)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Heading (before highlight)">
                <Input
                  value={formData.processHeadingBefore}
                  onChange={(e) =>
                    setField("processHeadingBefore", e.target.value)
                  }
                  placeholder="Our Simple Registration"
                />
              </Field>
              <Field label="Heading (highlight)">
                <Input
                  value={formData.processHeadingHighlight}
                  onChange={(e) =>
                    setField("processHeadingHighlight", e.target.value)
                  }
                  placeholder="Process"
                />
              </Field>
            </div>

            <div className="flex items-center justify-between">
              <Label>Steps</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  addItem("processSteps", {
                    step: formData.processSteps.length + 1,
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
              {formData.processSteps.map((step, i) => (
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
                      onChange={(icon: string) =>
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
                      className="md:col-span-1"
                    />
                  </div>
                </div>
              ))}
              {formData.processSteps.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No process steps added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---------------- Document Requirements ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Document Requirements</CardTitle>
            <CardDescription>
              Required documents grouped by applicant type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Section Title">
              <Input
                value={formData.requiredDocsTitle}
                onChange={(e) =>
                  setField("requiredDocsTitle", e.target.value)
                }
                placeholder="Required Documents for Income Tax Registration"
              />
            </Field>

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
              {formData.documentRequirements.map((req, i) => (
                <div key={i} className="rounded-md border p-3 space-y-2">
                  <div className="grid gap-2 md:grid-cols-[1fr_160px_auto] items-start">
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
                      onChange={(icon: string) =>
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
              {formData.documentRequirements.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No applicant types added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---------------- Timeline ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Processing time metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Section Title">
                <Input
                  value={formData.timeRequiredTitle}
                  onChange={(e) =>
                    setField("timeRequiredTitle", e.target.value)
                  }
                  placeholder="Time Required for Income Tax Registration"
                />
              </Field>
              <Field label="Fast Processing Text">
                <Input
                  value={formData.fastProcessingText}
                  onChange={(e) =>
                    setField("fastProcessingText", e.target.value)
                  }
                />
              </Field>
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
              {formData.timelineMetrics.map((metric, i) => (
                <div
                  key={i}
                  className="grid gap-2 md:grid-cols-[1fr_1fr_120px_auto] items-center rounded-md border p-3"
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
                    onChange={(icon: string) =>
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
              {formData.timelineMetrics.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No metrics added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---------------- Why Choose Us ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Why Choose Us</CardTitle>
            <CardDescription>Key differentiators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Heading (before highlight)">
                <Input
                  value={formData.whyChooseHeadingBefore}
                  onChange={(e) =>
                    setField("whyChooseHeadingBefore", e.target.value)
                  }
                  placeholder="Why Choose"
                />
              </Field>
              <Field label="Heading (highlight)">
                <Input
                  value={formData.whyChooseHeadingHighlight}
                  onChange={(e) =>
                    setField("whyChooseHeadingHighlight", e.target.value)
                  }
                  placeholder="Us?"
                />
              </Field>
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
              {formData.whyChooseFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="grid gap-2 md:grid-cols-[1fr_1fr_120px_auto] items-start rounded-md border p-3"
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
                    onChange={(icon: string) =>
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
              {formData.whyChooseFeatures.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No features added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---------------- Testimonials ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>Client reviews shown on the page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Section Title">
              <Input
                value={formData.testimonialsTitle}
                onChange={(e) =>
                  setField("testimonialsTitle", e.target.value)
                }
                placeholder="What Our Clients Say"
              />
            </Field>

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
              {formData.testimonials.map((t, i) => (
                <div key={i} className="rounded-md border p-3 space-y-2">
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
                  <div className="grid gap-2 md:grid-cols-3">
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
                    <Input
                      value={t.avatar}
                      onChange={(e) =>
                        updateItem("testimonials", i, {
                          avatar: e.target.value,
                        })
                      }
                      placeholder="Avatar URL"
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
                </div>
              ))}
              {formData.testimonials.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No testimonials added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---------------- Call To Action ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle>Call To Action</CardTitle>
            <CardDescription>Bottom-of-page CTA and contact details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="CTA Title">
              <Input
                value={formData.ctaTitle}
                onChange={(e) => setField("ctaTitle", e.target.value)}
                placeholder="Ready to Register Your"
              />
            </Field>
            <Field label="CTA Highlight">
              <Input
                value={formData.ctaHighlight}
                onChange={(e) => setField("ctaHighlight", e.target.value)}
                placeholder="Tax?"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="CTA Description">
                <Textarea
                  rows={2}
                  value={formData.ctaDescription}
                  onChange={(e) =>
                    setField("ctaDescription", e.target.value)
                  }
                />
              </Field>
            </div>
            <Field label="Apply Button Text">
              <Input
                value={formData.ctaApplyButton}
                onChange={(e) => setField("ctaApplyButton", e.target.value)}
              />
            </Field>
            <Field label="Call Button Text">
              <Input
                value={formData.ctaCallButton}
                onChange={(e) => setField("ctaCallButton", e.target.value)}
              />
            </Field>
            <Field label="WhatsApp Button Text">
              <Input
                value={formData.ctaWhatsappButton}
                onChange={(e) =>
                  setField("ctaWhatsappButton", e.target.value)
                }
              />
            </Field>
            <Field label="Phone">
              <Input
                value={formData.ctaPhone}
                onChange={(e) => setField("ctaPhone", e.target.value)}
                placeholder="+923137937530"
              />
            </Field>
            <Field label="WhatsApp Number">
              <Input
                value={formData.ctaWhatsapp}
                onChange={(e) => setField("ctaWhatsapp", e.target.value)}
                placeholder="923137937530"
              />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/services")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Service"}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}