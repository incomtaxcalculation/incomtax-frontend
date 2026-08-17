"use client";

import { useState, useEffect } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  FileText,
  AlertCircle,
  Building2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  coverImage: string;
  coverImageAlt: string;
  status: string;
  created_at: string;
}

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blogs?limit=50&status=published`);
        if (!res.ok) throw new Error("Failed to load blogs");
        const data = await res.json();
        if (!cancelled) setBlogs(data.blogs || []);
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
    fetchBlogs();
    return () => { cancelled = true; };
  }, []);

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

  if (error) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-[70vh] flex items-center justify-center bg-[#f4f7f6]">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Unable to Load Blogs
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
          <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Our Blog
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Insights, guides, and updates on tax, finance, and compliance in
                Pakistan
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#f4f7f6]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            {blogs.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No blog posts yet.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Check back soon for new articles.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.slug}`}
                    className="group block h-full"
                  >
                    <article className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative h-[220px] overflow-hidden bg-gray-100">
                        {blog.coverImage ? (
                          <Image
                            src={blog.coverImage}
                            alt={blog.coverImageAlt || blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                            fill
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Building2 className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <time className="text-sm text-gray-400 mb-3 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {blog.created_at
                            ? format(new Date(blog.created_at), "dd MMM yyyy")
                            : "Recent"}
                        </time>
                        <h3 className="text-xl font-bold leading-tight line-clamp-2 mb-3 group-hover:text-[#0d7a7a] transition-colors duration-200">
                          {blog.title}
                        </h3>
                        {blog.short_description && (
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                            {blog.short_description}
                          </p>
                        )}
                        {!blog.short_description && (
                          <div className="flex-1" />
                        )}
                        <div className="mt-auto">
                          <span className="font-semibold text-[#0d7a7a] inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                            Read More
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
