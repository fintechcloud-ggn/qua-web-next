"use client";

import React, { useEffect, useRef } from "react";

// Zoom factor for the visual pattern.
const ZOOM_FACTOR = 0.3;

// Base wave amplitude in domain warping.
const BASE_WAVE_AMPLITUDE = 0.2;

// Additional factor for random amplitude variations.
const RANDOM_WAVE_FACTOR = 0.15;

// Frequency multiplier for wave domain warp.
const WAVE_FREQUENCY = 4.0;

// Time speed factor (overall speed of animation).
const TIME_FACTOR = 0.05;

// Swirl strength near the center.
const BASE_SWIRL_STRENGTH = 1.2;

// Finer swirl timing factor.
const SWIRL_TIME_MULT = 5.0;

// Additional swirl effect modulated by noise.
const NOISE_SWIRL_FACTOR = 0.2;

// Number of fractal noise octaves in fbm (must be integer).
const FBM_OCTAVES = 10;

const ORANGE_START = [1.0, 0.54, 0.0]; // #ff8a00
const ORANGE_END = [0.97, 0.45, 0.09]; // #f97316

// 20-step palette based on the login/signup orange button.
const orangeColors = [
  [1.00, 0.90, 0.68],
  [1.00, 0.85, 0.58],
  [1.00, 0.80, 0.50],
  [1.00, 0.76, 0.43],
  [1.00, 0.72, 0.37],
  [1.00, 0.69, 0.31],
  [1.00, 0.66, 0.25],
  [1.00, 0.63, 0.19],
  [1.00, 0.60, 0.14],
  [1.00, 0.57, 0.09],
  [1.00, 0.54, 0.04],
  [0.99, 0.52, 0.03],
  [0.99, 0.50, 0.05],
  [0.98, 0.48, 0.06],
  [0.98, 0.47, 0.07],
  [0.98, 0.46, 0.08],
  [0.97, 0.45, 0.09],
  [0.98, 0.61, 0.20],
  [0.99, 0.73, 0.39],
  [1.00, 0.92, 0.76]
];

function buildFragmentShader(): string {
  const fbmOctavesInt = Math.floor(FBM_OCTAVES);
  const colorArraySrc = orangeColors.map((c) => `vec3(${c[0]}, ${c[1]}, ${c[2]})`).join(",\n  ");

  return `#version 300 es

precision highp float;
out vec4 outColor;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

#define NUM_COLORS 20

vec3 orangeColors[NUM_COLORS] = vec3[](
  ${colorArraySrc}
);

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float noise2D(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod(i, 289.0);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) +
    i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ),
    0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.792843 - 0.853734 * (a0 * a0 + h * h);

  vec3 g;
  g.x  = a0.x  * x0.x + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

float fbm(vec2 st) {
  float value = 0.0;
  float amplitude = 0.5;
  float freq = 1.0;
  for (int i = 0; i < ${fbmOctavesInt}; i++) {
    value += amplitude * noise2D(st * freq);
    freq *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = (gl_FragCoord.xy / uResolution.xy) * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  uv *= float(${ZOOM_FACTOR});
  float t = uTime * float(${TIME_FACTOR});
  
  // Transform mouse coordinate from pixels into our uv-space
  vec2 mouseUV = (uMouse.xy / uResolution.xy) * 2.0 - 1.0;
  mouseUV.x *= uResolution.x / uResolution.y;
  mouseUV *= float(${ZOOM_FACTOR});

  float waveAmp = float(${BASE_WAVE_AMPLITUDE}) + float(${RANDOM_WAVE_FACTOR})
                  * noise2D(vec2(t, 27.7));

  float waveX = waveAmp * sin(uv.y * float(${WAVE_FREQUENCY}) + t);
  float waveY = waveAmp * sin(uv.x * float(${WAVE_FREQUENCY}) - t);
  uv.x += waveX;
  uv.y += waveY;

  float r = length(uv);
  float angle = atan(uv.y, uv.x);
  float swirlStrength = float(${BASE_SWIRL_STRENGTH})
                        * (1.0 - smoothstep(0.0, 1.0, r));

  angle += swirlStrength * sin(uTime + r * float(${SWIRL_TIME_MULT}));
  uv = vec2(cos(angle), sin(angle)) * r;

  // Enhanced Interactive Glow
  float distToMouse = length(uv - mouseUV);
  float mouseGlow = smoothstep(1.5, 0.0, distToMouse) * 0.35; // Brightness near mouse
  float mouseWarp = smoothstep(2.0, 0.0, distToMouse) * 0.15; // Warp the ripples
  
  float n = fbm(uv + (mouseUV - uv) * mouseWarp);
  float swirlEffect = float(${NOISE_SWIRL_FACTOR}) * sin(t + n * 3.0);
  n += swirlEffect;

  float noiseVal = 0.5 * (n + 1.0);
  float idx = clamp(noiseVal, 0.0, 1.0) * float(NUM_COLORS - 1);
  int iLow = int(floor(idx));
  int iHigh = int(min(float(iLow + 1), float(NUM_COLORS - 1)));
  float f = fract(idx);

  vec3 colLow = orangeColors[iLow];
  vec3 colHigh = orangeColors[iHigh];
  vec3 color = mix(colLow, colHigh, f);

  // Add the interactive mouse glow using the same orange family as the CTA button.
  color += mix(
    vec3(${ORANGE_START[0]}, ${ORANGE_START[1]}, ${ORANGE_START[2]}),
    vec3(${ORANGE_END[0]}, ${ORANGE_END[1]}, ${ORANGE_END[2]}),
    0.5
  ) * mouseGlow;

  // Use full opacity everywhere (no transparent dark regions)
  outColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;
}

const vertexShaderSource = `#version 300 es
precision mediump float;
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

function createShaderProgram(
  gl: WebGL2RenderingContext,
  vsSource: string,
  fsSource: string
): WebGLProgram | null {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vertexShader) return null;
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error("ShaderBackground vertex shader compile failed:", gl.getShaderInfoLog(vertexShader));
    gl.deleteShader(vertexShader);
    return null;
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fragmentShader) return null;
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error("ShaderBackground fragment shader compile failed:", gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ShaderBackground program link failed:", gl.getProgramInfoLog(program));
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    gl.deleteProgram(program);
    return null;
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  return program;
}

export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;

    const fsSource = buildFragmentShader();
    const gl = canvas.getContext("webgl2", { alpha: true });
    if (!gl) {
      console.error("ShaderBackground could not create a WebGL2 context.");
      canvas.dataset.shaderStatus = "no-webgl2";
      return;
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const glContext = gl;

    const program = createShaderProgram(glContext, vertexShaderSource, fsSource);
    if (!program) {
      canvas.dataset.shaderStatus = "compile-failed";
      return;
    }

    canvas.dataset.shaderStatus = "ready";
    glContext.useProgram(program);

    const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vao = glContext.createVertexArray();
    glContext.bindVertexArray(vao);

    const vbo = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vbo);
    glContext.bufferData(glContext.ARRAY_BUFFER, quadVertices, glContext.STATIC_DRAW);

    const aPositionLoc = glContext.getAttribLocation(program, "aPosition");
    glContext.enableVertexAttribArray(aPositionLoc);
    glContext.vertexAttribPointer(aPositionLoc, 2, glContext.FLOAT, false, 0, 0);

    const uResolutionLoc = glContext.getUniformLocation(program, "uResolution");
    const uTimeLoc = glContext.getUniformLocation(program, "uTime");
    const uMouseLoc = glContext.getUniformLocation(program, "uMouse");

    const startTime = performance.now();
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleMouseMove = (e: MouseEvent) => {
      // For WebGL, Y=0 is bottom, so we invert Y
      targetMouseX = e.clientX;
      targetMouseY = window.innerHeight - e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    function render() {
      const elapsed = (performance.now() - startTime) * 0.001;
      
      // Smoothly interpolate mouse position for fluid trailing effect
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      glContext.viewport(0, 0, canvas.width, canvas.height);
      glContext.clear(glContext.COLOR_BUFFER_BIT);

      glContext.useProgram(program);
      glContext.bindVertexArray(vao);
      glContext.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      glContext.uniform1f(uTimeLoc, elapsed);
      if (uMouseLoc) {
        glContext.uniform2f(uMouseLoc, mouseX, mouseY);
      }

      glContext.drawArrays(glContext.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }

    const frameId = requestAnimationFrame(render);
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      glContext.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      glContext.deleteProgram(program);
      glContext.deleteBuffer(vbo);
      glContext.deleteVertexArray(vao!);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,244,220,0.55), transparent 35%), linear-gradient(135deg, #ff8a00 0%, #f97316 100%)",
        }}
      />
    </div>
  );
}
