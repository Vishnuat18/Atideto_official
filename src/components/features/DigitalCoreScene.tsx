import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

const CARD_POSITIONS_3D = [
  { x: -3.61, y: 2.27, z: 0 },
  { x: 0, y: 2.59, z: 0 },
  { x: 3.61, y: 1.35, z: 0 },
  { x: -3.78, y: -0.27, z: 0 },
  { x: -1.89, y: -2.43, z: 0 },
  { x: 3.44, y: -2.05, z: 0 },
];

const DARK_SCENE = {
  ambient: '#4466ff',
  primary: '#2F7DFF',
  bright: '#00BFFF',
  soft: '#53A8FF',
  accent: '#7CCBFF',
  hemiGround: '#071326',
  fog: '#050505',
  particleOpacity: 0.6,
  additive: true,
};

const LIGHT_SCENE = {
  ambient: '#6366F1',
  primary: '#4F46E5',
  bright: '#6366F1',
  soft: '#818CF8',
  accent: '#2F2FE4',
  hemiGround: '#E0E7FF',
  fog: '#F8FAFC',
  particleOpacity: 0.5,
  additive: false,
};

function useScenePalette() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? DARK_SCENE : LIGHT_SCENE;
}

// ── Scene Lighting ──
function SceneLighting() {
  const P = useScenePalette();
  return (
    <>
      <ambientLight intensity={0.3} color={P.ambient} />
      <directionalLight position={[5, 8, 6]} intensity={1.2} color={P.primary} />
      <directionalLight position={[-5, -3, 4]} intensity={0.5} color={P.bright} />
      <pointLight position={[0, 3, 2]} intensity={0.8} color={P.soft} distance={10} decay={2} />
      <pointLight position={[3, -2, 1]} intensity={0.4} color={P.bright} distance={8} decay={2} />
      <pointLight position={[-3, 1, 3]} intensity={0.4} color={P.primary} distance={8} decay={2} />
      <hemisphereLight args={[P.primary, P.hemiGround, 0.3]} />
    </>
  );
}

// ── Logo floating text with metallic crystal core ──
function LogoCore({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const floatOffset = useRef(Math.random() * Math.PI * 2);
  const P = useScenePalette();

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Smooth sine float
    groupRef.current.position.y = Math.sin(t * 0.5 + floatOffset.current) * 0.15;

    // Slow Y rotation
    groupRef.current.rotation.y = t * 0.15;

    // Mouse tilt
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -mouseY * 0.15,
      0.03
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      mouseX * 0.1,
      0.03
    );

    if (coreRef.current) {
      coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;
      coreRef.current.rotation.z = Math.cos(t * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Crystal core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshPhysicalMaterial
          color={P.primary}
          metalness={0.9}
          roughness={0.1}
          emissive={P.bright}
          emissiveIntensity={0.3}
          transparent
          opacity={0.95}
          envMapIntensity={1.5}
          clearcoat={0.3}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color={P.soft} transparent opacity={0.12} />
      </mesh>

      {/* Outer glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.03, 16, 48]} />
        <meshBasicMaterial color={P.bright} transparent opacity={0.25} />
      </mesh>

      {/* ATIDETO text */}
      <Text
        position={[0, -1.0, 0]}
        fontSize={0.32}
        font="https://fonts.gstatic.com/s/spacegrotesk/v13/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff"
        letterSpacing={0.15}
        anchorX="center"
        anchorY="middle"
      >
        ATIDETO
        <meshPhysicalMaterial
          color={P.accent}
          metalness={0.8}
          roughness={0.2}
          emissive={P.primary}
          emissiveIntensity={0.2}
          transparent
          opacity={0.9}
        />
      </Text>
    </group>
  );
}

// ── Holographic Ring System ──
function HolographicRings({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const P = useScenePalette();
  const ringData = useMemo(() => [
    { radius: 1.4, tube: 0.015, rotX: 0, rotY: 0, rotZ: 0, speed: 0.2, dir: 1, opacity: 0.2 },
    { radius: 1.8, tube: 0.012, rotX: 0.4, rotY: 0, rotZ: 0.2, speed: -0.15, dir: -1, opacity: 0.15 },
    { radius: 2.2, tube: 0.01, rotX: -0.2, rotY: 0.3, rotZ: 0, speed: 0.25, dir: 1, opacity: 0.12 },
    { radius: 2.6, tube: 0.008, rotX: 0.6, rotY: -0.2, rotZ: 0.1, speed: -0.2, dir: -1, opacity: 0.1 },
    { radius: 3.0, tube: 0.006, rotX: 0, rotY: 0.5, rotZ: 0.3, speed: 0.18, dir: 1, opacity: 0.08 },
  ], []);

  const ringsRef = useRef<(THREE.Mesh)[]>([]);
  const ticksRef = useRef<(THREE.Group)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    ringsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const data = ringData[i];
      mesh.rotation.y += data.speed * 0.01;
      mesh.rotation.x += data.speed * 0.003 * data.dir;
      mesh.position.y = Math.sin(t * 0.2 + i * 1.2) * 0.05;

      // Pulse opacity
      const pulse = 0.6 + Math.sin(t * 0.5 + i * 1.5) * 0.4;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = data.opacity * pulse;
    });

    ticksRef.current.forEach((group, i) => {
      if (!group) return;
      group.rotation.y += ringData[i % ringData.length].speed * 0.015;
    });
  });

  return (
    <>
      {ringData.map((data, i) => (
        <group key={i}>
          <mesh
            ref={(el) => { ringsRef.current[i] = el!; }}
            rotation={[data.rotX, data.rotY, data.rotZ]}
          >
            <torusGeometry args={[data.radius, data.tube, 32, 80]} />
            <meshBasicMaterial
              color={P.bright}
              transparent
              opacity={data.opacity}
            />
          </mesh>

          {/* HUD Ticks */}
          <group
            ref={(el) => { ticksRef.current[i] = el!; }}
            rotation={[data.rotX, data.rotY, data.rotZ]}
          >
            {Array.from({ length: 24 }).map((_, j) => {
              const angle = (j / 24) * Math.PI * 2;
              const tickLen = j % 6 === 0 ? 0.06 : 0.03;
              const tickWidth = j % 6 === 0 ? 0.02 : 0.01;
              return (
                <mesh
                  key={j}
                  position={[
                    Math.cos(angle) * data.radius,
                    Math.sin(angle) * data.radius,
                    0,
                  ]}
                  rotation={[0, 0, -angle]}
                >
                  <planeGeometry args={[tickWidth, tickLen]} />
                  <meshBasicMaterial
                    color={j % 6 === 0 ? P.accent : P.bright}
                    transparent
                    opacity={j % 6 === 0 ? 0.6 : 0.25}
                  />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}
    </>
  );
}

// ── Holographic Platform ──
function HolographicPlatform() {
  const platformRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);
  const P = useScenePalette();

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (platformRef.current) {
      platformRef.current.rotation.z = Math.sin(t * 0.1) * 0.02;
    }

    if (scanRef.current) {
      scanRef.current.rotation.y = t * 0.3;
      scanRef.current.position.y = (Math.sin(t * 0.8) * 0.5 + 0.5) * 1.2 - 0.6;
    }
  });

  return (
    <group ref={platformRef} position={[0, -1.6, 0]}>
      {/* Base glow */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 3.0, 64]} />
        <meshBasicMaterial color={P.primary} transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>

      {/* Concentric rings */}
      {[2.8, 2.2, 1.6, 1.0, 0.4].map((radius, i) => (
        <mesh key={i} position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.01, radius + 0.01, 80]} />
          <meshBasicMaterial
            color={P.bright}
            transparent
            opacity={0.12 - i * 0.015}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Radial scan line */}
      <mesh ref={scanRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 0.03]} />
        <meshBasicMaterial color={P.accent} transparent opacity={0.3} />
      </mesh>

      {/* Center glow */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 24]} />
        <meshBasicMaterial color={P.bright} transparent opacity={0.4} />
      </mesh>

      {/* Pulse ring */}
      <mesh ref={pulseRingRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.35, 48]} />
        <meshBasicMaterial color={P.soft} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// ── Connection Lines with Energy Particles ──
function ConnectionLines({
  hoveredCard,
  pulseTrigger,
}: {
  hoveredCard: number | null;
  pulseTrigger: number;
}) {
  const P = useScenePalette();
  const curves = useMemo(() => {
    return CARD_POSITIONS_3D.map((pos) => {
      const midX = pos.x * 0.5;
      const midY = pos.y * 0.5;
      const cpOffset = 0.3;
      return new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0.2, 0),
        new THREE.Vector3(midX + cpOffset, midY, 0.5),
        new THREE.Vector3(pos.x, pos.y, 0)
      );
    });
  }, []);

  const particlesRef = useRef<(THREE.Mesh)[]>([]);
  const progress = useRef<number[]>(CARD_POSITIONS_3D.map(() => Math.random()));
  const direction = useRef<number[]>(CARD_POSITIONS_3D.map(() => 1));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Every few seconds, reverse flow
    if (Math.floor(t * 0.3) % 2 === 0) {
      particlesRef.current.forEach((mesh, i) => {
        if (!mesh) return;
        const speed = hoveredCard === i ? 0.8 : 0.4;
        progress.current[i] += delta * speed * direction.current[i];

        if (progress.current[i] >= 1) {
          progress.current[i] = 0;
        }

        const point = curves[i].getPoint(progress.current[i]);
        mesh.position.copy(point);
      });
    } else {
      // Reverse direction every few seconds
      if (Math.floor(t * 0.3) !== Math.floor((t - delta) * 0.3)) {
        direction.current = direction.current.map((d) => -d);
      }
    }
  });

  return (
    <>
      {curves.map((curve, i) => {
        const isHovered = hoveredCard === i;
        const points = curve.getPoints(32);
        const lineOpacity = isHovered ? 0.4 : 0.15;
        const lineWidth = isHovered ? 0.025 : 0.015;

        return (
          <group key={i}>
            {/* Main line */}
            <mesh>
              <tubeGeometry args={[curve, 32, lineWidth, 8, false]} />
              <meshBasicMaterial
                color={P.bright}
                transparent
                opacity={lineOpacity}
              />
            </mesh>

            {/* Glow line */}
            <mesh>
              <tubeGeometry args={[curve, 32, lineWidth * 2, 8, false]} />
              <meshBasicMaterial
                color={P.primary}
                transparent
                opacity={lineOpacity * 0.5}
              />
            </mesh>

            {/* Energy particle */}
            <mesh
              ref={(el) => { particlesRef.current[i] = el!; }}
            >
              <sphereGeometry args={[isHovered ? 0.05 : 0.035, 8, 8]} />
              <meshBasicMaterial color={P.accent} transparent opacity={0.9} />
            </mesh>

            {/* Endpoint glow */}
            <mesh position={[curve.v2.x, curve.v2.y, curve.v2.z]}>
              <sphereGeometry args={[isHovered ? 0.06 : 0.04, 12, 12]} />
              <meshBasicMaterial color={P.bright} transparent opacity={isHovered ? 0.6 : 0.25} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

// ── Floating Particle Field ──
function ParticleField() {
  const count = 400;
  const pointsRef = useRef<THREE.Points>(null);
  const P = useScenePalette();

  const [positions, speeds, phases, radii, orbits] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const ph = new Float32Array(count);
    const rad = new Float32Array(count);
    const orb = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const isOrbital = i < count * 0.6;
      const radius = 1.5 + Math.random() * 4;

      if (isOrbital) {
        const angle = Math.random() * Math.PI * 2;
        const heightOffset = (Math.random() - 0.5) * 3;
        pos[i3] = Math.cos(angle) * radius;
        pos[i3 + 1] = heightOffset;
        pos[i3 + 2] = Math.sin(angle) * radius;
      } else {
        pos[i3] = (Math.random() - 0.5) * 12;
        pos[i3 + 1] = (Math.random() - 0.5) * 6;
        pos[i3 + 2] = (Math.random() - 0.5) * 4;
      }

      spd[i] = 0.1 + Math.random() * 0.3;
      ph[i] = Math.random() * Math.PI * 2;
      rad[i] = radius;
      orb[i] = isOrbital ? 1 : 0;
    }
    return [pos, spd, ph, rad, orb];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const mouseInfluence = 0.2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const isOrbital = orbits[i] > 0.5;
      const phase = phases[i];
      const speed = speeds[i];
      const radius = radii[i];

      if (isOrbital) {
        const angle = t * speed * 0.2 + phase;
        const baseR = radius;
        const wobble = Math.sin(t * 0.5 + phase) * 0.15;
        const height = Math.sin(t * speed * 0.3 + phase) * 1.2;

        pos[i3] = Math.cos(angle) * (baseR + wobble);
        pos[i3 + 1] = height + Math.sin(t * 0.2 + phase) * 0.3;
        pos[i3 + 2] = Math.sin(angle) * (baseR + wobble);
      } else {
        // Drifting
        pos[i3] += Math.sin(t * 0.1 + phase) * 0.002;
        pos[i3 + 1] += Math.cos(t * 0.08 + phase) * 0.002;
        if (pos[i3] > 6) pos[i3] = -6;
        if (pos[i3] < -6) pos[i3] = 6;
        if (pos[i3 + 1] > 3) pos[i3 + 1] = -3;
        if (pos[i3 + 1] < -3) pos[i3 + 1] = 3;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={P.soft}
        transparent
        opacity={P.particleOpacity}
        blending={P.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ── Energy Pulse ──
function EnergyPulse({ trigger }: { trigger: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(0);
  const opacityRef = useRef(0);
  const P = useScenePalette();

  useFrame((state, delta) => {
    if (!ringRef.current) return;

    // Trigger pulse
    scaleRef.current += delta * 1.5;
    opacityRef.current = Math.max(0, 1 - scaleRef.current * 0.5);

    if (scaleRef.current > 3) {
      scaleRef.current = 3;
      opacityRef.current = 0;
    }

    ringRef.current.scale.set(scaleRef.current, scaleRef.current, scaleRef.current);
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacityRef.current * 0.3;
  });

  // Reset on trigger
  useEffect(() => {
    scaleRef.current = 0.1;
    opacityRef.current = 1;
  }, [trigger]);

  return (
    <mesh ref={ringRef} position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.1, 0.4, 48]} />
      <meshBasicMaterial color={P.bright} transparent opacity={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ── Wireframe Terrain ──
function WireframeTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  const P = useScenePalette();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = meshRef.current.geometry.attributes.position;
    const array = pos.array as Float32Array;
    const count = pos.count;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = array[i3];
      const z = array[i3 + 2] + t * 0.3;

      array[i3 + 1] =
        Math.sin(x * 0.4 + t * 0.5) * 0.08 +
        Math.cos(x * 0.2 + z * 0.3 + t * 0.3) * 0.06 +
        Math.sin(x * 0.8 + z * 0.5 + t * 0.7) * 0.04;
    }
    pos.needsUpdate = true;
  });

  return (
    <group position={[0, -2.5, -1]}>
      {/* Wireframe terrain */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 4, 48, 24]} />
        <meshBasicMaterial
          color={P.primary}
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Grid overlay */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 4, 32, 16]} />
        <meshBasicMaterial
          color={P.bright}
          wireframe
          transparent
          opacity={0.05}
        />
      </mesh>
    </group>
  );
}

// ── Scene Orchestrator ──
function SceneContent({
  hoveredCard,
  pulseTrigger,
}: {
  hoveredCard: number | null;
  pulseTrigger: number;
}) {
  const { mouse } = useThree();
  const smoothMouse = useRef({ x: 0, y: 0 });
  const P = useScenePalette();

  useFrame(() => {
    smoothMouse.current.x = THREE.MathUtils.lerp(
      smoothMouse.current.x,
      mouse.x * 0.5,
      0.03
    );
    smoothMouse.current.y = THREE.MathUtils.lerp(
      smoothMouse.current.y,
      mouse.y * 0.5,
      0.03
    );
  });

  return (
    <>
      <SceneLighting />
      <LogoCore mouseX={smoothMouse.current.x} mouseY={smoothMouse.current.y} />
      <HolographicRings mouseX={smoothMouse.current.x} mouseY={smoothMouse.current.y} />
      <HolographicPlatform />
      <ConnectionLines hoveredCard={hoveredCard} pulseTrigger={pulseTrigger} />
      <ParticleField />
      <WireframeTerrain />
      <EnergyPulse trigger={pulseTrigger} />
      <EffectComposer>
        <Bloom
          intensity={0.4}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
      <fog attach="fog" args={[P.fog, 6, 15]} />
    </>
  );
}

// ── Main Export ──
export default function DigitalCoreScene({
  hoveredCard,
  pulseTrigger,
}: {
  hoveredCard: number | null;
  pulseTrigger: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 7], fov: 50, near: 0.1, far: 20 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      style={{ background: 'transparent' }}
    >
      <SceneContent hoveredCard={hoveredCard} pulseTrigger={pulseTrigger} />
    </Canvas>
  );
}
