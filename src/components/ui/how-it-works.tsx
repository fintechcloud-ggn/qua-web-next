"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { MonitorSmartphone, Cpu, ShieldCheck, Landmark, RefreshCw, CheckCircle2 } from "lucide-react"

const steps = [
  { num: "01", icon: <MonitorSmartphone className="w-8 h-8 md:w-10 md:h-10" />, title: "Fill Simple Form", desc: "Share your basic details. Our digital form requires absolutely zero paperwork.", time: "2 min", color: "#2563eb" },
  { num: "02", icon: <Cpu className="w-8 h-8 md:w-10 md:h-10" />, title: "AI Credit Check", desc: "Our proprietary AI engine evaluates your profile instantly. No CIBIL required.", time: "< 60 sec", color: "#4f46e5" },
  { num: "03", icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10" />, title: "Instant Approval", desc: "Review your personalized loan offer and complete a secure digital e-sign.", time: "1 min", color: "#9333ea" },
  { num: "04", icon: <Landmark className="w-8 h-8 md:w-10 md:h-10" />, title: "Money in Account", desc: "Funds transferred via IMPS directly to your bank account. Arrives instantly.", time: "5 min", color: "#059669" },
]

// Subcomponent for the massive scaling icons to safely use hooks
function StepIcon({ step, i, scrollYProgress }: { step: any, i: number, scrollYProgress: any }) {
  const input = i === 0 ? [0, 0.33] : i === 3 ? [0.66, 1] : [(i-1)*0.33, i*0.33, (i+1)*0.33];
  const output = i === 0 ? [1.2, 0.5] : i === 3 ? [0.5, 1.2] : [0.5, 1.2, 0.5];
  const scale = useTransform(scrollYProgress, input, output);

  return (
    <div className="w-full flex justify-center text-white drop-shadow-xl" style={{ color: step.color }}>
      <motion.div style={{ scale }}>
        {step.icon}
      </motion.div>
    </div>
  )
}

// Subcomponent for the details to safely use hooks
function StepDetails({ step, i, scrollYProgress }: { step: any, i: number, scrollYProgress: any }) {
  const center = i * 0.33; 
  const inputOp = i === 0 ? [0, 0.2] : i === 3 ? [0.8, 1] : [center - 0.2, center, center + 0.2];
  const outputOp = i === 0 ? [1, 0.3] : i === 3 ? [0.3, 1] : [0.3, 1, 0.3];
  const inputScale = i === 0 ? [0, 0.2] : i === 3 ? [0.8, 1] : [center - 0.2, center, center + 0.2];
  const outputScale = i === 0 ? [1.05, 0.95] : i === 3 ? [0.95, 1.05] : [0.95, 1.05, 0.95];

  const opacity = useTransform(scrollYProgress, inputOp, outputOp);
  const scale = useTransform(scrollYProgress, inputScale, outputScale);
  const borderColor = useTransform(scrollYProgress, (v: any) => typeof v === 'number' && v >= center - 0.05 ? step.color : "rgba(255,255,255,0.15)");

  return (
    <motion.div style={{ opacity, scale }} className="relative pl-16 md:pl-24">
      <motion.div 
        className="absolute -left-[5.25rem] md:-left-[4.75rem] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-[3px] flex items-center justify-center bg-black shadow-lg transition-colors duration-300"
        style={{ borderColor }}
      >
         <CheckCircle2 className="w-5 h-5 transition-colors duration-300" style={{ color: step.color }} />
      </motion.div>

      <div className="bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-xl shadow-black/50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-black text-white tracking-tight">{step.title}</h3>
          <span className="text-sm font-black hidden md:block" style={{ color: step.color }}>{step.time}</span>
        </div>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const containerRef = useRef(null)
  
  // Track scroll within this specific h-[400vh] container
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  })

  // We have 4 steps, split the 0-1 progress into 4 chunks
  // 0.00-0.25: Step 1
  // 0.25-0.50: Step 2
  // 0.50-0.75: Step 3
  // 0.75-1.00: Step 4

  return (
    <section id="how-it-works" ref={containerRef} className="relative h-[300vh] bg-transparent">
      
      {/* Sticky viewport that stays on screen while parsing the 400vh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center py-20">
        
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div className="text-center mb-10 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/30 border border-blue-800/50 text-blue-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
              <RefreshCw className="w-3.5 h-3.5" /> Fast Execution
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tight">
              Money in{" "}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#60a5fa,#8b5cf6)" }}>
                4 Simple Steps
              </span>
            </h2>
            <p className="text-gray-400 font-medium text-lg">Scroll to execute timeline</p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center">
            
            {/* LEFT SIDE: Dynamic Big Graphic */}
            <div className="hidden md:flex flex-1 justify-center relative">
              {/* Massive glowing rings */}
              <motion.div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-40 mix-blend-multiply"
                style={{
                  background: useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [steps[0].color, steps[1].color, steps[2].color, steps[3].color])
                }}
              />
              <div className="relative w-64 h-64 lg:w-80 lg:h-80 bg-black/40 rounded-full shadow-2xl border-4 border-white/10 flex items-center justify-center overflow-hidden z-10 backdrop-blur-xl">
                 <motion.div
                   className="flex items-center gap-[200px]"
                   // Move a giant track horizontally based on scroll
                   style={{
                     x: useTransform(scrollYProgress, [0, 1], ["0%", "-300%"]),
                     width: "400%"
                   }}
                 >
                    {steps.map((step, i) => (
                       <StepIcon key={i} step={step} i={i} scrollYProgress={scrollYProgress} />
                    ))}
                 </motion.div>
              </div>
            </div>

            {/* RIGHT SIDE: Vertical text timeline connected directly to scroll */}
            <div className="flex-1 w-full max-w-lg relative py-8">
              
              {/* Background static line */}
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-1 bg-white/10 rounded-full" />
              
              {/* Foreground active line bound to scroll! */}
              <motion.div 
                className="absolute left-6 md:left-8 top-0 w-1 rounded-full origin-top"
                style={{ 
                  scaleY: scrollYProgress,
                  background: useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [steps[0].color, steps[1].color, steps[2].color, steps[3].color])
                }}
              />

              <div className="flex flex-col gap-12 relative z-10">
                {steps.map((step, i) => (
                  <StepDetails key={step.num} step={step} i={i} scrollYProgress={scrollYProgress} />
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
