import { useEffect, useRef } from 'react';

export default function HorizonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = canvas.parentElement?.clientWidth || window.innerWidth;
    let height = canvas.parentElement?.clientHeight || 600;

    const resize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || 600;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    // Landscape setup
    const rows = 40;
    const cols = 60;
    const spacing = 45;
    let time = 0;

    interface Particle {
      x: number;
      y: number;
      speed: number;
      size: number;
      alpha: number;
    }
    const shootingParticles: Particle[] = [];
    const floatingParticles: Particle[] = [];
    
    for (let i = 0; i < 60; i++) {
       floatingParticles.push({
         x: Math.random() * width,
         y: Math.random() * (height * 0.6), // Upper sky
         speed: 0.05 + Math.random() * 0.15,
         size: Math.random() * 1.5,
         alpha: Math.random() * 0.6 + 0.1
       });
    }

    const draw = () => {
      time += 0.015;

      // Background gradient (Deep dark futuristic sky)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#010105');
      bgGrad.addColorStop(0.4, '#04081c');
      bgGrad.addColorStop(1, '#010105');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'screen';

      // Draw Stars / Floating glowing particles
      ctx.fillStyle = '#6ab8ff';
      for (let p of floatingParticles) {
        p.x -= p.speed;
        if (p.x < 0) {
           p.x = width;
           p.y = Math.random() * (height * 0.6);
        }
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Shooting particles (meteors / data streams)
      if (Math.random() < 0.015) {
        shootingParticles.push({
          x: width + 100,
          y: Math.random() * (height * 0.4),
          speed: 6 + Math.random() * 12,
          size: 1 + Math.random() * 1.5,
          alpha: 1
        });
      }

      for (let i = shootingParticles.length - 1; i >= 0; i--) {
        const sp = shootingParticles[i];
        sp.x -= sp.speed;
        sp.y += sp.speed * 0.2; // Slight downward trajectory
        sp.alpha -= 0.005;
        
        ctx.beginPath();
        ctx.moveTo(sp.x, sp.y);
        ctx.lineTo(sp.x + sp.speed * 4, sp.y - sp.speed * 0.8);
        ctx.strokeStyle = `rgba(150, 210, 255, ${sp.alpha})`;
        ctx.lineWidth = sp.size;
        ctx.stroke();

        if (sp.alpha <= 0 || sp.x < -100) {
          shootingParticles.splice(i, 1);
        }
      }

      // Procedural Wireframe Mountains
      const horizonY = height * 0.55;
      const fov = 450;
      const cameraY = -80;
      const cameraZ = -200;
      
      const travel = time * 45;
      const zOffset = travel % spacing;
      const startRow = Math.floor(travel / spacing);

      const projected: {x: number, y: number, z: number, alpha: number}[][] = [];
      
      for (let r = 0; r < rows; r++) {
        const row = [];
        const absoluteRow = startRow + r;
        const worldZ = absoluteRow * spacing;
        
        for (let c = 0; c < cols; c++) {
          const x = c * spacing - (cols * spacing) / 2;
          const viewZ = (r * spacing) - zOffset;
          
          // Mountain height noise
          const mtnNoise = Math.sin(x * 0.004) * Math.cos(worldZ * 0.003) * 280;
          const fineNoise = Math.sin(x * 0.02 + worldZ * 0.02) * 35;
          let y = Math.max(0, mtnNoise + fineNoise - 70);
          
          // Valley path in the center
          const dist = Math.abs(x);
          if (dist < 400) {
             y *= Math.max(0, (dist - 150) / 250); 
          }
          
          // Project 3D to 2D
          const zProjected = viewZ - cameraZ;
          const scale = fov / (fov + zProjected);
          const px = width / 2 + x * scale;
          const py = horizonY + (-y - cameraY) * scale;
          
          // Fade out based on distance
          const alpha = Math.max(0, 1 - (viewZ / (rows * spacing)));
          
          row.push({x: px, y: py, z: zProjected, alpha});
        }
        projected.push(row);
      }
      
      // Render holographic grids
      ctx.lineWidth = 1;
      
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
           const p1 = projected[r][c];
           const p2 = projected[r][c+1];
           const p3 = projected[r+1][c];
           
           if (p1.z < 10) continue; // Behind camera
           
           ctx.beginPath();
           ctx.moveTo(p1.x, p1.y);
           ctx.lineTo(p2.x, p2.y);
           ctx.moveTo(p1.x, p1.y);
           ctx.lineTo(p3.x, p3.y);
           
           ctx.strokeStyle = `rgba(0, 140, 255, ${p1.alpha * 0.3})`;
           ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = 'source-over';

      // Soft moving fog (gradient layer over the horizon)
      const fogGrad = ctx.createLinearGradient(0, horizonY - 120, 0, horizonY + 200);
      fogGrad.addColorStop(0, 'rgba(2, 2, 8, 0)');
      fogGrad.addColorStop(0.3, 'rgba(5, 15, 40, 0.7)'); 
      fogGrad.addColorStop(0.5, 'rgba(1, 4, 15, 0.9)'); 
      fogGrad.addColorStop(1, 'rgba(2, 2, 8, 0)');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, horizonY - 120, width, 320);
      
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" style={{ pointerEvents: 'none' }} />;
}
