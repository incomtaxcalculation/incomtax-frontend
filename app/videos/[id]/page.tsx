import type { Metadata } from "next";
import { VideoDetailClient } from "./VideoDetailClient";

async function getVideo(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/videos/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.video;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideo(id);

  if (!video) {
    return { title: "Video Not Found | Navigate Business" };
  }

  return {
    title: `${video.title} | Navigate Business`,
    description: video.short_description || "Watch our educational video",
    openGraph: {
      title: video.title,
      description: video.short_description,
      images: video.thumbnail ? [{ url: video.thumbnail }] : [],
    },
  };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VideoDetailClient id={id} />;
}
