"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
}

/**
 * SpotlightCard — 21st.dev style interactive card.
 * Tracks mouse position to cast a warm radial spotlight onto the card surface,
 * with optional subtle 3D gyroscope tilt physics.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className,
  spotlightColor = "rgba(136, 19, 55, 0.08)",
  enableTilt = false,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Spotlight coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 3D tilt motion values
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const springTiltX = useSpring(tiltX, { stiffness: 260, damping: 25 });
  const springTiltY = useSpring(tiltY, { stiffness: 260, damping: 25 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
      const rotateY = ((x - centerX) / centerX) * 6;
      tiltX.set(rotateX);
      tiltY.set(rotateY);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (enableTilt) {
      tiltX.set(0);
      tiltY.set(0);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        enableTilt
          ? {
              transformStyle: "preserve-3d",
              rotateX: springTiltX,
              rotateY: springTiltY,
            }
          : undefined
      }
      className={cn(
        "relative overflow-hidden rounded-2xl border border-rose-950/10 bg-white/80 p-6 backdrop-blur-md transition-all duration-300",
        "shadow-[0_4px_20px_-4px_rgba(136,19,55,0.06)] hover:shadow-[0_12px_32px_-6px_rgba(136,19,55,0.14)] hover:border-burgundy-700/20",
        className
      )}
      {...(props as any)}
    >
      {/* Dynamic Cursor-following Spotlight layer */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(400px circle at ${x}px ${y}px, ${spotlightColor}, transparent 80%)`
          ),
        }}
      />

      {/* Subtle top edge ambient reflection */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default SpotlightCard;
