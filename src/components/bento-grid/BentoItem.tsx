"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TimelineEvent } from "@/lib/constants";

interface BentoItemProps {
  item: TimelineEvent;
}

// Renders individual grid cards with physics-based hover effects
export function BentoItem({ item }: BentoItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 0.98, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "relative overflow-hidden rounded-3xl bg-neutral-900 border border-neutral-800 group",
        item.className
      )}
    >
      <div className="absolute inset-0 w-full h-full">
        {item.mediaType === "image" ? (
          <Image
            src={item.mediaUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <video
            src={item.mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 p-6 z-10">
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
          {item.title}
        </h3>
        <p className="text-neutral-300 text-sm max-w-xs">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}