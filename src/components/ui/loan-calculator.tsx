"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoanCalculator({ onApplyClick }: { onApplyClick: () => void }) {
  const [amount, setAmount] = useState(25000)
  const [tenure, setTenure] = useState(30)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const interest = amount * 0.015 * (tenure / 30)
  const fee = Math.min(amount * 0.02, 999)
  const total = amount + interest + fee

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  // Draw donut chart
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = 200 * dpr
    canvas.height = 200 * dpr
    ctx.scale(dpr, dpr)

    const cx = 100, cy = 100, r = 78, lineW = 18
    ctx.clearRect(0, 0, 200, 200)

    const principalAngle = (amount / total) * Math.PI * 2
    const interestAngle = (interest / total) * Math.PI * 2
    const feeAngle = (fee / total) * Math.PI * 2
    const gap = 0.04

    const drawArc = (start: number, end: number, color: string) => {
      ctx.beginPath()
      ctx.arc(cx, cy, r, start + gap / 2, end - gap / 2)
      ctx.lineWidth = lineW
      ctx.strokeStyle = color
      ctx.lineCap = "round"
      ctx.stroke()
    }

    const start1 = -Math.PI / 2
    const start2 = start1 + principalAngle
    const start3 = start2 + interestAngle

    drawArc(start1, start2, "#e2e8f0") // slate-200 for Light Mode background track
    drawArc(start2, start3, "#3b82f6") // blue-500
    drawArc(start3, start3 + feeAngle, "#8b5cf6") // purple-500

    // Center text
    ctx.fillStyle = "#111827" // gray-900
    ctx.font = "bold 22px system-ui"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(fmt(total).replace("₹", "₹"), cx, cy - 10)
    ctx.fillStyle = "#6b7280" // gray-500
    ctx.font = "11px system-ui"
    ctx.fillText("Total Repayable", cx, cy + 14)
  }, [amount, tenure, total, interest, fee])

  const presets = [5000, 15000, 25000, 50000, 75000, 100000]
  const glass = { background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)" }

  return (
    <section id="calculator" className="py-24">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16 max-w-6xl mx-auto" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            🧮 Loan Calculator
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            Find Your{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
              Perfect Loan
            </span>
          </h2>
          <p className="text-gray-500 font-medium text-lg">No hidden charges — ever.</p>
        </motion.div>

        {/* Bento layout */}
        <div className="grid md:grid-cols-3 gap-4">

          {/* Donut chart — tall left card */}
          <motion.div
            className="md:row-span-2 rounded-3xl p-8 border border-gray-200 flex flex-col items-center justify-center shadow-sm"
            style={glass}
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <canvas ref={canvasRef} style={{ width: 200, height: 200 }} />
            <div className="mt-6 space-y-2 w-full">
              {[
                { label: "Principal", color: "#e2e8f0", value: fmt(amount) },
                { label: "Interest", color: "#3b82f6", value: fmt(interest) },
                { label: "Processing", color: "#8b5cf6", value: fmt(fee) },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: item.color }} />
                    <span className="text-gray-500 font-medium text-xs">{item.label}</span>
                  </div>
                  <span className="text-gray-900 font-bold text-xs">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Amount slider card */}
          <motion.div
            className="md:col-span-2 rounded-3xl p-7 border border-gray-200 shadow-sm"
            style={glass}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex justify-between mb-5">
              <div>
                <div className="text-gray-500 font-medium text-xs mb-1 uppercase tracking-wider">Loan Amount</div>
                <motion.div key={amount} className="text-3xl font-black text-gray-900"
                  initial={{ scale: 1.08, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}>
                  {fmt(amount)}
                </motion.div>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                {presets.map(p => (
                  <button key={p} onClick={() => setAmount(p)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer shadow-sm ${
                      amount === p
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}>
                    ₹{p >= 1000 ? p / 1000 + "K" : p}
                  </button>
                ))}
              </div>
            </div>
            <input type="range" min={5000} max={100000} step={5000} value={amount}
              onChange={e => setAmount(+e.target.value)}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer mb-1"
              style={{
                background: `linear-gradient(to right,#3b82f6 ${((amount-5000)/95000)*100}%,rgba(0,0,0,0.05) ${((amount-5000)/95000)*100}%)`,
                accentColor: "#3b82f6"
              }} />
            <div className="flex justify-between text-gray-400 font-medium text-[10px]"><span>₹5K</span><span>₹1L</span></div>
          </motion.div>

          {/* Tenure slider card */}
          <motion.div
            className="md:col-span-2 rounded-3xl p-7 border border-gray-200 shadow-sm"
            style={glass}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}>
            <div className="flex justify-between mb-5">
              <div>
                <div className="text-gray-500 font-medium text-xs mb-1 uppercase tracking-wider">Repayment Tenure</div>
                <motion.div key={tenure} className="text-3xl font-black text-indigo-600"
                  initial={{ scale: 1.08, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}>
                  {tenure} Days
                </motion.div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 font-medium text-xs mb-1 uppercase tracking-wider">Daily payment</div>
                <div className="text-gray-900 font-bold text-lg">{fmt(total / tenure)}</div>
              </div>
            </div>
            <input type="range" min={7} max={90} step={7} value={tenure}
              onChange={e => setTenure(+e.target.value)}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer mb-1"
              style={{
                background: `linear-gradient(to right,#4f46e5 ${((tenure-7)/83)*100}%,rgba(0,0,0,0.05) ${((tenure-7)/83)*100}%)`,
                accentColor: "#4f46e5"
              }} />
            <div className="flex justify-between text-gray-400 font-medium text-[10px]"><span>7 Days</span><span>90 Days</span></div>

            <div className="mt-5 pt-5 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <span className="text-blue-500 text-lg">💎</span>
                1.5% flat per month · Zero prepayment penalty
              </div>
              <motion.button onClick={onApplyClick}
                className="px-6 py-2.5 rounded-full text-white text-sm font-bold cursor-pointer shadow-md shadow-blue-500/20"
                style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)" }}
                whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(59,130,246,0.3)" }}
                whileTap={{ scale: 0.97 }}>
                🚀 Apply for {fmt(amount)}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
