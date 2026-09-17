import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function EnergyLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const particleCount = 3000;
  
  const { positions, speeds, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 6); // 2 points per line segment
    const spd = new Float32Array(particleCount);
    const col = new Float32Array(particleCount * 6); // RGB per vertex
    
    const colorPalette = [
      new THREE.Color('#3B82F6'), // Blue
      new THREE.Color('#00C6FF'), // Cyan
      new THREE.Color('#8B5CF6'), // Purple
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Start positions (-30 to 30)
      const x = (Math.random() - 0.5) * 60;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 40;
      
      const idx = i * 6;
      pos[idx] = x;
      pos[idx + 1] = y;
      pos[idx + 2] = z;
      
      // End point of the line segment (flowing diagonally up/right/forward)
      const length = Math.random() * 3 + 1.0;
      pos[idx + 3] = x + length;
      pos[idx + 4] = y + length * 0.6; 
      pos[idx + 5] = z + length * 0.3;
      
      spd[i] = Math.random() * 0.08 + 0.02;
      
      // Color
      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[idx] = c.r; col[idx+1] = c.g; col[idx+2] = c.b;
      // Head of the line is brighter/same color
      col[idx+3] = c.r; col[idx+4] = c.g; col[idx+5] = c.b;
    }
    
    return { positions: pos, speeds: spd, colors: col };
  }, []);

  useFrame(() => {
    if (!linesRef.current) return;
    const pos = linesRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 6;
      
      // Flow logic
      const speed = speeds[i];
      pos[idx] += speed;
      pos[idx + 1] += speed * 0.6;
      pos[idx + 2] += speed * 0.3;
      
      pos[idx + 3] += speed;
      pos[idx + 4] += speed * 0.6;
      pos[idx + 5] += speed * 0.3;
      
      // Reset if out of bounds (top/right/front)
      if (pos[idx] > 30 || pos[idx + 1] > 30 || pos[idx + 2] > 20) {
        const x = -30;
        const y = (Math.random() - 0.5) * 60 - 10;
        const z = (Math.random() - 0.5) * 40 - 10;
        const length = Math.random() * 3 + 1.0;
        
        pos[idx] = x;
        pos[idx + 1] = y;
        pos[idx + 2] = z;
        
        pos[idx + 3] = x + length;
        pos[idx + 4] = y + length * 0.6;
        pos[idx + 5] = z + length * 0.3;
      }
    }
    
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particleCount * 2} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={particleCount * 2} 
          array={colors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <lineBasicMaterial 
        vertexColors 
        transparent 
        opacity={0.4} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

export default function DigitalEnergyBackground() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none bg-[#020202]">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }} gl={{ antialias: false, alpha: false }}>
        {/* Very subtle ambient fog */}
        <fog attach="fog" args={['#020202', 10, 40]} />
        <EnergyLines />
      </Canvas>
      {/* Gradient Overlay for seamless integration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505] z-10 pointer-events-none" />
    </div>
  );
}
