"use client"
import { useEffect, useRef } from "react"

export default function Confetti({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ffffff", "#f97316"]
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      w: Math.random() * 10 + 5,
      h: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 8,
      opacity: 1,
    }))

    let raf: number
    let done = false

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let allGone = true
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vrot
        if (p.y > canvas.height) { p.opacity = 0 } else { allGone = false }
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
      })
      if (allGone && !done) { done = true; onDone() }
      else raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 z-[100] pointer-events-none"
    />
  )
}
