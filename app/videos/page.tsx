"use client";

import { useState, useEffect } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  Loader2,
  AlertCircle,
  Video,
  Play,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { VideoModal } from "@/components/ui/VideoModal";

interface VideoItem {
  id: number;
  title: string;
  short_description: string;
  thumbnail: string;
  video_url: string;
  status: string;
  created_at: string;
}

export default function VideosListingPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<{
    src: string;
    title: string;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos?limit=50&status=published");
        if (!res.ok) throw new Error("Failed to load videos");
        const data = await res.json();
        if (!cancelled) setVideos(data.videos || []);
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
    fetchVideos();
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
              Unable to Load Videos
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
                Videos
              </h1>
              <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                Watch our educational videos on tax, finance, and compliance
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-[#f4f7f6]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            {videos.length === 0 ? (
              <div className="text-center py-20">
                <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No videos yet.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Check back soon for new content.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group"
                    onClick={() => {
                      setSelectedVideo({
                        src: video.video_url,
                        title: video.title,
                      });
                      setModalOpen(true);
                    }}
                  >
                    <div className="relative h-48 md:h-52 overflow-hidden bg-gray-100">
                      {video.thumbnail ? (
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                          fill
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0d7a7a]/10 to-[#0a3d3d]/10">
                          <Video className="w-12 h-12 text-[#0d7a7a]/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-[#0d7a7a] ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        {video.created_at
                          ? format(new Date(video.created_at), "dd MMM yyyy")
                          : ""}
                      </div>
                      <Link
                        href={`/videos/${video.id}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <h3 className="text-lg font-bold text-[#0a3d3d] mb-2 hover:text-[#0d7a7a] transition-colors">
                          {video.title}
                        </h3>
                      </Link>
                      {video.short_description && (
                        <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-2">
                          {video.short_description}
                        </p>
                      )}
                      <Link
                        href={`/videos/${video.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#0d7a7a] hover:text-[#0a6666] transition-colors"
                      >
                        View Details
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {selectedVideo && (
        <VideoModal
          src={selectedVideo.src}
          title={selectedVideo.title}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </>
  );
}
