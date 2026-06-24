"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/lib/admin/store";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "M4 13h6V4H4zM14 21h6v-9h-6zM14 4v5h6V4zM4 21h6v-5H4z" },
  { href: "/admin/home", label: "Home", icon: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" },
  { href: "/admin/roadmap", label: "Roadmap", icon: "M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" },
  { href: "/admin/gallery", label: "Gallery", icon: "M3 3h18v18H3zM3 15l5-5 4 4 3-3 6 6" },
];

/** Admin chrome: responsive nav (sidebar on desktop, top bar on mobile) + a
 * hydration guard so child editors only mount once content is loaded. */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { ready, actions } = useAdmin();

  return (
    <div className="min-h-screen w-full bg-[var(--bg-void)] text-[var(--text-hi)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col md:flex-row">
        {/* nav */}
        <aside className="sticky top-0 z-20 border-b border-white/10 bg-[var(--bg-void)]/80 backdrop-blur-xl md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-5 py-4 md:block md:py-6">
            <Link href="/admin" className="font-handwriting text-2xl text-white">
              Control Room
            </Link>
            <p className="hidden text-[11px] text-[var(--text-lo)] md:mt-1 md:block">for-loves-one · admin</p>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:none] md:flex-col md:overflow-visible md:px-3 md:pb-0 [&::-webkit-scrollbar]:hidden">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-colors duration-300",
                    active ? "bg-[var(--bloom-core)]/15 text-[var(--bloom-tip)]" : "text-[var(--text-lo)] hover:bg-white/[0.04] hover:text-[var(--text-hi)]"
                  )}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden px-5 md:absolute md:bottom-5 md:block">
            <Link href="/" className="text-[11px] text-[var(--text-lo)] underline-offset-4 hover:text-[var(--bloom-core)] hover:underline">
              ← View live site
            </Link>
          </div>
        </aside>

        {/* content */}
        <main className="flex-1 px-4 py-6 md:px-8 md:py-10">
          {ready ? (
            children
          ) : (
            <div className="flex h-[60vh] items-center justify-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--text-lo)]">Loading content…</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
