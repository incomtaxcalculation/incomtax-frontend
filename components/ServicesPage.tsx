"use client";

import { useState, useEffect } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import Image from "next/image";
import { Loader2, AlertCircle, Building2 } from "lucide-react";
import { format } from "date-fns/format";

interface Service {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  icon?: string;
  featureImage: string;
  featureImageAlt: string;
  categories?: string[];
  author?: string;
  created_at?: string;
}

export default function ServicesPage() {
  const { apiUrl } = useAppContext();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchServices = async () => {
      try {
        const [apiRes, staticRes] = await Promise.all([
          fetch(`${apiUrl}/api/services?limit=100&status=active`),
          fetch("/data/services-static.json").catch(() => null),
        ]);

        let merged: Service[] = [];

        if (apiRes && apiRes.ok) {
          const data = await apiRes.json();
          merged = data.services || [];
        }

        if (staticRes && staticRes.ok) {
          const staticData = await staticRes.json();
          const staticList: Service[] = staticData.services || [];
          for (const s of staticList) {
            if (!merged.find((m) => m.slug === s.slug)) {
              merged.push(s);
            }
          }
        }

        if (!cancelled) {
          setServices(merged);
          if (merged.length === 0) {
            setError("No services available");
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchServices();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  if (loading) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-[70vh] flex items-center justify-center bg-[#f4f7f6]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#0d7a7a] mx-auto" />
            <p className="mt-4 text-gray-500 text-sm">Loading services...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-[70vh] flex items-center justify-center bg-[#f4f7f6]">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Unable to Load Services
            </h2>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0d7a7a] text-white rounded-lg hover:bg-[#0a6666] transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PublicHeader />
      <main>
        <section className="bg-gradient-to-br from-[#0a3d3d] to-[#0d7a7a] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Our Services
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Comprehensive tax, finance, and compliance solutions tailored to
                meet the unique needs of your business
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#f4f7f6]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            {services.length === 0 ? (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No services available at the moment.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Please check back later.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0a3d3d]">
                      All Services
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {services.length} service{services.length !== 1 && "s"}{" "}
                      available
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="group block"
                    >
                      <article className="bg-white overflow-hidden h-full flex flex-col font-sans transition-all duration-300 hover:shadow-lg border border-gray-300">
                        {/* Image Container */}
                        <div className="relative h-56 md:h-64 overflow-hidden bg-gray-100">
                          {service.featureImage ? (
                            <Image
                              src={service.featureImage}
                              alt={service.featureImageAlt || service.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                              fill
                            />
                          ) : (
                            /* Fallback if no feature image exists */
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <Building2 className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Content Container */}
                        <div className="pt-6 pb-5 px-5 flex flex-col flex-1">

                          {/* Title */}
                          <h3 className="text-xl md:text-[22px] font-extrabold text-[#222222] mb-3 leading-tight tracking-tight group-hover:text-primary transition-colors duration-200">
                            {service.title}
                          </h3>

                          {/* Metadata (Author & Date) */}
                          <div className="flex items-center gap-2.5 text-gray-400 text-xs md:text-sm mb-3 font-normal">
                            <div className="flex items-center gap-1.5">
                              {/* Simple User SVG Icon */}
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <span className="text-gray-500">
                                {service?.author || "Admin"}
                              </span>
                            </div>

                            <span className="text-gray-300">—</span>

                            <div className="flex items-center gap-1.5">
                              {/* Simple Calendar SVG Icon */}
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-gray-500">
                                {service.created_at ? format(new Date(service.created_at), "dd MMM yyyy") : "Recent"}
                              </span>
                            </div>
                          </div>

                          {/* Short Description */}
                          {service.short_description && (
                            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-5 flex-1 line-clamp-2 font-normal">
                              {service.short_description}
                            </p>
                          )}

                          {!service.short_description && (
                            <div className="flex-1" />
                          )}

                          {/* Read More Baseline Link */}
                          <div className="mt-auto pt-2">
                            <span className="inline-block text-black font-bold text-sm md:text-base group-hover:text-primary transition-colors duration-200">
                              Read More
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
