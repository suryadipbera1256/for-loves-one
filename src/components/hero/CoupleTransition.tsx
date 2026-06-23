"use client";

import Image from "next/image";
import { motion, useTransform, useReducedMotion, type MotionValue } from "framer-motion";

/**
 * The couple, as the RAW transparent PNG -- no container, no border, no
 * background shape, no box-shadow, no edge vignette. It sits exactly on the
 * light-canopy / dark-soil boundary and its lower half dissolves straight
 * into the deep dark ground via a single bottom mask, so it reads as growing
 * out of the soil rather than pasted on top.
 *
 * `progress` is the hero's scrollYProgress (0 -> 1). Gentle parallax only.
 * Asset: /public/image/roadmap header.png
 */
export function CoupleTransition({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const yRaw = useTransform(progress, [0, 1], [0, 60]);
  const y = reduce ? 0 : yRaw;

  return (
    <motion.div
      style={{
        y,
        // ONLY a bottom dissolve into the soil -- nothing feathers the sides,
        // so the silhouette stays crisp and uncontained.
        WebkitMaskImage: "linear-gradient(to bottom, #000 56%, transparent 92%)",
        maskImage: "linear-gradient(to bottom, #000 56%, transparent 92%)",
      }}
      className="pointer-events-none absolute bottom-[15vh] left-1/2 z-20 h-[50vh] w-[80vw] max-w-[540px] -translate-x-1/2 md:bottom-[16vh] md:h-[58vh]"
    >
      <Image
        src="/image/roadmap header.png"
        alt="The couple at the start of their journey"
        fill
        priority
        sizes="(max-width: 768px) 80vw, 540px"
        className="object-contain object-bottom"
      />
    </motion.div>
  );
}
