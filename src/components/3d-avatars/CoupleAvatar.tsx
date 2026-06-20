"use client";

// Mounts the WebGL canvas for the interactive 3D couple avatar
export function CoupleAvatar() {
  return (
    <div className="w-full h-[500px] relative rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800">
      <div className="absolute inset-0 bg-linear-to-br from-neutral-900 via-cyan-950/20 to-neutral-950" />

      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2 className="text-white text-3xl font-bold">Our Journey</h2>
        <p className="text-cyan-400 font-mono text-sm mt-1">3D Scene — add your Spline URL to enable</p>
      </div>
    </div>
  );
}