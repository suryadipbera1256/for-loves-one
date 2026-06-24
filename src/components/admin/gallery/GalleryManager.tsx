"use client";

import { useState } from "react";
import { useAdmin, useChapters, useGallery } from "@/lib/admin/store";
import { GALLERY_TAGS } from "@/lib/admin/constants";
import { validateGalleryPhoto } from "@/lib/admin/validation";
import type { AdminGalleryPhoto, GalleryTag } from "@/lib/admin/types";
import { Panel, Button, Field, Label, EmptyState } from "@/components/admin/ui/Primitives";
import { UploadZone } from "@/components/admin/ui/UploadZone";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { cn } from "@/lib/utils";

/** Add / delete / tag gallery photos. */
export function GalleryManager() {
  const gallery = useGallery();
  const { actions } = useAdmin();
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--bloom-core)]">Public · Gallery</p>
          <h1 className="font-handwriting text-4xl text-white md:text-5xl">Manage photos</h1>
        </div>
        <Button variant="primary" size="sm" onClick={actions.addPhoto}>
          + Add photo
        </Button>
      </header>

      {gallery.length === 0 ? (
        <EmptyState title="No photos yet." action={<Button variant="primary" size="sm" onClick={actions.addPhoto}>Add your first photo</Button>} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {gallery.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onDelete={() => setPendingDelete(photo.id)} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this photo?"
        body="It will be removed from the gallery."
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) actions.deletePhoto(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}

function PhotoCard({ photo, onDelete }: { photo: AdminGalleryPhoto; onDelete: () => void }) {
  const { actions } = useAdmin();
  const chapters = useChapters();
  const errors = validateGalleryPhoto(photo);

  const toggleTag = (tag: GalleryTag) => {
    const next = photo.tags.includes(tag) ? photo.tags.filter((t) => t !== tag) : [...photo.tags, tag];
    actions.updatePhoto(photo.id, { tags: next });
  };

  return (
    <Panel className="space-y-3 p-4">
      <UploadZone guideKey="gallery" value={photo.image} onChange={(url) => actions.updatePhoto(photo.id, { image: url })} />

      <Field label="Title" value={photo.title} error={errors.title} onChange={(e) => actions.updatePhoto(photo.id, { title: e.target.value })} />
      <Field label="Location" value={photo.location} error={errors.location} onChange={(e) => actions.updatePhoto(photo.id, { location: e.target.value })} />

      <div>
        <Label>Chapter</Label>
        <select
          value={photo.chapterId ?? ""}
          onChange={(e) => actions.updatePhoto(photo.id, { chapterId: e.target.value || null })}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-[13px] text-[var(--text-hi)] outline-none focus:border-[var(--bloom-core)]/50"
        >
          <option value="">— None —</option>
          {chapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.order + 1}. {c.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-1.5">
          {GALLERY_TAGS.map((tag) => {
            const on = photo.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors",
                  on ? "border-[var(--bloom-core)]/50 bg-[var(--bloom-core)]/15 text-[var(--bloom-tip)]" : "border-white/10 text-[var(--text-lo)] hover:text-[var(--text-hi)]"
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
        {errors.tags && <p className="mt-1 text-[11px] text-red-300">{errors.tags}</p>}
      </div>

      <div className="flex justify-end pt-1">
        <Button variant="danger" size="sm" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </Panel>
  );
}
