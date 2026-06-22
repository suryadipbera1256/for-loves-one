"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity } from "framer-motion";
import Image from "next/image";
import { STORY_DATA } from "@/lib/constants";

// Professional 10X Architecture for Spatial Winding Roadmap
export default function RoadmapPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Core physics engine for scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the scroll progression
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Track scrolling speed to dynamically adjust the avatar walking speed
  const scrollVelocity = useVelocity(scrollYProgress);
  const avatarBobbingSpeed = useTransform(scrollVelocity, [-1, 0, 1], [0.2, 1, 0.2]);

  // Dynamic mapping for the avatar moving along the vertical road
  const avatarY = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <main className="relative min-h-[300vh] bg-black overflow-hidden" ref={containerRef}>
      
      {/* Premium Ambient Background with Cyberpunk Cyan Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-500 mb-32 text-center tracking-tighter"
        >
          Our Spatial Journey
        </motion.h1>

        <div className="relative w-full flex justify-center">
          
          {/* Central Glowing Data Stream Road */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-neutral-900 rounded-full overflow-hidden shadow-[0_0_15px_rgba(0,0,0,1)]">
            <motion.div
              style={{ scaleY: smoothProgress, transformOrigin: "top" }}
              className="w-full h-full bg-gradient-to-b from-cyan-400 via-blue-500 to-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
            />
          </div>

          {/* The Animated Couple Dummy Avatars */}
          <motion.div
            style={{ top: avatarY }}
            className="absolute left-1/2 -translate-x-1/2 z-50 mt-12"
          >
            {/* Physics-based walking bobbing effect controlled by scroll velocity */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
              className="relative w-16 h-16 bg-neutral-950 border-2 border-cyan-400 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center justify-center overflow-hidden"
            >
              {/* Replace this div with your actual Anime/Dummy illustration Image */}
              <div className="flex gap-1">
                <div className="w-3 h-5 bg-pink-400 rounded-full" />
                <div className="w-3 h-5 bg-blue-400 rounded-full" />
              </div>
            </motion.div>
          </motion.div>

          {/* Rendering Asymmetrical Creative Containers */}
          <div className="w-full flex flex-col gap-[30vh] pb-[20vh]">
            {STORY_DATA.map((event, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={event.id}
                  className={`relative w-full flex ${isEven ? "justify-start" : "justify-end"} items-center`}
                >
                  {/* Branching connection lines from main road to cards */}
                  <div 
                    className={`absolute top-1/2 w-[calc(50%-2rem)] h-0.5 bg-gradient-to-r ${
                      isEven ? "left-1/2 from-cyan-500 to-transparent" : "right-1/2 from-transparent to-cyan-500"
                    } opacity-30`} 
                  />

                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -100 : 100, rotateY: isEven ? -15 : 15 }}
                    whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                    className={`w-[45%] group perspective-1000 ${isEven ? "pr-10" : "pl-10"}`}
                  >
                    {/* Unique Asymmetrical Premium Layout */}
                    <div className="relative backdrop-blur-xl bg-neutral-950/40 border border-white/5 p-2 transition-all duration-500 hover:border-cyan-500/50 hover:bg-neutral-900/60
                      rounded-tl-[40px] rounded-br-[40px] rounded-tr-xl rounded-bl-xl overflow-hidden shadow-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                      
                      <div className="relative h-64 w-full rounded-tl-[32px] rounded-br-[32px] rounded-tr-lg rounded-bl-lg overflow-hidden">
                        <Image
                          src={event.mediaUrl}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        
                        <div className="absolute bottom-6 left-6 right-6">
                          <span className="px-3 py-1 text-xs font-mono text-cyan-300 bg-cyan-950/80 rounded-full border border-cyan-800/50 mb-3 inline-block">
                            Memory Node #{index + 1}
                          </span>
                          <h3 className="text-3xl font-bold text-white tracking-tight">{event.title}</h3>
                        </div>
                      </div>

                      <div className="p-6">
                        <p className="text-neutral-400 leading-relaxed font-light">
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