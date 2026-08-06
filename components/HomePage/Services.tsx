"use client";

import { useState, useEffect } from "react";
import {
  Gavel,
  ClipboardCheck,
  FileText,
  BookOpen,
  Copyright,
  ShieldCheck,
  Building2,
  ReceiptText,
  ScrollText,
} from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface AdminService {
  id: number;
  title: string;
  slug: string;
  icon?: string;
}

interface StaticServices {
  icon: LucideIcon;
  title: string;
  subTitle: string;
  href: string;
}

const staticServices: StaticServices[] = [
  {
    icon: ReceiptText,
    title: "Income Tax",
    subTitle: "Registration",
    href: `/services/tax-registration`,
  },
  {
    icon: ScrollText,
    title: "Sales Tax",
    subTitle: "Registration",
    href: "/services/sales-tax-registration",
  },
  {
    icon: Building2,
    title: "Business",
    subTitle: "Registration",
    href: "/services/business-registration",
  },
  {
    icon: Gavel,
    title: "Tax Appeal &",
    subTitle: "Litigation Services",
    href: "/services/tax-appeal",
  },
  {
    icon: ClipboardCheck,
    title: "Audit & Assurance",
    subTitle: "Services",
    href: "/services/audit",
  },
  {
    icon: FileText,
    title: "Accounting &",
    subTitle: "Reporting Services",
    href: "/services/accounting",
  },
  {
    icon: BookOpen,
    title: "Bookkeeping",
    subTitle: "Services",
    href: "/services/bookkeeping",
  },
  {
    icon: Copyright,
    title: "Copyright",
    subTitle: "Registration",
    href: "/services/copyright",
  },
  {
    icon: ShieldCheck,
    title: "Trademark",
    subTitle: "Registration",
    href: "/services/trademark",
  },
  {
    icon: Building2,
    title: "Company & Firm",
    subTitle: "Registration",
    href: "/services/company-registration",
  },
];

type ServiceItem =
  | { kind: "admin"; icon: string; title: string; slug: string }
  | { kind: "static"; icon: LucideIcon; title: string; subTitle: string; href: string };

function buildServiceItems(adminServices: AdminService[]): ServiceItem[] {
  const adminItems = adminServices.map((s) => ({
    kind: "admin" as const,
    icon: s.icon || "receipt-text",
    title: s.title,
    slug: s.slug,
  }));

  const merged: ServiceItem[] = [];
  const seen = new Set<string>();

  const addStatic = (staticItem: StaticServices) => {
    const adminMatch = adminItems.find((a) => a.slug === staticItem.href.replace("/services/", ""));
    if (adminMatch) {
      if (!seen.has(adminMatch.slug)) {
        seen.add(adminMatch.slug);
        merged.push(adminMatch);
      }
    } else {
      if (!seen.has(staticItem.href)) {
        seen.add(staticItem.href);
        merged.push({ kind: "static", ...staticItem });
      }
    }
  };

  for (const s of staticServices) {
    addStatic(s);
  }

  for (const admin of adminItems) {
    if (!seen.has(admin.slug)) {
      seen.add(admin.slug);
      merged.push(admin);
    }
  }

  return merged.slice(0, 8);
}

export default function ServicesSection() {
  const [items, setItems] = useState<ServiceItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    const fetchAdmin = async () => {
      try {
        const res = await fetch("/api/services?limit=8&status=active");
        const data = await res.json();
        if (cancelled) return;
        setItems(buildServiceItems(data.services || []));
      } catch {
        if (!cancelled) setItems(buildServiceItems([]));
      }
    };
    fetchAdmin();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="services" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#0a3d3d] mb-2">
            Our Services
          </h2>
          <p className="text-sm text-gray-500">
            All the services that we provide to the clients
          </p>
        </div>

        {/* 4-Column Grid (LG) / 2-Column (MD) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, index) => {
            const isAdmin = item.kind === "admin";
            const href = isAdmin
              ? `/services/${(item as any).slug}`
              : (item as any).href;
            const iconEl = isAdmin ? (
              <DynamicIcon
                name={(item as any).icon as any}
                className="w-6 h-6 text-[#0d7a7a] group-hover:text-white transition-colors"
              />
            ) : (
              (() => {
                const Icon = (item as any).icon as LucideIcon;
                return (
                  <Icon
                    className="w-6 h-6 text-[#0d7a7a] group-hover:text-white transition-colors"
                    strokeWidth={1.5}
                  />
                );
              })()
            );

            return (
              <Link key={index} href={href} className="group">
                <div className="h-full bg-white rounded-xl p-5 border border-gray-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.06)] hover:shadow-md transition-all duration-300 flex items-center gap-4 flex-col md:flex-row text-center">
                  <div className="w-12 h-12 bg-[#f0f7f7] rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#0d7a7a] transition-colors duration-300">
                    {iconEl}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#0a3d3d] leading-tight">
                      {(item as any).title}
                    </span>
                    {!isAdmin && (
                      <span className="text-[13px] font-bold text-[#0a3d3d] leading-tight">
                        {(item as any).subTitle}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Button
            size="2xl"
            className="rounded-full px-8 bg-[#0d7a7a] hover:bg-[#119191] text-white border-none shadow-lg"
          >
            <Link href="/services">View More Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
