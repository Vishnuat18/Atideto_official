import { useEffect, useRef } from 'react';

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimizes rendering
    if (!ctx) return;

    let animId: number;
    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;

    const resize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mouse interaction with smooth interpolation
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Ribbon layer configurations
    const layers = [
      { color: [0, 93, 255], zOffset: 0, speed: 0.001, count: 25 },     // Deep Blue
      { color: [139, 92, 246], zOffset: 80, speed: 0.0015, count: 25 },   // Violet
      { color: [46, 168, 255], zOffset: 160, speed: 0.0008, count: 25 },  // Electric Cyan
      { color: [255, 46, 168], zOffset: 240, speed: 0.0012, count: 15 },  // Magenta Accent
    ];

    const particlesPerStrand = 180;
    let time = 0;

    // Pseudo 3D Noise for organic curl motion
    const noise3D = (x: number, y: number, z: number) => {
      const n1 = Math.sin(x * 0.002 + z * 0.0015);
      const n2 = Math.sin(x * 0.006 + y * 0.004 - z * 0.003) * 0.5;
      const n3 = Math.cos(x * 0.012 + y * 0.008 - z * 0.005) * 0.25;
      return n1 + n2 + n3;
    };

    const draw = () => {
      // Smoothly interpolate mouse position for fluid ripples
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Dark premium background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Use screen composite mode to make overlapping particles glow brightly
      ctx.globalCompositeOperation = 'screen';
      time += 1;

      // Draw mathematical particle ribbons
      layers.forEach((layer, layerIdx) => {
        for (let s = 0; s < layer.count; s++) {
          const strandOffset = s * 8;
          const zBase = layer.zOffset + strandOffset;
          const tF = time * layer.speed * 100;

          for (let i = 0; i < particlesPerStrand; i++) {
            const t = i / (particlesPerStrand - 1);
            const rawX = (t - 0.15) * width * 1.3; // Expand slightly past screen edges

            // Base organic wave position
            const n = noise3D(rawX, strandOffset, tF);
            let rawY = height / 2 + n * 250;

            // Interactive mouse ripples (localized Gaussian bump based on distance to mouse)
            const distToMouseX = rawX - mouse.x;
            const mouseRipple = Math.exp(-(distToMouseX * distToMouseX) / 60000) * (mouse.y - height / 2) * 0.8;
            rawY += mouseRipple;

            // Additional curl/twist for the ribbon strands
            const twist = Math.sin(t * Math.PI * 8 + time * layer.speed * 40 + s * 0.15) * 35;
            rawY += twist;

            // Simple 3D depth projection
            const fov = 450;
            const z = zBase + Math.sin(time * 0.015 + s * 0.2) * 100 + 150;
            const scale = fov / (fov + z);
            
            const projX = width / 2 + (rawX - width / 2) * scale;
            const projY = height / 2 + (rawY - height / 2) * scale + (layerIdx * 10);

            // Compute particle opacity with edge fading and depth fading
            const edgeFade = Math.sin(t * Math.PI); 
            const depthFade = Math.max(0, 1 - (z - 150) / 400);
            const alpha = edgeFade * depthFade * 0.6;

            if (alpha > 0.01) {
              const size = Math.max(0.5, 2.5 * scale);
              ctx.fillStyle = `rgba(${layer.color[0]}, ${layer.color[1]}, ${layer.color[2]}, ${alpha})`;
              ctx.fillRect(projX, projY, size, size);
            }
          }
        }
      });

      // Reset composite for next frame grid drawing
      ctx.globalCompositeOperation = 'source-over';
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}
