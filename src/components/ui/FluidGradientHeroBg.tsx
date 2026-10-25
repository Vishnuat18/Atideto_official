import React, { useEffect, useRef, useState } from 'react';

/**
 * FluidGradientHeroBg
 * 
 * Premium, full-screen, GPU-accelerated animated abstract gradient background.
 * - Electric cyan, luminous aqua blue, deep ocean blue, midnight navy, and near-black.
 * - Upper-left vibrant saturated blue glow.
 * - Upper-right luminous cyan & turquoise gradient drifting horizontally.
 * - Central organic fluid transitions with multi-octave domain-warped noise.
 * - Lower half stable deep charcoal navy and near-black with subtle blue wave boundary.
 * - Zero UI, zero particles, zero text, zero mouse listeners. Pure cinematic liquid aurora.
 */

const VERTEX_SHADER_SRC = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

// ── Simplex Noise & Hash functions ──
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Multi-octave fBm with organic domain warping
float fbm(vec2 p) {
  float f = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for(int i = 0; i < 4; i++) {
    f += amp * snoise(p * freq);
    freq *= 2.05;
    amp *= 0.48;
  }
  return f;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;

  vec2 st = uv;
  st.x *= aspect;

  // Slow, serene fluid motion (~16-20 second loop cycle)
  float t = u_time * 0.065;

  // Domain warping for organic underwater fluid currents
  vec2 q = vec2(0.0);
  q.x = fbm(st * 1.1 + vec2(t * 0.22, t * 0.14));
  q.y = fbm(st * 1.1 + vec2(-t * 0.16, t * 0.25));

  vec2 r = vec2(0.0);
  r.x = fbm(st * 1.35 + 1.2 * q + vec2(1.7, 9.2) + 0.12 * t);
  r.y = fbm(st * 1.35 + 1.2 * q + vec2(8.3, 2.8) - 0.10 * t);

  // Vertical light caustics / refractive light beams (matching user reference image)
  float rayCoord = st.x * 2.8 + st.y * 0.35 + 0.4 * r.x;
  float causticRays = sin(rayCoord * 4.0 + t * 0.4) * 0.5 + 0.5;
  float causticRays2 = sin(rayCoord * 8.0 - t * 0.3 + 0.6 * q.y) * 0.5 + 0.5;
  float causticBeam = pow(causticRays * 0.65 + causticRays2 * 0.35, 3.2);

  // Soft fluid wave modulation
  float fluidPattern = fbm(st * 1.25 + 1.1 * r);

  // ── PURE MONOCHROMATIC ROYAL ELECTRIC BLUE PALETTE ──
  // Exact royal electric blue matching the provided reference image
  vec3 colDeepBlue       = vec3(0.00, 0.15, 0.78); // Deep royal blue (#0026C7)
  vec3 colElectricBlue   = vec3(0.00, 0.28, 0.96); // Saturated electric blue (#0047F5)
  vec3 colBrightBlue     = vec3(0.06, 0.42, 1.00); // Luminous electric blue (#0F6BFF)
  vec3 colLightCaustic   = vec3(0.24, 0.58, 1.00); // Refractive light caustic streak (#3D94FF)
  vec3 colBackgroundDark = vec3(0.020, 0.020, 0.020); // Anchors into #050505

  // Blend the pure blue fluid texture
  vec3 blueColor = mix(colDeepBlue, colElectricBlue, fluidPattern * 0.7 + 0.3);
  blueColor = mix(blueColor, colBrightBlue, clamp(r.x * 0.75 + 0.25, 0.0, 1.0));
  blueColor = mix(blueColor, colLightCaustic, causticBeam * 0.55);

  // ── 60% HERO SECTION COVERAGE ──
  // The vibrant blue covers the top ~60% of the hero section.
  // In GLSL, uv.y = 1.0 is the top, uv.y = 0.0 is the bottom.
  // 60% of hero from the top corresponds to uv.y from 1.0 down to ~0.40.
  // From uv.y = 0.52 to 0.20, smoothly blend into #050505 with subtle fluid wave.
  float waveOffset = 0.05 * sin(st.x * 3.2 + t + r.x * 2.0);
  float fadeThreshold = 0.38 + waveOffset; // 60% blue coverage boundary
  float blueOpacity = smoothstep(fadeThreshold, fadeThreshold + 0.28, uv.y);

  // Final color: Top 60% is pure electric blue, bottom smoothly transitions to #050505
  vec3 finalColor = mix(colBackgroundDark, blueColor, blueOpacity);

  // High-frequency triangular dither to eliminate any 8-bit banding on gradients
  float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  finalColor += dither;

  gl_FragColor = vec4(finalColor, 1.0);
}

`;

export default function FluidGradientHeroBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL context
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (canvas.getContext('webgl', {
        alpha: false,
        depth: false,
        stencil: false,
        antialias: false,
        powerPreference: 'high-performance'
      }) || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }

    if (!gl) {
      setWebGlSupported(false);
      return;
    }

    // Helper: compile shader
    function createShader(glCtx: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, src);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.warn('WebGL shader compile error:', glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);

    if (!vs || !fs) {
      setWebGlSupported(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setWebGlSupported(false);
      return;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('WebGL program link error:', gl.getProgramInfoLog(program));
      setWebGlSupported(false);
      return;
    }

    gl.useProgram(program);

    // Full-screen quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const quadVertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');

    let animationFrameId: number;
    const startTime = performance.now();

    // Resize handler (render at optimal resolution for 60fps)
    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      }
    }

    resize();
    window.addEventListener('resize', resize);

    // Render loop
    function render(now: number) {
      if (!gl) return;
      const elapsedSeconds = (now - startTime) / 1000.0;

      gl.uniform2f(uResolutionLoc, canvas!.width, canvas!.height);
      gl.uniform1f(uTimeLoc, elapsedSeconds);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* ── WebGL Canvas (Primary 60 FPS Fluid Shaders) ── */}
      {webGlSupported && (
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {/* ── CSS High-Fidelity Fallback if WebGL is unavailable ── */}
      {!webGlSupported && (
        <div className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden">
          {/* Top 60% Pure Electric Blue Fluid Atmosphere */}
          <div
            className="absolute top-0 inset-x-0 h-[65%] w-full"
            style={{
              background: 'radial-gradient(ellipse 90% 75% at 50% 25%, #0047F5 0%, #0026C7 50%, #001270 75%, transparent 100%)',
              animation: 'blueAtmospherePulse 16s ease-in-out infinite alternate'
            }}
          />

          {/* Luminous Caustic Light Refraction Streaks */}
          <div
            className="absolute top-0 left-[25%] w-[50vw] h-[55%] rounded-full blur-[100px] opacity-70"
            style={{
              background: 'radial-gradient(ellipse at center, #3D94FF 0%, #0F6BFF 45%, transparent 75%)',
              animation: 'blueCausticWarp 14s ease-in-out infinite alternate'
            }}
          />

          {/* Smooth fade from 60% down to #050505 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 35%, rgba(5,5,5,0.4) 55%, #050505 85%)'
            }}
          />

          <style>{`
            @keyframes blueAtmospherePulse {
              0% { transform: scale(1) translateY(0); opacity: 0.95; }
              50% { transform: scale(1.05) translateY(2%); opacity: 1; }
              100% { transform: scale(0.98) translateY(-1%); opacity: 0.92; }
            }
            @keyframes blueCausticWarp {
              0% { transform: translate(0, 0) scale(1); }
              50% { transform: translate(6%, 4%) scale(1.12); }
              100% { transform: translate(-5%, -2%) scale(0.95); }
            }
          `}</style>
        </div>
      )}

      {/* Seamless bottom fade into #050505 to bridge into next sections */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(5,5,5,0.7) 65%, #050505 100%)'
        }}
      />
    </div>
  );
}
