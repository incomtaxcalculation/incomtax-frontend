"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, X } from "lucide-react";

interface ImageModalProps {
  src: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({
  src,
  alt = "",
  isOpen,
  onClose,
}: ImageModalProps) {
  const [zoom, setZoom] = useState(70);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle ESC + body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset everything when modal opens or src changes
  useEffect(() => {
    if (isOpen) {
      setZoom(70);
      setPosition({ x: 0, y: 0 });
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen, src]);

  // Zoom via scroll
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -15 : 15;
    setZoom((prev) => Math.min(Math.max(prev + delta, 70), 150));
  };

  // Drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 10) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  // Drag move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 10) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Download
  const handleDownload = () => {
    if (!src || hasError) return;
    const link = document.createElement("a");
    link.href = src;
    link.download = alt || "image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 15, 150));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 15, 70));

  const resetZoom = () => {
    setZoom(70);
    setPosition({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  const showImage = src && !hasError;
  const showFallback = !src || hasError;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
      onClick={onClose}
    >
      {/* TOP BAR */}
      <div
        className="flex items-center justify-between px-4 py-2 bg-black/70"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span
            className="text-white text-sm min-w-[60px] text-center cursor-pointer"
            onClick={resetZoom}
          >
            {zoom}%
          </span>

          <Button variant="secondary" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <span className="text-white text-sm truncate max-w-[40%]">{alt}</span>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownload}
            disabled={!showImage}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>

          <Button variant="secondary" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* IMAGE AREA */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          onWheel={handleWheel}
        >
          {/* LOADING */}
          {isLoading && showImage && (
            <div className="text-white animate-pulse text-sm">
              Loading image...
            </div>
          )}

          {/* IMAGE */}
          {showImage && (
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              className="max-w-none transition-transform duration-100"
              style={{
                display: isLoading ? "none" : "block",
                transform: `scale(${zoom / 100}) translate(${position.x / (zoom / 100)}px, ${position.y / (zoom / 100)}px)`,
                cursor:
                  zoom > 10 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
              }}
              draggable={false}
            />
          )}

          {/* FALLBACK */}
          {showFallback && (
            <div className="text-white text-center">
              <p className="text-lg font-semibold">
                {src ? "Failed to load image" : "No image available"}
              </p>
              <p className="text-sm opacity-70">
                {src
                  ? "The image URL may be broken or inaccessible."
                  : "No image source was provided."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
