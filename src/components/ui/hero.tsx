"use client"
import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { ArrowRight, Shield, Zap, Clock, Star, ShieldCheck, LineChart, Calendar, Gift } from "lucide-react"

const cycleWords = ["Instant", "Fast", "Secure", "Easy"]

export default function HeroSection({ onApplyClick }: { onApplyClick: () => void }) {
  const [wordIdx, setWordIdx] = useState(0)
  const [mounted, setMounted] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 120, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 120, damping: 20 })

  useEffect(() => {
    setMounted(true)
    const id = setInterval(() => setWordIdx(i => (i + 1) % cycleWords.length), 2400)
    return () => clearInterval(id)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotateY.set(((e.clientX - cx) / rect.width) * 18)
    rotateX.set(-((e.clientY - cy) / rect.height) * 18)
  }
  const handleMouseLeave = () => { rotateX.set(0); rotateY.set(0) }

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">


      {/* Main hero body */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-8 pt-8 pb-16 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium mb-7 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              India&apos;s Fastest Payday Loan — 98% Approval Rate
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[0.95] tracking-tight mb-6">
              <span className="block text-gray-400 font-bold text-3xl tracking-widest mb-2 uppercase">Get up to</span>
              <span className="block text-transparent bg-clip-text" style={{
                backgroundImage: "linear-gradient(135deg,#2563eb 0%,#4f46e5 100%)",
              }}>₹1,00,000</span>
              <span className="block mt-1">in minutes</span>
            </h1>

            {/* Cycling word */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <AnimatePresence mode="wait">
                  {mounted && (
                    <motion.span
                      key={wordIdx}
                      className="text-blue-600 font-bold"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28 }}
                    >
                      {cycleWords[wordIdx]}
                    </motion.span>
                  )}
                </AnimatePresence>
                · No Branch Visit · No CIBIL Check
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
            </div>

            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-md">
              Apply in 2 minutes, get approved in 5, and receive money directly in your
              bank account — <span className="text-gray-900 font-bold">same day guaranteed.</span>
            </p>

            {/* CTA row */}
            <div className="flex gap-3 mb-8 flex-wrap">
              <motion.button
                onClick={onApplyClick}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white font-bold text-sm cursor-pointer"
                style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)", boxShadow: "0 8px 30px rgba(59,130,246,0.25)" }}
                whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(59,130,246,0.35)" }}
                whileTap={{ scale: 0.97 }}
              >
                <ShieldCheck className="w-4 h-4" /> Apply Securely
              </motion.button>
              <button
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full text-gray-600 font-semibold text-sm border border-gray-200 bg-white/50 hover:bg-white hover:text-gray-900 hover:shadow-sm transition-all cursor-pointer backdrop-blur-sm"
              >
                Check Eligibility <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trust pills */}
            <div className="flex gap-5 flex-wrap">
              {[
                { icon: <Zap className="w-3.5 h-3.5" />, label: "5-Min Approval" },
                { icon: <Shield className="w-3.5 h-3.5" />, label: "RBI Registered" },
                { icon: <Clock className="w-3.5 h-3.5" />, label: "24/7 Disbursal" },
                { icon: <Star className="w-3.5 h-3.5" />, label: "4.9★ Rating" },
              ].map(t => (
                <div key={t.label} className="flex items-center gap-1.5 text-gray-500 font-medium text-xs">
                  <span className="text-blue-500">{t.icon}</span>{t.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — 3D Tilt Card */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d", perspective: 1000 }}
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Main offer card */}
            <div className="rounded-3xl p-7 border border-white relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(24px)", boxShadow: "0 32px 64px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)" }}>
              {/* Shine */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,1),transparent)" }} />

              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-gray-500 text-xs font-semibold mb-0.5 uppercase tracking-wide">Pre-approved for you</div>
                  <div className="text-4xl font-black text-gray-900">₹50,000</div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-blue-600 text-xs font-bold">Offer Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Rate", value: "1.5%/mo", icon: <LineChart className="w-5 h-5 mx-auto text-blue-600" /> },
                  { label: "Tenure", value: "90 days", icon: <Calendar className="w-5 h-5 mx-auto text-blue-600" /> },
                  { label: "Fee", value: "₹0", icon: <Gift className="w-5 h-5 mx-auto text-blue-600" /> },
                ].map(item => (
                  <div key={item.label} className="text-center p-3 rounded-2xl border border-blue-50 bg-blue-50/50">
                    <div className="mb-2">{item.icon}</div>
                    <div className="text-gray-900 font-bold text-sm">{item.value}</div>
                    <div className="text-gray-500 font-medium text-[10px] uppercase tracking-wider">{item.label}</div>
                  </div>
                ))}
              </div>

              <button onClick={onApplyClick}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm cursor-pointer transition-all hover:scale-[1.02] shadow-md shadow-blue-500/20"
                style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)" }}>
                Claim Secure Offer <ShieldCheck className="w-4 h-4" />
              </button>
            </div>

            {/* Mini stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "1L+", label: "Customers", color: "#2563eb" },
                { val: "5 min", label: "Approval", color: "#000000" },
                { val: "4.9★", label: "Rating", color: "#f59e0b" },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4 text-center border border-white backdrop-blur-md shadow-sm"
                  style={{ background: "rgba(255,255,255,0.7)" }}>
                  <div className="font-black text-lg mb-0.5" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-gray-500 font-medium text-[10px] uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
