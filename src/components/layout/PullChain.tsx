import React, { useState, useEffect, useRef } from 'react';
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
  const clickStartAmount = useRef(0);
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

  // Sway physics when idle
  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();

    const animateSway = () => {
      if (!isDragging) {
        const time = (Date.now() - startTime) / 1000;
        const amplitude = isOpen ? 1 : 5; // degrees of rotation
        const currentRotation = Math.sin(time * 2) * amplitude;
        setRotation(currentRotation);
      } else {
        // While dragging, let the chain hang straight down towards the mouse
        setRotation(0);
      }
      animationFrameId = requestAnimationFrame(animateSway);
    };

    animateSway();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging, isOpen]);

  // Handle drag mechanics
  const handleStart = (clientY: number) => {
    setIsDragging(true);
    dragStartY.current = clientY - pullAmount;
    clickStartAmount.current = pullAmount;
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;
    const deltaY = clientY - dragStartY.current;
    const constrainedY = Math.max(0, Math.min(250, deltaY));
    setPullAmount(constrainedY);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // If dragged more than 130px OR it was just a click (moved less than 5px)
    if (pullAmount > 130 || Math.abs(pullAmount - clickStartAmount.current) < 5) {
      setIsOpen((prev) => !prev);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
        // AudioContext browser policy
      }
    }

    // Spring return animation
    let current = pullAmount;
    const target = 0;
    let velocity = 0;
    const stiffness = 180;
    const damping = 12;
    let lastTime = performance.now();

    const springStep = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (dt > 0.1) return;

      const force = -stiffness * (current - target);
      const acceleration = force - damping * velocity;
      velocity += acceleration * dt;
      current += velocity * dt;

      setPullAmount(current);

      if (Math.abs(current - target) < 0.1 && Math.abs(velocity) < 0.1) {
        setPullAmount(0);
      } else {
        requestAnimationFrame(springStep);
      }
    };

    requestAnimationFrame(springStep);
  };

  // Click outside to close
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (isOpen) {
        const target = e.target as HTMLElement;
        if (!target.closest('.pull-chain-container') && !target.closest('[style*="100px"]')) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, [isOpen]);

  // Scroll swing
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScrollSwing = () => {
      // Cause a temporary extra swing when scrolling
      setRotation((prev) => prev + (Math.random() > 0.5 ? 2 : -2));
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setRotation(0);
      }, 150);
    };

    window.addEventListener('scroll', handleScrollSwing);
    return () => {
      window.removeEventListener('scroll', handleScrollSwing);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Document-level drag listeners
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const onMouseUp = () => handleEnd();
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientY);
    };
    const onTouchEnd = () => handleEnd();

    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchmove', onTouchMove);
      document.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, pullAmount]);

  return (
    <div className="pull-chain-container fixed top-0 right-0 z-50 h-screen pointer-events-none lg:hidden">
      {/* Background Dim & Blur Overlay */}
      <BackgroundBlur isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Container holding the menu and the chain in a column */}
      <div className="fixed top-0 right-4 z-50 pointer-events-none flex flex-col items-end w-72">
        {/* The Menu (slides up/down by changing height) */}
        <motion.div
          className="w-full pointer-events-auto origin-top"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0.9,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{ overflow: 'hidden' }}
        >
          <PullMenu isOpen={isOpen} onClose={() => setIsOpen(false)} theme={theme} />
        </motion.div>

        {/* The Interactive Pull Chain */}
        <div 
          className="pointer-events-auto flex flex-col items-center mr-6"
          style={{ 
            width: '60px', 
            transformOrigin: 'top center',
            transform: `translateY(${isOpen ? 0 : pullAmount}px) rotate(${rotation}deg)`
          }}
          onMouseDown={(e) => handleStart(e.clientY)}
          onTouchStart={(e) => e.touches[0] && handleStart(e.touches[0].clientY)}
        >
          {/* Straight Rope */}
          <PullChainRope pullAmount={isOpen ? 0 : pullAmount} />

          {/* ATIDETO Logo Handle */}
          <PullChainHandle isDragging={isDragging} />
        </div>
      </div>
    </div>
  );
}
