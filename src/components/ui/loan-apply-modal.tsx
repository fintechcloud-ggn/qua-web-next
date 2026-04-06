"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

// ─── Dot Map (adapted for light background) ───────────────────────────────────
function DotMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvas.parentElement) return
    const ro = new ResizeObserver(entries => {
      const { width: w, height: h } = entries[0].contentRect
      setDims({ w, h })
      canvas.width = w
      canvas.height = h
    })
    ro.observe(canvas.parentElement)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!dims.w || !dims.h) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Generate world-silhouette dots
    const dots: { x: number; y: number; op: number }[] = []
    const gap = 10
    const { w, h } = dims
    for (let x = 0; x < w; x += gap) {
      for (let y = 0; y < h; y += gap) {
        const inMap =
          // North America
          (x < w * 0.28 && x > w * 0.05 && y < h * 0.45 && y > h * 0.08) ||
          // South America
          (x < w * 0.28 && x > w * 0.14 && y < h * 0.85 && y > h * 0.45) ||
          // Europe
          (x < w * 0.48 && x > w * 0.3 && y < h * 0.38 && y > h * 0.1) ||
          // Africa
          (x < w * 0.52 && x > w * 0.32 && y < h * 0.72 && y > h * 0.32) ||
          // Asia
          (x < w * 0.78 && x > w * 0.48 && y < h * 0.52 && y > h * 0.08) ||
          // Australia
          (x < w * 0.85 && x > w * 0.68 && y < h * 0.82 && y > h * 0.58)
        if (inMap && Math.random() > 0.35) {
          // Darker dots for light background
          dots.push({ x, y, op: Math.random() * 0.4 + 0.2 })
        }
      }
    }

    // Routes
    const routes = [
      { sx: w * 0.15, sy: h * 0.22, ex: w * 0.38, ey: h * 0.18, delay: 0 },
      { sx: w * 0.38, sy: h * 0.18, ex: w * 0.62, ey: h * 0.28, delay: 1.8 },
      { sx: w * 0.08, sy: h * 0.15, ex: w * 0.22, ey: h * 0.55, delay: 0.8 },
      { sx: w * 0.62, sy: h * 0.28, ex: w * 0.76, ey: h * 0.24, delay: 3.2 },
    ]

    let startTime = Date.now()
    let raf: number

    function draw() {
      ctx.clearRect(0, 0, w, h)
      // Draw dots
      dots.forEach(d => {
        ctx.beginPath()
        ctx.arc(d.x, d.y, 1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(37, 99, 235, ${d.op})` // Blue dots
        ctx.fill()
      })
      // Draw animated routes
      const t = (Date.now() - startTime) / 1000
      routes.forEach(r => {
        const elapsed = t - r.delay
        if (elapsed <= 0) return
        const progress = Math.min(elapsed / 2.5, 1)
        const cx = r.sx + (r.ex - r.sx) * progress
        const cy = r.sy + (r.ey - r.sy) * progress
        // Line
        ctx.beginPath()
        ctx.moveTo(r.sx, r.sy)
        ctx.lineTo(cx, cy)
        ctx.strokeStyle = "rgba(37, 99, 235, 0.4)"
        ctx.lineWidth = 1.2
        ctx.stroke()
        // Start dot
        ctx.beginPath()
        ctx.arc(r.sx, r.sy, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#2563eb"
        ctx.fill()
        // Moving dot + glow
        ctx.beginPath()
        ctx.arc(cx, cy, 4, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(37, 99, 235, 0.3)"
        ctx.fill()
        ctx.beginPath()
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = "#60a5fa"
        ctx.fill()
      })
      if (t > 14) startTime = Date.now()
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [dims])

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: "Personal Info", icon: "👤", sub: "Name, phone & email" },
  { id: 2, title: "Loan Details", icon: "💰", sub: "Amount & purpose" },
  { id: 3, title: "Employment", icon: "💼", sub: "Income details" },
  { id: 4, title: "KYC", icon: "🏦", sub: "PAN & Aadhaar" },
  { id: 5, title: "Review", icon: "✅", sub: "Confirm & submit" },
]
const PURPOSES = ["Medical Emergency", "Salary Gap", "Home Expenses", "Travel", "Education", "Business", "Other"]
const EMP_TYPES = ["Salaried", "Self-Employed", "Business Owner", "Freelancer"]

interface Form {
  fullName: string; phone: string; email: string; dob: string
  loanAmount: number; tenure: number; purpose: string
  employmentType: string; monthlyIncome: string; company: string
  panCard: string; aadhaar: string; bankAccount: string; agreed: boolean
}

export default function LoanApplyModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<Form>({
    fullName: "", phone: "", email: "", dob: "",
    loanAmount: 25000, tenure: 30, purpose: "",
    employmentType: "", monthlyIncome: "", company: "",
    panCard: "", aadhaar: "", bankAccount: "", agreed: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Form | "agreed", string>>>({})
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")

  const upd = (k: keyof Form, v: string | number | boolean) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: "" }))
  }
  const validate = () => {
    const e: Record<string, string> = {}
    if (step === 1) {
      if (!form.fullName) e.fullName = "Required"
      if (!form.phone || form.phone.length !== 10) e.phone = "Enter valid 10-digit phone"
      if (!form.email || !form.email.includes("@")) e.email = "Enter valid email"
    }
    if (step === 2 && !form.purpose) e.purpose = "Select a purpose"
    if (step === 3) {
      if (!form.employmentType) e.employmentType = "Required"
      if (!form.monthlyIncome || Number(form.monthlyIncome) < 10000) e.monthlyIncome = "Min ₹10,000 required"
    }
    if (step === 4) {
      if (!form.panCard || form.panCard.length !== 10) e.panCard = "Valid 10-char PAN required"
      if (!form.aadhaar || form.aadhaar.length !== 12) e.aadhaar = "Valid 12-digit Aadhaar required"
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 5)) }
  const back = () => setStep(s => Math.max(s - 1, 1))
  const sendOtp = () => { setLoading(true); setTimeout(() => { setLoading(false); setOtpSent(true) }, 1500) }
  const submit = () => {
    if (!form.agreed) { setErrors({ agreed: "Please accept terms" }); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); onSuccess() }, 2500)
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100
  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n)

  // Light theme input class
  const inp = (err?: string) =>
    `w-full rounded-xl px-4 py-3 text-sm text-gray-900 transition-all duration-200 outline-none placeholder:text-gray-400 focus:ring-2 ${err ? "bg-red-50 border border-red-200 focus:ring-red-500/40" : "bg-gray-50 border border-gray-200 focus:ring-blue-500/40 focus:border-blue-500"}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="w-full max-w-4xl overflow-hidden rounded-3xl flex shadow-2xl bg-white"
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
      >
        {/* ── LEFT PANEL — Dot Map ─────────────────────────────────────── */}
        <div className="hidden md:flex w-5/12 flex-col relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)", borderRight: "1px solid #e5e7eb" }}>

          {/* Dot map canvas fills bg */}
          <div className="absolute inset-0">
            <DotMap />
          </div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-32"
            style={{ background: "linear-gradient(to top,#e0e7ff,transparent)" }} />

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col h-full p-8 text-gray-900">
            {/* Logo */}
            <motion.div className="flex items-center gap-2"
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md shadow-blue-200/50"
                style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)" }}>Q</div>
              <span className="font-bold text-lg tracking-tight">QuaLoan</span>
            </motion.div>

            {/* Center content */}
            <div className="flex-1 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 border border-green-200 text-green-700 text-[11px] font-bold mb-5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  98% Approval Rate
                </div>
                <h2 className="text-3xl font-black leading-tight mb-3 text-gray-900">
                  Get up to<br />
                  <span className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
                    ₹1,00,000
                  </span>
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Money in your account in under 10 minutes. No branch visit. No CIBIL check.
                </p>
              </motion.div>

              {/* Step progress sidebar */}
              <motion.div className="mt-10 space-y-3"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                {STEPS.map((s, i) => {
                  const isActive = step === s.id;
                  const isPast = step > s.id;
                  return (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all duration-300"
                        style={{
                          background: isPast ? "linear-gradient(135deg,#3b82f6,#4f46e5)" : isActive ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.6)",
                          border: isActive ? "2px solid #3b82f6" : isPast ? "transparent" : "1px solid #d1d5db",
                          color: isPast ? "#fff" : isActive ? "#2563eb" : "#9ca3af",
                          boxShadow: isPast ? "0 2px 6px rgba(59,130,246,0.3)" : "none"
                        }}>
                        {isPast ? "✓" : s.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold transition-colors duration-300"
                          style={{ color: isActive ? "#111827" : "#6b7280" }}>
                          {s.title}
                        </div>
                        <div className="text-[10px] transition-colors duration-300"
                          style={{ color: isActive ? "#4b5563" : "#9ca3af" }}>
                          {s.sub}
                        </div>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="w-px h-4 ml-3.5 mt-0.5 absolute translate-y-5"
                          style={{ background: isPast ? "#93c5fd" : "#e5e7eb" }} />
                      )}
                    </div>
                  )
                })}
              </motion.div>
            </div>

            {/* Bottom trust badges */}
            <motion.div className="flex gap-2 flex-wrap text-gray-500"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              {["🏛️ RBI", "🔒 SSL", "🛡️ DPDP"].map(t => (
                <span key={t} className="text-[10px] bg-white/50 border border-indigo-100 px-2.5 py-1 rounded-full shadow-sm">
                  {t}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Form ───────────────────────────────────────── */}
        <div className="flex-1 flex flex-col max-h-[90vh] overflow-hidden bg-white">

          {/* Header */}
          <div className="px-8 pt-7 pb-0 flex-shrink-0">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-gray-900 font-black text-xl">{STEPS[step - 1].title}</h1>
                <p className="text-gray-500 text-xs mt-0.5">Step {step} of {STEPS.length} · {STEPS[step - 1].sub}</p>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 text-sm cursor-pointer transition-all">
                ✕
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-100 rounded-full mb-6 overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#3b82f6,#4f46e5)" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }} />
            </div>
          </div>

          {/* Form body — scrollable */}
          <div className="flex-1 overflow-y-auto px-8 pb-2">
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -18 }}
                transition={{ duration: 0.22 }}
                className="space-y-4 min-h-[300px]">

                {/* STEP 1 — Personal */}
                {step === 1 && (<>
                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-1.5">Full Name <span className="text-blue-500">*</span></label>
                    <input className={inp(errors.fullName)} placeholder="As per Aadhaar card" value={form.fullName} onChange={e => upd("fullName", e.target.value)} />
                    {errors.fullName && <div className="text-red-500 text-xs mt-1">{errors.fullName}</div>}
                  </div>

                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-1.5">Mobile Number <span className="text-blue-500">*</span></label>
                    <div className="flex gap-2">
                      <input className={`flex-1 ${inp(errors.phone)}`} placeholder="10-digit mobile" maxLength={10} value={form.phone} onChange={e => upd("phone", e.target.value.replace(/\D/g, ""))} />
                      {!otpSent ? (
                        <motion.button onClick={sendOtp} disabled={form.phone.length !== 10 || loading}
                          className="px-4 rounded-xl text-xs font-bold cursor-pointer transition-all disabled:opacity-50 text-white flex-shrink-0 shadow-sm"
                          style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)" }}
                          whileTap={{ scale: 0.97 }}>
                          {loading ? "…" : "Send OTP"}
                        </motion.button>
                      ) : (
                        <div className="px-3 rounded-xl text-xs font-bold bg-green-50 text-green-600 border border-green-200 flex items-center flex-shrink-0">✓ Sent</div>
                      )}
                    </div>
                    {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                  </div>

                  {otpSent && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <label className="text-gray-700 text-xs font-semibold block mb-1.5">OTP</label>
                      <input className={inp()} placeholder="6-digit OTP" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))} />
                    </motion.div>
                  )}

                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-1.5">Email <span className="text-blue-500">*</span></label>
                    <input className={inp(errors.email)} type="email" placeholder="you@email.com" value={form.email} onChange={e => upd("email", e.target.value)} />
                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                  </div>

                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-1.5">Date of Birth</label>
                    <input className={inp()} type="date" value={form.dob} onChange={e => upd("dob", e.target.value)} />
                  </div>
                </>)}

                {/* STEP 2 — Loan Details */}
                {step === 2 && (<>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-gray-700 text-xs font-semibold">Loan Amount</label>
                      <motion.span key={form.loanAmount} className="text-blue-600 font-black"
                        initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        {fmt(form.loanAmount)}
                      </motion.span>
                    </div>
                    <input type="range" min={5000} max={100000} step={5000} value={form.loanAmount} onChange={e => upd("loanAmount", Number(e.target.value))}
                      className="w-full cursor-pointer h-1.5 rounded-full appearance-none mb-1 shadow-inner"
                      style={{ background: `linear-gradient(to right,#3b82f6 ${((form.loanAmount - 5000) / 95000) * 100}%, #e5e7eb ${((form.loanAmount - 5000) / 95000) * 100}%)`, accentColor: "#3b82f6" }} />
                    <div className="flex justify-between text-gray-400 text-[10px] font-medium"><span>₹5K</span><span>₹1L</span></div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-gray-700 text-xs font-semibold">Tenure</label>
                      <span className="text-indigo-600 font-black">{form.tenure} Days</span>
                    </div>
                    <input type="range" min={7} max={90} step={7} value={form.tenure} onChange={e => upd("tenure", Number(e.target.value))}
                      className="w-full cursor-pointer h-1.5 rounded-full appearance-none mb-1 shadow-inner"
                      style={{ background: `linear-gradient(to right,#4f46e5 ${((form.tenure - 7) / 83) * 100}%, #e5e7eb ${((form.tenure - 7) / 83) * 100}%)`, accentColor: "#4f46e5" }} />
                    <div className="flex justify-between text-gray-400 text-[10px] font-medium"><span>7 Days</span><span>90 Days</span></div>
                  </div>

                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-2">Purpose <span className="text-blue-500">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {PURPOSES.map(p => (
                        <button key={p} onClick={() => upd("purpose", p)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all shadow-sm ${form.purpose === p ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                    {errors.purpose && <div className="text-red-500 text-xs mt-1">{errors.purpose}</div>}
                  </div>

                  {/* Summary card */}
                  <div className="rounded-xl p-4 flex justify-between shadow-sm"
                    style={{ background: "linear-gradient(135deg, #f0fdfa, #ecfeff)", border: "1px solid #ccfbf1" }}>
                    {[
                      { label: "Amount", val: fmt(form.loanAmount), color: "text-gray-900" },
                      { label: "Interest", val: fmt(form.loanAmount * 0.015 * (form.tenure / 30)), color: "text-gray-600" },
                      { label: "Total", val: fmt(form.loanAmount * (1 + 0.015 * (form.tenure / 30))), color: "text-emerald-700" },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <div className={`font-black text-base ${s.color}`}>{s.val}</div>
                        <div className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </>)}

                {/* STEP 3 — Employment */}
                {step === 3 && (<>
                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-2">Employment Type <span className="text-blue-500">*</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      {EMP_TYPES.map(t => (
                        <button key={t} onClick={() => upd("employmentType", t)}
                          className={`py-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all shadow-sm ${form.employmentType === t ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    {errors.employmentType && <div className="text-red-500 text-xs mt-1">{errors.employmentType}</div>}
                  </div>
                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-1.5">Monthly Income <span className="text-blue-500">*</span></label>
                    <input className={inp(errors.monthlyIncome)} placeholder="₹ Monthly take-home" value={form.monthlyIncome} onChange={e => upd("monthlyIncome", e.target.value.replace(/\D/g, ""))} />
                    {errors.monthlyIncome && <div className="text-red-500 text-xs mt-1">{errors.monthlyIncome}</div>}
                  </div>
                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-1.5">Company / Employer</label>
                    <input className={inp()} placeholder="Your company name" value={form.company} onChange={e => upd("company", e.target.value)} />
                  </div>
                </>)}

                {/* STEP 4 — KYC */}
                {step === 4 && (<>
                  <div className="rounded-xl px-4 py-3 text-amber-800 text-xs shadow-sm"
                    style={{ background: "#fffbeb", border: "1px solid #fef3c7" }}>
                    🔒 All KYC data is encrypted with 256-bit SSL. RBI & DPDP compliant.
                  </div>
                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-1.5">PAN Card <span className="text-blue-500">*</span></label>
                    <input className={inp(errors.panCard)} placeholder="ABCDE1234F" maxLength={10} value={form.panCard} onChange={e => upd("panCard", e.target.value.toUpperCase())} />
                    {errors.panCard && <div className="text-red-500 text-xs mt-1">{errors.panCard}</div>}
                  </div>
                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-1.5">Aadhaar Number <span className="text-blue-500">*</span></label>
                    <input className={inp(errors.aadhaar)} placeholder="12-digit Aadhaar" maxLength={12} value={form.aadhaar} onChange={e => upd("aadhaar", e.target.value.replace(/\D/g, ""))} />
                    {errors.aadhaar && <div className="text-red-500 text-xs mt-1">{errors.aadhaar}</div>}
                  </div>
                  <div>
                    <label className="text-gray-700 text-xs font-semibold block mb-1.5">Bank Account</label>
                    <input className={inp()} placeholder="Account to receive funds" value={form.bankAccount} onChange={e => upd("bankAccount", e.target.value.replace(/\D/g, ""))} />
                  </div>
                </>)}

                {/* STEP 5 — Review */}
                {step === 5 && (<>
                  <div className="rounded-xl p-5 space-y-2.5 shadow-sm"
                    style={{ background: "#ecfdf5", border: "1px solid #d1fae5" }}>
                    <div className="text-emerald-700 font-bold text-sm mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px]">✅</span> 
                      Application Summary
                    </div>
                    {[
                      { l: "Name", v: form.fullName || "—" },
                      { l: "Phone", v: form.phone || "—" },
                      { l: "Loan", v: fmt(form.loanAmount) },
                      { l: "Tenure", v: `${form.tenure} Days` },
                      { l: "Purpose", v: form.purpose || "—" },
                      { l: "Employment", v: form.employmentType || "—" },
                      { l: "Income", v: form.monthlyIncome ? fmt(Number(form.monthlyIncome)) : "—" },
                    ].map(item => (
                      <div key={item.l} className="flex justify-between border-b border-emerald-100 pb-2">
                        <span className="text-emerald-800/60 text-xs font-medium">{item.l}</span>
                        <span className="text-emerald-900 text-xs font-bold">{item.v}</span>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group mt-2">
                    <input type="checkbox" checked={form.agreed} onChange={e => upd("agreed", e.target.checked)} 
                      className="mt-0.5 flex-shrink-0 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                    <span className="text-gray-600 text-xs leading-relaxed group-hover:text-gray-900 transition-colors">
                      I agree to the{" "}
                      <span className="text-blue-600 hover:underline">Terms & Conditions</span>,{" "}
                      <span className="text-blue-600 hover:underline">Privacy Policy</span>, and{" "}
                      <span className="text-blue-600 hover:underline">Loan Agreement</span>.
                      I authorize QuaLoan to perform a soft credit check.
                    </span>
                  </label>
                  {errors.agreed && <div className="text-red-500 text-xs">{errors.agreed}</div>}
                </>)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 flex-shrink-0 border-t border-gray-100 bg-gray-50/50">
            <div className="flex gap-3">
              {step > 1 && (
                <button onClick={back}
                  className="flex-1 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-semibold cursor-pointer hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-all focus:ring-2 focus:ring-gray-200 focus:outline-none">
                  ← Back
                </button>
              )}
              {step < 5 ? (
                <motion.button onClick={next}
                  className="flex-[2] py-3.5 rounded-xl text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                  style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)" }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(59,130,246,0.3)" }}
                  whileTap={{ scale: 0.98 }}>
                  Continue <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button onClick={submit} disabled={loading}
                  className="flex-[2] py-3.5 rounded-xl text-white text-sm font-bold cursor-pointer transition-all disabled:opacity-75 flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                  style={{ background: loading ? "#10b981" : "linear-gradient(135deg,#10b981,#059669)" }}
                  whileHover={!loading ? { scale: 1.02, boxShadow: "0 8px 20px rgba(16,185,129,0.3)" } : {}}
                  whileTap={{ scale: 0.98 }}>
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing...</>
                  ) : "🚀 Submit Application"}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
