"use client";

import { useState } from "react";
import { useChapters, useGallery, useUsage, useAdmin } from "@/lib/admin/store";
import { FREE_TIER } from "@/lib/admin/constants";
import { bytesToReadable } from "@/lib/admin/validation";
import { Panel, PanelTitle, Button } from "@/components/admin/ui/Primitives";
import { ProgressMeter } from "@/components/admin/ui/ProgressMeter";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";

/** The Command Center: free-tier usage at a glance + quick stats. */
export function UsageMonitor() {
  const usage = useUsage();
  const chapters = useChapters();
  const gallery = useGallery();
  const { actions } = useAdmin();
  const [resetting, setResetting] = useState(false);

  if (!usage) return null;

  const danger = usage.photoPct >= FREE_TIER.dangerAt || usage.bytesPct >= FREE_TIER.dangerAt;
  const warn = !danger && (usage.photoPct >= FREE_TIER.warnAt || usage.bytesPct >= FREE_TIER.warnAt);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--bloom-core)]">Command center</p>
          <h1 className="font-handwriting text-4xl text-white md:text-5xl">Dashboard</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setResetting(true)}>
          Restore defaults
        </Button>
      </header>

      {(warn || danger) && (
        <div
          className={`rounded-xl border px-4 py-3 text-[13px] ${
            danger ? "border-red-400/30 bg-red-500/10 text-red-200" : "border-amber-400/30 bg-amber-500/10 text-amber-100"
          }`}
        >
          {danger
            ? "You're close to a free-tier limit. Remove unused media or upgrade before uploading more."
            : "Heads up — you're past 70% of a free-tier limit."}
        </div>
      )}

      <Panel>
        <PanelTitle title="Free-tier usage" hint="Estimated — keeps uploads under your Cloudinary / Supabase limits." />
        <div className="grid gap-6 md:grid-cols-2">
          <ProgressMeter
            label="Photos stored"
            value={`${usage.photoCount} / ${FREE_TIER.maxPhotos}`}
            pct={usage.photoPct}
            limitLabel={`${FREE_TIER.maxPhotos} max`}
          />
          <ProgressMeter
            label="Storage (est.)"
            value={`${bytesToReadable(usage.estBytes)} / ${bytesToReadable(FREE_TIER.maxBytes)}`}
            pct={usage.bytesPct}
            limitLabel={`~${bytesToReadable(FREE_TIER.avgPhotoBytes)} / photo`}
          />
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Chapters" value={chapters.length} />
        <Stat label="Gallery photos" value={gallery.length} />
        <Stat label="Tagged photos" value={gallery.filter((p) => p.tags.length > 0).length} />
      </div>

      <ConfirmDialog
        open={resetting}
        title="Restore default content?"
        body="This clears your local admin edits and reloads the seeded content. The live site is unaffected."
        confirmLabel="Restore"
        onCancel={() => setResetting(false)}
        onConfirm={() => {
          void actions.resetAll();
          setResetting(false);
        }}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Panel className="p-5">
      <p className="font-handwriting text-4xl text-[var(--bloom-tip)]">{value}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-lo)]">{label}</p>
    </Panel>
  );
}
