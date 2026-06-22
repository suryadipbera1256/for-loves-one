"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import Image from "next/image";
import { STORY_DATA } from "@/lib/constants";
import { BoyEngine } from "@/components/3d-avatars/BoyEngine";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

const ChapterNode = ({ event, index }: { event: any; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40% 0px -40% 0px" });
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`relative w-full flex ${isEven ? "md:justify-start" : "md:justify-end"} justify-end items-center md:my-40 my-24`}>
      
      {/* Desktop Branch */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'right-[42%] left-1/2' : 'left-[42%] right-1/2'} h-24 z-0 hidden md:block`}>
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
          <path d={isEven ? "M 0,25 Q 50,0 100,25" : "M 100,25 Q 50,50 0,25"} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeLinecap="round" />
          <motion.path
            d={isEven ? "M 0,25 Q 50,0 100,25" : "M 100,25 Q 50,50 0,25"}
            fill="none" stroke="url(#branchGlow)" strokeWidth="3" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Mobile Branch */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 right-[85%] h-16 z-0 md:hidden block">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
          <path d="M 0,25 Q 50,0 100,25" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeLinecap="round" />
          <motion.path
            d="M 0,25 Q 50,0 100,25"
            fill="none" stroke="url(#branchGlow)" strokeWidth="2" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ type: "spring", stiffness: 50, damping: 18 }}
        className={`w-[85%] md:w-[42%] ${isEven ? "md:pr-8" : "md:pl-8"} relative z-10`}
      >
        <div className={`relative bg-neutral-900 border-t-[6px] border-l border-white/5 rounded-2xl overflow-hidden transition-all duration-700 ease-in-out transform ${isInView ? "border-t-cyan-500 border-l-cyan-900/50 shadow-[10px_15px_0px_0px_rgba(6,182,212,0.2),_20px_25px_40px_rgba(0,0,0,0.9)] scale-[1.02]" : "border-t-neutral-800 shadow-2xl scale-100 grayscale-[40%]"}`}>
          
          <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none transition-opacity duration-700 ${isInView ? "opacity-100" : "opacity-0"}`} />
          
          <div className="absolute -top-16 left-8 w-32 h-32 z-30 cursor-pointer pointer-events-auto">
            <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }} transparent>
              <Environment preset="city" />
              <ambientLight intensity={0.7} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} />
              <BoyEngine chapter={index + 1} />
            </Canvas>
          </div>

          <div className="relative h-60 md:h-72 w-[calc(100%-16px)] mx-2 mt-4 rounded-t-lg rounded-b-xl overflow-hidden">
            <Image src={event.mediaUrl} alt={event.title} fill className={`object-cover transition-transform duration-1000 ${isInView ? "scale-105" : "scale-100"}`} sizes="(max-width: 768px) 100vw, 50vw" />
            <div className={`absolute inset-0 transition-colors duration-700 ${isInView ? "bg-gradient-to-t from-black/95 via-black/20 to-transparent" : "bg-black/60"}`} />
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className={`px-3 py-1 text-xs font-mono rounded-full mb-3 inline-block transition-colors duration-700 ${isInView ? "text-cyan-300 bg-cyan-950/80 shadow-[0_0_10px_rgba(6,182,212,0.5)] border border-cyan-800/50" : "text-neutral-500 bg-neutral-900/80 border border-white/5"}`}>
                Chapter {index + 1}
              </span>
              <h3 className={`text-2xl md:text-3xl font-handwriting tracking-wide transition-colors duration-700 ${isInView ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-neutral-500"}`}>{event.title}</h3>
            </div>
          </div>
          <div className="p-6 pt-4">
            <p className={`text-sm md:text-base leading-relaxed transition-colors duration-700 ${isInView ? "text-neutral-200" : "text-neutral-600"}`}>{event.description}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function RoadmapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });

  return (
    <main className="relative min-h-[400vh] select-none bg-black" ref={containerRef}>
      
      {/* PHASE 1: PREPARED HERO SECTION FOR TRANSPARENT IMAGE */}
      <section className="relative w-full h-[100vh] bg-gradient-to-b from-[#fdfbf7] via-[#f4eee1] to-black overflow-hidden flex flex-col items-center justify-start pt-20">
        
        {/* Soft Background Tree Pattern */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150vw] md:w-[80vw] h-[80vh] opacity-10 pointer-events-none">
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

        {/* CONTAINER FOR BACKGROUND-REMOVED IMAGE */}
        <div className="absolute bottom-0 w-full flex justify-center items-end pb-8 z-20">
          {/* Glowing Ground / Pedestal */}
          <div className="absolute bottom-0 w-[90%] md:w-[60%] h-[120px] bg-cyan-500/20 blur-[60px] rounded-full" />
          
          <div className="relative w-[320px] md:w-[450px] h-[400px] md:h-[550px] z-30 flex items-end justify-center">
            
            {/* REPLACE THIS DIV WITH YOUR ACTUAL NEXT/IMAGE COMPONENT */}
            <div className="w-full h-full border-2 border-dashed border-neutral-400/50 rounded-2xl flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm shadow-2xl transition-all hover:border-cyan-400 hover:bg-cyan-500/5">
              <span className="text-3xl mb-2">📸</span>
              <p className="text-neutral-600 text-center font-mono text-sm px-8">
                Place your background-removed transparent image here
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* PHASE 2: THE ROOTS UNDERGROUND */}
      <section className="relative w-full pt-10 pb-48">
        
        {/* Subtle Background Root Network */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <path d="M 50%,0 Q 30%,20 40%,50 T 20%,100 M 50%,0 Q 70%,30 60%,60 T 80%,100 M 50%,0 Q 40%,40 50%,80 T 50%,100" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 20" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          
          {/* MAIN NEON ROOT */}
          <div className="absolute top-0 bottom-0 left-6 md:left-1/2 md:-translate-x-1/2 w-4 md:w-8 pointer-events-none z-0 overflow-visible">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1000">
              <path d="M 50,0 Q 20,250 50,500 T 50,1000" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <motion.path
                d="M 50,0 Q 20,250 50,500 T 50,1000"
                fill="none" stroke="url(#mainRootGlow)" strokeWidth="6" strokeLinecap="round"
                style={{ pathLength: smoothProgress }}
                className="drop-shadow-[0_0_15px_rgba(6,182,212,1)]"
              />
              <defs>
                <linearGradient id="mainRootGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="branchGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

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