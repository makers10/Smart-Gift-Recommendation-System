import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(190, 18, 60, 0.12)",
  enableTilt = false,
  ...props
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const springTiltX = useSpring(tiltX, { stiffness: 260, damping: 25 });
  const springTiltY = useSpring(tiltY, { stiffness: 260, damping: 25 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      tiltX.set(rotateX);
      tiltY.set(rotateY);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
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
      className={`relative overflow-hidden rounded-2xl border border-rose-200/80 bg-white/90 p-6 backdrop-blur-md transition-all duration-300
        shadow-[0_4px_20px_-4px_rgba(136,19,55,0.06)] hover:shadow-[0_16px_36px_-6px_rgba(136,19,55,0.14)] hover:border-burgundy-400/40 ${className}`}
      {...props}
    >
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
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export default SpotlightCard;
