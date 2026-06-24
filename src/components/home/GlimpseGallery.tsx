"use client";

import { Frame } from "./Frame";
import { GALLERY } from "./home.content";

/**
 * "A Glimpse of Us" -- two infinite marquee rows scrolling in opposite
 * directions. Each row duplicates its frames so a -50% translate loops
 * seamlessly (see .marquee-track in globals.css). Pauses on hover; GPU only.
 */
function Row({ reverse, duration }: { reverse?: boolean; duration: number }) {
  // duplicate the set so the track can loop seamlessly at -50%
  const items = [...GALLERY, ...GALLERY];
  return (
    <div className="marquee-group relative overflow-hidden">
      {/* edge fades */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--bg-void)] to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--bg-void)] to-transparent" />

      <div
        className={`marquee-track flex w-max ${reverse ? "is-reverse" : ""}`}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        {items.map((g, i) => (
          <Frame
            key={i}
            src={g.image}
            accent={g.accent}
            index={i}
            alt="A glimpse of us"
            className="mr-4 h-40 w-60 shrink-0 md:mr-5 md:h-52 md:w-72"
          />
        ))}
      </div>
    </div>
  );
}

export function GlimpseGallery() {
  return (
    <section className="relative z-10 overflow-hidden bg-[var(--bg-void)] py-[14vh]">
      <header className="mx-auto mb-[7vh] max-w-6xl px-6 text-center">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--bloom-core)] md:text-xs">
          A glimpse of us
        </p>
        <h2 className="font-handwriting text-3xl tracking-wide text-white md:text-5xl">Fragments of light</h2>
      </header>

      <div className="flex flex-col gap-4">
        <Row duration={52} />
        <Row reverse duration={64} />
      </div>
    </section>
  );
}
