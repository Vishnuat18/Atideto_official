import { useRef, useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';

function ParticleField() {
  const count = 1200;
  const points = useRef<THREE.Points>(null);

  // Initialize particles in a wide flowing cylinder
  const [positions, initialPositions, randoms] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const init = new Float32Array(count * 3);
    const rand = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.random() * 8; // Radius of cylinder
      const x = (Math.random() - 0.5) * 50; // Spread horizontally

      pos[i * 3] = x;
      pos[i * 3 + 1] = Math.sin(theta) * r;
      pos[i * 3 + 2] = Math.cos(theta) * r;

      init[i * 3] = pos[i * 3];
      init[i * 3 + 1] = pos[i * 3 + 1];
      init[i * 3 + 2] = pos[i * 3 + 2];

      rand[i] = Math.random();
    }
    return [pos, init, rand];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.elapsedTime * 0.8;
    const positionsAttr = points.current.geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      let x = initialPositions[i * 3];
      let y = initialPositions[i * 3 + 1];
      let z = initialPositions[i * 3 + 2];

      // Complex mathematical wave displacement
      const waveX = Math.sin(time + y * 0.5 + z * 0.2) * 2;
      const waveY = Math.cos(time + x * 0.2 + z * 0.1) * 1.5;
      const waveZ = Math.sin(time + x * 0.3 + y * 0.2) * 2;

      // Fast continuous flow towards the right
      const speed = 2 + randoms[i] * 4;
      let currentX = x + waveX + (time * speed) % 50;

      // Wrap around seamlessly
      if (currentX > 25) currentX -= 50;
      if (currentX < -25) currentX += 50;

      positionsAttr.setXYZ(i, currentX, y + waveY, z + waveZ);
    }
    positionsAttr.needsUpdate = true;

    // Slow drift of the entire system
    points.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    points.current.rotation.y = Math.cos(time * 0.1) * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={new Float32Array(positions)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#2F2FE4"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}

export default function PreFooterCTA() {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reduceMotion = useReducedMotion();

  // Mount the Three.js scene only once the CTA scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setInView(true);
      },
      { rootMargin: '240px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (location.pathname === '/login' || location.pathname === '/dashboard' || location.pathname === '/profile' || location.pathname === '/client-connect') {
    return null;
  }

  // Removed /about check to show CTA on About page

  return (
    <div id="pre-footer-cta" className="w-full bg-transparent pt-12 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div ref={containerRef} className="relative rounded-[24px] overflow-hidden border border-border bg-card shadow-card">

          {/* ThreeJS Background Canvas */}
          {inView && !reduceMotion && (
            <div className="absolute inset-0 w-full h-full pointer-events-none opacity-90">
              <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 1.5]}>
                <fog attach="fog" args={['#FFFFFF', 6, 18]} />
                <ParticleField />
              </Canvas>
            </div>
          )}

          {/* Glow Effects */}
          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-primary/10 to-transparent blur-[80px] pointer-events-none" />
          <div className="absolute right-0 bottom-0 w-1/3 h-full bg-gradient-to-l from-primary-400/10 to-transparent blur-[60px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 px-8 py-12 md:py-14 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-10">

            {/* Left Text */}
            <div className="flex-1 max-w-md text-center lg:text-left">
              <h2 className="text-3xl md:text-[34px] font-bold text-foreground leading-tight">
                Ready to Start Your <br className="hidden md:block" /> Next Big Project?
              </h2>
            </div>

            {/* Middle Text */}
            <div className="flex-1 max-w-sm text-center lg:text-left">
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Let's work together to build something amazing and create digital experiences that make a difference.
              </p>
            </div>

            {/* Right Button */}
            <div className="shrink-0">
              <Button
                variant="accent"
                size="lg"
                onClick={() => navigate('/client-connect')}
                className="group rounded-xl px-8 text-[13px] uppercase tracking-wider"
              >
                Let's discuss your project
                <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
