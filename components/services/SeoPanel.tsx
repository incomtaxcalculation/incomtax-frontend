"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "lucide-react";

interface SeoPanelProps {
  slug: string;
  onSlugChange: (val: string) => void;
  slugAvailable: boolean | null;
  isCheckingSlug: boolean;
  seoTitle: string;
  onSeoTitleChange: (val: string) => void;
  seoDescription: string;
  onSeoDescriptionChange: (val: string) => void;
  focusKeyword: string;
  onFocusKeywordChange: (val: string) => void;
  title: string;
  shortDescription: string;
  featureImage?: string;
  previewPath?: string;
}

const SITE_URL = "navigatebusinesses.com";

export default function SeoPanel({
  slug,
  onSlugChange,
  slugAvailable,
  isCheckingSlug,
  seoTitle,
  onSeoTitleChange,
  seoDescription,
  onSeoDescriptionChange,
  focusKeyword,
  onFocusKeywordChange,
  title,
  shortDescription,
  featureImage,
  previewPath = "services",
}: SeoPanelProps) {
  const displayTitle = seoTitle || title || "Service Title";
  const previewTitle =
    displayTitle.length > 60
      ? displayTitle.slice(0, 60) + "..."
      : displayTitle;
  const displayDescription = seoDescription || shortDescription || "";
  const previewDescription =
    displayDescription.length > 160
      ? displayDescription.slice(0, 157) + "..."
      : displayDescription || "No description available";
  const previewUrl = `${SITE_URL} / ${previewPath} / ${slug || `${previewPath}-slug`}`;
  const SITE_NAME = "Navigate Business";

  const keywordCount = focusKeyword
    ? (displayDescription.toLowerCase().split(focusKeyword.toLowerCase()).length - 1) +
      (title.toLowerCase().split(focusKeyword.toLowerCase()).length - 1)
    : 0;

  return (
    <div className="space-y-6">
      {/* Google Preview */}
      <div
        className="google-seo-card"
        style={{
          fontFamily: "Arial, sans-serif",
          maxWidth: "100%",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
          border: "1px solid #dfe1e5",
        }}
      >
        <div
          className="seo-header"
          style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}
        >
          <img
            src="/Logos/trimmed.webp"
            alt=""
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
          />
          <div className="seo-site-info" style={{ display: "flex", flexDirection: "column" }}>
            <span className="seo-site-name" style={{ fontSize: "14px", fontWeight: 500, color: "#202124" }}>
              {SITE_NAME}
            </span>
            <span className="seo-site-url" style={{ fontSize: "12px", color: "#4d5156" }}>
              https://{previewUrl}
            </span>
          </div>
        </div>

        <a
          href="#"
          className="seo-title"
          style={{
            display: "block",
            fontSize: "20px",
            color: "#1a0dab",
            textDecoration: "none",
            fontWeight: 400,
            marginBottom: "4px",
            lineHeight: 1.2,
          }}
        >
          {previewTitle || "Your Compelling Meta Title Goes Here (50-60 Chars)"}
        </a>

        <p className="seo-description" style={{ fontSize: "14px", color: "#4d5156", lineHeight: 1.58, margin: 0 }}>
          {previewDescription || "No description set"}
        </p>
      </div>

      {/* Slug */}
      <div className="space-y-2">
        <Label htmlFor="seo-slug">
          Slug
          <span className="text-xs text-muted-foreground ml-1">(auto-generated)</span>
        </Label>
        <div className="relative">
          <Input
            id="seo-slug"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="service-slug"
          />
          {isCheckingSlug && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              checking...
            </span>
          )}
          {slugAvailable === true && !isCheckingSlug && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-green-600">
              Available
            </span>
          )}
          {slugAvailable === false && !isCheckingSlug && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500">
              Taken
            </span>
          )}
        </div>
      </div>

      {/* SEO Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="seo-title">SEO Title</Label>
          <span
            className={`text-xs ${
              seoTitle.length > 60
                ? "text-red-500"
                : seoTitle.length > 50
                  ? "text-amber-500"
                  : "text-muted-foreground"
            }`}
          >
            {seoTitle.length}/60
          </span>
        </div>
        <Input
          id="seo-title"
          value={seoTitle}
          onChange={(e) => onSeoTitleChange(e.target.value)}
          placeholder="SEO optimized title"
        />
        {seoTitle.length > 60 && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <Info className="w-3 h-3" />
            Title may be truncated in search results
          </p>
        )}
        {!seoTitle && (
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty to use the service title
          </p>
        )}
      </div>

      {/* Meta Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="seo-description">Meta Description</Label>
          <span
            className={`text-xs ${
              seoDescription.length > 160
                ? "text-red-500"
                : seoDescription.length > 140
                  ? "text-amber-500"
                  : "text-muted-foreground"
            }`}
          >
            {seoDescription.length}/160
          </span>
        </div>
        <Textarea
          id="seo-description"
          value={seoDescription}
          onChange={(e) => onSeoDescriptionChange(e.target.value)}
          placeholder="Brief description for search engines"
          rows={3}
        />
        {seoDescription.length > 160 && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <Info className="w-3 h-3" />
            Description may be truncated in search results
          </p>
        )}
        {!seoDescription && (
          <p className="text-xs text-muted-foreground mt-1">
            Leave empty to use the short description
          </p>
        )}
      </div>

      {/* Focus Keyword */}
      <div className="space-y-2">
        <Label htmlFor="focus-keyword">Focus Keyword</Label>
        <Input
          id="focus-keyword"
          value={focusKeyword}
          onChange={(e) => onFocusKeywordChange(e.target.value)}
          placeholder="e.g. tax registration"
        />
        {focusKeyword && (
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Keyword usage</span>
              <span
                className={
                  keywordCount >= 3
                    ? "text-green-600 font-medium"
                    : keywordCount >= 1
                      ? "text-amber-500 font-medium"
                      : "text-red-500 font-medium"
                }
              >
                {keywordCount} time{keywordCount !== 1 ? "s" : ""}
              </span>
            </div>
            {keywordCount === 0 && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Add keyword to title or description
              </p>
            )}
            {keywordCount >= 1 && keywordCount < 3 && (
              <p className="text-xs text-amber-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Try using the keyword at least 3 times
              </p>
            )}
            {keywordCount >= 3 && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                Good keyword density
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
