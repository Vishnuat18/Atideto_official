import { useEffect, useRef } from 'react';

export default function CrystallineGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || window.innerHeight;
    
    // Grid Setup
    const rows = 40;
    const cols = 60;
    const spacing = 60;
    
    interface GridNode {
      x: number;
      y: number;
      z: number;
    }
    
    const nodes: GridNode[][] = [];
    
    const initGrid = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      nodes.length = 0;
      for (let r = 0; r < rows; r++) {
        const rowNodes: GridNode[] = [];
        for (let c = 0; c < cols; c++) {
          rowNodes.push({
            x: c * spacing - (cols * spacing) / 2,
            y: 0,
            z: r * spacing - (rows * spacing) / 2});
        }
        nodes.push(rowNodes);
      }
    };
    
    initGrid();
    window.addEventListener('resize', initGrid);

    let explosions: { x: number, z: number, time: number, maxTime: number, power: number }[] = [];
    let travelingParticles: { r: number, c: number, targetR: number, targetC: number, progress: number, speed: number }[] = [];
    // Hover interaction disabled per user request
    // let lastMouse = { x: 0, y: 0 };
    // const handleMouseMove = (e: MouseEvent) => { ... };
    // window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const draw = () => {
      time += 0.025;
      
      // Deep space / dark liquid glass background
      ctx.fillStyle = '#030308';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'screen';
      
      // Manage explosions
      for (let i = explosions.length - 1; i >= 0; i--) {
        explosions[i].time += 2;
        if (explosions[i].time > explosions[i].maxTime) {
          explosions.splice(i, 1);
        }
      }
      
      // Manage traveling particles
      if (Math.random() > 0.4 && travelingParticles.length < 50) {
        const startR = Math.floor(Math.random() * (rows - 1));
        const startC = Math.floor(Math.random() * (cols - 1));
        travelingParticles.push({
          r: startR, c: startC,
          targetR: Math.random() > 0.5 ? startR + 1 : startR,
          targetC: Math.random() > 0.5 ? startC : startC + 1,
          progress: 0,
          speed: 0.04 + Math.random() * 0.04
        });
      }
      
      for (let i = travelingParticles.length - 1; i >= 0; i--) {
        travelingParticles[i].progress += travelingParticles[i].speed;
        if (travelingParticles[i].progress >= 1) {
          travelingParticles.splice(i, 1);
        }
      }

      // Camera and Projection
      const fov = 700;
      const viewerZ = -1400;
      const cameraY = -400;
      const cameraAngle = 0.38; // Tilting down
      const cosA = Math.cos(cameraAngle);
      const sinA = Math.sin(cameraAngle);

      const projectedNodes: { x: number, y: number, z: number, scale: number, rawY: number }[][] = [];
      
      for (let r = 0; r < rows; r++) {
        const pRow = [];
        for (let c = 0; c < cols; c++) {
          const node = nodes[r][c];
          
          // Liquid glass sine waves traveling across the surface
          const wave1 = Math.sin(node.x * 0.005 + time) * 40;
          const wave2 = Math.cos(node.z * 0.008 - time * 1.2) * 30;
          const wave3 = Math.sin((node.x + node.z) * 0.01 + time * 1.5) * 20;
          let currentY = wave1 + wave2 + wave3;

          // Apply interactive explosions
          for (let e of explosions) {
            const dist = Math.sqrt((node.x - e.x) ** 2 + (node.z - e.z) ** 2);
            const rippleDist = e.time * 20;
            const diff = Math.abs(dist - rippleDist);
            if (diff < 200) {
              const effect = Math.sin(diff * 0.05) * (1 - e.time / e.maxTime) * e.power * Math.exp(-dist * 0.001);
              currentY -= effect; // Ripples push the grid up (negative Y)
            }
          }
          
          // 3D rotation
          const y1 = currentY - cameraY;
          const z1 = node.z - viewerZ;
          
          const rotY = y1 * cosA - z1 * sinA;
          const rotZ = y1 * sinA + z1 * cosA;
          
          const scale = fov / (fov + rotZ);
          const px = width / 2 + node.x * scale;
          const py = height / 2 + rotY * scale;
          
          pRow.push({ x: px, y: py, z: rotZ, scale, rawY: currentY });
        }
        projectedNodes.push(pRow);
      }
      
      // Draw Grid Lines (Crystalline structure)
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = projectedNodes[r][c];
          if (p.z < 10) continue; // Behind camera
          
          // Draw connecting lines
          if (c < cols - 1) {
            const pRight = projectedNodes[r][c + 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pRight.x, pRight.y);
          }
          if (r < rows - 1) {
            const pDown = projectedNodes[r + 1][c];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pDown.x, pDown.y);
          }
          // Diagonal for crystalline look
          if (c < cols - 1 && r < rows - 1) {
            const pDiag = projectedNodes[r + 1][c + 1];
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pDiag.x, pDiag.y);
          }
        }
      }
      // Single stroke for massive performance boost
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(0, 93, 255, 0.05)');
      grad.addColorStop(0.5, 'rgba(46, 168, 255, 0.25)');
      grad.addColorStop(1, 'rgba(0, 20, 50, 0.05)');
      ctx.strokeStyle = grad;
      ctx.stroke();
      
      // Draw Grid Intersections (glowing blue light)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = projectedNodes[r][c];
          if (p.z < 10) continue;
          
          const depthAlpha = Math.max(0, 1 - p.z / 3000);
          const heightGlow = Math.max(0, -p.rawY / 150); // Glow more when pushed up by waves/explosions
          
          ctx.fillStyle = `rgba(46, 168, 255, ${(0.3 + heightGlow) * depthAlpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, (1 + heightGlow * 2) * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      

      // Draw glowing ripple circles (explosions)
      for (let e of explosions) {
        const radius = e.time * 20;
        const alpha = Math.max(0, 1 - e.time / e.maxTime);
        const scale = fov / (fov + (e.z - viewerZ));
        
        const px = width / 2 + e.x * scale;
        const py = height / 2 + (-cameraY) * scale;
        
        ctx.beginPath();
        // Approximate oval projection
        ctx.ellipse(px, py, radius * scale, radius * scale * 0.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(95, 212, 255, ${alpha * 0.6})`;
        ctx.lineWidth = 2 * scale;
        ctx.stroke();
        
        // Secondary inner ripple
        ctx.beginPath();
        ctx.ellipse(px, py, radius * scale * 0.8, radius * scale * 0.4, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 93, 255, ${alpha * 0.4})`;
        ctx.stroke();
      }
      
      // Draw traveling particles (neon travel lines)
      for (let tp of travelingParticles) {
        const p1 = projectedNodes[tp.r][tp.c];
        const p2 = projectedNodes[tp.targetR][tp.targetC];
        
        const px = p1.x + (p2.x - p1.x) * tp.progress;
        const py = p1.y + (p2.y - p1.y) * tp.progress;
        const pScale = p1.scale + (p2.scale - p1.scale) * tp.progress;
        
        const depthAlpha = Math.max(0, 1 - p1.z / 3000);
        
        ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha})`;
        ctx.shadowColor = '#5FD4FF';
        ctx.shadowBlur = 15 * pScale;
        ctx.beginPath();
        ctx.arc(px, py, 2.5 * pScale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
      
      ctx.globalCompositeOperation = 'source-over';
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', initGrid);
      // window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // pointer-events-auto removed since hover is disabled
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />;
}
