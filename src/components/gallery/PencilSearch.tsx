"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * "Pencil-style" search. A glass field where the placeholder is typed out by an
 * organic typewriter (with a blinking ink caret), a pen nib bobs while you type,
 * and an ink underline "draws" itself in on focus. Fully controlled.
 */
export function PencilSearch({
  value,
  onChange,
  suggestions = ["bike rides at dusk…", "couple nights…", "the long hike…", "festival lights…", "chapter 1…"],
}: {
  value: string;
  onChange: (v: string) => void;
  suggestions?: string[];
}) {
  const reduce = useReducedMotion() ?? false;
  const [focused, setFocused] = useState(false);
  const [typed, setTyped] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  // typewriter placeholder (only while empty + unfocused)
  useEffect(() => {
    if (reduce || focused || value) {
      setTyped(suggestions[0] ?? "");
      return;
    }
    let si = 0;
    let ci = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = suggestions[si % suggestions.length] ?? "";
      ci += deleting ? -1 : 1;
      setTyped(word.slice(0, Math.max(0, ci)));
      let delay = deleting ? 38 : 70;
      if (!deleting && ci >= word.length) {
        delay = 1500;
        deleting = true;
      } else if (deleting && ci <= 0) {
        deleting = false;
        si += 1;
        delay = 320;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [focused, value, reduce, suggestions]);

  return (
    <div className="relative w-full max-w-md">
      <div
        className={`relative flex items-center gap-3 rounded-2xl border bg-white/[0.04] px-4 py-3 backdrop-blur-xl transition-colors duration-300 ${
          focused ? "border-[var(--bloom-core)]/50" : "border-white/10"
        }`}
      >
        {/* pen nib -- bobs while typing */}
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0 text-[var(--bloom-core)]"
          animate={reduce ? undefined : focused ? { rotate: [-8, -2, -8], y: [0, -1, 0] } : { rotate: -8, y: 0 }}
          transition={{ duration: 1.4, repeat: focused ? Infinity : 0, ease: "easeInOut" }}
        >
          <path d="M12 19l7-7 3 3-7 7-3 0 0-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M18 13l-1.5-1.5M2 22l4-1 9-9-3-3-9 9-1 4z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>

        <div className="relative flex-1">
          <input
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search the gallery"
            className="w-full bg-transparent text-[15px] text-[var(--text-hi)] caret-[var(--bloom-tip)] outline-none placeholder:text-transparent"
            placeholder="search"
          />
          {/* animated placeholder (typewriter + ink caret) */}
          {!value && !focused && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-[15px] text-[var(--text-lo)]">
              {typed}
              <motion.span
                aria-hidden
                className="ml-0.5 inline-block h-[1.05em] w-[2px] bg-[var(--bloom-core)]"
                animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </span>
          )}
        </div>

        {/* clear */}
        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => {
                onChange("");
                ref.current?.focus();
              }}
              aria-label="Clear search"
              className="shrink-0 rounded-full p-1 text-[var(--text-lo)] transition-colors hover:text-[var(--text-hi)]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ink underline that draws in on focus */}
      <motion.span
        aria-hidden
        className="absolute -bottom-px left-4 right-4 h-[1.5px] origin-left rounded-full bg-gradient-to-r from-[var(--bloom-tip)] via-[var(--bloom-core)] to-transparent"
        initial={false}
        animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 0.9 : 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
