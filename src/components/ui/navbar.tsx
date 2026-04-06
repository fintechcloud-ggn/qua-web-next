"use client"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { useState } from "react"
import { ArrowRight } from "lucide-react"

export default function Navbar({ onApplyClick }: { onApplyClick: () => void }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50)
  })

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 flex justify-center px-4 ${
        scrolled ? "py-4 md:py-6" : "py-6 md:py-8"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div 
        className="w-full max-w-5xl flex items-center justify-between px-6 py-3 md:py-3.5 rounded-full transition-all duration-500 shadow-sm"
        style={{
          background: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
          backdropFilter: "blur(24px)",
          border: scrolled ? "1px solid rgba(0,0,0,0.05)" : "1px solid rgba(255,255,255,0.4)",
          boxShadow: scrolled ? "0 20px 40px rgba(0,0,0,0.08)" : "0 4px 20px rgba(0,0,0,0.02)"
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center font-black text-sm md:text-base text-white shadow-md shadow-blue-200/50"
            style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)" }}>Q</div>
          <span className="text-gray-900 font-bold text-base md:text-lg tracking-tight hidden sm:block">QuaLoan</span>
          <span className="text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 ml-1 hidden sm:block">PAYDAY</span>
        </div>

        <nav className="hidden lg:flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full border border-gray-100">
          {[
            ["Calculator", "#calculator"],
            ["Process", "#how-it-works"],
            ["Features", "#features"],
            ["Reviews", "#reviews"]
          ].map(([label, href]) => (
            <a key={label} href={href}
              className="text-gray-500 hover:text-gray-900 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full hover:bg-white hover:shadow-sm transition-all duration-200">
              {label}
            </a>
          ))}
        </nav>

        <button onClick={onApplyClick}
          className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold text-white cursor-pointer transition-all hover:shadow-lg shadow-blue-500/20 hover:scale-105"
          style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)" }}>
          Apply Now <ArrowRight className="w-3.5 h-3.5 hidden md:block" />
        </button>
      </div>
    </motion.header>
  )
}
