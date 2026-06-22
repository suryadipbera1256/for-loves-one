"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useFBX, useAnimations, Html } from "@react-three/drei";
import * as THREE from "three";

interface BoyEngineProps {
  chapter?: number;
}

// IQ1000: Ultra-lightweight, Localized Engine for fixed characters
export function BoyEngine({ chapter = 1 }: BoyEngineProps) {
  const group = useRef<THREE.Group>(null);
  
  const [actionState, setActionState] = useState("Sitting");
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load only the essential animations
  const baseMesh = useFBX("/animations/boy/Sitting Idle.fbx");
  const animStandUp = useFBX("/animations/boy/Sit To Stand.fbx");
  const animSitDown = useFBX("/animations/boy/Stand To Sit.fbx");
  const animWave = useFBX("/animations/boy/Waving.fbx");

  const splicedAnimations = useMemo(() => {
    if (baseMesh.animations.length) baseMesh.animations[0].name = "Sitting";
    if (animStandUp.animations.length) animStandUp.animations[0].name = "StandingUp";
    if (animSitDown.animations.length) animSitDown.animations[0].name = "SittingDown";
    if (animWave.animations.length) animWave.animations[0].name = "Waving";

    return [
      ...(baseMesh.animations.length ? [baseMesh.animations[0]] : []),
      ...(animStandUp.animations.length ? [animStandUp.animations[0]] : []),
      ...(animSitDown.animations.length ? [animSitDown.animations[0]] : []),
      ...(animWave.animations.length ? [animWave.animations[0]] : []),
    ];
  }, [baseMesh, animStandUp, animSitDown, animWave]);

  const { actions } = useAnimations(splicedAnimations, group);

  // Smooth Crossfade Player
  useEffect(() => {
    if (!actions || !actions[actionState]) return;
    const currentAction = actions[actionState];
    // Very slow and smooth crossfade transition (0.5 seconds)
    currentAction.reset().fadeIn(0.5).play();
    return () => { currentAction.fadeOut(0.5); };
  }, [actionState, actions]);

  // Click Interaction Logic (Triggered on 3D Mesh Click)
  const handleInteraction = (e: any) => {
    e.stopPropagation(); // Prevents click from bubbling up
    if (isTransitioning || actionState !== "Sitting") return; 
    
    setIsTransitioning(true);
    setActionState("StandingUp");
    
    // Smooth sequence timings
    setTimeout(() => setActionState("Waving"), 2000); 
    setTimeout(() => setActionState("SittingDown"), 4500); 
    setTimeout(() => {
      setActionState("Sitting");
      setIsTransitioning(false);
    }, 6500); 
  };

  useMemo(() => {
    baseMesh.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [baseMesh]);

  return (
    // position Y is lowered (-1.4) so his hands and hips perfectly touch the bottom of this mini-canvas,
    // which aligns perfectly with the top border of your HTML Chapter Box.
    <group ref={group} dispose={null} position={[0, -1.4, 0]} onClick={handleInteraction}>
      {/* Even smaller scale as requested */}
      <primitive object={baseMesh} scale={0.004} />
      
      {actionState === "Waving" && (
        <Html position={[0, 3.5, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-neutral-900/90 backdrop-blur-md border border-cyan-500/50 text-cyan-300 px-4 py-2 rounded-2xl shadow-[0_0_15px_rgba(6,182,212,0.5)] whitespace-nowrap font-handwriting text-xl animate-bounce">
            Welcome to Chapter {chapter}!
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-cyan-500/50" />
          </div>
        </Html>
      )}
    </group>
  );
}

useFBX.preload("/animations/boy/Sitting Idle.fbx");
useFBX.preload("/animations/boy/Sit To Stand.fbx");
useFBX.preload("/animations/boy/Stand To Sit.fbx");
useFBX.preload("/animations/boy/Waving.fbx");