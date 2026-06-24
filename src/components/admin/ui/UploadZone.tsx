"use client";

import { useRef, useState } from "react";
import { UPLOAD_GUIDES, type UploadGuideKey } from "@/lib/admin/constants";
import { uploadImage } from "@/lib/admin/api";
import { validateImageFile } from "@/lib/admin/validation";
import { cn } from "@/lib/utils";

/**
 * Upload zone with a strict, always-visible guide (ratio / resolution / size).
 * Validates type + size before "uploading" (Phase 1 = object URL via the api
 * seam) and shows a live preview. Errors are surfaced inline.
 */
export function UploadZone({
  guideKey,
  value,
  onChange,
  className,
}: {
  guideKey: UploadGuideKey;
  value: string | null;
  onChange: (url: string | null) => void;
  className?: string;
}) {
  const guide = UPLOAD_GUIDES[guideKey];
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    const err = validateImageFile(file, guide);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handleFile(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed bg-black/30 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[var(--bloom-tip)]",
          error ? "border-red-400/50" : "border-white/15 hover:border-[var(--bloom-core)]/50"
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Upload preview" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[var(--text-lo)]">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[12px]">{busy ? "Uploading…" : "Click or drop an image"}</span>
          </div>
        )}

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            aria-label="Remove image"
            className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={guide.accept.join(",")}
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0] ?? undefined)}
        />
      </div>

      {/* the strict guide — always visible */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Chip>{guide.label}</Chip>
        <Chip>{guide.ratio}</Chip>
        <Chip>{guide.resolution}</Chip>
        <Chip>≤ {guide.maxMB} MB</Chip>
      </div>
      {error && <p className="mt-1.5 text-[11px] text-red-300">{error}</p>}
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-lo)]">
      {children}
    </span>
  );
}
