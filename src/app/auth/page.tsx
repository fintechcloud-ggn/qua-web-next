"use client"

import { startTransition, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  KeyRound,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"

type AuthMode = "signin" | "signup"

const perks = [
  "Instant eligibility check with live offer preview",
  "Flexible loan amount and tenure controls",
  "Direct bank disbursal with a guided journey",
]

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("signin")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: "Anu Sharma",
    mobile: "9876543210",
    email: "anu.sharma@example.com",
    city: "Gurugram",
  })

  const activeTitle = useMemo(() => {
    return mode === "signin" ? "Welcome back to your credit line" : "Create your QuaLoan account"
  }, [mode])

  const handleSubmit = () => {
    setIsSubmitting(true)

    window.setTimeout(() => {
      startTransition(() => {
        router.push("/dashboard")
      })
    }, 900)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.28),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.22),_transparent_24%),linear-gradient(180deg,#03111f_0%,#081a2d_48%,#eff6ff_48%,#f8fbff_100%)] text-slate-950">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <section className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950/60 p-8 text-white shadow-[0_30px_120px_rgba(8,15,35,0.45)] backdrop-blur-2xl lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(125,211,252,0.24),transparent_20%),radial-gradient(circle_at_85%_15%,rgba(96,165,250,0.24),transparent_24%),linear-gradient(135deg,rgba(30,41,59,0.88),rgba(15,23,42,0.72))]" />
          <div className="relative z-10 space-y-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-sky-300/20 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-100">
              <Sparkles className="size-3.5" />
              Loan Journey Portal
            </div>

            <div className="max-w-xl space-y-5">
              <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                Sign in once.
                <span className="block bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent">
                  Walk out with a tailored offer.
                </span>
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-200/84 md:text-lg">
                QuaLoan&apos;s borrower dashboard guides every customer from profile capture to disbursal with clear steps,
                smart limits, and a smooth repayment plan builder.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Decision time", value: "under 5 min" },
                { label: "Loan range", value: "₹10K to ₹3L" },
                { label: "Repayment", value: "30 to 180 days" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="rounded-[1.6rem] border border-white/10 bg-white/8 p-4"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
                >
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-300">{item.label}</div>
                  <div className="mt-2 text-2xl font-black text-white">{item.value}</div>
                </motion.div>
              ))}
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-sky-100">
                <BadgeCheck className="size-4" />
                What your clients get after login
              </div>
              <div className="space-y-3">
                {perks.map((perk, index) => (
                  <motion.div
                    key={perk}
                    className="flex items-start gap-3 text-sm text-slate-200"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.08, duration: 0.4 }}
                  >
                    <CheckCircle2 className="mt-0.5 size-4 text-emerald-300" />
                    <span>{perk}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            className="relative z-10 mt-8 rounded-[1.8rem] border border-white/10 bg-white/10 p-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-300">Pre-check completed</div>
                <div className="mt-1 text-2xl font-black text-white">Offer likely ₹1,45,000</div>
              </div>
              <div className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
                Ready to unlock
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-950/40 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Borrower support</div>
                <div className="mt-2 flex items-center gap-2 text-sm text-white">
                  <PhoneCall className="size-4 text-sky-300" />
                  Personal loan desk live 24x7
                </div>
              </div>
              <div className="rounded-2xl bg-slate-950/40 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Security</div>
                <div className="mt-2 flex items-center gap-2 text-sm text-white">
                  <ShieldCheck className="size-4 text-emerald-300" />
                  Encrypted bank disbursal workflow
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="flex items-center justify-center">
          <motion.div
            className="w-full max-w-xl rounded-[2rem] border border-slate-200/70 bg-white/86 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl md:p-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex rounded-full border border-slate-200 bg-slate-100 p-1">
              {[
                { id: "signin", label: "Sign In", icon: KeyRound },
                { id: "signup", label: "Sign Up", icon: UserPlus },
              ].map((item) => {
                const Icon = item.icon
                const isActive = mode === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id as AuthMode)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
                      isActive ? "bg-slate-950 text-white shadow-lg" : "text-slate-600"
                    }`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.28 }}
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tight text-slate-950">{activeTitle}</h2>
                  <p className="text-sm leading-6 text-slate-500">
                    {mode === "signin"
                      ? "Use your mobile number to continue into the borrower dashboard."
                      : "Create a quick account to save borrower details and unlock custom offers."}
                  </p>
                </div>

                <div className="mt-8 grid gap-4">
                  {mode === "signup" && (
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Full name
                      <input
                        value={form.fullName}
                        onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-300 focus:bg-white"
                        placeholder="Enter full name"
                      />
                    </label>
                  )}

                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Mobile number
                    <input
                      value={form.mobile}
                      onChange={(event) => setForm((current) => ({ ...current, mobile: event.target.value }))}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-300 focus:bg-white"
                      placeholder="10 digit mobile number"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Email address
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-300 focus:bg-white"
                      placeholder="you@example.com"
                    />
                  </label>

                  {mode === "signup" && (
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      City
                      <input
                        value={form.city}
                        onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-300 focus:bg-white"
                        placeholder="Current city"
                      />
                    </label>
                  )}

                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    {mode === "signin" ? "OTP / Password" : "Create passcode"}
                    <input
                      type="password"
                      defaultValue="123456"
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-300 focus:bg-white"
                      placeholder="Enter secure code"
                    />
                  </label>
                </div>

                <div className="mt-8 rounded-[1.6rem] border border-sky-100 bg-sky-50/80 p-4">
                  <div className="text-xs font-bold uppercase tracking-[0.25em] text-sky-700">After login</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">
                    Your client lands inside a guided dashboard to submit profile details, adjust amount and tenure,
                    add a bank account, and request instant disbursal.
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="mt-8 h-13 w-full rounded-full bg-slate-950 text-base font-bold text-white hover:bg-slate-800"
                >
                  {isSubmitting ? "Entering dashboard..." : mode === "signin" ? "Login to Dashboard" : "Create Account"}
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </section>
      </div>
    </main>
  )
}
