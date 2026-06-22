"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useInView, MotionValue } from "framer-motion";
import Image from "next/image";
import { STORY_DATA } from "@/lib/constants";

// The Dense, Animated Organic Root Network Component
const OrganicRootNetwork = ({ progress }: { progress: MotionValue<number> }) => {
  return (
    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 1000">
      <defs>
        {/* Glow for the main active roots */}
        <linearGradient id="neonRootGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* BACKGROUND SCATTERED ROOTS (These spread densely everywhere) */}
      <motion.path d="M 50,0 C 40,100 10,150 20,250 C 30,350 0,450 15,550 C 30,650 5,750 20,850 C 35,950 10,1000 10,1000" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" style={{ pathLength: progress }} />
      <motion.path d="M 50,0 C 60,80 90,120 80,220 C 70,320 100,420 85,520 C 70,620 95,720 80,820 C 65,920 90,1000 90,1000" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" style={{ pathLength: progress }} />
      <motion.path d="M 45,50 C 25,150 5,200 15,300 C 25,400 -5,500 10,600 C 25,700 0,800 15,900" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" style={{ pathLength: progress }} />
      <motion.path d="M 55,50 C 75,150 95,200 85,300 C 75,400 105,500 90,600 C 75,700 100,800 85,900" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.2" style={{ pathLength: progress }} />
      <motion.path d="M 50,100 C 80,250 20,400 70,550 C 20,700 80,850 30,1000" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" style={{ pathLength: progress }} />

      {/* THE MAIN THICK WINDING ROOT */}
      {/* Faint Track */}
      <path d="M 50,0 C 60,100 30,200 50,300 C 70,400 40,500 50,600 C 60,700 30,800 50,900 C 70,950 50,1000 50,1000" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
      {/* Glowing Animated Core */}
      <motion.path
        d="M 50,0 C 60,100 30,200 50,300 C 70,400 40,500 50,600 C 60,700 30,800 50,900 C 70,950 50,1000 50,1000"
        fill="none"
        stroke="url(#neonRootGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        className="drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]"
        style={{ pathLength: progress }}
      />
    </svg>
  );
};

// Chapter Node - Handles the Middle Branches and Glow Connections
const ChapterNode = ({ event, index }: { event: any; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40% 0px -40% 0px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`relative w-full flex ${isEven ? "md:justify-start" : "md:justify-end"} justify-end items-center md:my-32 my-24`}>
      
      {/* MIDDLE BRANCH (DESKTOP) - Organic Wavy Connections */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'right-[42%] left-1/2' : 'left-[42%] right-1/2'} h-32 z-0 hidden md:block`}>
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
          <motion.path
            d={isEven ? "M 0,25 C 30,50 40,0 100,25" : "M 100,25 C 70,50 60,0 0,25"}
            fill="none"
            stroke="url(#branchNeonGlow)"
            strokeWidth="3"
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* MIDDLE BRANCH (MOBILE) */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 right-[85%] h-20 z-0 md:hidden block">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
          <motion.path
            d="M 0,25 C 30,50 40,0 100,25"
            fill="none"
            stroke="url(#branchNeonGlow)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <svg className="hidden">
        <defs>
          <linearGradient id="branchNeonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>

      {/* The Glassmorphic Chapter Box with Connection Glow */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ type: "spring", stiffness: 50, damping: 18 }}
        className={`w-[85%] md:w-[42%] ${isEven ? "md:pr-8" : "md:pl-8"} relative z-10`}
      >
        <div 
          className={`relative backdrop-blur-2xl rounded-2xl overflow-hidden
            transition-all duration-700 ease-in-out transform border
            ${isInView 
              ? "bg-neutral-900/80 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] scale-[1.02]" 
              : "bg-white/5 border-white/5 shadow-2xl scale-100 grayscale-[40%]"
            }`}
        >
          {/* Internal Neon Glow triggered on connection */}
          <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/15 to-transparent pointer-events-none transition-opacity duration-700 ${isInView ? "opacity-100" : "opacity-0"}`} />

          <div className="relative h-60 md:h-72 w-[calc(100%-16px)] mx-2 mt-2 rounded-t-lg rounded-b-xl overflow-hidden">
            <Image src={event.mediaUrl} alt={event.title} fill className={`object-cover transition-transform duration-1000 ${isInView ? "scale-105" : "scale-100"}`} sizes="(max-width: 768px) 100vw, 50vw" />
            
            <div className={`absolute inset-0 transition-colors duration-700 ${isInView ? "bg-gradient-to-t from-black/95 via-black/40 to-transparent" : "bg-black/70"}`} />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className={`px-3 py-1 text-xs font-mono rounded-full mb-3 inline-block transition-colors duration-700 ${isInView ? "text-cyan-900 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] font-bold" : "text-neutral-400 bg-neutral-900/80 border border-white/5"}`}>
                Chapter {index + 1}
              </span>
              <h3 className={`text-2xl md:text-3xl font-handwriting tracking-wide transition-colors duration-700 ${isInView ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-neutral-500"}`}>
                {event.title}
              </h3>
            </div>
          </div>
          <div className="p-6 pt-4">
            <p className={`text-sm md:text-base leading-relaxed transition-colors duration-700 ${isInView ? "text-neutral-200" : "text-neutral-600"}`}>
              {event.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Main Roadmap Page Architecture
export default function RoadmapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <main className="relative min-h-[400vh] select-none bg-black" ref={containerRef}>
      
      {/* PHASE 1: THE TREE CANOPY (Hero Section) */}
      <section className="relative w-full h-[100vh] bg-gradient-to-b from-[#f4eee1] via-[#e8dec7] to-black overflow-hidden flex flex-col items-center justify-start pt-20">
        
        {/* Abstract Tree Silhouette */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] md:w-[80vw] h-[80vh] opacity-15 pointer-events-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-[#4a3f35]">
            <path d="M44.7,-76.4C58.3,-69.2,70.1,-57.1,79.5,-42.8C88.9,-28.5,95.9,-12.1,94.2,3.5C92.6,19.1,82.3,33.9,71.2,46.7C60.1,59.5,48.2,70.3,34.2,76.5C20.2,82.7,4.1,84.4,-11.1,81.8C-26.4,79.3,-40.8,72.6,-53.4,63.1C-66,53.6,-76.8,41.2,-83.4,26.5C-90,11.8,-92.4,-5.2,-88.2,-20.5C-84,-35.8,-73.2,-49.3,-60.1,-57.1C-47,-64.9,-31.6,-66.9,-17.5,-70.7C-3.4,-74.4,9.5,-79.8,24,-81.4C38.5,-83,53.4,-80.8,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="relative z-10 text-center px-4 mt-10">
          <h1 className="text-6xl md:text-8xl font-handwriting text-neutral-900 tracking-tighter drop-shadow-2xl">
            Our Beautiful Journey
          </h1>
          <p className="mt-4 text-neutral-700 font-mono text-sm md:text-base uppercase tracking-widest font-bold">
            Roots of our Memories
          </p>
        </div>

        {/* The Ground Layer - Solid Black Curve */}
        <div className="absolute bottom-0 w-full h-[25vh] md:h-[35vh] bg-black rounded-t-[50%] md:rounded-t-[100%] shadow-[0_-20px_60px_rgba(0,0,0,0.9)] z-20 flex justify-center items-end">
          
          {/* THE RAW PNG IMAGE - NO BORDERS, NO CONTAINERS */}
          {/* Placed dynamically so the ground of the image matches the black ground curve */}
          <div className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px] -mb-[8%] md:-mb-[5%] z-30 pointer-events-none">
            <Image 
              src="/image/roadmap header.png" 
              alt="Beautiful Couple" 
              fill 
              className="object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]" 
              sizes="(max-width: 768px) 280px, 420px"
              priority
            />
          </div>
          
        </div>
      </section>

      {/* PHASE 2: THE ROOTS UNDERGROUND */}
      <section className="relative w-full pt-10 pb-48 bg-black">
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          
          {/* DENSE ROOT NETWORK CONTAINER */}
          <div className="absolute top-0 bottom-0 left-6 md:left-1/2 md:-translate-x-1/2 w-[100px] md:w-[300px] pointer-events-none z-0">
            <OrganicRootNetwork progress={smoothProgress} />
          </div>

          {/* Render Chapters */}
          <div className="w-full flex flex-col z-10 pt-[10vh]">
            {STORY_DATA.map((event, index) => (
              <ChapterNode key={event.id} event={event} index={index} />
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}