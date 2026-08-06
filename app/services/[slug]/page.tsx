import type { Metadata } from "next";
import { ServiceDetailClient } from "./ServiceDetailClient";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001";

async function getService(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/api/services/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.service;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return { title: "Service Not Found | Navigate Business" };
  }

  const seoTitle = service.seo_title
    ? `${service.seo_title} | Navigate Business`
    : `${service.title} | Navigate Business`;
  const seoDescription =
    service.seo_description ||
    service.short_description ||
    `Learn more about our ${service.title} services`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: service.focus_keyword
      ? [service.focus_keyword, service.title, "Navigate Business"]
      : [service.title, "Navigate Business"],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: service.featureImage ? [{ url: service.featureImage }] : [],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServiceDetailClient slug={slug} />;
}
