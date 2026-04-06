"use client"
import { motion } from "framer-motion"
import { ShieldCheck, Landmark, Lock, Zap } from "lucide-react"

export default function CtaSection({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="rounded-[2rem] p-10 md:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl shadow-blue-900/5 border border-white"
          style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(24px)" }}
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          
          {/* Decorative glowing orb behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] opacity-40 pointer-events-none"
               style={{ background: "radial-gradient(circle, #3b82f6 0%, #4f46e5 100%)" }} />

          <div className="relative z-10 w-full max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Pre-approved limits up to ₹1 Lakh
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
              Ready for Instant{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
                Financial Relief?
              </span>
            </h2>
            
            <p className="text-gray-500 text-base md:text-lg mb-10 leading-relaxed font-medium">
              Join over 100,000 satisfied users. Apply in 2 minutes, get approved in 5, and receive your money directly in your Indian bank account. No messy paperwork.
            </p>
            
            <motion.button onClick={onApplyClick}
              className="px-10 py-4 rounded-full text-white font-bold text-base cursor-pointer shadow-lg shadow-blue-500/30 w-full sm:w-auto flex items-center justify-center gap-3 mx-auto"
              style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)" }}
              whileHover={{ scale: 1.04, boxShadow: "0 20px 40px rgba(59,130,246,0.3)" }}
              whileTap={{ scale: 0.97 }}>
              <ShieldCheck className="w-5 h-5" /> Apply Securely — It&apos;s Free
            </motion.button>

            <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
              {[
                { label: "RBI Registered", icon: <Landmark className="w-4 h-4 text-blue-600" /> },
                { label: "Bank-grade Security", icon: <Lock className="w-4 h-4 text-emerald-600" /> },
                { label: "IMPS Instant Disbursal", icon: <Zap className="w-4 h-4 text-yellow-500" /> }
              ].map(badge => (
                <div key={badge.label} className="flex items-center gap-1.5 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  {badge.icon} {badge.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
