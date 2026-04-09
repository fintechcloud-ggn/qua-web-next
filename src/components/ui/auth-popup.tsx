"use client"

import { startTransition, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Sparkles, UserRound, X } from "lucide-react"

import { Button } from "@/components/ui/button"

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
          className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xl"
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
            className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-[#08111f] shadow-[0_40px_160px_rgba(2,8,23,0.55)] lg:grid-cols-[1.05fr_0.95fr]"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <div className="relative overflow-hidden border-b border-white/10 p-6 text-white lg:border-b-0 lg:border-r lg:p-9">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(14,165,233,0.3),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.34),transparent_24%),linear-gradient(160deg,rgba(3,7,18,0.35),rgba(2,6,23,0.9))]" />
              <div className="relative z-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-sky-100">
                  <Sparkles className="size-3.5" />
                  Borrower Access
                </div>
                <h2 className="max-w-md text-4xl font-black leading-tight tracking-tight">
                  Step in, shape your loan, and get disbursal moving.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-slate-200/80">
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
                      className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * index }}
                    >
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-300">{item.label}</div>
                      <div className="mt-2 text-2xl font-black">{item.value}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/8 p-5">
                  <div className="text-xs font-bold uppercase tracking-[0.24em] text-sky-100">Demo credentials</div>
                  <div className="mt-4 grid gap-3 text-sm text-slate-200">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-950/35 px-4 py-3">
                      <span>Mobile</span>
                      <span className="font-semibold text-white">{form.mobile}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-950/35 px-4 py-3">
                      <span>Email</span>
                      <span className="font-semibold text-white">{form.email}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-950/35 px-4 py-3">
                      <span>Password / OTP</span>
                      <span className="font-semibold text-white">{form.password}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-[linear-gradient(180deg,#f8fbff,#eef5ff)] p-6 lg:p-9">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-950"
                aria-label="Close login dialog"
              >
                <X className="size-4" />
              </button>

              <div className="flex rounded-full border border-slate-200 bg-slate-100 p-1">
                {[
                  { id: "signin", label: "Sign In" },
                  { id: "signup", label: "Sign Up" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id as AuthMode)}
                    className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
                      mode === item.id ? "bg-slate-950 text-white shadow-lg" : "text-slate-500"
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
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                      <UserRound className="size-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-slate-950">{title}</div>
                      <div className="text-sm text-slate-500">
                        {mode === "signin" ? "Continue to the live borrower dashboard." : "Open a new borrower workspace in seconds."}
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4">
                    {mode === "signup" && (
                      <label className="grid gap-2 text-sm font-medium text-slate-700">
                        Full name
                        <input
                          value={form.name}
                          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-300"
                        />
                      </label>
                    )}

                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Mobile number
                      <input
                        value={form.mobile}
                        onChange={(event) => setForm((current) => ({ ...current, mobile: event.target.value }))}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-300"
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Email address
                      <input
                        value={form.email}
                        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-300"
                      />
                    </label>

                    {mode === "signup" && (
                      <label className="grid gap-2 text-sm font-medium text-slate-700">
                        City
                        <input
                          value={form.city}
                          onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-300"
                        />
                      </label>
                    )}

                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Password / OTP
                      <input
                        type="password"
                        value={form.password}
                        onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-300"
                      />
                    </label>
                  </div>

                  <div className="mt-7 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2 font-semibold text-emerald-700">
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
                    className="mt-7 h-13 w-full rounded-full bg-slate-950 text-base font-bold text-white hover:bg-slate-800"
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
