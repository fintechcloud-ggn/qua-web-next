"use client"

import { startTransition, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Sparkles, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import BrandLogo from "@/components/ui/brand-logo"

type AuthMode = "signin" | "signup"

export default function AuthPopup({
  open,
  onClose,
  onAuthSuccess,
}: {
  open: boolean
  onClose: () => void
  onAuthSuccess?: (user: { name: string; email: string; mobile: string; city?: string } | null) => void
}) {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("signin")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "Anu Sharma",
    mobile: "9876543210",
    email: "anu.sharma@example.com",
    city: "Gurugram",
    password: "123456",
  })

  const title = useMemo(() => {
    return mode === "signin" ? "Welcome back" : "Create borrower access"
  }, [mode])

  const handleContinue = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          city: form.city,
          password: form.password,
        }),
      })

      const data = (await response.json()) as {
        ok: boolean
        message?: string
        user?: { name: string; email: string; mobile: string; city?: string }
      }

      if (!response.ok || !data.ok || !data.user) {
        setError(data.message || "Unable to sign in right now.")
        setLoading(false)
        return
      }

      onAuthSuccess?.(data.user)
      setLoading(false)
      startTransition(() => {
        onClose()
        router.push("/dashboard")
      })
      router.refresh()
    } catch {
      setLoading(false)
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[220] flex items-center justify-center bg-[#2a1708]/65 p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              onClose()
            }
          }}
        >
          <motion.div
            className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-orange-200/70 bg-[#fff8f1] shadow-[0_40px_160px_rgba(120,53,15,0.24)] lg:grid-cols-[1.05fr_0.95fr]"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <div className="relative overflow-hidden border-b border-orange-200/70 p-6 text-slate-950 lg:border-b-0 lg:border-r lg:p-9">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,138,0,0.28),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.32),transparent_24%),linear-gradient(160deg,rgba(255,250,245,0.96),rgba(255,241,225,0.92))]" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-orange-700">
                  <Sparkles className="size-3.5" />
                  Borrower Access
                </div>
                <h2 className="max-w-md text-4xl font-black leading-tight tracking-tight">
                  Step in, shape your loan, and get disbursal moving.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-[#6f4317]">
                  Sign in through a focused popup and land directly in a proper loan dashboard with offer controls,
                  account setup, repayment view, and application activity.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: "Pre-check", value: "2 min" },
                    { label: "Limit ready", value: "₹1.8L" },
                    { label: "Disbursal", value: "15 mins" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="rounded-[1.5rem] border border-orange-100 bg-white/80 p-4"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * index }}
                    >
                      <div className="text-xs uppercase tracking-[0.24em] text-[#8a5a24]">{item.label}</div>
                      <div className="mt-2 text-2xl font-black text-slate-950">{item.value}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 rounded-[1.8rem] border border-orange-100 bg-white/80 p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.24em] text-orange-700">Demo credentials</div>
                  <div className="mt-4 grid gap-3 text-sm text-[#6f4317]">
                    <div className="flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3">
                      <span>Mobile</span>
                      <span className="font-semibold text-slate-950">{form.mobile}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3">
                      <span>Email</span>
                      <span className="font-semibold text-slate-950">{form.email}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3">
                      <span>Password / OTP</span>
                      <span className="font-semibold text-slate-950">{form.password}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-[linear-gradient(180deg,#fffaf5,#fff1df)] p-6 lg:p-9">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full border border-orange-200 bg-white text-[#8a5a24] transition hover:text-slate-950"
                aria-label="Close login dialog"
              >
                <X className="size-4" />
              </button>

              <div className="flex rounded-full border border-orange-200 bg-orange-50 p-1">
                {[
                  { id: "signin", label: "Sign In" },
                  { id: "signup", label: "Sign Up" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id as AuthMode)}
                    className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
                      mode === item.id ? "bg-[#f97316] text-white shadow-lg shadow-orange-500/20" : "text-[#8a5a24]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  className="mt-8"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                >
                  <div className="flex items-center gap-3">
                    <BrandLogo compact className="scale-[0.62] origin-left" />
                    <div>
                      <div className="text-2xl font-black text-slate-950">{title}</div>
                      <div className="text-sm text-[#6f4317]">
                        {mode === "signin" ? "Continue to the live borrower dashboard." : "Open a new borrower workspace in seconds."}
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4">
                    {mode === "signup" && (
                      <label className="grid gap-2 text-sm font-medium text-[#6f4317]">
                        Full name
                        <input
                          value={form.name}
                          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                          className="rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-300"
                        />
                      </label>
                    )}

                    <label className="grid gap-2 text-sm font-medium text-[#6f4317]">
                      Mobile number
                      <input
                        value={form.mobile}
                        onChange={(event) => setForm((current) => ({ ...current, mobile: event.target.value }))}
                        className="rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-300"
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-[#6f4317]">
                      Email address
                      <input
                        value={form.email}
                        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                        className="rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-300"
                      />
                    </label>

                    {mode === "signup" && (
                      <label className="grid gap-2 text-sm font-medium text-[#6f4317]">
                        City
                        <input
                          value={form.city}
                          onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                          className="rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-300"
                        />
                      </label>
                    )}

                    <label className="grid gap-2 text-sm font-medium text-[#6f4317]">
                      Password / OTP
                      <input
                        type="password"
                        value={form.password}
                        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                        className="rounded-2xl border border-orange-200 bg-white px-4 py-3 outline-none transition focus:border-orange-300"
                      />
                    </label>
                  </div>

                  <div className="mt-7 rounded-[1.5rem] border border-orange-100 bg-orange-50 px-4 py-4 text-sm text-[#6f4317]">
                    <div className="flex items-center gap-2 font-semibold text-orange-700">
                      <ShieldCheck className="size-4" />
                      Post-login flow
                    </div>
                    <p className="mt-2 leading-6">
                      The dashboard includes amount control, tenure tuning, disbursal account details, borrower overview,
                      and a clear funding workspace.
                    </p>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-[1.4rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {error}
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={handleContinue}
                    disabled={loading}
                    className="mt-7 h-13 w-full rounded-full bg-gradient-to-r from-[#ff8a00] to-[#f97316] text-base font-bold text-white shadow-lg shadow-orange-500/20 hover:from-[#ff9800] hover:to-[#fb923c]"
                  >
                    {loading ? "Opening dashboard..." : mode === "signin" ? "Login to Dashboard" : "Create Account"}
                    <ArrowRight className="size-4" />
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
