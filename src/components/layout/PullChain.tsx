import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import PullChainRope from './pull-chain/PullChainRope';
import PullChainHandle from './pull-chain/PullChainHandle';
import PullMenu from './pull-chain/PullMenu';
import BackgroundBlur from './pull-chain/BackgroundBlur';

export default function PullChain() {
  const [isOpen, setIsOpen] = useState(false);
  const [pullAmount, setPullAmount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  const dragStartY = useRef(0);
  const animFrameRef = useRef<number>(0);
  const springFrameRef = useRef<number>(0);
  const location = useLocation();

  // Determine current page theme
  const getThemeFromPath = (path: string) => {
    if (path === '/') return 'home';
    if (path.startsWith('/services')) return 'services';
    if (path.startsWith('/academy')) return 'academy';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/client-connect')) return 'client-connect';
    return 'home';
  };

  const theme = getThemeFromPath(location.pathname);

  // Gentle idle sway — smooth sine wave
  useEffect(() => {
    const startTime = Date.now();

    const animateSway = () => {
      if (!isDragging) {
        const time = (Date.now() - startTime) / 1000;
        const amplitude = isOpen ? 0.8 : 3;
        setRotation(Math.sin(time * 1.5) * amplitude);
      } else {
        setRotation(0);
      }
      animFrameRef.current = requestAnimationFrame(animateSway);
    };

    animateSway();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isDragging, isOpen]);

  // Handle drag mechanics
  const handleStart = useCallback((clientY: number) => {
    setIsDragging(true);
    dragStartY.current = clientY - pullAmount;
  }, [pullAmount]);

  const handleMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const deltaY = clientY - dragStartY.current;
    setPullAmount(Math.max(0, Math.min(200, deltaY)));
  }, [isDragging]);

  // Smooth spring return with higher quality physics
  const springReturn = useCallback(() => {
    cancelAnimationFrame(springFrameRef.current);
    
    let current = pullAmount;
    let velocity = 0;
    const stiffness = 120;
    const damping = 16;
    const mass = 1;
    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.032); // cap at ~30fps minimum
      lastTime = now;

      const force = -stiffness * current;
      const dampForce = -damping * velocity;
      const acceleration = (force + dampForce) / mass;
      velocity += acceleration * dt;
      current += velocity * dt;

      if (Math.abs(current) < 0.3 && Math.abs(velocity) < 0.3) {
        setPullAmount(0);
        return;
      }

      setPullAmount(current);
      springFrameRef.current = requestAnimationFrame(step);
    };

    springFrameRef.current = requestAnimationFrame(step);
  }, [pullAmount]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsOpen(prev => !prev);

    // Soft click sound
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(500, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {
      // AudioContext browser policy
    }

    springReturn();
  }, [isDragging, springReturn]);

  // Click outside to close
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (isOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.pull-chain-container')) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, [isOpen]);

  // Subtle scroll swing
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScrollSwing = () => {
      setRotation(prev => prev + (Math.random() > 0.5 ? 1.5 : -1.5));
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setRotation(0), 200);
    };

    window.addEventListener('scroll', handleScrollSwing, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScrollSwing);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Document-level drag listeners using PointerEvents
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => handleMove(e.clientY);
    const onPointerUp = () => handleEnd();

    if (isDragging) {
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    }

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, [isDragging, handleMove, handleEnd]);

  return (
    <div className="pull-chain-container fixed top-0 right-0 z-50 h-screen pointer-events-none lg:hidden">
      {/* Background Dim & Blur Overlay */}
      <BackgroundBlur isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Container holding the menu and the chain in a column */}
      <div className="fixed top-0 right-4 z-50 pointer-events-none flex flex-col items-end w-72">
        {/* The Menu (slides down smoothly) */}
        <motion.div
          className="w-full pointer-events-auto origin-top"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 28, 
            mass: 0.8 
          }}
          style={{ overflow: 'hidden' }}
        >
          <PullMenu isOpen={isOpen} onClose={() => setIsOpen(false)} theme={theme} />
        </motion.div>

        {/* The Interactive Pull Chain */}
        <div 
          className="pointer-events-auto flex flex-col items-center mr-6 cursor-grab active:cursor-grabbing"
          style={{ 
            width: '44px', 
            transformOrigin: 'top center',
            transform: `translateY(${pullAmount}px) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            touchAction: 'none'
          }}
          onPointerDown={(e) => {
            e.preventDefault();
            handleStart(e.clientY);
          }}
        >
          {/* Thin Rope */}
          <PullChainRope pullAmount={pullAmount} />

          {/* Atideto Logo Handle */}
          <PullChainHandle isDragging={isDragging} />
        </div>
      </div>
    </div>
  );
}
