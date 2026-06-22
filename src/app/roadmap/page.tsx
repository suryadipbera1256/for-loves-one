"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity } from "framer-motion";
import Image from "next/image";
import { STORY_DATA } from "@/lib/constants";

// Professional winding road architecture with dynamic coordinate mapping
export default function RoadmapPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Tracking the scroll progression across the dynamic container height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Softening structural jerkiness with physics damping
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.001,
  });

  // Capturing velocity to calculate active movement states
  const scrollVelocity = useVelocity(scrollYProgress);

  // Mapping vertical scroll depth directly to absolute top percentage
  const avatarY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // High-IQ coordinate array mapping the avatar directly along the winding track bends
  const avatarX = useTransform(
    smoothProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    ["0px", "-140px", "140px", "-140px", "140px", "0px"]
  );

  // Calculating a slight rotation lean based on direction of horizontal transit
  const avatarRotate = useTransform(
    scrollVelocity,
    [-1, 0, 1],
    [-15, 0, 15]
  );

  return (
    <main className="relative min-h-[400vh] bg-black overflow-hidden select-none" ref={containerRef}>
      
      {/* Ambient glowing universe styling elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] bg-cyan-950/10 blur-[160px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-blue-950/10 blur-[140px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
        <motion.h1 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-handwriting md:text-7xl text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 mb-48 tracking-tighter"
        >
          Our Beautiful Journey
        </motion.h1>

        <div className="relative w-full flex justify-center">
          
          {/* Authentic Winding Road Layer utilizing overlapping absolute curved blocks */}
          <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-[320px] h-[calc(100%-6rem)] pointer-events-none z-0">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 320 1000" preserveAspectRatio="none">
              <path
                d="M 160,0 C 10,150 310,350 160,500 C 10,650 310,850 160,1000"
                fill="none"
                stroke="#171717"
                strokeWidth="48"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                d="M 160,0 C 10,150 310,350 160,500 C 10,650 310,850 160,1000"
                fill="none"
                stroke="url(#cyanNeonStream)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pathLength: smoothProgress }}
              />
              <defs>
                <linearGradient id="cyanNeonStream" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Dynamic Couple Avatar tracking the snake-like road configurations */}
          <motion.div
            style={{ top: avatarY, x: avatarX, rotate: avatarRotate }}
            className="absolute left-1/2 -translate-x-1/2 z-30 -mt-4 pointer-events-none"
          >
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
              className="w-16 h-16 bg-neutral-950 border-2 border-cyan-400 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.7)] flex items-center justify-center"
            >
              <div className="flex gap-1.5 items-center">
                {/* Boy Character Graphic Placeholder */}
                <div className="w-3.5 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-inner" />
                {/* Girl Character Graphic Placeholder */}
                <div className="w-3.5 h-6 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full shadow-inner" />
              </div>
            </motion.div>
          </motion.div>

          {/* Main Story Container Array with dynamic grid gaps */}
          <div className="w-full flex flex-col gap-[45vh] pb-[10vh] z-10">
            {STORY_DATA.map((event, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={event.id}
                  className={`relative w-full flex ${isEven ? "justify-start" : "justify-end"} items-center`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -80 : 80, scale: 0.95 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{ type: "spring", stiffness: 50, damping: 18 }}
                    className={`w-[42%] ${isEven ? "pr-4" : "pl-4"}`}
                  >
                    {/* Asymmetrical Premium Interactive Cards */}
                    <div className="relative backdrop-blur-xl bg-neutral-950/50 border border-white/5 p-3 transition-all duration-500 hover:border-cyan-500/40 hover:bg-neutral-900/40
                      rounded-tl-[50px] rounded-br-[50px] rounded-tr-2xl rounded-bl-2xl overflow-hidden shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                      
                      <div className="relative h-72 w-full rounded-tl-[42px] rounded-br-[42px] rounded-tr-xl rounded-bl-xl overflow-hidden">
                        <Image
                          src={event.mediaUrl}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                        
                        <div className="absolute bottom-6 left-6 right-6">
                          <span className="px-3 py-1 text-xs font-mono text-cyan-300 bg-cyan-950/80 rounded-full border border-cyan-800/40 mb-3 inline-block">
                            Chapter {index + 1}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-handwriting text-white tracking-wide">{event.title}</h3>
                        </div>
                      </div>

                      <div className="p-6">
                        <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-light">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </main>
  );
}