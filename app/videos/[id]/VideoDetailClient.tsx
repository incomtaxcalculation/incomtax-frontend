"use client";

import { useState, useEffect, useMemo } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  Video,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

interface VideoData {
  id: number;
  title: string;
  short_description: string;
  video_url: string;
  thumbnail: string;
  thumbnailAlt: string;
  status: string;
  created_at: string;
  updated_at: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  return null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export function VideoDetailClient({ id }: { id: string }) {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/videos/${id}`);
        if (!res.ok) throw new Error("Video not found");
        const data = await res.json();
        if (!cancelled) setVideo(data.video);
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
    fetchVideo();
    return () => { cancelled = true; };
  }, [id]);

  const embedUrl = useMemo(() => {
    if (!video?.video_url) return null;
    return (
      getYouTubeEmbedUrl(video.video_url) ||
      (getVimeoId(video.video_url)
        ? `https://player.vimeo.com/video/${getVimeoId(video.video_url)}`
        : null)
    );
  }, [video?.video_url]);

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

  if (error || !video) {
    return (
      <>
        <PublicHeader />
        <main className="min-h-[70vh] flex items-center justify-center bg-[#f4f7f6]">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Video Not Found
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {error || "The requested video does not exist."}
            </p>
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0d7a7a] text-white rounded-lg hover:bg-[#0a6666] transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Videos
            </Link>
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
          <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Videos
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {video.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
              {video.created_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Published: {format(new Date(video.created_at), "dd MMM yyyy")}
                </span>
              )}
              {embedUrl && (
                <span className="flex items-center gap-1.5">
                  <Video className="w-4 h-4" />
                  Video
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
            {embedUrl ? (
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl mb-10 bg-black">
                <iframe
                  src={embedUrl}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : video.thumbnail ? (
              <div className="rounded-2xl overflow-hidden mb-10 shadow-lg">
                <Image
                  src={video.thumbnail}
                  alt={video.thumbnailAlt || video.title}
                  className="w-full h-auto object-cover"
                  unoptimized
                  width={896}
                  height={504}
                />
              </div>
            ) : null}

            {video.short_description && (
              <div className="max-w-3xl">
                <h2 className="text-xl font-bold text-[#0a3d3d] mb-3">
                  About This Video
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {video.short_description}
                </p>

                <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                  {video.created_at && video.updated_at && (
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      Published{" "}
                      {format(new Date(video.created_at), "dd MMM yyyy")}
                      {video.updated_at !== video.created_at &&
                        ` (updated ${format(new Date(video.updated_at), "dd MMM yyyy")})`}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/videos"
                className="inline-flex items-center gap-2 text-[#0d7a7a] hover:text-[#0a6666] transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Browse All Videos
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#f4f7f6]">
          <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-[#0a3d3d] mb-4">
              Stay Updated with Our Latest Videos
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Subscribe to our channel for more educational content on tax,
              finance, and compliance.
            </p>
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0d7a7a] text-white rounded-lg hover:bg-[#0a6666] transition-colors font-medium"
            >
              <Video className="w-5 h-5" />
              Watch More Videos
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
