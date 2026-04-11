"use client"

import { Canvas } from "@react-three/fiber"

import { EnergyRing, ShaderPlane } from "@/components/ui/background-paper-shaders"

export function DashboardPaperShaderOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-80"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.35),transparent_30%)]" />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.6} />
        <ShaderPlane position={[-2.1, 1.25, -0.4]} color1="#7dd3fc" color2="#ffffff" />
        <ShaderPlane position={[2.25, -1.25, -0.8]} color1="#fdba74" color2="#ffffff" />
        <ShaderPlane position={[0.15, 0.2, -1.1]} color1="#c4b5fd" color2="#ffffff" />
        <ShaderPlane position={[0.9, 1.7, -1.4]} color1="#86efac" color2="#ffffff" />
        <EnergyRing radius={1.05} position={[-1.9, -0.7, 0.2]} />
        <EnergyRing radius={0.7} position={[1.9, 1.1, 0.1]} />
      </Canvas>
    </div>
  )
}
