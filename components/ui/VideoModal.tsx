"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Maximize2, Minimize2 } from "lucide-react"

interface VideoModalProps {
  src: string
  title?: string
  isOpen: boolean
  onClose: () => void
}

export function VideoModal({ src, title = "", isOpen, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isOpen])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoRef.current?.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (err) {
      console.error("Fullscreen error:", err)
    }
  }

  if (!isOpen) return null

  const isYouTube = src && (src.includes("youtube.com") || src.includes("youtu.be"))
  const isVimeo = src && src.includes("vimeo.com")
  const isLocalVideo = src && (src.startsWith("data:") || src.startsWith("blob:"))

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95"
      onClick={onClose}
    >
      <div 
        className="flex items-center justify-between px-4 py-2 bg-black/70"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white font-medium truncate">{title}</span>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

<div 
        className="flex-1 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        {isYouTube ? (
          <iframe
            key="youtube-iframe"
            src={src.includes("embed") ? src : src.replace("watch?v=", "embed/")}
            className="w-full max-w-4xl aspect-video rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isVimeo ? (
          <iframe
            key="vimeo-iframe"
            src={src.includes("player") ? src : src.replace("vimeo.com", "player.vimeo.com/video")}
            className="w-full max-w-4xl aspect-video rounded-lg"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : isLocalVideo ? (
          <video
            ref={videoRef}
            src={src}
            controls
            className="w-full max-w-4xl aspect-video rounded-lg"
            autoPlay
          />
        ) : (
          <video
            ref={videoRef}
            src={src}
            controls
            className="w-full max-w-4xl aspect-video rounded-lg"
            autoPlay
          />
        )}
      </div>
    </div>
  )
}