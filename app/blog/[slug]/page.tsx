import type { Metadata } from "next";
import Script from "next/script";
import { BlogDetailClient } from "./BlogDetailClient";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5001";

async function getBlog(slug: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/blogs/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.blog;
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
  const blog = await getBlog(slug);

  if (!blog) {
    return { title: "Blog Not Found | Navigate Business" };
  }

  const seoTitle = blog.seo_title || blog.title;
  const seoDesc =
    blog.seo_description || blog.short_description || "Read our blog post";

  return {
    title: `${seoTitle} | Navigate Business`,
    description: seoDesc,
    keywords: blog.focus_keyword || "",
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `/blog/${blog.slug}`,
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
    },
    twitter: {
      title: seoTitle,
      description: seoDesc,
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
    },
    alternates: {
      canonical: `/blog/${blog.slug}`,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  return (
    <>
      {blog?.schemaMarkup && (
        <Script
          id="blog-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: blog.schemaMarkup }}
          strategy="beforeInteractive"
        />
      )}
      <BlogDetailClient slug={slug} />
    </>
  );
}
