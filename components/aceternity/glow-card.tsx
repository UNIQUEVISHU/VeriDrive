"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlowCard({
  children,
  className,
  glowColor = "45,217,196",
}: {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group relative rounded-xl border border-white/10 bg-neutral-900/60 transition-colors",
        className
      )}
      style={{
        backgroundImage: hovered
          ? `radial-gradient(280px circle at ${pos.x}% ${pos.y}%, rgba(${glowColor},0.12), transparent 70%)`
          : undefined,
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(160px circle at ${pos.x}% ${pos.y}%, rgba(${glowColor},0.35), transparent 70%)`,
          WebkitMaskImage:
            "linear-gradient(#fff, #fff) content-box, linear-gradient(#fff, #fff)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: 1,
        }}
      />
      {children}
    </div>
  );
}
