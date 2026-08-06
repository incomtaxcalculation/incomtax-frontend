"use client";

import { useState, useCallback, useRef } from "react";
import { Video, X, Play } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface VideoDropZoneProps {
  value?: string;
  onChange: (value: string) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
  className?: string;
}

export function VideoDropZone({
  value,
  onChange,
  title = "",
  onTitleChange,
  className,
}: VideoDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("video/")) return;

      setIsUploading(true);

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onChange(result);
          if (!title && file.name) {
            onTitleChange?.(file.name.replace(/\.[^/.]+$/, ""));
          }
          setIsUploading(false);
        };
        reader.onerror = () => {
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("Error reading video:", err);
        setIsUploading(false);
      }
    },
    [onChange, onTitleChange, title],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleRemove = useCallback(() => {
    onChange("");
  }, [onChange]);

  return (
    <div className={cn("relative", className)}>
      {value ? (
        <div className="relative group">
          <video
            src={value}
            className="w-full h-48 object-cover rounded-lg bg-black"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="h-12 w-12 text-white fill-white" />
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 z-10 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>

          {onTitleChange && (
            <div className="absolute bottom-2 right-2 z-10">
              <InputGroup className="bg-background/90 rounded-md">
                <InputGroupAddon>title</InputGroupAddon>
                <InputGroupInput
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="Video title..."
                  className="h-7 text-xs w-32"
                />
              </InputGroup>
            </div>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg h-48 flex items-center justify-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleChange}
          />

          <div className="text-center pointer-events-none">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click or drag video here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  MP4, WebM, MOV
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
