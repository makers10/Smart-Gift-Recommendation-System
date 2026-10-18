import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import confetti from "canvas-confetti";

/**
 * HeroGiftScene — Real-time interactive WebGL 3D Gift Universe.
 * Powered by Three.js with mouse parallax, floating geometric gift sculpture,
 * dynamic glowing core, orbital rings, and click-to-open interaction.
 */
export default function HeroGiftScene({ onBoxClick }) {
  const mountRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── 1. Scene & Camera ──────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 7.5);

    // ── 2. WebGL Renderer ──────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ── 3. Atmospheric Lights ──────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0e1738, 2.5);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 8, 20);
    cyanLight.position.set(-4, 3, 4);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0xa855f7, 9, 20);
    violetLight.position.set(4, -2, 3);
    scene.add(violetLight);

    const goldKeyLight = new THREE.DirectionalLight(0xffdf88, 3.5);
    goldKeyLight.position.set(2, 5, 5);
    scene.add(goldKeyLight);

    // ── 4. Main 3D Gift Group ──────────────────────────────────────
    const giftGroup = new THREE.Group();
    scene.add(giftGroup);

    // Box Base Geometry & Material (Luxury Dark Cyber Metallic)
    const boxSize = 2.0;
    const boxGeo = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
    const boxMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0a1026),
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
    });
    const boxMesh = new THREE.Mesh(boxGeo, boxMat);
    boxMesh.position.y = -0.2;
    giftGroup.add(boxMesh);

    // Box Edge Bevel Wireframe Glow
    const wireGeo = new THREE.EdgesGeometry(boxGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    wireMesh.position.copy(boxMesh.position);
    giftGroup.add(wireMesh);

    // Ribbon Material (Luminous Rose / Gold Metallic)
    const ribbonMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf43f5e),
      emissive: new THREE.Color(0x881337),
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 1.0,
    });

    // Vertical Ribbon Band
    const ribbonV = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, boxSize + 0.04, boxSize + 0.04),
      ribbonMat
    );
    ribbonV.position.copy(boxMesh.position);
    giftGroup.add(ribbonV);

    // Horizontal Ribbon Band
    const ribbonH = new THREE.Mesh(
      new THREE.BoxGeometry(boxSize + 0.04, boxSize + 0.04, 0.38),
      ribbonMat
    );
    ribbonH.position.copy(boxMesh.position);
    giftGroup.add(ribbonH);

    // ── 5. Box Lid (Animated Pivot) ────────────────────────────────
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, boxSize / 2 - 0.2, 0);

    const lidGeo = new THREE.BoxGeometry(boxSize + 0.12, 0.35, boxSize + 0.12);
    const lidMesh = new THREE.Mesh(lidGeo, boxMat);
    lidGroup.add(lidMesh);

    const lidRibbonV = new THREE.Mesh(
      new THREE.BoxGeometry(0.39, 0.37, boxSize + 0.14),
      ribbonMat
    );
    lidGroup.add(lidRibbonV);

    const lidRibbonH = new THREE.Mesh(
      new THREE.BoxGeometry(boxSize + 0.14, 0.37, 0.39),
      ribbonMat
    );
    lidGroup.add(lidRibbonH);

    // Sculptural Ribbon Bow on Lid Top
    const bowGeo = new THREE.TorusGeometry(0.35, 0.12, 16, 40);
    const bowMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf59e0b),
      emissive: new THREE.Color(0xd97706),
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });

    const bowLeft = new THREE.Mesh(bowGeo, bowMat);
    bowLeft.position.set(-0.25, 0.32, 0);
    bowLeft.rotation.set(0.6, 0.8, -0.4);
    lidGroup.add(bowLeft);

    const bowRight = new THREE.Mesh(bowGeo, bowMat);
    bowRight.position.set(0.25, 0.32, 0);
    bowRight.rotation.set(-0.6, -0.8, 0.4);
    lidGroup.add(bowRight);

    giftGroup.add(lidGroup);

    // ── 6. Glowing Cosmic Core Inside the Box ──────────────────────
    const coreGeo = new THREE.IcosahedronGeometry(0.48, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 2.2,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 0.1, 0);
    giftGroup.add(coreMesh);

    const coreLight = new THREE.PointLight(0x00f2fe, 4, 6);
    coreLight.position.set(0, 0.2, 0);
    giftGroup.add(coreLight);

    // ── 7. Floating Orbital Gyroscope Rings ────────────────────────
    const ringGeo1 = new THREE.TorusGeometry(1.85, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    giftGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.1, 0.018, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    giftGroup.add(ring2);

    // ── 8. Starfield Particle Galaxy ───────────────────────────────
    const particleCount = 420;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorChoices = [
      new THREE.Color(0x00f2fe), // cyan
      new THREE.Color(0xa855f7), // violet
      new THREE.Color(0xf43f5e), // rose
      new THREE.Color(0xf59e0b), // amber
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.5 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // ── 9. Interactive Mouse Parallax & Raycasting ─────────────────
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouse.targetX = x * 0.7;
      mouse.targetY = y * 0.5;

      mouseCoord.x = x;
      mouseCoord.y = y;

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObjects([boxMesh, lidMesh]);
      setIsHovered(intersects.length > 0);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // ── 10. Click to Open / Burst Interaction ──────────────────────
    const handleClick = (e) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      )
        return;

      mouseCoord.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObjects([boxMesh, lidMesh, bowLeft, bowRight]);

      if (intersects.length > 0) {
        setIsOpen((prev) => !prev);

        // Confetti burst on interaction
        confetti({
          particleCount: 70,
          spread: 80,
          origin: {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          },
          colors: ["#00F2FE", "#8B5CF6", "#FF007A", "#F59E0B"],
        });

        if (onBoxClick) onBoxClick();
      }
    };

    window.addEventListener("click", handleClick);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // ── 11. Render Animation Loop ──────────────────────────────────
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Base Floating levitation
      const hoverYOffset = isHovered ? 0.35 : 0;
      giftGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.15 + hoverYOffset;

      // Gentle continuous rotation + mouse parallax tilt
      giftGroup.rotation.y = elapsedTime * 0.28 + mouse.x * 0.7;
      giftGroup.rotation.x = Math.sin(elapsedTime * 0.8) * 0.08 - mouse.y * 0.5;

      // Gyroscope Ring rotations
      ring1.rotation.z = elapsedTime * 0.45;
      ring2.rotation.z = -elapsedTime * 0.35;

      // Core rotation & pulsing glow
      coreMesh.rotation.y = elapsedTime * 1.5;
      coreMesh.rotation.x = elapsedTime * 0.9;
      coreMesh.scale.setScalar(1 + Math.sin(elapsedTime * 4) * 0.12);

      // Starfield slow drift
      particlePoints.rotation.y = elapsedTime * 0.04;
      particlePoints.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;

      // Lid Open / Close smooth lerp
      const targetLidAngle = isOpen ? -1.1 : isHovered ? -0.22 : 0;
      const targetLidY = (boxSize / 2 - 0.2) + (isOpen ? 0.6 : isHovered ? 0.15 : 0);
      lidGroup.rotation.x += (targetLidAngle - lidGroup.rotation.x) * 0.08;
      lidGroup.position.y += (targetLidY - lidGroup.position.y) * 0.08;

      camera.position.x = mouse.x * 0.5;
      camera.position.y = 1.2 + mouse.y * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      boxGeo.dispose();
      boxMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ribbonMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [isOpen, isHovered, onBoxClick]);

  return (
    <div className="relative w-full h-[480px] sm:h-[580px] lg:h-[650px] flex items-center justify-center">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-pointer select-none"
        title="Click the 3D gift box to discover"
      />

      {/* Floating 3D Interaction Badge */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-midnight-900/80 border border-cyber-cyan/40 backdrop-blur-md shadow-neon-cyan flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
        <span className="text-xs font-mono tracking-widest uppercase text-cyan-300">
          {isOpen ? "✦ Giftverse Unlocked ✦" : "Hover & Click 3D Box to Unlock"}
        </span>
      </div>
    </div>
  );
}
