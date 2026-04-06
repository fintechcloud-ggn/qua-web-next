"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MonitorSmartphone, Cpu, ShieldCheck, Landmark, RefreshCw } from "lucide-react"

const steps = [
  { num: "01", icon: <MonitorSmartphone className="w-1/2 h-1/2" />, title: "Fill Simple Form", desc: "Share your basic details, income, and pan card. Our 2-minute digital form requires absolutely zero physical paperwork.", time: "2 min", color: "#2563eb" }, // blue-600
  { num: "02", icon: <Cpu className="w-1/2 h-1/2" />, title: "AI Credit Check", desc: "Our proprietary AI engine evaluates your profile instantly. No CIBIL score required — get your results in under 60 seconds.", time: "1 min", color: "#4f46e5" }, // indigo-600
  { num: "03", icon: <ShieldCheck className="w-1/2 h-1/2" />, title: "Instant Approval", desc: "Review your personalized loan offer directly on screen. Accept with one tap and complete a secure digital e-sign.", time: "1 min", color: "#9333ea" }, // purple-600
  { num: "04", icon: <Landmark className="w-1/2 h-1/2" />, title: "Money in Account", desc: "Funds are transferred via IMPS directly to your linked Indian bank account. Arrives in 5–30 minutes, 24/7.", time: "5 min", color: "#059669" }, // emerald-600
]

export default function HowItWorks() {
  const [active, setActive] = useState(0)

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16 max-w-7xl mx-auto" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <RefreshCw className="w-3.5 h-3.5" /> Process
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">
            Money in{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
              4 Simple Steps
            </span>
          </h2>
          <p className="text-gray-500 font-medium text-lg">10 minutes total time. From start to cash.</p>
        </motion.div>

        <div className="bg-white/60 border border-gray-200 rounded-3xl p-4 md:p-8 backdrop-blur-xl shadow-xl shadow-blue-900/5">
          {/* Tabs / Stepper */}
          <div className="relative flex justify-between items-center mb-12">
            {/* Background Track */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full" />
            
            {/* Active Progress Track */}
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full"
              style={{ background: steps[active].color }}
              initial={{ width: "0%" }}
              animate={{ width: `${(active / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {steps.map((step, i) => {
              const isActive = i === active;
              const isPast = i < active;
              
              return (
                <div key={step.num} className="relative z-10 flex flex-col items-center">
                  <motion.button
                    onClick={() => setActive(i)}
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 cursor-pointer shadow-sm"
                    style={{
                      backgroundColor: isActive || isPast ? step.color : "#ffffff",
                      border: `2px solid ${isActive || isPast ? step.color : "#e5e7eb"}`,
                      color: isActive || isPast ? "#ffffff" : "#9ca3af"
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive ? step.icon : step.num}
                  </motion.button>
                  <div className={`absolute top-14 w-32 text-center text-xs font-bold transition-colors duration-300 hidden md:block ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.title}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="md:h-12 hidden md:block" /> {/* Spacer for the absolute titles on desktop */}

          {/* Expanded Content Area */}
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full transition-colors duration-500" style={{ backgroundColor: steps[active].color }} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-full flex items-center justify-center text-gray-700 shadow-inner border border-gray-50"
                     style={{ background: `linear-gradient(135deg, #f8fafc, ${steps[active].color}15)`, color: steps[active].color }}>
                  {steps[active].icon}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4" 
                       style={{ backgroundColor: `${steps[active].color}15`, color: steps[active].color }}>
                    Step {steps[active].num}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
                    {steps[active].title}
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">
                    {steps[active].desc}
                  </p>
                </div>

                <div className="flex-shrink-0 md:text-right border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 mt-4 md:mt-0 w-full md:w-auto text-center">
                  <div className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Time Estimate</div>
                  <div className="text-4xl font-black" style={{ color: steps[active].color }}>
                    {steps[active].time}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
