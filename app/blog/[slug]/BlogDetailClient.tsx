"use client";

import { useState, useEffect } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  Share2,
} from "lucide-react";
import { wrapTables } from "@/lib/html";
import { format } from "date-fns";

interface BlogData {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  details: string;
  coverImage: string;
  coverImageAlt: string;
  status: string;
  created_at: string;
  updated_at: string;
  schemaMarkup?: string;
}

function readingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function BlogDetailClient({ slug }: { slug: string }) {
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs/${slug}`);
        if (!res.ok) throw new Error("Blog not found");
        const data = await res.json();
        if (!cancelled) setBlog(data.blog);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBlog();
    return () => { cancelled = true; };
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

  if (error || !blog) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-[70vh] flex items-center justify-center bg-[#f4f7f6]">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Blog Not Found
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {error || "The requested blog post does not exist."}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0d7a7a] text-white rounded-lg hover:bg-[#0a6666] transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      <PublicHeader />
      <main>
        <article>
          <section className="bg-gradient-to-br from-[#0a3d3d] to-[#0d7a7a] relative overflow-hidden">
            <div className="relative max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {blog.title}
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-3xl leading-relaxed mb-6">
                {blog.short_description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
                {blog.created_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(blog.created_at), "dd MMM yyyy")}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {readingTime(blog.details || "")} min read
                </span>
              </div>
            </div>
          </section>

          <section className="py-12 bg-white">
            <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
              {blog.coverImage && (
                <div className="rounded-2xl overflow-hidden mb-10 shadow-lg">
                  <Image
                    src={blog.coverImage}
                    alt={blog.coverImageAlt || blog.title}
                    className="w-full h-auto object-cover"
                    unoptimized
                    width={896}
                    height={504}
                  />
                </div>
              )}
              {blog.details && (
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: wrapTables(blog.details) }}
                />
              )}

              <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {blog.created_at && (
                    <span>
                      Published: {format(new Date(blog.created_at), "dd MMM yyyy")}
                    </span>
                  )}
                  {blog.updated_at && blog.updated_at !== blog.created_at && (
                    <span>
                      Updated: {format(new Date(blog.updated_at), "dd MMM yyyy")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Share:</span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-100 hover:bg-[#0d7a7a] hover:text-white transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-[#f4f7f6]">
            <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
              <h2 className="text-2xl font-bold text-[#0a3d3d] mb-4">
                Need Expert Tax Advice?
              </h2>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                Our team of experienced tax professionals is here to help you
                navigate Pakistan&apos;s tax landscape.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d7a7a] text-white rounded-lg hover:bg-[#0a6666] transition-colors font-medium"
              >
                Contact Us Today
              </Link>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
