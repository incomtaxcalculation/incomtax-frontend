"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Loader2, ArrowUpRight } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/AppContext";

interface Service {
  id: number;
  title: string;
  slug: string;
  short_description?: string;
  icon?: string;
  featureImage?: string;
  featureImageAlt?: string;
}

let cachedServices: Service[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export default function ServicesDropdown() {
  const { apiUrl } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loaded, setLoaded] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = Date.now();
    if (cachedServices && now - cacheTimestamp < CACHE_DURATION) {
      setServices(cachedServices);
      setLoaded(true);
      return;
    }

    const controller = new AbortController();

    const fetchStatic = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services?limit=20&status=active`);     
        const data = await res.json();
        return (data.services || []) as Service[];
      } catch {
        return [] as Service[];
      }
    };

    const fetchApi = fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/services?limit=20&status=active&sort=created_at:desc`,
      { signal: controller.signal },
    ).then((res) => res.json());

    Promise.all([fetchApi, fetchStatic()])
      .then(([apiData, staticServices]) => {
        const apiList: Service[] = (apiData.services || []).slice(0, 5);
        const merged = [...apiList];

        for (const s of staticServices) {
          if (!merged.find((m) => m.slug === s.slug)) {
            merged.push(s);
          }
        }

        const list = merged.slice(0, 8);
        cachedServices = list;
        cacheTimestamp = Date.now();
        setServices(list);
        setLoaded(true);
      })
      .catch(() => {
        fetchStatic().then((staticServices) => {
          if (staticServices.length > 0) {
            setServices(staticServices);
          }
          setLoaded(true);
        });
      });
    return () => controller.abort();
  }, [apiUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const show = () => {
    clearTimeout(closeTimerRef.current);
    setIsOpen(true);
  };

  const hide = () => {
    closeTimerRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <Link
        href="/services"
        className="text-foreground hover:text-primary font-medium transition-colors inline-flex items-center gap-1"
      >
        Services
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </Link>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-xl bg-popover p-1.5 text-popover-foreground shadow-xl ring-1 ring-foreground/10 animate-in fade-in-0 zoom-in-95 slide-in-from-top-3 duration-200">
          {!loaded ? (
            <div className="flex items-center justify-center px-3 py-10">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : services.length === 0 ? (
            <p className="px-3 py-6 text-sm text-muted-foreground text-center">
              No services available
            </p>
          ) : (
            <div className="space-y-0.5">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-all duration-200 hover:bg-accent/60 hover:scale-[1.02] active:scale-[0.99]"
                >
                  <div className="shrink-0 mt-0.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      <DynamicIcon name={(service.icon || "building-2") as any} className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-foreground transition-colors duration-200 group-hover:text-primary">
                        {service.title}
                      </span>
                      <ArrowUpRight className="h-2.5 w-2.5 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-primary" />
                    </div>
                    
                    {service.short_description && (
                      <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                        {service.short_description.replace(/<[^>]*>/g, "")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
              <div className="border-t border-border/50 mt-1 pt-1">
                <Link
                  href="/services"
                  className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-primary transition-all duration-200 hover:bg-accent/50"
                >
                  <span>View All Services</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
