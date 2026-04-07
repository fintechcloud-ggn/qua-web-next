"use client"
import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence, useTransform } from "framer-motion"
import { ArrowRight, Shield, Zap, Clock, Star, ShieldCheck, LineChart, Calendar, Gift, Sparkles } from "lucide-react"

const cycleWords = ["Fast", "Easy", "Paperless", "Secure"]

// Helper for magnetic pull effect on buttons
function MagneticButton({
  children,
  onClick,
  className,
  style,
}: {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = e.clientX - rect.left - rect.width / 2;
    const ny = e.clientY - rect.top - rect.height / 2;
    x.set(nx * 0.3); // Pull amount
    y.set(ny * 0.3);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      style={{ x: springX, y: springY, ...style }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={className}
      whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(59,130,246,0.35)" }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

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

      {/* Floating Parallax Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating Sphere */}
        <motion.div
           className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full hidden md:block"
           style={{
             background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(59, 130, 246, 0.4))",
             boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)",
             backdropFilter: "blur(10px)",
             x: useTransform(rotateY, [-18, 18], [-30, 30]),
             y: useTransform(rotateX, [-18, 18], [-30, 30])
           }}
           animate={{ y: [0, -20, 0] }}
           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Floating Mini-Card */}
        <motion.div
           className="absolute bottom-[15%] left-[45%] w-16 h-16 rounded-2xl bg-black/40 border border-white/10 shadow-xl backdrop-blur-md flex items-center justify-center hidden md:flex"
           style={{
             x: useTransform(rotateY, [-18, 18], [20, -20]),
             y: useTransform(rotateX, [-18, 18], [20, -20])
           }}
           animate={{ rotate: [0, 10, -10, 0], y: [0, 15, 0] }}
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="text-blue-500 w-8 h-8" />
        </motion.div>
      </div>

      {/* Main hero body */}
      <div className="flex-1 flex items-center relative z-10">
        <div className="max-w-7xl mx-auto w-full px-8 pt-8 pb-16 grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT — Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-800/50 bg-blue-900/30 text-blue-300 text-xs font-medium mb-7 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Digital Process — Only KYC Required
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
              <span className="block">Quick, Urgent,</span>
              <span className="block text-transparent bg-clip-text" style={{
                backgroundImage: "linear-gradient(135deg,#60a5fa 0%,#a78bfa 100%)",
              }}>Assured Loans (QUA)</span>
            </h1>

            {/* Cycling word */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
              <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                <AnimatePresence mode="wait">
                  {mounted && (
                    <motion.span
                      key={wordIdx}
                      className="text-blue-400 font-bold"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28 }}
                    >
                      {cycleWords[wordIdx]}
                    </motion.span>
                  )}
                </AnimatePresence>
                · No Branch Visit · Completely Digital
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
            </div>

            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md">
              Get instant loans online with a 100% digital process. Designed to provide fast, easy, and paperless liquidity right when you need it.
            </p>

            {/* CTA row */}
            <div className="flex gap-3 mb-8 flex-wrap">
              <MagneticButton
                onClick={onApplyClick}
                className="group relative overflow-hidden flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white font-bold text-sm cursor-pointer"
                style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)", boxShadow: "0 8px 30px rgba(59,130,246,0.25)" }}
              >
                {/* Shine Sweep Animation */}
                <motion.div
                  className="absolute inset-0 z-0  bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                  initial={{ x: "-150%" }}
                  animate={{ x: "150%" }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                />
                <span className="relative z-10 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4" /> Apply Securely
                </span>
              </MagneticButton>
              <button
                onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full text-gray-300 font-semibold text-sm border border-white/20 bg-black/40 hover:bg-white/10 hover:text-white hover:shadow-sm transition-all cursor-pointer backdrop-blur-sm"
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
                <div key={t.label} className="flex items-center gap-1.5 text-gray-400 font-medium text-xs">
                  <span className="text-blue-400">{t.icon}</span>{t.label}
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
            <div className="rounded-3xl p-7 border border-white/10 relative overflow-hidden"
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(24px)", boxShadow: "0 32px 64px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
              {/* Shine */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)" }} />

              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-gray-400 text-xs font-semibold mb-0.5 uppercase tracking-wide">Pre-approved for you</div>
                  <div className="text-4xl font-black text-white">₹50,000</div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-900/30 border border-blue-800/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span className="text-blue-300 text-xs font-bold">Offer Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Rate", value: "1.5%/mo", icon: <LineChart className="w-5 h-5 mx-auto text-blue-400" /> },
                  { label: "Tenure", value: "90 days", icon: <Calendar className="w-5 h-5 mx-auto text-blue-400" /> },
                  { label: "Fee", value: "₹0", icon: <Gift className="w-5 h-5 mx-auto text-blue-400" /> },
                ].map(item => (
                  <div key={item.label} className="text-center p-3 rounded-2xl border border-white/5 bg-white/5">
                    <div className="mb-2">{item.icon}</div>
                    <div className="text-white font-bold text-sm">{item.value}</div>
                    <div className="text-gray-400 font-medium text-[10px] uppercase tracking-wider">{item.label}</div>
                  </div>
                ))}
              </div>

              <button onClick={onApplyClick}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm cursor-pointer transition-all hover:scale-[1.02] shadow-md shadow-blue-500/20"
                style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}>
                Claim Secure Offer <ShieldCheck className="w-4 h-4" />
              </button>
            </div>

            {/* Mini stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "50K+", label: "Joined", color: "#60a5fa" },
                { val: "₹2.3Cr", label: "Disbursed / 24h", color: "#ffffff" },
                { val: "95%", label: "Approval", color: "#34d399" },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4 text-center border border-white/10 backdrop-blur-md shadow-sm"
                  style={{ background: "rgba(0,0,0,0.4)" }}>
                  <div className="font-black text-lg mb-0.5" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-gray-400 font-medium text-[9px] uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
