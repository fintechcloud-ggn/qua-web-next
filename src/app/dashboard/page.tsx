"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  BadgeIndianRupee,
  Building2,
  CheckCheck,
  CircleCheckBig,
  CreditCard,
  FileBadge2,
  Landmark,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react"

import { Button } from "@/components/ui/button"

type Step = 0 | 1 | 2 | 3

type BorrowerProfile = {
  name: string
  mobile: string
  email: string
  city: string
  monthlyIncome: number
  employment: string
}

const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

const stepMeta = [
  { id: 0 as Step, title: "Profile", caption: "Borrower details" },
  { id: 1 as Step, title: "Offer", caption: "Tune amount & tenure" },
  { id: 2 as Step, title: "Bank", caption: "Add disbursal account" },
  { id: 3 as Step, title: "Review", caption: "Confirm transfer" },
]

export default function DashboardPage() {
  const [step, setStep] = useState<Step>(0)
  const [isDisbursing, setIsDisbursing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [profile, setProfile] = useState<BorrowerProfile>({
    name: "Anu Sharma",
    mobile: "9876543210",
    email: "anu.sharma@example.com",
    city: "Gurugram",
    monthlyIncome: 52000,
    employment: "Salaried",
  })
  const [amount, setAmount] = useState(145000)
  const [tenure, setTenure] = useState(90)
  const [account, setAccount] = useState({
    holderName: "Anu Sharma",
    bankName: "HDFC Bank",
    accountNumber: "50200011876543",
    ifsc: "HDFC0001287",
  })

  const processingFee = Math.min(Math.round(amount * 0.015), 1999)
  const interest = Math.round(amount * 0.019 * (tenure / 30))
  const totalRepayment = amount + interest + processingFee
  const emi = Math.round(totalRepayment / (tenure / 30))
  const offerStrength = useMemo(() => {
    return Math.min(100, Math.round((profile.monthlyIncome / 70000) * 100) + 25)
  }, [profile.monthlyIncome])

  const goNext = () => setStep((current) => Math.min(3, current + 1) as Step)
  const goBack = () => setStep((current) => Math.max(0, current - 1) as Step)

  const handleDisbursal = () => {
    setIsDisbursing(true)
    window.setTimeout(() => {
      setIsDisbursing(false)
      setIsSuccess(true)
    }, 1800)
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#06111c_0%,#0f1d2f_30%,#dbeafe_30%,#eef6ff_100%)] text-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-sky-700 backdrop-blur">
              <Sparkles className="size-3.5" />
              Borrower Dashboard
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
              Hello, {profile.name.split(" ")[0]}. Your loan journey is ready.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200/88 md:text-base">
              Complete your profile, shape your offer, and receive disbursal to your chosen bank account in a guided flow.
            </p>
          </div>

          <Link
            href="/auth"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <ArrowLeft className="size-4" />
            Change account
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/12 bg-slate-950/65 p-6 text-white shadow-[0_30px_100px_rgba(6,17,28,0.35)] backdrop-blur-xl">
              <div className="text-sm font-semibold text-sky-200">Progress</div>
              <div className="mt-5 space-y-4">
                {stepMeta.map((item, index) => {
                  const isActive = step === item.id
                  const isComplete = step > item.id || isSuccess

                  return (
                    <div key={item.title} className="flex items-start gap-4">
                      <motion.div
                        className={`flex size-10 items-center justify-center rounded-2xl border text-sm font-black ${
                          isComplete
                            ? "border-emerald-300/30 bg-emerald-400/20 text-emerald-100"
                            : isActive
                              ? "border-sky-300/30 bg-sky-400/20 text-sky-100"
                              : "border-white/10 bg-white/5 text-slate-300"
                        }`}
                        animate={{ scale: isActive ? 1.04 : 1 }}
                      >
                        {isComplete ? <CircleCheckBig className="size-4" /> : `0${index + 1}`}
                      </motion.div>
                      <div>
                        <div className={`font-semibold ${isActive ? "text-white" : "text-slate-200"}`}>{item.title}</div>
                        <div className="text-sm text-slate-400">{item.caption}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-sky-100 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-sky-700">Offer Health</div>
              <div className="mt-3 text-4xl font-black text-slate-950">{offerStrength}%</div>
              <div className="mt-2 text-sm text-slate-500">Based on income, mobile verification, and profile completion.</div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#0ea5e9,#2563eb)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${offerStrength}%` }}
                />
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  { label: "Pre-approved limit", value: formatter.format(180000), icon: BadgeIndianRupee },
                  { label: "Expected transfer", value: "within 15 minutes", icon: WalletCards },
                  { label: "KYC posture", value: "light-touch approved", icon: FileBadge2 },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                        <Icon className="size-4" />
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                        <div className="font-semibold text-slate-900">{item.value}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-white/82 p-4 shadow-[0_30px_100px_rgba(15,23,42,0.14)] backdrop-blur-2xl md:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.3 }}
              >
                {step === 0 && (
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="rounded-[1.8rem] bg-slate-950 p-6 text-white">
                      <div className="text-sm font-semibold text-sky-200">Step 1</div>
                      <h2 className="mt-3 text-3xl font-black">Complete borrower profile</h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                        A clean profile helps your client get a sharper offer, better tenure flexibility, and faster disbursal.
                      </p>

                      <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {[
                          { label: "Full name", key: "name", type: "text" },
                          { label: "Mobile number", key: "mobile", type: "text" },
                          { label: "Email", key: "email", type: "email" },
                          { label: "City", key: "city", type: "text" },
                        ].map((field) => (
                          <label key={field.key} className="grid gap-2 text-sm font-medium text-slate-200">
                            {field.label}
                            <input
                              type={field.type}
                              value={profile[field.key as keyof BorrowerProfile] as string}
                              onChange={(event) =>
                                setProfile((current) => ({
                                  ...current,
                                  [field.key]: event.target.value,
                                }))
                              }
                              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-sky-300"
                            />
                          </label>
                        ))}
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <label className="grid gap-2 text-sm font-medium text-slate-200">
                          Employment
                          <select
                            value={profile.employment}
                            onChange={(event) => setProfile((current) => ({ ...current, employment: event.target.value }))}
                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-sky-300"
                          >
                            <option className="text-slate-950">Salaried</option>
                            <option className="text-slate-950">Self-employed</option>
                            <option className="text-slate-950">Business owner</option>
                          </select>
                        </label>

                        <label className="grid gap-2 text-sm font-medium text-slate-200">
                          Monthly income
                          <input
                            type="range"
                            min={25000}
                            max={120000}
                            step={1000}
                            value={profile.monthlyIncome}
                            onChange={(event) =>
                              setProfile((current) => ({
                                ...current,
                                monthlyIncome: Number(event.target.value),
                              }))
                            }
                            className="mt-5"
                          />
                          <div className="text-lg font-black text-white">{formatter.format(profile.monthlyIncome)}</div>
                        </label>
                      </div>
                    </div>

                    <div className="rounded-[1.8rem] bg-sky-50 p-6">
                      <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
                        <Sparkles className="size-4" />
                        Live recommendation
                      </div>
                      <div className="mt-4 text-3xl font-black text-slate-950">{formatter.format(180000)}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Current profile suggests a strong disbursal band with better pricing if the client keeps the tenure below 120 days.
                      </p>
                      <div className="mt-6 space-y-3">
                        {[
                          "Mobile and email are already pre-filled from the auth step.",
                          "Income helps personalize offer size and repayment comfort.",
                          "No heavy paperwork added in this demo experience.",
                        ].map((item) => (
                          <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="rounded-[1.8rem] bg-[linear-gradient(135deg,#eff6ff,#ffffff)] p-6">
                      <div className="text-sm font-semibold text-sky-700">Step 2</div>
                      <h2 className="mt-3 text-3xl font-black text-slate-950">Shape the offer your client wants</h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                        Let the client adjust amount and tenure while the dashboard animates repayment and pricing instantly.
                      </p>

                      <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <div className="rounded-[1.6rem] bg-slate-950 p-5 text-white">
                          <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Chosen amount</div>
                          <motion.div
                            key={amount}
                            className="mt-3 text-4xl font-black"
                            initial={{ scale: 1.06, opacity: 0.7 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            {formatter.format(amount)}
                          </motion.div>
                          <input
                            type="range"
                            min={10000}
                            max={300000}
                            step={5000}
                            value={amount}
                            onChange={(event) => setAmount(Number(event.target.value))}
                            className="mt-6 w-full"
                          />
                          <div className="mt-2 flex justify-between text-xs text-slate-400">
                            <span>₹10K</span>
                            <span>₹3L</span>
                          </div>
                        </div>

                        <div className="rounded-[1.6rem] bg-slate-950 p-5 text-white">
                          <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Chosen tenure</div>
                          <motion.div
                            key={tenure}
                            className="mt-3 text-4xl font-black"
                            initial={{ scale: 1.06, opacity: 0.7 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            {tenure} days
                          </motion.div>
                          <input
                            type="range"
                            min={30}
                            max={180}
                            step={15}
                            value={tenure}
                            onChange={(event) => setTenure(Number(event.target.value))}
                            className="mt-6 w-full"
                          />
                          <div className="mt-2 flex justify-between text-xs text-slate-400">
                            <span>30 days</span>
                            <span>180 days</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {[
                          { label: "Monthly instalment", value: formatter.format(emi) },
                          { label: "Interest estimate", value: formatter.format(interest) },
                          { label: "Processing fee", value: formatter.format(processingFee) },
                        ].map((item) => (
                          <motion.div
                            key={item.label}
                            className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm"
                            whileHover={{ y: -4 }}
                          >
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                            <div className="mt-3 text-2xl font-black text-slate-950">{item.value}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.8rem] bg-slate-950 p-6 text-white">
                      <div className="flex items-center gap-2 text-sm font-semibold text-sky-200">
                        <ShieldCheck className="size-4" />
                        Recommended package
                      </div>
                      <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/8 p-5">
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Best-fit repayment</div>
                        <div className="mt-3 text-3xl font-black">{formatter.format(totalRepayment)}</div>
                        <div className="mt-2 text-sm text-slate-300">Balanced for comfort and quick closure.</div>
                      </div>
                      <div className="mt-4 space-y-3">
                        {[
                          "Great for salaried borrowers who want cash flow flexibility.",
                          "Shorter tenures reduce total interest automatically.",
                          "This screen can later plug into a real pricing API.",
                        ].map((item) => (
                          <div key={item} className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-slate-300">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="rounded-[1.8rem] bg-slate-950 p-6 text-white">
                      <div className="text-sm font-semibold text-sky-200">Step 3</div>
                      <h2 className="mt-3 text-3xl font-black">Add the account for disbursal</h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                        Capture bank details cleanly so the client can confirm where the loan should be sent.
                      </p>

                      <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {[
                          { label: "Account holder", key: "holderName" },
                          { label: "Bank name", key: "bankName" },
                          { label: "Account number", key: "accountNumber" },
                          { label: "IFSC code", key: "ifsc" },
                        ].map((field) => (
                          <label key={field.key} className="grid gap-2 text-sm font-medium text-slate-200">
                            {field.label}
                            <input
                              value={account[field.key as keyof typeof account]}
                              onChange={(event) =>
                                setAccount((current) => ({
                                  ...current,
                                  [field.key]: event.target.value,
                                }))
                              }
                              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-sky-300"
                            />
                          </label>
                        ))}
                      </div>

                      <motion.div
                        className="mt-6 rounded-[1.6rem] border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-100"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        Verified-style preview: the funds will be mapped to the above account for IMPS/UPI-ready disbursal.
                      </motion.div>
                    </div>

                    <div className="rounded-[1.8rem] bg-[linear-gradient(180deg,#ffffff,#eef6ff)] p-6">
                      <div className="flex items-center gap-2 text-sm font-semibold text-sky-700">
                        <Landmark className="size-4" />
                        Transfer destination
                      </div>
                      <div className="mt-5 rounded-[1.6rem] bg-slate-950 p-5 text-white shadow-2xl">
                        <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Primary bank</div>
                        <div className="mt-3 text-2xl font-black">{account.bankName}</div>
                        <div className="mt-2 text-sm text-slate-300">{account.holderName}</div>
                        <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Account ending</div>
                            <div className="mt-1 text-lg font-semibold">•••• {account.accountNumber.slice(-4)}</div>
                          </div>
                          <CreditCard className="size-5 text-sky-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="rounded-[1.8rem] bg-slate-950 p-6 text-white">
                      <div className="text-sm font-semibold text-sky-200">Step 4</div>
                      <h2 className="mt-3 text-3xl font-black">Review and disburse</h2>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                        Give the client a final confidence screen before releasing the loan amount.
                      </p>

                      <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {[
                          { label: "Loan amount", value: formatter.format(amount), icon: BadgeIndianRupee },
                          { label: "Repayment tenure", value: `${tenure} days`, icon: Building2 },
                          { label: "Total payable", value: formatter.format(totalRepayment), icon: WalletCards },
                          { label: "Disbursal account", value: `•••• ${account.accountNumber.slice(-4)}`, icon: CreditCard },
                        ].map((item) => {
                          const Icon = item.icon
                          return (
                            <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5">
                              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                                <Icon className="size-4" />
                                {item.label}
                              </div>
                              <div className="mt-3 text-2xl font-black text-white">{item.value}</div>
                            </div>
                          )
                        })}
                      </div>

                      <Button
                        type="button"
                        onClick={handleDisbursal}
                        disabled={isDisbursing || isSuccess}
                        className="mt-8 h-13 rounded-full bg-white text-base font-bold text-slate-950 hover:bg-slate-100"
                      >
                        {isDisbursing ? "Disbursing funds..." : isSuccess ? "Funds released" : "Disburse Now"}
                        <CheckCheck className="size-4" />
                      </Button>
                    </div>

                    <div className="rounded-[1.8rem] bg-[linear-gradient(180deg,#ffffff,#ecfeff)] p-6">
                      <div className="text-sm font-semibold text-sky-700">Transfer status</div>
                      <motion.div
                        className="mt-5 flex h-56 items-center justify-center rounded-[1.6rem] border border-sky-100 bg-white"
                        animate={isDisbursing ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                        transition={{ duration: 0.9, repeat: isDisbursing ? Infinity : 0 }}
                      >
                        {isSuccess ? (
                          <div className="text-center">
                            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                              <CircleCheckBig className="size-8" />
                            </div>
                            <div className="mt-4 text-2xl font-black text-slate-950">Disbursal successful</div>
                            <div className="mt-2 text-sm text-slate-500">
                              {formatter.format(amount)} is on the way to {account.bankName}.
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <motion.div
                              className="mx-auto flex size-16 items-center justify-center rounded-full bg-sky-100 text-sky-700"
                              animate={{ rotate: isDisbursing ? 360 : 0 }}
                              transition={{ duration: 1.1, repeat: isDisbursing ? Infinity : 0, ease: "linear" }}
                            >
                              <WalletCards className="size-8" />
                            </motion.div>
                            <div className="mt-4 text-2xl font-black text-slate-950">
                              {isDisbursing ? "Processing transfer" : "Awaiting confirmation"}
                            </div>
                            <div className="mt-2 text-sm text-slate-500">
                              {isDisbursing ? "Securing bank rails and finalizing payout." : "Review details, then release the funds."}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[1.6rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-sm text-slate-500">
                {isSuccess ? "Loan journey completed for this borrower." : `Step ${step + 1} of 4 in the guided loan workflow.`}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={goBack} disabled={step === 0 || isSuccess} className="rounded-full px-5">
                  Back
                </Button>
                <Button type="button" onClick={goNext} disabled={step === 3 || isSuccess} className="rounded-full bg-slate-950 px-5 text-white hover:bg-slate-800">
                  Continue
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
