import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PullChainRope from './pull-chain/PullChainRope';
import PullChainHandle from './pull-chain/PullChainHandle';
import PullMenu from './pull-chain/PullMenu';
import BackgroundBlur from './pull-chain/BackgroundBlur';

export default function PullChain() {
  const [isOpen, setIsOpen] = useState(false);
  const [pullAmount, setPullAmount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swayX, setSwayX] = useState(0);
  const [rotation, setRotation] = useState(0);
  
  const dragStartY = useRef(0);
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
    let startTime = Date.now();

    const animateSway = () => {
      if (!isDragging) {
        const time = (Date.now() - startTime) / 1000;
        // Sway decay if menu is open or recently released
        const amplitude = isOpen ? 1 : 3.5;
        const currentSway = Math.sin(time * 2) * amplitude;
        setSwayX(currentSway);
        setRotation(currentSway * 1.5);
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
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;
    const deltaY = clientY - dragStartY.current;
    // Constrain pull distance between 0 and 250px
    const constrainedY = Math.max(0, Math.min(250, deltaY));
    setPullAmount(constrainedY);
    
    // Rotate slightly during pulling
    setRotation(constrainedY * 0.08);

    // Dynamic sway response to drag speed/direction
    setSwayX((constrainedY * 0.05));
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // If pulled more than 130px, toggle the menu
    if (pullAmount > 130) {
      setIsOpen((prev) => !prev);
      // Play soft click sound if supported
      try {
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

      if (dt > 0.1) return; // Ignore tab suspension jumps

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

  // Keyboard navigation & Mouse outside click listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (isOpen) {
        // If clicking outside menu container or handle
        const target = e.target as HTMLElement;
        if (!target.closest('.pull-chain-container') && !target.closest('[style*="100px"]')) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, [isOpen]);

  // Scroll swing listener
  useEffect(() => {
    let scrollTimeout: any;
    const handleScrollSwing = () => {
      // Cause a temporary extra swing when scrolling
      setSwayX((prev) => prev + (Math.random() > 0.5 ? 4 : -4));
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setSwayX(0);
      }, 150);
    };

    window.addEventListener('scroll', handleScrollSwing);
    return () => {
      window.removeEventListener('scroll', handleScrollSwing);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Listeners for document mousemove/mouseup to continue dragging outside component
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
    <div className="pull-chain-container fixed top-0 right-0 z-50 h-screen pointer-events-none">
      {/* Background Dim & Blur Overlay */}
      <BackgroundBlur isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Interactive pull-chain group */}
      <div 
        className="absolute top-0 pointer-events-auto"
        style={{ right: 0, width: '140px', height: '400px' }}
        onMouseDown={(e) => handleStart(e.clientY)}
        onTouchStart={(e) => e.touches[0] && handleStart(e.touches[0].clientY)}
      >
        {/* SVG Hanging Rope */}
        <PullChainRope theme={theme} pullAmount={pullAmount} swayX={swayX} />

        {/* ATIDETO Logo Handle */}
        <PullChainHandle
          theme={theme}
          isDragging={isDragging}
          pullAmount={pullAmount}
          rotation={rotation}
        />
      </div>

      {/* Floating Menu Dropdown */}
      <div className="pointer-events-auto">
        <PullMenu isOpen={isOpen} onClose={() => setIsOpen(false)} theme={theme} />
      </div>
    </div>
  );
}
