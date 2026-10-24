"use client";

import React, { useRef, useState } from "react";
import {
  UploadCloud,
  HardDrive,
  Trash2,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Link2,
  Check,
} from "lucide-react";
import { uploadsApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: "banner" | "square" | "video" | "auto";
  className?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload Image from Drive",
  placeholder = "PNG, JPG, WEBP, or GIF up to 10MB",
  aspectRatio = "banner",
  className = "",
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState(value || "");
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    const isImageMime = file.type ? file.type.startsWith("image/") : false;
    const hasImageExt = /\.(jpg|jpeg|png|webp|gif|avif|jfif|svg|bmp)$/i.test(file.name);
    if (!isImageMime && !hasImageExt) {
      setError("Please select a valid image file (JPG, PNG, WEBP, AVIF, GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size exceeds 10MB limit.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const url = await uploadsApi.uploadFile(file);
      onChange(url);
      setTempUrl(url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err?.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // reset input so the same file can be selected again if needed
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onChange("");
    setTempUrl("");
    setError(null);
  };

  const handleApplyUrl = () => {
    onChange(tempUrl.trim());
    setShowUrlInput(false);
  };

  const aspectClass =
    aspectRatio === "banner"
      ? "h-40 w-full"
      : aspectRatio === "square"
      ? "h-36 w-36"
      : aspectRatio === "video"
      ? "h-48 w-full"
      : "min-h-[140px] w-full";

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => {
            setShowUrlInput(!showUrlInput);
            setTempUrl(value || "");
          }}
          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <Link2 className="w-3 h-3" />
          {showUrlInput ? "Hide URL input" : "Paste image URL"}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
          <Input
            type="url"
            placeholder="https://..."
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            className="text-xs h-8"
          />
          <Button
            type="button"
            size="sm"
            onClick={handleApplyUrl}
            className="h-8 text-xs font-bold px-3 bg-blue-600 hover:bg-blue-500 text-white"
          >
            Apply
          </Button>
        </div>
      )}

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.avif,.jfif,.svg,.bmp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Image Preview or Dropzone */}
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900">
          <div className={`${aspectClass} overflow-hidden flex items-center justify-center bg-slate-900/5`}>
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // handle broken image
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'><rect width='18' height='18' x='3' y='3' rx='2'/><circle cx='9' cy='9' r='2'/><path d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/></svg>";
              }}
            />
          </div>

          {/* Overlay controls */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="h-8 text-xs font-semibold bg-white/90 text-slate-900 hover:bg-white shadow"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Uploading...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Change Image
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleRemove}
              disabled={isUploading}
              className="h-8 text-xs font-semibold shadow"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Remove
            </Button>
          </div>

          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-medium text-white max-w-[85%] truncate pointer-events-none">
            {value.startsWith("data:") ? "Local Image" : value.split("/").pop()}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 p-5 flex flex-col items-center justify-center text-center gap-2 ${
            isDragging
              ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-500/30"
              : "border-slate-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 bg-slate-50/50 dark:bg-zinc-900/40 hover:bg-blue-50/20"
          }`}
        >
          {isUploading ? (
            <div className="py-4 flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Uploading image from drive...
              </p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  Click to upload from drive or drag and drop
                </p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
                  {placeholder}
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs font-semibold mt-1 gap-1.5 border-slate-300 dark:border-zinc-700"
              >
                <HardDrive className="w-3.5 h-3.5 text-blue-600" />
                Browse Device / Drive
              </Button>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-500 font-medium px-1 animate-in fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
