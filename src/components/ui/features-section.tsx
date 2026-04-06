"use client"
import { useState } from "react"
import { motion } from "framer-motion"

const features = [
  { icon: "⚡", title: "Lightning Approval", desc: "AI processes in under 60 seconds. No manual delays or branch visits.", badge: "< 60 sec", color: "#f59e0b", size: "large" },
  { icon: "🔒", title: "Bank-Grade Security", desc: "256-bit SSL. DPDP compliant.", badge: "256-bit SSL", color: "#10b981", size: "small" },
  { icon: "📊", title: "No CIBIL Required", desc: "Income-first evaluation. Any score welcome.", badge: "Any Score", color: "#3b82f6", size: "small" },
  { icon: "💳", title: "Flexible Repayment", desc: "7 to 90 days. Zero prepayment penalty. Extend anytime.", badge: "7–90 days", color: "#8b5cf6", size: "medium" },
  { icon: "📱", title: "100% Digital", desc: "iOS & Android. Apply, track, repay from your phone.", badge: "Mobile First", color: "#06b6d4", size: "medium" },
  { icon: "🚀", title: "IMPS Disbursal", desc: "5–30 minutes to your bank, 24/7, every day.", badge: "5 min", color: "#ef4444", size: "small" },
  { icon: "🏆", title: "Loyalty Rewards", desc: "Earn QuaCoins on repayments. Redeem for lower rates.", badge: "QuaCoins", color: "#f59e0b", size: "small" },
  { icon: "🤝", title: "24/7 Support", desc: "Real humans, always available, any hour.", badge: "Always On", color: "#10b981", size: "small" },
]

export default function FeaturesSection() {
  const [hovered, setHovered] = useState<number | null>(null)
  const glass = "rgba(255,255,255,0.7)"

  return (
    <section id="features" className="py-24">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16 max-w-6xl mx-auto" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-600 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
              ✨ Features
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Why{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#2563eb,#4f46e5,#9333ea)" }}>
                1 Lakh+
              </span>
              <br />Choose Us
            </h2>
          </div>
          <p className="text-gray-500 text-base max-w-xs md:text-right font-medium">
            Built for speed, trust, and your financial freedom.
          </p>
        </motion.div>

        {/* BENTO GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-auto">

          {/* Hero card — spans 2 cols & 2 rows */}
          <motion.div
            onHoverStart={() => setHovered(0)}
            onHoverEnd={() => setHovered(null)}
            className="col-span-2 row-span-2 rounded-3xl p-8 border transition-all duration-300 cursor-default backdrop-blur-md relative overflow-hidden"
            style={{
              background: hovered === 0 ? `linear-gradient(to bottom right, #ffffff, ${features[0].color}15)` : glass,
              borderColor: hovered === 0 ? `${features[0].color}40` : "rgba(0,0,0,0.05)",
              boxShadow: hovered === 0 ? `0 24px 48px ${features[0].color}20` : "0 4px 20px rgba(0,0,0,0.03)",
            }}
            initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            whileHover={{ y: -6 }}>
            <div className="absolute top-0 left-0 right-0 h-px transition-all duration-300"
              style={{ background: hovered === 0 ? `linear-gradient(90deg,transparent,${features[0].color},transparent)` : "transparent" }} />
            <motion.div className="text-6xl mb-6 drop-shadow-md"
              animate={{ scale: hovered === 0 ? 1.15 : 1, rotate: hovered === 0 ? 8 : 0 }}
              transition={{ duration: 0.3 }}>{features[0].icon}</motion.div>
            <div className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ background: `${features[0].color}15`, color: features[0].color, border: `1px solid ${features[0].color}30` }}>
              {features[0].badge}
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">{features[0].title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{features[0].desc}</p>
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">
              Our proprietary AI model analyses 200+ data points from your profile, bank statements, and income in real-time — delivering a credit decision faster than any human reviewer ever could.
            </p>
          </motion.div>

          {/* Remaining feature cards */}
          {features.slice(1).map((f, i) => (
            <motion.div
              key={f.title}
              onHoverStart={() => setHovered(i + 1)}
              onHoverEnd={() => setHovered(null)}
              className="rounded-2xl p-5 border transition-all duration-300 cursor-default backdrop-blur-md relative overflow-hidden"
              style={{
                background: hovered === i + 1 ? `linear-gradient(to bottom right, #ffffff, ${f.color}10)` : glass,
                borderColor: hovered === i + 1 ? `${f.color}30` : "rgba(0,0,0,0.05)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 + 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}>
              <div className="absolute top-0 left-0 right-0 h-px transition-colors duration-300"
                style={{ background: hovered === i + 1 ? `linear-gradient(90deg,transparent,${f.color},transparent)` : "transparent" }} />
              <motion.div className="text-3xl mb-3 drop-shadow-sm"
                animate={{ scale: hovered === i + 1 ? 1.15 : 1 }}>{f.icon}</motion.div>
              <div className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2"
                style={{ background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}22` }}>
                {f.badge}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          className="mt-5 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-sm"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(243,244,246,0.8) 100%)",
            border: "1px solid #e5e7eb", backdropFilter: "blur(16px)",
          }}
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div>
            <h3 className="text-xl font-black text-gray-900">Apply in 2 minutes.{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg,#2563eb,#4f46e5)" }}>Get money today.</span>
            </h3>
            <p className="text-gray-500 text-sm mt-1 font-medium">Join 1 lakh+ Indians who trust QuaLoan.</p>
          </div>
          <div className="flex gap-3">
            {["📱 iOS App", "🤖 Android"].map(app => (
              <div key={app} className="bg-white border border-gray-200 text-gray-700 shadow-sm text-sm font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 hover:text-blue-600 transition-all">
                {app}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
