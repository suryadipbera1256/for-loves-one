"use client";

import Spline from "@splinetool/react-spline";

// Mounts the WebGL canvas for the interactive 3D couple avatar
export function CoupleAvatar() {
  return (
    <div className="w-full h-[500px] relative rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800">
      {/* Replace the URL below with your actual exported Spline scene URL */}
      <Spline scene="https://prod.spline.design/your-scene-url/scene.splinecode" />
      
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h2 className="text-white text-3xl font-bold">Our Journey</h2>
        <p className="text-cyan-400 font-mono text-sm mt-1">Interactive Node Loaded</p>
      </div>
    </div>
  );
}