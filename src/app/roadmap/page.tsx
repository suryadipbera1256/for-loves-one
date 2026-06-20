"use client";

import { motion } from "framer-motion";
import { STORY_DATA } from "@/lib/constants";
import Image from "next/image";

// Renders a vertically alternating spatial timeline
export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-black py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-16 text-center tracking-tighter">
          Our Journey Map
        </h1>
        
        <div className="relative border-l border-neutral-800 ml-4 md:mx-auto md:w-full">
          {STORY_DATA.map((event, index) => (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              key={event.id}
              className="mb-12 pl-8 relative md:pl-0 md:flex md:items-center md:justify-between w-full group"
            >
              {/* Glowing Timeline Node */}
              <div className="absolute w-4 h-4 bg-cyan-500 rounded-full left-[-8.5px] md:left-1/2 md:-ml-2 top-0 md:top-1/2 md:-mt-2 shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
              
              {/* Alternating Content Container */}
              <div className={`md:w-[45%] ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:ml-auto"}`}>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl transition-colors hover:border-cyan-500/50">
                  <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                  <p className="text-neutral-400 mb-4">{event.description}</p>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={event.mediaUrl}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}