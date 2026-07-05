"use client";
import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HoverGlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // rgba string
}

export function HoverGlowCard({
  children,
  className,
  glowColor = "rgba(47,217,196,0.18)", // teal, matches brand accent
}: HoverGlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x, y });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-[#14161C]/80 backdrop-blur-sm transition-colors duration-300",
        "hover:border-teal-400/30",
        className
      )}
      style={{
        backgroundImage: hovered
          ? `radial-gradient(320px circle at ${pos.x}% ${pos.y}%, ${glowColor}, transparent 65%)`
          : undefined,
      }}
    >
      {/* animated border shimmer on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(200px circle at ${pos.x}% ${pos.y}%, rgba(47,217,196,0.35), transparent 70%)`,
          maskImage: "linear-gradient(#000, #000)",
          WebkitMaskImage: "linear-gradient(#000, #000)",
          padding: 1,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}