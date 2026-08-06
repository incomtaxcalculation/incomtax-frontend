"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

interface FileStore {
  [key: string]: File;
}

let fileStore: FileStore = {};

export function getCurrentFile(key: string = "default"): File | null {
  return fileStore[key] || null;
}

export function clearCurrentFile(key: string = "default"): void {
  delete fileStore[key];
}

export function clearAllFiles(): void {
  fileStore = {};
}

interface ImageDropZoneProps {
  value?: string;
  onChange: (value: string) => void;
  alt?: string;
  onAltChange: (alt: string) => void;
  className?: string;
  fileKey?: string;
}

export function ImageDropZone({
  value,
  onChange,
  alt = "",
  onAltChange,
  className,
  fileKey = "default",
}: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = useCallback(() => {
    if (inputRef.current) {
      // Reset value so choosing the same file again still triggers change.
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      fileStore[fileKey] = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onChange, fileKey],
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
    delete fileStore[fileKey];
    onChange("");
    onAltChange("");
    // Clear the file input to prevent re-selection of the same file
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onChange, onAltChange, fileKey]);

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {value ? (
        <div className="relative group bg-white dark:bg-background p-2 rounded-xl border">
          <img
            src={value}
            alt={alt}
            className="w-full max-h-64 object-contain rounded-lg cursor-pointer bg-gray-50 dark:bg-background"
            onClick={openFilePicker}
          />

          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 z-10 p-1 bg-black/50 dark:bg-white/70 rounded-full text-white dark:text-black opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={openFilePicker}
            className="absolute top-2 left-2 z-10 px-2 py-1 bg-black/50 rounded text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Replace
          </button>

          <div className="absolute bottom-2 right-2 z-10">
            <InputGroup className="bg-background/90 rounded-md">
              <InputGroupAddon>alt</InputGroupAddon>
              <InputGroupInput
                value={alt}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="Alt text..."
                className="h-7 text-xs w-32"
              />
            </InputGroup>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg h-48 flex items-center justify-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={openFilePicker}
        >
          <div className="text-center pointer-events-none">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Click or drag image here
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
