import { BentoGrid } from "@/components/bento-grid/BentoGrid";
import Image from "next/image";

// Server component serving as the root entry point
export default function Home() {
  return (
    <main className="min-h-screen bg-black selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        
        {/* Header Section with Static Image Integration */}
        <section className="w-full relative h-[500px] md:h-[600px] rounded-[40px] overflow-hidden border border-neutral-800 shadow-2xl group">
          
          <Image
            src="/image/home header.jpg"
            alt="Our Journey Begins"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          
          {/* Spatial depth gradient overlay for premium aesthetics */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

          <div className="absolute bottom-10 left-10 z-20 pointer-events-none">
            <h2 className="text-white text-5xl md:text-6xl font-handwriting tracking-wide drop-shadow-lg">
              Our Journey
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-cyan-300 font-mono text-sm tracking-widest uppercase">
                Memory Node Connected
              </p>
            </div>
          </div>
        </section>

        {/* Spatial UI Timeline Gallery */}
        <section className="w-full">
          <div className="mb-8 px-4">
            <h1 className="text-4xl md:text-5xl font-handwriting text-cyan-400 tracking-tighter drop-shadow-md">
              A Timeline of Us
            </h1>
            <p className="text-neutral-400 mt-2 font-light">
              Scroll through the fragments of our memory.
            </p>
          </div>
          <BentoGrid />
        </section>
        
      </div>
    </main>
  );
}