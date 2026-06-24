"use client";

import { useMemo } from "react";
import { useAdmin, useHome } from "@/lib/admin/store";
import { validateHome } from "@/lib/admin/validation";
import { Panel, PanelTitle, Field, TextArea, Label } from "@/components/admin/ui/Primitives";
import { UploadZone } from "@/components/admin/ui/UploadZone";

/** Edit the Home / Genesis hero: headers, subtext, CTA label, hero image. */
export function HomeEditor() {
  const home = useHome();
  const { actions } = useAdmin();
  const errors = useMemo(() => (home ? validateHome(home) : {}), [home]);

  if (!home) return null;

  return (
    <div className="space-y-6">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--bloom-core)]">Public · Home</p>
        <h1 className="font-handwriting text-4xl text-white md:text-5xl">Edit the opening</h1>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <PanelTitle title="Headline & copy" hint="Changes autosave to this admin (Phase 2 publishes to the site)." />
          <div className="space-y-4">
            <Field label="Kicker" name="kicker" value={home.kicker} error={errors.kicker} onChange={(e) => actions.setHome({ kicker: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Title line 1"
                name="title1"
                value={home.titleLines[0]}
                error={errors.titleLines}
                onChange={(e) => actions.setHome({ titleLines: [e.target.value, home.titleLines[1]] })}
              />
              <Field
                label="Title line 2"
                name="title2"
                value={home.titleLines[1]}
                onChange={(e) => actions.setHome({ titleLines: [home.titleLines[0], e.target.value] })}
              />
            </div>
            <TextArea label="Subtitle" name="subtitle" rows={3} value={home.subtitle} error={errors.subtitle} onChange={(e) => actions.setHome({ subtitle: e.target.value })} />
            <Field label="Button label" name="cta" value={home.ctaLabel} error={errors.ctaLabel} onChange={(e) => actions.setHome({ ctaLabel: e.target.value })} />
          </div>
        </Panel>

        <Panel>
          <PanelTitle title="Hero image" />
          <Label>Background photo</Label>
          <UploadZone guideKey="hero" value={home.heroImage || null} onChange={(url) => actions.setHome({ heroImage: url ?? "" })} />
        </Panel>
      </div>
    </div>
  );
}
