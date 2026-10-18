import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import confetti from "canvas-confetti";
import { RotateCcw } from "lucide-react";

/**
 * HeroGiftScene — Luxury 3D Champagne Dream Gift Experience.
 *
 * Features:
 * 1. Rich Burgundy satin box with true hollow interior cavity.
 * 2. Champagne-gold satin ribbon & sculpted 4-loop bow with tails.
 * 3. Warm golden interior light source that illuminates inner cavity upon opening.
 * 4. Signature 5-Phase automatic opening sequence on initial load (~5.5 seconds).
 * 5. Interactive cursor parallax & hover highlight.
 * 6. "Replay the magic" trigger & click-to-replay handling.
 * 7. Respects prefers-reduced-motion preferences.
 */
export default function HeroGiftScene({ onBoxClick }) {
  const mountRef = useRef(null);
  const [animPhase, setAnimPhase] = useState("playing"); // 'playing' | 'opened'
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const restartAnimRef = useRef(null);

  // Check reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReducedMotion(true);
      setAnimPhase("opened");
    }
    const handler = (e) => {
      setReducedMotion(e.matches);
      if (e.matches) setAnimPhase("opened");
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── 1. Scene & Camera ──────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    // Initial camera position for Phase 1
    camera.position.set(0, 1.1, 6.8);

    // ── 2. WebGL Renderer with High-End Tone Mapping ───────────────
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── 3. Luxury Studio Lighting ──────────────────────────────────
    // Ambient fill with deep burgundy-black undertones
    const ambientLight = new THREE.AmbientLight(0x2a1a24, 1.8);
    scene.add(ambientLight);

    // Key Light: Warm Champagne Ivory from top-right
    const keyLight = new THREE.DirectionalLight(0xfff5e4, 3.2);
    keyLight.position.set(3.5, 5.0, 4.0);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill Light: Soft Champagne Gold from top-left
    const fillLight = new THREE.DirectionalLight(0xd6b675, 1.6);
    fillLight.position.set(-4.0, 3.0, 2.5);
    scene.add(fillLight);

    // Rim Light: Deep Burgundy / Rose from behind to sculpt the silhouette
    const rimLight = new THREE.DirectionalLight(0x882a4a, 2.8);
    rimLight.position.set(0, 3.0, -4.5);
    scene.add(rimLight);

    // Studio Spotlight Backdrop Glow (Canvas Radial Texture on Plane)
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = 512;
    bgCanvas.height = 512;
    const ctx = bgCanvas.getContext("2d");
    const radGrad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
    radGrad.addColorStop(0, "rgba(245, 221, 160, 0.28)");
    radGrad.addColorStop(0.35, "rgba(214, 182, 117, 0.12)");
    radGrad.addColorStop(0.7, "rgba(90, 36, 56, 0.08)");
    radGrad.addColorStop(1, "rgba(16, 13, 18, 0)");
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 512, 512);

    const bgTexture = new THREE.CanvasTexture(bgCanvas);
    const bgPlaneGeo = new THREE.PlaneGeometry(9.0, 9.0);
    const bgPlaneMat = new THREE.MeshBasicMaterial({
      map: bgTexture,
      transparent: true,
      depthWrite: false,
    });
    const bgPlane = new THREE.Mesh(bgPlaneGeo, bgPlaneMat);
    bgPlane.position.set(0, 0, -2.0);
    scene.add(bgPlane);

    // ── 4. Luxury Materials ────────────────────────────────────────
    // Deep Burgundy Satin Velvet for Box Body & Outer Lid
    const boxMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x421223), // Rich deep burgundy
      metalness: 0.15,
      roughness: 0.35,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      reflectivity: 0.5,
    });

    // Box Interior Velvet Lining (Slightly deeper burgundy)
    const interiorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x280814),
      roughness: 0.85,
      metalness: 0.05,
    });

    // Champagne Gold Satin Ribbon Material
    const ribbonMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd6b675),
      emissive: new THREE.Color(0x524020),
      emissiveIntensity: 0.25,
      metalness: 0.82,
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
    });

    // Highlight Gold Material for Bow Highlights & Trim
    const bowMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf5dda0),
      emissive: new THREE.Color(0x735522),
      emissiveIntensity: 0.35,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
    });

    // ── 5. Main 3D Gift Box Hierarchy ──────────────────────────────
    const giftGroup = new THREE.Group();
    scene.add(giftGroup);

    const boxWidth = 2.0;
    const boxHeight = 1.6;
    const boxDepth = 2.0;
    const wallThick = 0.07;

    // ── Constructing Hollow Box Base with True Inner Cavity ──
    const baseGroup = new THREE.Group();
    giftGroup.add(baseGroup);

    // Floor of box
    const floorGeo = new THREE.BoxGeometry(boxWidth, wallThick, boxDepth);
    const floorMesh = new THREE.Mesh(floorGeo, boxMat);
    floorMesh.position.y = -boxHeight / 2 + wallThick / 2;
    baseGroup.add(floorMesh);

    // Inner velvet cushion pad on floor
    const cushionGeo = new THREE.BoxGeometry(boxWidth - 0.15, 0.06, boxDepth - 0.15);
    const cushionMesh = new THREE.Mesh(cushionGeo, interiorMat);
    cushionMesh.position.y = floorMesh.position.y + 0.05;
    baseGroup.add(cushionMesh);

    // Front Wall
    const frontWall = new THREE.Mesh(
      new THREE.BoxGeometry(boxWidth, boxHeight, wallThick),
      boxMat
    );
    frontWall.position.set(0, 0, boxDepth / 2 - wallThick / 2);
    baseGroup.add(frontWall);

    // Back Wall
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(boxWidth, boxHeight, wallThick),
      boxMat
    );
    backWall.position.set(0, 0, -boxDepth / 2 + wallThick / 2);
    baseGroup.add(backWall);

    // Left Wall
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThick, boxHeight, boxDepth - wallThick * 2),
      boxMat
    );
    leftWall.position.set(-boxWidth / 2 + wallThick / 2, 0, 0);
    baseGroup.add(leftWall);

    // Right Wall
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThick, boxHeight, boxDepth - wallThick * 2),
      boxMat
    );
    rightWall.position.set(boxWidth / 2 - wallThick / 2, 0, 0);
    baseGroup.add(rightWall);

    // Base Ribbon Band — Vertical (front, bottom, back)
    const baseRibbonV = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, boxHeight + 0.02, boxDepth + 0.02),
      ribbonMat
    );
    baseGroup.add(baseRibbonV);

    // Base Ribbon Band — Horizontal (left, bottom, right)
    const baseRibbonH = new THREE.Mesh(
      new THREE.BoxGeometry(boxWidth + 0.02, boxHeight + 0.02, 0.32),
      ribbonMat
    );
    baseGroup.add(baseRibbonH);

    // ── 6. Warm Golden Interior Light Source ───────────────────────
    // Emerges from the inside cavity
    const interiorLight = new THREE.PointLight(0xf5dda0, 0.2, 7.0, 1.8);
    interiorLight.position.set(0, -0.1, 0);
    baseGroup.add(interiorLight);

    // Glowing Inner Orb / Core
    const innerOrbGeo = new THREE.SphereGeometry(0.24, 24, 24);
    const innerOrbMat = new THREE.MeshStandardMaterial({
      color: 0xf5dda0,
      emissive: 0xd6b675,
      emissiveIntensity: 1.2,
      roughness: 0.2,
    });
    const innerOrb = new THREE.Mesh(innerOrbGeo, innerOrbMat);
    innerOrb.position.set(0, -0.15, 0);
    baseGroup.add(innerOrb);

    // ── 7. Realistic Box Lid with Pivot Near Rear Edge ─────────────
    // Pivot positioned at the top back edge so the lid rotates naturally
    const lidPivot = new THREE.Group();
    // Top-rear edge: y = boxHeight / 2, z = -boxDepth / 2
    lidPivot.position.set(0, boxHeight / 2, -boxDepth / 2);
    giftGroup.add(lidPivot);

    // Child group that offsets the lid relative to the pivot
    const lidContent = new THREE.Group();
    lidContent.position.set(0, 0, boxDepth / 2);
    lidPivot.add(lidContent);

    // Lid Top Plate
    const lidTopGeo = new THREE.BoxGeometry(boxWidth + 0.12, 0.08, boxDepth + 0.12);
    const lidTopMesh = new THREE.Mesh(lidTopGeo, boxMat);
    lidTopMesh.position.y = 0.04;
    lidContent.add(lidTopMesh);

    // Lid Lips (the 4 descending edges that slip over the box base)
    const lipThick = 0.05;
    const lipHeight = 0.30;
    const lipGeoX = new THREE.BoxGeometry(boxWidth + 0.12, lipHeight, lipThick);
    const lipGeoZ = new THREE.BoxGeometry(lipThick, lipHeight, boxDepth + 0.12);

    const lipFront = new THREE.Mesh(lipGeoX, boxMat);
    lipFront.position.set(0, -lipHeight / 2 + 0.04, boxDepth / 2 + 0.06 - lipThick / 2);
    lidContent.add(lipFront);

    const lipBack = new THREE.Mesh(lipGeoX, boxMat);
    lipBack.position.set(0, -lipHeight / 2 + 0.04, -boxDepth / 2 - 0.06 + lipThick / 2);
    lidContent.add(lipBack);

    const lipLeft = new THREE.Mesh(lipGeoZ, boxMat);
    lipLeft.position.set(-boxWidth / 2 - 0.06 + lipThick / 2, -lipHeight / 2 + 0.04, 0);
    lidContent.add(lipLeft);

    const lipRight = new THREE.Mesh(lipGeoZ, boxMat);
    lipRight.position.set(boxWidth / 2 + 0.06 - lipThick / 2, -lipHeight / 2 + 0.04, 0);
    lidContent.add(lipRight);

    // Lid Ribbon Bands (Moves with lid!)
    const lidRibbonV = new THREE.Mesh(
      new THREE.BoxGeometry(0.33, 0.09, boxDepth + 0.14),
      ribbonMat
    );
    lidRibbonV.position.y = 0.04;
    lidContent.add(lidRibbonV);

    const lidRibbonH = new THREE.Mesh(
      new THREE.BoxGeometry(boxWidth + 0.14, 0.09, 0.33),
      ribbonMat
    );
    lidRibbonH.position.y = 0.04;
    lidContent.add(lidRibbonH);

    // ── Sophisticated Ribbon Bow with 4 Curved Loops & Tails ──
    const bowGroup = new THREE.Group();
    bowGroup.position.set(0, 0.1, 0);
    lidContent.add(bowGroup);

    // Center Knot
    const knotGeo = new THREE.SphereGeometry(0.14, 18, 18);
    const knotMesh = new THREE.Mesh(knotGeo, bowMat);
    knotMesh.scale.set(1.1, 0.8, 1.1);
    bowGroup.add(knotMesh);

    // 4 Curved Satin Ribbon Loops
    const loopGeo = new THREE.TorusGeometry(0.28, 0.075, 16, 36, Math.PI * 1.85);

    const loop1 = new THREE.Mesh(loopGeo, bowMat);
    loop1.position.set(-0.24, 0.16, -0.22);
    loop1.rotation.set(0.6, 0.7, -0.3);
    bowGroup.add(loop1);

    const loop2 = new THREE.Mesh(loopGeo, bowMat);
    loop2.position.set(0.24, 0.16, 0.22);
    loop2.rotation.set(-0.6, -0.7, 0.3);
    bowGroup.add(loop2);

    const loop3 = new THREE.Mesh(loopGeo, bowMat);
    loop3.position.set(0.22, 0.16, -0.24);
    loop3.rotation.set(0.6, -0.7, 0.3);
    bowGroup.add(loop3);

    const loop4 = new THREE.Mesh(loopGeo, bowMat);
    loop4.position.set(-0.22, 0.16, 0.24);
    loop4.rotation.set(-0.6, 0.7, -0.3);
    bowGroup.add(loop4);

    // Flowing Ribbon Tails draped across the lid
    const tailGeo = new THREE.CylinderGeometry(0.06, 0.14, 0.65, 12);
    tailGeo.scale(1, 1, 0.2); // flatten into ribbon strip

    const tail1 = new THREE.Mesh(tailGeo, ribbonMat);
    tail1.position.set(-0.32, 0.02, 0.34);
    tail1.rotation.set(1.4, 0.3, -0.8);
    bowGroup.add(tail1);

    const tail2 = new THREE.Mesh(tailGeo, ribbonMat);
    tail2.position.set(0.34, 0.02, -0.3);
    tail2.rotation.set(-1.3, -0.4, 0.7);
    bowGroup.add(tail2);

    // ── 8. Golden Dust & Rising Magical Sparkles ───────────────────
    // Ambient Drifting Golden Dust
    const ambientCount = 85;
    const ambientGeo = new THREE.BufferGeometry();
    const ambPos = new Float32Array(ambientCount * 3);
    const ambScales = new Float32Array(ambientCount);

    for (let i = 0; i < ambientCount; i++) {
      ambPos[i * 3] = (Math.random() - 0.5) * 8.0;
      ambPos[i * 3 + 1] = (Math.random() - 0.5) * 5.0 + 0.5;
      ambPos[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
      ambScales[i] = Math.random() * 0.04 + 0.02;
    }
    ambientGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));

    const goldParticleMat = new THREE.PointsMaterial({
      color: 0xf5dda0,
      size: 0.055,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const ambientParticles = new THREE.Points(ambientGeo, goldParticleMat);
    scene.add(ambientParticles);

    // Magical Rising Sparkles Erupting from Box
    const burstCount = 60;
    const burstGeo = new THREE.BufferGeometry();
    const burstPos = new Float32Array(burstCount * 3);
    const burstVel = [];

    for (let i = 0; i < burstCount; i++) {
      burstPos[i * 3] = (Math.random() - 0.5) * 0.7;
      burstPos[i * 3 + 1] = -0.2;
      burstPos[i * 3 + 2] = (Math.random() - 0.5) * 0.7;

      burstVel.push({
        x: (Math.random() - 0.5) * 0.015,
        y: Math.random() * 0.025 + 0.015,
        z: (Math.random() - 0.5) * 0.015,
        life: 0,
      });
    }
    burstGeo.setAttribute("position", new THREE.BufferAttribute(burstPos, 3));

    const burstMat = new THREE.PointsMaterial({
      color: 0xfff0c4,
      size: 0.075,
      transparent: true,
      opacity: 0.0,
      blending: THREE.AdditiveBlending,
    });
    const burstParticles = new THREE.Points(burstGeo, burstMat);
    giftGroup.add(burstParticles);

    // ── 9. Interactive Mouse Tracking & Raycaster ──────────────────
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      mouse.targetX = x * 0.45;
      mouse.targetY = y * 0.35;

      mouseCoord.x = x;
      mouseCoord.y = y;

      raycaster.setFromCamera(mouseCoord, camera);
      const intersects = raycaster.intersectObjects([
        floorMesh,
        frontWall,
        lidTopMesh,
        knotMesh,
      ]);
      setIsHovered(intersects.length > 0);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // ── 10. Click Interaction to Replay or Trigger ─────────────────
    let animTime = 0;
    let isOpeningComplete = false;
    let burstActive = false;
    let burstTriggered = false;

    const startOpeningSequence = () => {
      animTime = 0;
      isOpeningComplete = false;
      burstActive = false;
      burstTriggered = false;
      burstMat.opacity = 0;

      // Reset positions to closed state
      lidPivot.rotation.x = 0;
      lidPivot.position.y = boxHeight / 2;
      interiorLight.intensity = 0.2;
      setAnimPhase("playing");
    };

    restartAnimRef.current = startOpeningSequence;

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
      const intersects = raycaster.intersectObjects([
        floorMesh,
        frontWall,
        leftWall,
        rightWall,
        lidTopMesh,
        knotMesh,
      ]);

      if (intersects.length > 0) {
        if (isOpeningComplete) {
          // Replay sequence gracefully
          startOpeningSequence();
        }

        // Soft champagne golden confetti
        confetti({
          particleCount: 55,
          spread: 70,
          origin: {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          },
          colors: ["#D6B675", "#F5DDA0", "#5A2438", "#FFF7E9"],
        });

        if (onBoxClick) onBoxClick();
      }
    };

    window.addEventListener("click", handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // ── 11. 5-Phase Cinematic Animation Loop ───────────────────────
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Mouse smoothing
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Ambient golden dust floating
      ambientParticles.rotation.y = elapsedTime * 0.03;
      ambientParticles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.08;

      // Handle Reduced Motion immediately
      if (reducedMotion) {
        lidPivot.rotation.x = -1.25; // beautifully open
        lidPivot.position.y = boxHeight / 2 + 0.12;
        interiorLight.intensity = 4.5;
        isOpeningComplete = true;
      } else {
        animTime += delta;

        // ═════ PHASE 1: The Mysterious Arrival (0.0s – 1.4s) ═════
        if (animTime < 1.4) {
          const t = animTime / 1.4;
          const easeOut = 1 - Math.pow(1 - t, 3);
          giftGroup.rotation.y = -0.8 + easeOut * 0.55;
          giftGroup.rotation.x = 0.25 - easeOut * 0.1;
          camera.position.z = 7.2 - easeOut * 0.5;
          interiorLight.intensity = 0.2 + easeOut * 0.4;
          lidPivot.rotation.x = 0;
        }
        // ═════ PHASE 2: The Anticipation (1.4s – 2.2s) ═══════════
        else if (animTime < 2.2) {
          const t = (animTime - 1.4) / 0.8;
          // Subtle breath / golden light peek through narrow gap
          const peekGap = Math.sin(t * Math.PI) * 0.06;
          lidPivot.position.y = boxHeight / 2 + peekGap;
          lidPivot.rotation.x = -peekGap * 0.4;
          interiorLight.intensity = 0.6 + t * 0.8;
          giftGroup.rotation.y = -0.25 + t * 0.05;
        }
        // ═════ PHASE 3: The Gift Opens (2.2s – 3.8s) ═════════════
        else if (animTime < 3.8) {
          const t = (animTime - 2.2) / 1.6;
          // Smooth luxury cubic ease-out for realistic lid lift & rear tilt
          const openEase = 1 - Math.pow(1 - t, 3.5);

          // Lid smoothly separates and rotates around rear pivot
          lidPivot.rotation.x = -openEase * 1.25; // ~72 degrees open
          lidPivot.position.y = boxHeight / 2 + openEase * 0.15;

          // Warm golden light bursts forth, illuminating cavity and lid underside
          interiorLight.intensity = 1.4 + openEase * 5.2;

          // Slight camera push-in
          camera.position.z = 6.7 - openEase * 0.25;
          giftGroup.rotation.y = -0.2 + openEase * 0.35;

          if (!burstTriggered && t > 0.4) {
            burstTriggered = true;
            burstActive = true;
          }
        }
        // ═════ PHASE 4: The Magical Reveal (3.8s – 5.0s) ═════════
        else if (animTime < 5.0) {
          const t = (animTime - 3.8) / 1.2;
          lidPivot.rotation.x = -1.25 - Math.sin(t * Math.PI) * 0.04; // subtle settling spring
          interiorLight.intensity = 6.6 - t * 1.8; // settles gently from peak to ambient luxury glow
          burstMat.opacity = Math.max(0, 0.95 - t * 0.8);
        }
        // ═════ PHASE 5: The Final Hero State (5.0s+) ═════════════
        else {
          lidPivot.rotation.x = -1.25;
          interiorLight.intensity = 4.8 + Math.sin(elapsedTime * 2.5) * 0.3; // warm pulsating interior breath
          burstMat.opacity = 0;
          if (!isOpeningComplete) {
            isOpeningComplete = true;
            setAnimPhase("opened");
          }
        }

        // Animate rising particles if active
        if (burstActive) {
          const positions = burstGeo.attributes.position.array;
          for (let i = 0; i < burstCount; i++) {
            positions[i * 3] += burstVel[i].x;
            positions[i * 3 + 1] += burstVel[i].y;
            positions[i * 3 + 2] += burstVel[i].z;
            burstVel[i].y += 0.0003; // slight upward drift acceleration
          }
          burstGeo.attributes.position.needsUpdate = true;
        }
      }

      // Base Floating levitation in opened state
      const hoverY = isHovered ? 0.22 : 0;
      giftGroup.position.y = Math.sin(elapsedTime * 1.3) * 0.08 + hoverY;

      // Mouse Parallax & Gentle continuous sway
      const baseRotY = isOpeningComplete ? 0.15 : giftGroup.rotation.y;
      giftGroup.rotation.y = baseRotY + Math.sin(elapsedTime * 0.6) * 0.06 + mouse.x * 0.6;
      giftGroup.rotation.x = 0.15 + Math.sin(elapsedTime * 0.8) * 0.03 - mouse.y * 0.35;

      // Camera responds softly to mouse parallax
      camera.position.x = mouse.x * 0.4;
      camera.position.y = 1.1 + mouse.y * 0.25;
      camera.lookAt(0, 0.1, 0);

      // Inner orb breathing pulse
      innerOrb.scale.setScalar(1.0 + Math.sin(elapsedTime * 3) * 0.08);

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
      bgPlaneGeo.dispose();
      bgPlaneMat.dispose();
      bgTexture.dispose();
      boxMat.dispose();
      interiorMat.dispose();
      ribbonMat.dispose();
      bowMat.dispose();
      floorGeo.dispose();
      cushionGeo.dispose();
      innerOrbGeo.dispose();
      innerOrbMat.dispose();
      ambientGeo.dispose();
      goldParticleMat.dispose();
      burstGeo.dispose();
      burstMat.dispose();
    };
  }, [reducedMotion, onBoxClick]);

  const handleReplay = (e) => {
    e.stopPropagation();
    if (restartAnimRef.current) {
      restartAnimRef.current();
    }
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[680px] flex items-center justify-center select-none">
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-pointer"
        title="Discover the Champagne Dream gift box — click to interact"
      />

      {/* Floating Status & Replay Control */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto">
        <div className="px-4 py-2 rounded-full bg-luxury-secondary/85 border border-luxury-border/80 backdrop-blur-md shadow-champagne-sm flex items-center gap-2.5 transition-all duration-300">
          <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
          <span className="text-xs font-serif tracking-widest uppercase text-champagne-light">
            {animPhase === "playing"
              ? "Unwrapping Gift..."
              : "✦ Champagne Dream Revealed ✦"}
          </span>
        </div>

        {/* Replay Magic Button */}
        <button
          onClick={handleReplay}
          className="group px-3 py-2 rounded-full bg-luxury-elevated/90 hover:bg-luxury-burgundy border border-luxury-border hover:border-champagne/60 text-champagne hover:text-champagne-light backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 text-xs font-sans shadow-md cursor-pointer"
          title="Replay the gift opening animation"
          aria-label="Replay the gift opening animation"
        >
          <RotateCcw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:-rotate-180" />
          <span className="hidden sm:inline text-[11px] font-medium tracking-wide">
            Replay
          </span>
        </button>
      </div>
    </div>
  );
}
