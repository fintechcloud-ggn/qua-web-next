"use client"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Shield, BarChart, CreditCard, Smartphone, Rocket, Trophy, Headphones } from "lucide-react"

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Disbursement",
    subtitle: "Under 15 Mins",
    desc: "Your money shouldn't wait. Receive funds in your bank account via IMPS within 15 minutes of final approval.",
    color: "#f59e0b"
  },
  {
    icon: <BarChart className="w-6 h-6" />,
    title: "High Approval Rate",
    subtitle: "95% Approvals",
    desc: "Our proprietary evaluation system looks past classic scorecards, leading to a 95% approval rate for qualified applicants.",
    color: "#3b82f6"
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "100% Digital Process",
    subtitle: "No Branch Visit",
    desc: "Ditch the paperwork. Complete your entire KYC, application, and tracking straight from your phone securely.",
    color: "#10b981"
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "No Collateral Needed",
    subtitle: "Unsecured Loans",
    desc: "Access liquidity simply based on your creditworthiness and earnings. Zero property or assets required as security.",
    color: "#ef4444"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Private",
    subtitle: "Bank-Grade SSL",
    desc: "Your financial privacy is guaranteed. We utilize strict 256-bit encryption and are fully compliant with all DPDP regulations.",
    color: "#8b5cf6"
  },
  {
    icon: <Headphones className="w-6 h-6" />,
    title: "24/7 Support",
    subtitle: "Always Accessible",
    desc: "Whenever you need help, our dedicated customer support team is available round the clock.",
    color: "#06b6d4"
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Transparent Policies",
    subtitle: "Zero Hidden Fees",
    desc: "What you see is what you pay. We operate with 100% transparency on interest rates and processing charges with absolutely no hidden fees.",
    color: "#f59e0b"
  }
]

// Custom Feature Card with Mouse Spotlight
function FeatureCard({ f, isHovered, handleHover, handleLeave }: any) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      layout
      className="relative rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-end p-6 border transition-all"
      style={{
        border: isHovered ? `1px solid ${f.color}70` : "1px solid rgba(255,255,255,0.05)",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(20px)",
      }}
      animate={{
        width: isHovered ? "45%" : "18%",
        flexGrow: isHovered ? 2 : 1, // fallback for flex layouts
      }}
      initial={{ width: "25%" }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
    >
      {/* Mouse Spotlight Glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300"
        animate={{ opacity: isHovered ? 1 : 0 }}
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${f.color}15, transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <motion.div layout className="mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ background: `${f.color}15`, color: f.color }}
          >
            {f.icon}
          </div>
        </motion.div>

        <motion.div layout className="mt-auto">
          <motion.div layout className="inline-block text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full mb-3"
            style={{ background: `${f.color}10`, color: f.color }}>
            {f.subtitle}
          </motion.div>
          <motion.h3 layout className="text-xl md:text-2xl font-black text-white leading-tight">
            {f.title}
          </motion.h3>

          <AnimatePresence>
            {isHovered && (
              <motion.p
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="text-gray-400 text-sm leading-relaxed overflow-hidden"
              >
                {f.desc}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function FeaturesSection() {
  const [hoveredTop, setHoveredTop] = useState<number | null>(0) // default select first card
  const [hoveredBottom, setHoveredBottom] = useState<number | null>(null)

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-800/50 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            ✨ Next-Gen Features
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-5">
            Built for speed, trust, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg,#60a5fa,#a78bfa,#c084fc)" }}>
              and your financial freedom.
            </span>
          </h2>
          <p className="text-gray-400 text-lg font-medium">Built on transparency and trust</p>
        </motion.div>

        <div className="flex flex-col gap-4 h-[700px] md:h-[400px]">
          {/* Top Row */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 h-1/2 w-full">
            {features.slice(0, 4).map((f, i) => (
              <FeatureCard
                key={f.title}
                f={f}
                isHovered={hoveredTop === i}
                handleHover={() => setHoveredTop(i)}
                handleLeave={() => {}}
              />
            ))}
          </div>

          {/* Bottom Row */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 h-1/2 w-full">
            {features.slice(4, 7).map((f, i) => (
              <FeatureCard
                key={f.title}
                f={f}
                isHovered={hoveredBottom === i}
                handleHover={() => setHoveredBottom(i)}
                handleLeave={() => {}}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
