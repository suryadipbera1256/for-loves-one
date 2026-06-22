"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Modular NavItem component - Compact and Minimal
const NavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="group relative flex md:flex-col flex-row items-center gap-1.5 p-2 rounded-xl transition-all duration-300">
      
      {/* Active State Glassmorphism Highlight */}
      {isActive && (
        <div className="absolute inset-0 bg-cyan-500/15 rounded-xl blur-[6px] transition-all duration-300 pointer-events-none" />
      )}

      {/* SVG Icon - Size reduced to 18px for a cleaner look */}
      <div 
        className={`relative z-10 transition-all duration-300 
          ${isActive 
            ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] scale-110" 
            : "text-neutral-500 group-hover:text-cyan-300 group-hover:scale-110"
          }`}
      >
        {Icon}
      </div>

      {/* Label Text - Scaled down slightly */}
      <span 
        className={`relative z-10 text-[9px] md:text-[10px] font-mono tracking-widest transition-all duration-300 md:[writing-mode:vertical-lr] md:rotate-180 
          ${isActive 
            ? "text-cyan-400 font-bold drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" 
            : "text-neutral-500 group-hover:text-cyan-300"
          }`}
      >
        {label}
      </span>
    </Link>
  );
};

// Main SmartNav Component
export function SmartNav() {
  return (
    <nav className="fixed md:left-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:flex-col md:h-auto md:w-auto md:bottom-auto bottom-6 left-1/2 -translate-x-1/2 md:py-4 md:px-2 px-4 py-2 z-50 bg-neutral-950/60 backdrop-blur-xl border border-white/10 rounded-full flex flex-row gap-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.6)]">
      
      <NavItem
        href="/"
        label="HOME"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        }
      />

      {/* Tiny Responsive Separator */}
      <div className="md:w-full md:h-[1px] w-[1px] h-full bg-white/10 opacity-50" />

      <NavItem
        href="/roadmap"
        label="ROADMAP"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="15" y1="3" x2="15" y2="21"/>
          </svg>
        }
      />

      {/* Tiny Responsive Separator */}
      <div className="md:w-full md:h-[1px] w-[1px] h-full bg-white/10 opacity-50" />

      <NavItem
        href="/gallery"
        label="GALLERY"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        }
      />
    </nav>
  );
}