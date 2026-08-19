"use client";

import { useState, useEffect } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { wrapTables } from "@/lib/html";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import ServicePageBody from "@/components/service-detail/ServicePageBody";
import ServiceCtaBanner from "@/components/service-detail/sections/ServiceCtaBanner";
import { resolveIcon } from "@/components/service-detail/icon-resolver";
import type { TemplateData, SectionHeadings } from "@/components/service-detail/types";

interface Service {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  long_description?: string;
  icon?: string;
  featureImage?: string;
  featureImageAlt?: string;
  created_at?: string;
  updated_at?: string;
  author?: string;
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  badge?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  primaryButton?: string;
  secondaryButton?: string;
  trustPoints?: string[];
  solutionIntro?: string;
  commonProblems?: { text: string }[];
  solutions?: { text: string }[];
  includedServices?: { title: string; description: string; icon: string }[];
  businessStructures?: {
    title: string;
    description: string;
    icon: string;
    features: string[];
    authority: string;
    authorityIcon: string;
  }[];
  processSteps?: { step: number; title: string; description: string; icon: string }[];
  documentRequirements?: { applicantType: string; icon: string; documents: string[] }[];
  registrationAuthorities?: {
    title: string;
    icon: string;
    outputs: string[];
  }[];
  timelineMetrics?: { label: string; value: string; icon: string }[];
  fastProcessingText?: string;
  whyChooseFeatures?: { title: string; description?: string; icon: string }[];
  testimonials?: { name: string; designation: string; content: string; avatar: string }[];
  struggleHeadingBefore?: string;
  struggleHeadingHighlight?: string;
  servicesHeadingBefore?: string;
  servicesHeadingHighlight?: string;
  servicesHeadingAfter?: string;
  structuresHeadingBefore?: string;
  structuresHeadingHighlight?: string;
  processHeadingBefore?: string;
  processHeadingHighlight?: string;
  authoritiesHeadingBefore?: string;
  authoritiesHeadingHighlight?: string;
  whyChooseHeadingBefore?: string;
  whyChooseHeadingHighlight?: string;
  testimonialsTitle?: string;
  requiredDocsTitle?: string;
  timeRequiredTitle?: string;
  ctaTitle?: string;
  ctaHighlight?: string;
  ctaDescription?: string;
  ctaApplyButton?: string;
  ctaPhone?: string;
  ctaWhatsapp?: string;
  ctaCallButton?: string;
  ctaWhatsappButton?: string;
}

function buildTemplateData(data: Service): TemplateData {
  const sectionHeadings: SectionHeadings = {
    struggle: {
      beforeHighlight: data.struggleHeadingBefore ?? "Why People Struggle With",
      highlight: data.struggleHeadingHighlight ?? "Registration",
    },
    servicesInclude: {
      beforeHighlight: data.servicesHeadingBefore ?? "Our",
      highlight: data.servicesHeadingHighlight ?? "Services",
      afterHighlight: data.servicesHeadingAfter ?? " Include",
    },
    process: {
      beforeHighlight: data.processHeadingBefore ?? "Our Simple",
      highlight: data.processHeadingHighlight ?? "Process",
    },
    whyChoose: {
      beforeHighlight: data.whyChooseHeadingBefore ?? "Why Choose",
      highlight: data.whyChooseHeadingHighlight ?? "Us?",
    },
    testimonials: {
      title: data.testimonialsTitle ?? "What Our Clients Say",
    },
    documentsTimeline: {
      requiredDocs: data.requiredDocsTitle ?? "Required Documents",
      timeRequired: data.timeRequiredTitle ?? "Time Required",
    },
  };

  return {
    solutionIntro: data.solutionIntro ?? "",
    commonProblems: data.commonProblems ?? [],
    solutions: data.solutions ?? [],
    includedServices: data.includedServices ?? [],
    processSteps: data.processSteps ?? [],
    documentRequirements: data.documentRequirements ?? [],
    timelineMetrics: data.timelineMetrics ?? [],
    fastProcessingText: data.fastProcessingText ?? "",
    whyChooseFeatures: data.whyChooseFeatures ?? [],
    serviceTestimonials: data.testimonials ?? [],
    sectionHeadings,
    ctaBanner: {
      title: data.ctaTitle ?? "Ready to Register Your",
      highlight: data.ctaHighlight ?? "Service?",
      description: data.ctaDescription ?? "Get professional assistance today.",
      applyButtonText: data.ctaApplyButton ?? "Apply Now",
      phoneNumber: data.ctaPhone ?? "+923137937530",
      whatsappNumber: data.ctaWhatsapp ?? "923137937530",
      callButtonText: data.ctaCallButton ?? "Call Now",
      whatsappButtonText: data.ctaWhatsappButton ?? "WhatsApp Us",
    },
  };
}

export function ServiceDetailClient({ slug }: { slug: string }) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services/${slug}`);

        if (!res.ok) {
          if (!cancelled) {
            setError("Service not found");
            setLoading(false);
          }
          return;
        }

        const data = await res.json();

        if (!cancelled) {
          if (data?.service) {
            setService(data.service);
          } else {
            setError("Service not found");
          }
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("Something went wrong");
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-[70vh] flex items-center justify-center bg-[#f4f7f6]">
          <Loader2 className="w-10 h-10 animate-spin text-[#0d7a7a]" />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !service) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-[70vh] flex items-center justify-center bg-[#f4f7f6]">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Service Not Found
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {error || "The requested service does not exist."}
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0d7a7a] text-white rounded-lg hover:bg-[#0a6666] transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              View All Services
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const templateData = buildTemplateData(service);
  const plainText = (service.heroDescription ?? service.short_description ?? "").replace(/<[^>]*>/g, "");

  return (
    <>
      <PublicHeader />
      <main>
        <section className="relative w-full bg-white overflow-hidden min-h-[500px] flex items-center">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-500 mb-5">
                  <Link href="/" className="hover:text-[#007a7a] transition-colors">Home</Link>
                  <span>/</span>
                  <Link href="/services" className="hover:text-[#007a7a] transition-colors">Services</Link>
                  <span>/</span>
                  <span className="text-gray-400 font-medium">{service.title}</span>
                </div>

                {service.badge && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0d7a7a]/10 text-[#0d7a7a] text-xs font-semibold mb-4 w-fit">
                    {service.badge}
                  </div>
                )}

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-[#0f2547] leading-[1.15] tracking-tight mb-3">
                  {service.title}
                </h1>

                {service.heroSubtitle && (
                  <p className="text-lg md:text-xl text-[#0f2547]/80 font-medium mb-4">
                    {service.heroSubtitle}
                  </p>
                )}
                <p className="text-gray-600 text-sm md:text-base max-w-xl leading-relaxed mb-8">
                  {plainText}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-10">
                  <Link
                    href="/apply"
                    className="bg-[#007a7a] hover:bg-[#006363] text-white px-6 py-3.5 rounded font-semibold text-sm transition-all"
                  >
                    {service.primaryButton ?? "Apply Now"}
                  </Link>
                  <Link
                    href="/consultation"
                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3.5 rounded font-semibold text-sm transition-all"
                  >
                    {service.secondaryButton ?? "Free Consultation"}
                  </Link>
                </div>

                {service.trustPoints && service.trustPoints.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-gray-100">
                    {service.trustPoints.map((point) => (
                      <div key={point} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-[#007a7a] stroke-[3]" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="hidden lg:block lg:col-span-5" />
            </div>
          </div>

          <svg className="absolute w-0 h-0" aria-hidden="true">
            <defs>
              <clipPath id="diagonal-clip" clipPathUnits="objectBoundingBox">
                <path d="M 0.3,0 C 0.1,0.3 0.2,0.7 0,1 L 1,1 L 1,0 Z" />
              </clipPath>
            </defs>
          </svg>

          {service.featureImage && (
            <div className="hidden lg:block absolute top-0 bottom-0 right-0 w-[45vw] h-full z-0 select-none pointer-events-none">
              <div className="absolute -inset-1 w-full h-full" style={{ clipPath: "url(#diagonal-clip)" }}>
                <img
                  src={service.featureImage}
                  alt={service.featureImageAlt || service.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          )}
        </section>

        {service.long_description && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{
                  __html: wrapTables(service.long_description),
                }}
              />
            </div>
          </section>
        )}

        <ServicePageBody templateData={templateData} />

        {service.businessStructures && (
          <section className="py-14 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[#002233] text-center leading-tight mb-10 md:mb-12">
                {service.structuresHeadingBefore ?? "Types of Business Structures"}{" "}
                <span className="text-[#006666]">{service.structuresHeadingHighlight ?? "We Register"}</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {service.businessStructures.map((structure) => {
                  const Icon = resolveIcon(structure.icon);
                  const AuthorityIcon = resolveIcon(structure.authorityIcon);
                  return (
                    <div key={structure.title} className="border border-gray-200 rounded-xl bg-white shadow-sm p-6 md:p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#006666]/30 flex flex-col">
                      <div className="w-14 h-14 rounded-xl bg-[#006666]/10 flex items-center justify-center mb-5">
                        <Icon className="w-7 h-7 text-[#006666]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#002233] mb-3">{structure.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-5">{structure.description}</p>
                      <ul className="space-y-2.5 mb-6 flex-1">
                        {structure.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5">
                            <svg className="w-4 h-4 text-[#006666] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 border-t border-gray-100 flex items-center gap-2.5">
                        <AuthorityIcon className="w-4 h-4 text-[#006666] shrink-0" />
                        <span className="text-xs text-gray-500 font-medium">Authority: {structure.authority}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {service.registrationAuthorities && (
          <section className="py-14 md:py-20 bg-[#F4F7F9]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-[#002233] text-center leading-tight mb-10 md:mb-12">
                {service.authoritiesHeadingBefore ?? "Registration Authorities"}{" "}
                <span className="text-[#006666]">{service.authoritiesHeadingHighlight ?? "in Pakistan"}</span>
              </h2>
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                {service.registrationAuthorities.map((authority) => {
                  const Icon = resolveIcon(authority.icon);
                  return (
                    <div key={authority.title} className="border border-gray-200 rounded-xl bg-white shadow-sm p-6 md:p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#006666]/30">
                      <div className="w-14 h-14 mx-auto rounded-full bg-[#006666]/10 flex items-center justify-center mb-4">
                        <Icon className="w-7 h-7 text-[#006666]" />
                      </div>
                      <h3 className="text-lg font-bold text-[#002233] mb-4">{authority.title}</h3>
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Output</p>
                        {authority.outputs.map((output) => (
                          <span key={output} className="inline-block bg-[#E8F5F4] text-[#006666] text-sm font-semibold px-4 py-1.5 rounded-full">
                            {output}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

       

        <ServiceCtaBanner
          title={templateData.ctaBanner.title}
          highlight={templateData.ctaBanner.highlight}
          description={templateData.ctaBanner.description}
          applyButtonText={templateData.ctaBanner.applyButtonText}
          callButtonText={`Call Now (${templateData.ctaBanner.phoneNumber})`}
          whatsappButtonText={templateData.ctaBanner.whatsappButtonText}
          phoneNumber={templateData.ctaBanner.phoneNumber}
          whatsappNumber={templateData.ctaBanner.whatsappNumber}
        />
      </main>
      <Footer />
    </>
  );
}