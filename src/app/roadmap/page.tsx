"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import Image from "next/image";
import { STORY_DATA } from "@/lib/constants";

// Chapter Node - Clean, Glassmorphic, High Visibility
const ChapterNode = ({ event, index }: { event: any; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40% 0px -40% 0px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`relative w-full flex ${isEven ? "md:justify-start" : "md:justify-end"} justify-end items-center md:my-32 my-24`}>
      
      {/* ORGANIC CHILD BRANCH (DESKTOP) - Clean White Line, No Neon Glow */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'right-[42%] left-1/2' : 'left-[42%] right-1/2'} h-24 z-0 hidden md:block`}>
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
          {/* Faint background path */}
          <path d={isEven ? "M 0,25 Q 50,0 100,25" : "M 100,25 Q 50,50 0,25"} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeLinecap="round" />
          {/* Animated connection line */}
          <motion.path
            d={isEven ? "M 0,25 Q 50,0 100,25" : "M 100,25 Q 50,50 0,25"}
            fill="none"
            stroke="rgba(255,255,255,0.8)" // High visibility white
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* ORGANIC CHILD BRANCH (MOBILE) */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 right-[85%] h-16 z-0 md:hidden block">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
          <path d="M 0,25 Q 50,0 100,25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeLinecap="round" />
          <motion.path
            d="M 0,25 Q 50,0 100,25"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* The Glassmorphic Chapter Box */}
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
              ? "bg-white/10 border-white/20 shadow-[0_8px_32px_0_rgba(255,255,255,0.05)] scale-[1.02]" 
              : "bg-white/5 border-white/5 shadow-2xl scale-100 grayscale-[50%]"
            }`}
        >
          <div className="relative h-60 md:h-72 w-[calc(100%-16px)] mx-2 mt-2 rounded-t-lg rounded-b-xl overflow-hidden">
            <Image src={event.mediaUrl} alt={event.title} fill className={`object-cover transition-transform duration-1000 ${isInView ? "scale-105" : "scale-100"}`} sizes="(max-width: 768px) 100vw, 50vw" />
            
            {/* Elegant dark overlay for text visibility */}
            <div className={`absolute inset-0 transition-colors duration-700 ${isInView ? "bg-gradient-to-t from-black/95 via-black/40 to-transparent" : "bg-black/70"}`} />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className={`px-3 py-1 text-xs font-mono rounded-full mb-3 inline-block transition-colors duration-700 ${isInView ? "text-black bg-white/90 shadow-md font-bold" : "text-neutral-400 bg-neutral-900/80 border border-white/5"}`}>
                Chapter {index + 1}
              </span>
              <h3 className={`text-2xl md:text-3xl font-handwriting tracking-wide transition-colors duration-700 ${isInView ? "text-white" : "text-neutral-500"}`}>
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
      
      {/* PHASE 1: THE TREE CANOPY (Hero Section - Elegant Black & White Theme) */}
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

        {/* The Ground & Couple Silhouette */}
        <div className="absolute bottom-0 w-full h-[30vh] bg-black rounded-t-[50%] md:rounded-t-[100%] shadow-[0_-20px_60px_rgba(0,0,0,0.9)] z-20 flex justify-center items-start pt-6">
          <div className="relative -mt-[80px] w-24 h-24 opacity-70">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
              <path d="M9 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="white"/>
              <path d="M15 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="white"/>
              <path d="M9 7v5l-2 5m2-5h3m3-5v5l2 5m-2-5h-3"/>
              <path d="M9 12l2 8m4-8l-2 8"/>
            </svg>
          </div>
        </div>
      </section>

      {/* PHASE 2: THE ROOTS UNDERGROUND (Black & White Theme) */}
      <section className="relative w-full pt-10 pb-48 bg-black">
        
        {/* Background Transparent Spreading Roots Network */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <path d="M 50%,0 Q 30%,20 40%,50 T 20%,100 M 50%,0 Q 70%,30 60%,60 T 80%,100 M 50%,0 Q 40%,40 50%,80 T 50%,100" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 20" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          
          {/* THE MAIN ROOT (Clean White/Silver Gradient) */}
          <div className="absolute top-0 bottom-0 left-6 md:left-1/2 md:-translate-x-1/2 w-4 md:w-8 pointer-events-none z-0 overflow-visible">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
              {/* Faint Dead Root */}
              <path d="M 50,0 Q 20,250 50,500 T 50,1000" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              
              {/* Animated Solid White Line based on scroll */}
              <motion.path
                d="M 50,0 Q 20,250 50,500 T 50,1000"
                fill="none"
                stroke="url(#mainRootGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pathLength: smoothProgress }}
              />
              <defs>
                <linearGradient id="mainRootGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Render Chapters */}
          <div className="w-full flex flex-col z-10">
            {STORY_DATA.map((event, index) => (
              <ChapterNode key={event.id} event={event} index={index} />
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}