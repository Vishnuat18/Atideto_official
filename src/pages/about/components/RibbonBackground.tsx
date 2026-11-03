import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Ribbon = ({ color, offset, positionY }: { color: THREE.Color, offset: number, positionY: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: color },
      uOffset: { value: offset }
    }),
    [color, offset]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.3;
    }
    if (meshRef.current) {
      // Gentle floating motion
      meshRef.current.position.y = positionY + Math.sin(state.clock.elapsedTime * 0.5 + offset) * 1.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2 + offset) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, positionY, -5]}>
      {/* A long strip to act as a ribbon */}
      <planeGeometry args={[50, 4, 150, 32]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform float uOffset;
          varying vec2 vUv;
          varying float vElevation;

          // Simple 3D noise approximation
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
          float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute( permute( permute(
                      i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
          }

          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Generate flowing noise based on position and time
            float noiseFreq = 0.08;
            float noiseAmp = 4.0;
            vec3 noisePos = vec3(pos.x * noiseFreq + uTime + uOffset, pos.y * noiseFreq, pos.z * noiseFreq);
            float n = snoise(noisePos);
            
            // Twist the ribbon along the X axis
            float twist = snoise(vec3(pos.x * 0.03 - uTime * 0.5, uOffset, 0.0)) * 3.0;
            float s = sin(twist);
            float c = cos(twist);
            float y = pos.y * c - pos.z * s;
            float z = pos.y * s + pos.z * c;
            
            pos.y = y + n * noiseAmp;
            pos.z = z + n * noiseAmp;
            
            vElevation = n;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            // Edge glow effect: Bright edges, transparent center
            float edge = smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
            float alpha = (1.0 - edge) * 0.8 + 0.1; 
            
            // Mix color with elevation for a dynamic flowing gradient
            vec3 color = mix(uColor * 0.5, uColor * 2.0, vElevation * 0.5 + 0.5);
            
            // Fade out at the extreme left and right edges of the plane
            float fadeX = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
            
            gl_FragColor = vec4(color, alpha * fadeX * 0.4);
          }
        `}
      />
    </mesh>
  );
};

export default function RibbonBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#040608]">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <fog attach="fog" args={['#040608', 5, 30]} />
        
        {/* Render multiple ribbons with different colors and offsets */}
        <Ribbon color={new THREE.Color('#3B82F6')} offset={0} positionY={2} />
        <Ribbon color={new THREE.Color('#00C6FF')} offset={100} positionY={-1} />
        <Ribbon color={new THREE.Color('#60A5FA')} offset={200} positionY={-4} />
      </Canvas>
      {/* Dark vignette to blend with the page */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#040608] via-transparent to-[#040608] z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040608] via-transparent to-[#040608] z-10" />
    </div>
  );
}
