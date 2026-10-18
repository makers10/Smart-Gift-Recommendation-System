import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function AmbientBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const orbs = [
      { x: width * 0.2, y: height * 0.25, r: 240, dx: 0.35, dy: 0.25, color: "rgba(254, 205, 211, 0.45)" },
      { x: width * 0.75, y: height * 0.3, r: 280, dx: -0.25, dy: 0.3, color: "rgba(254, 240, 138, 0.32)" },
      { x: width * 0.45, y: height * 0.65, r: 320, dx: 0.2, dy: -0.3, color: "rgba(253, 164, 175, 0.25)" },
      { x: width * 0.85, y: height * 0.75, r: 220, dx: -0.3, dy: -0.2, color: "rgba(251, 191, 36, 0.22)" },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      orbs.forEach((orb) => {
        orb.x += orb.dx;
        orb.y += orb.dy;
        if (orb.x < -100 || orb.x > width + 100) orb.dx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.dy *= -1;

        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(1, "rgba(250, 245, 239, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ivory-100" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-70 filter blur-3xl" />
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-rose-200/40 via-pink-100/30 to-amber-100/20 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -45, 30, 0],
          y: [0, 40, -25, 0],
          scale: [1, 0.92, 1.06, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 -right-20 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-amber-200/30 via-rose-100/35 to-rose-200/20 blur-3xl"
      />
      <div className="absolute inset-0 bg-[radial-gradient(#881337_0.75px,transparent_0.75px)] opacity-[0.035] [background-size:24px_24px]" />
    </div>
  );
}

export default AmbientBackground;
