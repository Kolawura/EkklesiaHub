"use client";

import { useRef, useState, DragEvent } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  label?: string;
  aspectRatio?: "video" | "square" | "banner";
}

const ASPECT: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  banner: "aspect-[4/1]",
};

export function ImageUpload({
  value,
  onChange,
  onClear,
  label = "Upload image",
  aspectRatio = "video",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG, WebP, GIF).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success) {
        onChange(res.data.data.url);
      } else {
        setError(res.data?.message ?? "Upload failed — please try again.");
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message ?? "Upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ""; // reset so same file can be re-selected
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-1.5">
      {/* Label */}
      {label && (
        <p className="font-body text-xs font-medium text-ink-faint">{label}</p>
      )}

      {/* Preview — shown when there's already an uploaded URL */}
      {value ? (
        <div
          className={cn(
            "relative rounded-xl overflow-hidden bg-parchment-deep border border-parchment-dark group",
            ASPECT[aspectRatio],
          )}
        >
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-parchment text-ink text-xs font-medium rounded-lg hover:bg-parchment-deep transition-colors"
            >
              <Upload size={12} />
              Replace
            </button>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <X size={12} />
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Drop zone — shown when no image yet */
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all cursor-pointer select-none",
            ASPECT[aspectRatio],
            dragging
              ? "border-gold bg-gold-bg"
              : "border-parchment-dark bg-parchment-deep hover:border-gold-pale hover:bg-gold-bg/40",
          )}
        >
          {uploading ? (
            <>
              <Loader2 size={26} className="animate-spin text-gold mb-2" />
              <p className="font-body text-sm text-ink-faint">Uploading…</p>
            </>
          ) : (
            <>
              <ImageIcon size={26} className="text-parchment-dark mb-2" />
              <p className="font-body text-sm font-medium text-ink-faint">
                {dragging ? "Drop to upload" : "Click or drag & drop"}
              </p>
              <p className="font-body text-xs text-ink-ghost mt-1">
                PNG, JPG, WebP · max 5 MB
              </p>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="font-body text-xs text-red-600 flex items-center gap-1.5">
          <span>⚠</span> {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}
