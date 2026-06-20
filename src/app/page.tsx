import { BentoGrid } from "@/components/bento-grid/BentoGrid";
import { CoupleAvatar } from "@/components/3d-avatars/CoupleAvatar";

// Server component serving as the root entry point
export default function Home() {
  return (
    <main className="min-h-screen bg-black selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        
        {/* Header Section with 3D Integration */}
        <section className="w-full">
          <CoupleAvatar />
        </section>

        {/* Spatial UI Timeline Gallery */}
        <section className="w-full">
          <div className="mb-8 px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
              A Timeline of Us
            </h1>
            <p className="text-neutral-400 mt-2">
              Scroll through the fragments of our memory.
            </p>
          </div>
          <BentoGrid />
        </section>
        
      </div>
    </main>
  );
}