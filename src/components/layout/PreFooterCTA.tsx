import { useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const count = 5000;
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
        size={0.06}
        color="#2EA8FF"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function PreFooterCTA() {
  const navigate = useNavigate();
  const location = useLocation();
  
  if (location.pathname === '/about') {
    return null;
  }

  return (
    <div className="w-full bg-[#050505] pt-12 pb-12">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="relative rounded-[24px] overflow-hidden border border-[#005DFF]/20 bg-[#020617] shadow-[0_0_40px_rgba(0,93,255,0.08)]">
          
          {/* ThreeJS Background Canvas */}
          <div className="absolute inset-0 w-full h-full pointer-events-none opacity-90">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
              <fog attach="fog" args={['#020617', 5, 20]} />
              <ParticleField />
            </Canvas>
          </div>
          
          {/* Glow Effects */}
          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-[#005DFF]/20 to-transparent blur-[80px] pointer-events-none" />
          <div className="absolute right-0 bottom-0 w-1/3 h-full bg-gradient-to-l from-[#2EA8FF]/10 to-transparent blur-[60px] pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10 px-8 py-12 md:py-14 md:px-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* Left Text */}
            <div className="flex-1 max-w-md text-center lg:text-left">
              <h2 className="text-3xl md:text-[34px] font-bold text-white leading-tight" >
                Ready to Start Your <br className="hidden md:block" /> Next Big Project?
              </h2>
            </div>
            
            {/* Middle Text */}
            <div className="flex-1 max-w-sm text-center lg:text-left">
              <p className="text-[#8e9bb0] text-[15px] leading-relaxed">
                Let's work together to build something amazing and create digital experiences that make a difference.
              </p>
            </div>
            
            {/* Right Button */}
            <div className="shrink-0">
              <button 
                onClick={() => navigate('/client-connect')}
                className="bg-gradient-to-r from-[#0047FF] to-[#0066FF] hover:from-[#005DFF] hover:to-[#2EA8FF] text-white px-8 py-4 rounded-md font-semibold text-[13px] tracking-wider transition-all duration-300 flex items-center gap-2 group shadow-[0_0_20px_rgba(0,93,255,0.3)] hover:shadow-[0_0_30px_rgba(46,168,255,0.5)] uppercase"
              >
                Let's discuss your project 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform ml-1" />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
