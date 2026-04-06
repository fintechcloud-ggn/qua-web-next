"use client"
import { motion } from "framer-motion"
import { Users, IndianRupee, Star, Zap, CheckCircle, Clock, Landmark, Lock, FileCheck, Award, Gem, Send, BarChart3 } from "lucide-react"

const statsRow1 = [
  { val: "1 Lakh+", label: "Happy Customers", icon: <Users className="w-4 h-4 text-blue-600" /> },
  { val: "500 Cr+", label: "Loans Disbursed", icon: <IndianRupee className="w-4 h-4 text-emerald-600" /> },
  { val: "4.9 / 5", label: "Customer Rating", icon: <Star className="w-4 h-4 text-yellow-500" /> },
  { val: "< 5 min", label: "Approval Time", icon: <Zap className="w-4 h-4 text-blue-600" /> },
  { val: "98%", label: "Approval Rate", icon: <CheckCircle className="w-4 h-4 text-emerald-600" /> },
  { val: "24 / 7", label: "Available", icon: <Clock className="w-4 h-4 text-indigo-500" /> },
]

const trustRow2 = [
  { val: "RBI Registered", icon: <Landmark className="w-4 h-4 text-gray-700" /> },
  { val: "256-bit SSL", icon: <Lock className="w-4 h-4 text-blue-600" /> },
  { val: "DPDP Compliant", icon: <FileCheck className="w-4 h-4 text-emerald-600" /> },
  { val: "ISO 27001", icon: <Award className="w-4 h-4 text-yellow-600" /> },
  { val: "Zero Hidden Fees", icon: <Gem className="w-4 h-4 text-blue-500" /> },
  { val: "Instant IMPS", icon: <Send className="w-4 h-4 text-indigo-600" /> },
  { val: "No CIBIL Needed", icon: <BarChart3 className="w-4 h-4 text-gray-500" /> },
]

function MarqueeRow({ items, reverse = false, speed = 30 }: {
  items: { val: string; label?: string; icon: React.ReactNode }[]
  reverse?: boolean
  speed?: number
}) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden relative">
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <div key={i}
            className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-gray-200/60 backdrop-blur-md whitespace-nowrap flex-shrink-0 shadow-sm"
            style={{ background: "rgba(255,255,255,0.7)" }}>
            <span className="flex items-center justify-center">{item.icon}</span>
            <span className="text-gray-900 font-bold text-sm">{item.val}</span>
            {item.label && <span className="text-gray-500 font-medium text-xs">· {item.label}</span>}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function StatsSection() {
  return (
    <section className="py-12 space-y-3">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8" />
      <MarqueeRow items={statsRow1} speed={35} />
      <MarqueeRow items={trustRow2} reverse speed={25} />
    </section>
  )
}
