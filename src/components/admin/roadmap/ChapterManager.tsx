"use client";

import { useState } from "react";
import { useAdmin, useChapters } from "@/lib/admin/store";
import { validateChapter, hasErrors } from "@/lib/admin/validation";
import type { AdminChapter } from "@/lib/admin/types";
import { Panel, Button, Field, TextArea, Label, EmptyState } from "@/components/admin/ui/Primitives";
import { UploadZone } from "@/components/admin/ui/UploadZone";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";

/** Add / delete / edit / reorder Roadmap chapters (Title · Photos · EN/BN story). */
export function ChapterManager() {
  const chapters = useChapters();
  const { actions } = useAdmin();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--bloom-core)]">Public · Roadmap</p>
          <h1 className="font-handwriting text-4xl text-white md:text-5xl">Manage chapters</h1>
          <p className="mt-1 text-[13px] text-[var(--text-lo)]">{chapters.length} chapters · drag-free reorder with the arrows.</p>
        </div>
        <Button variant="primary" size="sm" onClick={actions.addChapter}>
          + Add chapter
        </Button>
      </header>

      {chapters.length === 0 ? (
        <EmptyState title="No chapters yet." action={<Button variant="primary" size="sm" onClick={actions.addChapter}>Add the first chapter</Button>} />
      ) : (
        <div className="space-y-5">
          {chapters.map((c, i) => (
            <ChapterCard key={c.id} chapter={c} index={i} total={chapters.length} onDelete={() => setPendingDelete(c.id)} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this chapter?"
        body="The chapter and its story will be removed."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) actions.deleteChapter(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function ChapterCard({
  chapter,
  index,
  total,
  onDelete,
}: {
  chapter: AdminChapter;
  index: number;
  total: number;
  onDelete: () => void;
}) {
  const { actions } = useAdmin();
  const errors = validateChapter(chapter);
  const invalid = hasErrors(errors);

  const setStory = (lang: "en" | "bn", value: string) => actions.updateChapter(chapter.id, { story: { ...chapter.story, [lang]: value } });
  const addImage = (url: string | null) => url && actions.updateChapter(chapter.id, { images: [...chapter.images, url] });
  const removeImage = (idx: number) => actions.updateChapter(chapter.id, { images: chapter.images.filter((_, i) => i !== idx) });

  return (
    <Panel className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bloom-core)]/15 font-handwriting text-xl text-[var(--bloom-tip)]">
            {index + 1}
          </span>
          {invalid && <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-amber-200">Incomplete</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <IconBtn label="Move up" disabled={index === 0} onClick={() => actions.moveChapter(chapter.id, -1)} d="M12 19V5M5 12l7-7 7 7" />
          <IconBtn label="Move down" disabled={index === total - 1} onClick={() => actions.moveChapter(chapter.id, 1)} d="M12 5v14M19 12l-7 7-7-7" />
          <Button variant="danger" size="sm" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Kicker" value={chapter.kicker} error={errors.kicker} onChange={(e) => actions.updateChapter(chapter.id, { kicker: e.target.value })} />
        <Field label="Title" value={chapter.title} error={errors.title} onChange={(e) => actions.updateChapter(chapter.id, { title: e.target.value })} />
      </div>

      <TextArea label="Teaser (front of card)" rows={2} value={chapter.teaser} error={errors.teaser} onChange={(e) => actions.updateChapter(chapter.id, { teaser: e.target.value })} />

      <div className="grid gap-4 md:grid-cols-2">
        <TextArea label="Story — English" rows={6} value={chapter.story.en} error={errors.storyEn} onChange={(e) => setStory("en", e.target.value)} />
        <TextArea label="Story — বাংলা (Bengali)" rows={6} value={chapter.story.bn} hint="Optional — shown when the reader toggles to Bengali." onChange={(e) => setStory("bn", e.target.value)} />
      </div>

      <div>
        <Label>Photos</Label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {chapter.images.map((src, i) => (
            <div key={`${src}-${i}`} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={`${chapter.title} photo ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label="Remove photo"
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
          ))}
          <UploadZone guideKey="chapter" value={null} onChange={addImage} className="[&>div:first-child]:aspect-square" />
        </div>
      </div>
    </Panel>
  );
}

function IconBtn({ label, d, disabled, onClick }: { label: string; d: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-[var(--text-hi)] transition-colors hover:border-[var(--bloom-core)]/50 disabled:cursor-not-allowed disabled:opacity-30"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </button>
  );
}
