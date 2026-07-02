import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function ThreeBackground() {
  const group = useRef<THREE.Group>(null);
  const fogRef = useRef<THREE.FogExp2>(null);

  // Mouse parallax state
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    // Smooth mouse interpolation
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, (state.mouse.x * Math.PI) / 10, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, (state.mouse.y * Math.PI) / 10, 0.05);
    
    if (group.current) {
      group.current.rotation.x = -mouse.current.y * 0.5;
      group.current.rotation.y = mouse.current.x * 0.5;
    }
  });

  return (
    <>
      <color attach="background" args={['#040608']} />
      <fogExp2 ref={fogRef} attach="fog" args={['#040608', 0.03]} />

      <group ref={group}>
        {/* Subtle Stars */}
        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
        
        {/* Digital Dust / Particles */}
        <Sparkles count={500} scale={20} size={2} speed={0.4} opacity={0.4} color="#60A5FA" />
        <Sparkles count={300} scale={30} size={1} speed={0.2} opacity={0.2} color="#00C6FF" />

        {/* Ambient volumetric glowing spheres */}
        <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
          <Sphere args={[2, 64, 64]} position={[-8, 4, -10]}>
            <MeshDistortMaterial 
              color="#3B82F6" 
              emissive="#3B82F6" 
              emissiveIntensity={2} 
              distort={0.4} 
              speed={2} 
              transparent 
              opacity={0.15} 
            />
          </Sphere>
        </Float>

        <Float speed={2} rotationIntensity={2} floatIntensity={3}>
          <Sphere args={[3, 64, 64]} position={[10, -5, -15]}>
            <MeshDistortMaterial 
              color="#00C6FF" 
              emissive="#00C6FF" 
              emissiveIntensity={1} 
              distort={0.6} 
              speed={1.5} 
              transparent 
              opacity={0.1} 
            />
          </Sphere>
        </Float>
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.5} color="#00C6FF" />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#3B82F6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60A5FA" />
    </>
  );
}
