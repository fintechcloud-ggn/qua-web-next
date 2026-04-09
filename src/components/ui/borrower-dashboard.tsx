"use client"

import Image from "next/image"
import Link from "next/link"
import { startTransition, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  FileText,
  HandCoins,
  Landmark,
  LayoutDashboard,
  Menu,
  PencilLine,
  PiggyBank,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Upload,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"

type PageId = "overview" | "application" | "offer-studio" | "disbursal" | "repayment-plan" | "profile"
type Accent = "sky" | "mint" | "peach" | "violet"

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)

const navItems: Array<{
  id: PageId
  label: string
  href: string
  icon: typeof LayoutDashboard
  short: string
}> = [
  { id: "overview", label: "Overview", href: "/dashboard", icon: LayoutDashboard, short: "Home" },
  { id: "application", label: "Application", href: "/dashboard/application", icon: FileText, short: "Details" },
  { id: "offer-studio", label: "Offer Studio", href: "/dashboard/offer-studio", icon: SlidersHorizontal, short: "Offer" },
  { id: "disbursal", label: "Disbursal", href: "/dashboard/disbursal", icon: HandCoins, short: "Transfer" },
  { id: "repayment-plan", label: "Repayment Plan", href: "/dashboard/repayment-plan", icon: PiggyBank, short: "Pay" },
  { id: "profile", label: "Client Profile", href: "/dashboard/profile", icon: PencilLine, short: "Profile" },
]

const pageCopy: Record<PageId, { eyebrow: string; title: string; description: string; accent: Accent }> = {
  overview: {
    eyebrow: "Loan Workspace",
    title: "Everything important in one borrower hub.",
    description: "Use this page to check readiness, move between steps, and keep the loan journey simple for the client.",
    accent: "sky",
  },
  application: {
    eyebrow: "Application Form",
    title: "Collect the borrower details cleanly.",
    description: "A dedicated form page helps the client focus on submitting the right information before moving ahead.",
    accent: "mint",
  },
  "offer-studio": {
    eyebrow: "Offer Studio",
    title: "Adjust amount and tenure with clarity.",
    description: "Use a focused studio page to tune the offer and show pricing impact without distraction.",
    accent: "peach",
  },
  disbursal: {
    eyebrow: "Disbursal",
    title: "Review the account and release funds.",
    description: "Use this page to verify the bank destination and complete the final loan release.",
    accent: "violet",
  },
  "repayment-plan": {
    eyebrow: "Repayment Plan",
    title: "Make repayment easy to understand.",
    description: "This page shows the comfort of the repayment plan so the borrower knows what to expect.",
    accent: "sky",
  },
  profile: {
    eyebrow: "Client Profile",
    title: "View the full client profile in one place.",
    description: "Keep all client and loan details visible in one read-only profile page while allowing only the photo to be updated.",
    accent: "violet",
  },
}

const accentStyles: Record<
  Accent,
  {
    wash: string
    chip: string
    icon: string
    panel: string
    progress: string
  }
> = {
  sky: {
    wash: "from-sky-100 via-cyan-50 to-white",
    chip: "bg-sky-100 text-sky-700 border-sky-200",
    icon: "bg-sky-100 text-sky-700",
    panel: "bg-sky-50",
    progress: "from-sky-400 to-cyan-400",
  },
  mint: {
    wash: "from-emerald-100 via-teal-50 to-white",
    chip: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: "bg-emerald-100 text-emerald-700",
    panel: "bg-emerald-50",
    progress: "from-emerald-400 to-teal-400",
  },
  peach: {
    wash: "from-amber-100 via-orange-50 to-white",
    chip: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "bg-amber-100 text-amber-700",
    panel: "bg-orange-50",
    progress: "from-amber-400 to-orange-400",
  },
  violet: {
    wash: "from-violet-100 via-fuchsia-50 to-white",
    chip: "bg-violet-100 text-violet-700 border-violet-200",
    icon: "bg-violet-100 text-violet-700",
    panel: "bg-violet-50",
    progress: "from-violet-400 to-fuchsia-400",
  },
}

const repaymentBars = [60, 74, 68, 82, 62, 70, 66, 76]

function readStoredProfile() {
  if (typeof window === "undefined") {
    return null
  }

  const stored = window.localStorage.getItem("qualoan-client-profile")
  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as {
      profile?: {
        fullName: string
        mobile: string
        email: string
        city: string
        employer: string
        income: number
        score: number
        panCard: string
        aadhaarCard: string
        sanctionAmount: number
        repaymentDate: string
      }
      account?: {
        holder: string
        bank: string
        accountNumber: string
        ifsc: string
      }
      amount?: number
      tenure?: number
      profilePhoto?: string
    }
  } catch {
    return null
  }
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`rounded-[2rem] border border-slate-200 bg-white/92 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.05)] ${className}`}>{children}</div>
}

function MetricCard({
  label,
  value,
  note,
  tint,
}: {
  label: string
  value: string
  note: string
  tint: string
}) {
  return (
    <Card className={`relative overflow-hidden p-5 ${tint}`}>
      <div className="absolute inset-x-0 top-0 h-1.5 bg-white/80" />
      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-black text-slate-950">{value}</div>
      <div className="mt-1 text-sm text-slate-600">{note}</div>
    </Card>
  )
}

function ActivityGuide({
  accent,
  title,
  text,
  badge,
  x,
  y,
}: {
  accent: Accent
  title: string
  text: string
  badge: string
  x: string
  y: number
}) {
  const aura =
    accent === "mint"
      ? "from-emerald-200 to-teal-200"
      : accent === "peach"
        ? "from-amber-200 to-orange-200"
        : accent === "violet"
          ? "from-violet-200 to-fuchsia-200"
          : "from-sky-200 to-cyan-200"

  return (
    <Card className="overflow-hidden border-white/80 bg-white/84 p-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {badge}
          </div>
          <h3 className="mt-3 text-lg font-black text-slate-950">Loan journey companion</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            <span className="font-semibold text-slate-900">{title}</span> {text}
          </p>
        </div>

        <div className="relative h-28 rounded-[1.6rem] border border-slate-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.9))] px-4">
          <div className="absolute inset-x-4 bottom-5 h-2 rounded-full bg-slate-200/80" />
          <motion.div
            className="absolute bottom-7 left-4"
            animate={{ x, y: [0, y, 0] }}
            transition={{
              x: { duration: 0.8, ease: "easeInOut" },
              y: { duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
          >
            <div className="relative">
              <motion.div
                className={`absolute -inset-2 rounded-full bg-gradient-to-br ${aura} opacity-70 blur-md`}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
              <div className="relative flex size-16 items-center justify-center rounded-[1.6rem] border border-white/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span className="block size-2 rounded-full bg-slate-900" />
                    <span className="block size-2 rounded-full bg-slate-900" />
                  </div>
                  <div className="h-1.5 w-6 rounded-full bg-slate-900/80" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Card>
  )
}

export default function BorrowerDashboard({
  activePage,
  user,
}: {
  activePage: PageId
  user: { name: string; email: string; mobile: string; city?: string }
}) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const storedProfile = readStoredProfile()
  const [amount, setAmount] = useState(storedProfile?.amount ?? 145000)
  const [tenure, setTenure] = useState(storedProfile?.tenure ?? 84)
  const [disbursing, setDisbursing] = useState(false)
  const [funded, setFunded] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(storedProfile?.profilePhoto ?? "")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState(
    storedProfile?.profile ?? {
      fullName: user.name,
      mobile: user.mobile,
      email: user.email,
      city: user.city || "",
      employer: "UrbanCart Technologies",
      income: 52000,
      score: 82,
      panCard: "ABCDE1234F",
      aadhaarCard: "123412341234",
      sanctionAmount: 160000,
      repaymentDate: "2026-05-10",
    }
  )
  const [account, setAccount] = useState(
    storedProfile?.account ?? {
      holder: user.name,
      bank: "HDFC Bank",
      accountNumber: "50200011876543",
      ifsc: "HDFC0001287",
    }
  )

  const fee = Math.min(1999, Math.round(amount * 0.015))
  const interest = Math.round(amount * 0.0175 * (tenure / 30))
  const totalPayable = amount + interest + fee
  const monthlyRepayment = Math.round(totalPayable / Math.max(1, tenure / 30))
  const utilization = useMemo(() => Math.min(100, Math.round((amount / 180000) * 100)), [amount])
  const repaymentAmount = Math.max(500, Math.round(monthlyRepayment))
  const upiPaymentUrl = useMemo(() => {
    const params = new URLSearchParams({
      pa: "qualoan@upi",
      pn: "QuaLoan Repayment",
      am: String(repaymentAmount),
      cu: "INR",
      tn: `Repayment for ${profile.fullName}`,
    })
    return `upi://pay?${params.toString()}`
  }, [profile.fullName, repaymentAmount])

  const completedSteps = useMemo(
    () => ({
      identity: profile.fullName.trim().length > 3 && profile.mobile.trim().length >= 10 && profile.email.includes("@"),
      profile: profile.city.trim().length > 1 && profile.employer.trim().length > 2 && profile.income >= 25000,
      offer: amount >= 50000 && tenure >= 60,
      bank: account.holder.trim().length > 2 && account.bank.trim().length > 2 && account.accountNumber.trim().length >= 8 && account.ifsc.trim().length >= 5,
      funded,
    }),
    [account.accountNumber, account.bank, account.holder, account.ifsc, amount, funded, profile.city, profile.email, profile.employer, profile.fullName, profile.income, profile.mobile, tenure]
  )

  const completion = Math.round((Object.values(completedSteps).filter(Boolean).length / 5) * 100)
  const points = useMemo(() => {
    let total = 0
    if (completedSteps.identity) total += 100
    if (completedSteps.profile) total += 100
    if (completedSteps.offer) total += 100
    if (completedSteps.bank) total += 100
    if (completedSteps.funded) total += 100
    return total
  }, [completedSteps.bank, completedSteps.funded, completedSteps.identity, completedSteps.offer, completedSteps.profile])
  const canRedeem = points >= 500

  useEffect(() => {
    window.localStorage.setItem(
      "qualoan-client-profile",
      JSON.stringify({
        profile,
        account,
        amount,
        tenure,
        profilePhoto,
      })
    )
  }, [account, amount, profile, profilePhoto, tenure])

  const handleDisbursal = () => {
    setDisbursing(true)
    window.setTimeout(() => {
      setDisbursing(false)
      setFunded(true)
    }, 1500)
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    startTransition(() => {
      router.replace("/")
      router.refresh()
    })
  }

  const goToPage = (path: string) => {
    startTransition(() => {
      router.push(path)
    })
  }

  const copy = pageCopy[activePage]
  const accent = accentStyles[copy.accent]
  const activeIndex = navItems.findIndex((item) => item.id === activePage)
  const nextNavItem = navItems[activeIndex + 1] ?? navItems[activeIndex]
  const guideState: Record<PageId, { title: string; text: string; badge: string; x: string; y: number }> = {
    overview: {
      title: "Scout mode:",
      text: "the guide is surveying the borrower hub and pointing the client toward the next unlocked step.",
      badge: "Hub Check",
      x: "18%",
      y: -6,
    },
    application: {
      title: "Form mode:",
      text: "the guide is hovering near the details section and cheering the client on while they complete personal information.",
      badge: "Details Run",
      x: "34%",
      y: -10,
    },
    "offer-studio": {
      title: "Offer mode:",
      text: "the guide is tuning the amount and tenure sliders like a control deck to help shape the best loan fit.",
      badge: "Offer Lab",
      x: "52%",
      y: -8,
    },
    disbursal: {
      title: "Transfer mode:",
      text: "the guide is moving toward the bank release area to verify the account before the funds are sent.",
      badge: "Bank Gate",
      x: "70%",
      y: -6,
    },
    "repayment-plan": {
      title: "Repayment mode:",
      text: "the guide is standing by the payment zone so the client can scan the QR and finish the next action smoothly.",
      badge: "Pay Zone",
      x: "82%",
      y: -10,
    },
    profile: {
      title: "Profile mode:",
      text: "the guide is guarding the read-only KYC vault while still letting the client update their profile picture.",
      badge: "Profile Vault",
      x: "60%",
      y: -5,
    },
  }

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfilePhoto(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const renderOverviewPage = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MetricCard label="Eligible amount" value={money(180000)} note="Pre-approved limit" tint="bg-gradient-to-br from-sky-50 to-white" />
        <MetricCard label="Selected offer" value={money(amount)} note={`${tenure} day plan`} tint="bg-gradient-to-br from-emerald-50 to-white" />
        <MetricCard label="Reward points" value={`${points}`} note={canRedeem ? "Ready to redeem" : "Target 500"} tint="bg-gradient-to-br from-amber-50 to-white" />
        <MetricCard label="Disbursal" value={funded ? "Released" : "Pending"} note={funded ? "Completed" : "Waiting"} tint="bg-gradient-to-br from-violet-50 to-white" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_380px]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Journey steps</div>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Move through the loan process</h2>
            </div>
            <div className={`rounded-full border px-4 py-2 text-sm font-medium ${accent.chip}`}>{completion}% complete</div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Complete application",
                text: "Fill identity, city, employer, and income details before proceeding.",
                href: "/dashboard/application",
                done: completedSteps.identity && completedSteps.profile,
              },
              {
                title: "Tune the offer",
                text: "Choose the amount and tenure that best fits the borrower.",
                href: "/dashboard/offer-studio",
                done: completedSteps.offer,
              },
              {
                title: "Add bank account",
                text: "Review and confirm the account that will receive the disbursal.",
                href: "/dashboard/disbursal",
                done: completedSteps.bank,
              },
              {
                title: "Check repayment",
                text: "Review the monthly repayment comfort before releasing funds.",
                href: "/dashboard/repayment-plan",
                done: completedSteps.funded,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-950">{item.title}</div>
                  <div className={`rounded-full px-3 py-1 text-xs font-medium ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {item.done ? "Done" : "Open"}
                  </div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
                <Button type="button" variant="outline" onClick={() => goToPage(item.href)} className="mt-4 rounded-full px-4">
                  Open
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Reward system</div>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Points and redemption</h2>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
            <motion.div className={`h-full rounded-full bg-gradient-to-r ${accent.progress}`} initial={{ width: 0 }} animate={{ width: `${Math.min(100, (points / 500) * 100)}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
            <span>{points} points earned</span>
            <span>{Math.max(0, 500 - points)} to unlock</span>
          </div>

          <div className="mt-5 space-y-3">
            {[
              { label: "Identity completed", earned: completedSteps.identity },
              { label: "Profile completed", earned: completedSteps.profile },
              { label: "Offer chosen", earned: completedSteps.offer },
              { label: "Bank verified", earned: completedSteps.bank },
              { label: "Loan disbursed", earned: completedSteps.funded },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-700">{item.label}</span>
                <span className={`text-xs font-semibold ${item.earned ? "text-emerald-700" : "text-slate-500"}`}>
                  {item.earned ? "+100 earned" : "+100 pending"}
                </span>
              </div>
            ))}
          </div>

          <div className={`mt-5 rounded-[1.5rem] border px-4 py-4 ${canRedeem ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
            <div className="font-semibold text-slate-950">{canRedeem ? "Reward unlocked" : "Redemption locked"}</div>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {canRedeem
                ? "The borrower has reached 500 points and can redeem a benefit like a fee waiver, cashback, or priority support."
                : "Borrowers unlock rewards once they complete all five steps and reach 500 points."}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderApplicationPage = () => (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Application form</div>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Start the borrower application</h2>
          </div>
          <div className={`rounded-full border px-4 py-2 text-sm font-medium ${completedSteps.identity && completedSteps.profile ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
            {completedSteps.identity && completedSteps.profile ? "+200 points earned" : "Earn up to 200 points"}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Full name
            <input value={profile.fullName} onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Mobile
            <input value={profile.mobile} onChange={(event) => setProfile((current) => ({ ...current, mobile: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Email
            <input value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            City
            <input value={profile.city} onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Employer
            <input value={profile.employer} onChange={(event) => setProfile((current) => ({ ...current, employer: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Monthly income
            <input
              type="number"
              min={0}
              value={profile.income}
              onChange={(event) => setProfile((current) => ({ ...current, income: Number(event.target.value) || 0 }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={() => goToPage("/dashboard/offer-studio")} className="rounded-full bg-slate-950 px-5 text-white">
            Save and continue
          </Button>
          <Button type="button" variant="outline" onClick={() => goToPage("/dashboard")} className="rounded-full px-5">
            Back to overview
          </Button>
        </div>
      </Card>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Form status</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Application checkpoints</h2>
        <div className="mt-5 space-y-3">
          {[
            { label: "Identity details complete", done: completedSteps.identity, points: 100 },
            { label: "Profile and income complete", done: completedSteps.profile, points: 100 },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.5rem] bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium text-slate-950">{item.label}</div>
                <div className={`rounded-full px-3 py-1 text-xs font-medium ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                  {item.done ? "Complete" : "Pending"}
                </div>
              </div>
              <div className="mt-2 text-sm text-slate-500">{item.done ? `+${item.points} points earned` : `Complete this step to earn +${item.points} points`}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderOfferStudioPage = () => (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Offer studio</div>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Tune the amount and tenure</h2>
          </div>
          <div className={`rounded-full border px-4 py-2 text-sm font-medium ${accent.chip}`}>Utilization {utilization}%</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.6rem] bg-slate-50 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Loan amount</div>
            <motion.div key={amount} className="mt-3 text-4xl font-black text-slate-950" initial={{ opacity: 0.7, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }}>
              {money(amount)}
            </motion.div>
            <input type="range" min={10000} max={180000} step={5000} value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-6 w-full" />
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>₹10K</span>
              <span>₹1.8L</span>
            </div>
          </div>

          <div className="rounded-[1.6rem] bg-slate-50 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Repayment tenure</div>
            <motion.div key={tenure} className="mt-3 text-4xl font-black text-slate-950" initial={{ opacity: 0.7, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }}>
              {tenure} days
            </motion.div>
            <input type="range" min={30} max={150} step={6} value={tenure} onChange={(event) => setTenure(Number(event.target.value))} className="mt-6 w-full" />
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>30 days</span>
              <span>150 days</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Interest", value: money(interest) },
            { label: "Fee", value: money(fee) },
            { label: "Total payable", value: money(totalPayable) },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.4rem] bg-slate-50 px-4 py-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
              <div className="mt-3 text-2xl font-black text-slate-950">{item.value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Offer result</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">What this offer means</h2>
        <div className="mt-5 space-y-3">
          <div className="rounded-[1.5rem] bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Monthly repayment</div>
            <div className="mt-2 text-3xl font-black text-slate-950">{money(monthlyRepayment)}</div>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-4">
            <div className="text-sm text-slate-500">Points for this step</div>
            <div className="mt-2 text-lg font-semibold text-slate-950">{completedSteps.offer ? "+100 earned" : "+100 pending"}</div>
          </div>
          <Button type="button" onClick={() => goToPage("/dashboard/disbursal")} className="mt-2 w-full rounded-full bg-slate-950 text-white">
            Continue to disbursal
          </Button>
        </div>
      </Card>
    </div>
  )

  const renderDisbursalPage = () => (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_360px]">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Disbursal</div>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Review the bank destination</h2>
          </div>
          <div className={`flex size-11 items-center justify-center rounded-2xl ${accent.icon}`}>
            <Landmark className="size-5" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Account holder
            <input value={account.holder} onChange={(event) => setAccount((current) => ({ ...current, holder: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Bank name
            <input value={account.bank} onChange={(event) => setAccount((current) => ({ ...current, bank: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Account number
            <input value={account.accountNumber} onChange={(event) => setAccount((current) => ({ ...current, accountNumber: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300" />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-700">
            IFSC code
            <input value={account.ifsc} onChange={(event) => setAccount((current) => ({ ...current, ifsc: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-300" />
          </label>
        </div>

        <div className={`mt-6 rounded-[1.5rem] ${accent.panel} p-5`}>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Transfer preview</div>
          <div className="mt-3 text-3xl font-black text-slate-950">{money(amount)}</div>
          <div className="mt-2 text-sm text-slate-600">
            Funds will move to {account.bank} ending in {account.accountNumber.slice(-4)}.
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={handleDisbursal} disabled={disbursing || funded} className="rounded-full bg-slate-950 px-5 text-white">
            {disbursing ? "Processing..." : funded ? "Disbursed" : "Release funds"}
          </Button>
          <Button type="button" variant="outline" onClick={() => goToPage("/dashboard/repayment-plan")} className="rounded-full px-5">
            View repayment
          </Button>
        </div>
      </Card>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Disbursal status</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Readiness</h2>
        <div className="mt-5 space-y-3">
          {[
            { label: "Bank details added", done: completedSteps.bank },
            { label: "Offer selected", done: completedSteps.offer },
            { label: "Funds released", done: completedSteps.funded },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-[1.4rem] bg-slate-50 px-4 py-4">
              <span className="text-sm text-slate-700">{item.label}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                {item.done ? "Done" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderRepaymentPage = () => (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Repayment plan</div>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Comfort over time</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <TrendingUp className="size-4" />
            Stable
          </div>
        </div>

        <div className="mt-7 grid grid-cols-8 items-end gap-3 rounded-[1.6rem] bg-slate-50 px-4 pb-4 pt-8">
          {repaymentBars.map((height, index) => (
            <motion.div
              key={height}
              className={`rounded-t-[1rem] bg-gradient-to-b ${accent.progress}`}
              initial={{ height: 0 }}
              animate={{ height }}
              transition={{ delay: 0.04 * index, duration: 0.35 }}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Monthly outflow", value: money(monthlyRepayment), icon: CalendarClock },
            { label: "Income cushion", value: `${Math.max(8, 100 - Math.round((monthlyRepayment / profile.income) * 100))}%`, icon: TrendingUp },
            { label: "Suggested tenure", value: "78-96 days", icon: PiggyBank },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="rounded-[1.4rem] bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                  <span>{item.label}</span>
                  <Icon className="size-4" />
                </div>
                <div className="mt-3 text-2xl font-black text-slate-950">{item.value}</div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Scan to pay</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Repayment QR</h2>
        <div className="mt-5 flex justify-center rounded-[1.6rem] bg-slate-50 p-4">
          <Image
            src={`/api/payment-qr?data=${encodeURIComponent(upiPaymentUrl)}`}
            alt="QR code for loan repayment"
            width={220}
            height={220}
            unoptimized
            className="rounded-[1.2rem] border border-slate-200 bg-white p-2"
          />
        </div>

        <div className="mt-5 space-y-3">
          {[
            { label: "Pay now", value: money(repaymentAmount) },
            { label: "UPI ID", value: "qualoan@upi" },
            { label: "Reference", value: profile.fullName },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.4rem] bg-slate-50 px-4 py-4">
              <div className="text-sm text-slate-500">{item.label}</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">{item.value}</div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-500">
          The client can scan this QR from any UPI app to pay the current repayment amount directly.
        </p>
      </Card>
    </div>
  )

  const renderProfilePage = () => (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card>
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Profile photo</div>
        <h2 className="mt-2 text-2xl font-black text-slate-950">Client identity card</h2>

        <div className="mt-6 flex flex-col items-center rounded-[1.8rem] bg-slate-50 p-6 text-center">
          {profilePhoto ? (
            <Image
              src={profilePhoto}
              alt={`${profile.fullName} profile`}
              width={152}
              height={152}
              className="size-38 rounded-[2rem] object-cover shadow-sm"
            />
          ) : (
            <div className={`flex size-38 items-center justify-center rounded-[2rem] ${accent.panel}`}>
              <span className="text-5xl font-black text-slate-700">{profile.fullName.charAt(0).toUpperCase()}</span>
            </div>
          )}

          <div className="mt-5 text-2xl font-black text-slate-950">{profile.fullName}</div>
          <div className="mt-1 text-sm text-slate-500">{profile.email}</div>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="mt-5 rounded-full px-5">
            <Upload className="size-4" />
            Change picture
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          {[
            { label: "Profile score", value: `${profile.score}/100` },
            { label: "Reward points", value: `${points}` },
            { label: "Sanction amount", value: money(profile.sanctionAmount) },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.4rem] bg-slate-50 px-4 py-4">
              <div className="text-sm text-slate-500">{item.label}</div>
              <div className="mt-1 text-xl font-semibold text-slate-950">{item.value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Client profile</div>
            <h2 className="mt-2 text-2xl font-black text-slate-950">View client and loan details</h2>
            <p className="mt-2 text-sm text-slate-500">Only the profile picture can be changed here. All loan and KYC details are locked to the actual record.</p>
          </div>
          <div className={`rounded-full border px-4 py-2 text-sm font-medium ${accent.chip}`}>Read only profile</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { label: "Client name", value: profile.fullName },
            { label: "Mobile number", value: profile.mobile },
            { label: "Email", value: profile.email },
            { label: "City", value: profile.city || "-" },
            { label: "PAN card", value: profile.panCard },
            { label: "Aadhaar card", value: profile.aadhaarCard },
            { label: "Account number", value: account.accountNumber },
            { label: "IFSC code", value: account.ifsc },
            { label: "Loan amount", value: money(amount) },
            { label: "Sanction amount", value: money(profile.sanctionAmount) },
            { label: "Disbursed amount", value: money(amount) },
            { label: "Repayment amount", value: money(amount) },
            { label: "Repayment date", value: profile.repaymentDate },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
              <div className="mt-2 text-lg font-semibold text-slate-950">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={() => goToPage("/dashboard/disbursal")} className="rounded-full bg-slate-950 px-5 text-white">
            Go to disbursal
          </Button>
        </div>
      </Card>
    </div>
  )

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fcfeff_0%,#f4f9ff_38%,#fffaf3_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-16 h-64 w-64 rounded-full bg-sky-200/35 blur-3xl" />
        <div className="absolute right-[-10%] top-40 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute bottom-16 left-1/3 h-56 w-56 rounded-full bg-emerald-200/25 blur-3xl" />
      </div>
      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[108px_minmax(0,1fr)]">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.button
                type="button"
                aria-label="Close menu overlay"
                className="fixed inset-0 z-30 bg-slate-950/18 backdrop-blur-[2px] lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          <aside
            className={`fixed inset-y-0 left-0 z-40 w-[286px] max-w-[calc(100vw-1.5rem)] px-4 py-6 transition-transform duration-300 md:px-6 lg:hidden ${
              sidebarOpen ? "translate-x-0" : "-translate-x-[110%]"
            }`}
          >
            <Card className="h-full rounded-[2.25rem] border-white/80 bg-white/90 p-4 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Menu</div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-900"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className={`rounded-[1.8rem] bg-gradient-to-br ${accent.wash} p-5`}>
                <div className="flex items-start gap-3">
                  <div className="flex size-12 items-center justify-center rounded-[1.3rem] bg-white text-slate-950 shadow-sm">
                    {profilePhoto ? (
                      <Image src={profilePhoto} alt={`${profile.fullName} avatar`} width={48} height={48} className="size-12 rounded-[1.3rem] object-cover" />
                    ) : (
                      <span className="text-lg font-black">{profile.fullName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500">Borrower workspace</div>
                    <div className="mt-1 text-lg font-black text-slate-950">{profile.fullName}</div>
                    <div className="text-sm text-slate-500">{profile.mobile}</div>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] bg-white/70 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Journey progress</span>
                    <span className="font-semibold text-slate-950">{completion}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70">
                    <motion.div className={`h-full rounded-full bg-gradient-to-r ${accent.progress}`} initial={{ width: 0 }} animate={{ width: `${completion}%` }} />
                  </div>
                  <div className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                    Step {Math.max(1, activeIndex + 1)} of {navItems.length}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === activePage
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center justify-between rounded-[1.35rem] border px-3 py-3 text-sm transition ${
                        isActive ? `border-white bg-white text-slate-950 shadow-sm` : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex size-10 items-center justify-center rounded-[1rem] ${isActive ? accent.icon : "bg-slate-100 text-slate-500 group-hover:bg-white"}`}>
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-slate-400">{item.short}</div>
                        </div>
                      </div>
                      <ChevronRight className="size-4 opacity-40" />
                    </Link>
                  )
                })}
              </div>

              <div className="mt-5 rounded-[1.6rem] bg-slate-50/90 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">Reward points</div>
                    <div className="mt-2 text-2xl font-black text-slate-950">{points}</div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-semibold ${canRedeem ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {canRedeem ? "Redeem now" : "Reach 500"}
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <motion.div className={`h-full rounded-full bg-gradient-to-r ${accent.progress}`} initial={{ width: 0 }} animate={{ width: `${Math.min(100, (points / 500) * 100)}%` }} />
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  Each completed step gives `100` points. All five steps unlock redemption.
                </div>
              </div>
            </Card>
          </aside>

          <aside className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
            <Card className="rounded-[2rem] border-white/80 bg-white/88 p-3 backdrop-blur-xl">
              <div className={`rounded-[1.7rem] bg-gradient-to-br ${accent.wash} p-3 text-center`}>
                <div className="mx-auto flex size-12 items-center justify-center rounded-[1.1rem] bg-white text-slate-950 shadow-sm">
                  {profilePhoto ? (
                    <Image src={profilePhoto} alt={`${profile.fullName} avatar`} width={48} height={48} className="size-12 rounded-[1.1rem] object-cover" />
                  ) : (
                    <span className="text-lg font-black">{profile.fullName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Menu</div>
              </div>

              <div className="mt-3 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === activePage
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex flex-col items-center gap-2 rounded-[1.4rem] border px-2 py-3 text-center text-[11px] font-medium transition ${
                        isActive ? `${accent.panel} border-slate-200 text-slate-950 shadow-sm` : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white hover:text-slate-900"
                      }`}
                    >
                      <div className={`flex size-10 items-center justify-center rounded-[1rem] ${isActive ? accent.icon : "bg-slate-100 text-slate-500"}`}>
                        <Icon className="size-4" />
                      </div>
                      <div className="leading-4">{item.short}</div>
                    </Link>
                  )
                })}
              </div>

              <div className="mt-3 rounded-[1.4rem] bg-slate-50/90 px-3 py-4 text-center">
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Points</div>
                <div className="mt-1 text-xl font-black text-slate-950">{points}</div>
              </div>
            </Card>
          </aside>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-white/80 bg-white/80 p-3 shadow-[0_20px_70px_rgba(15,23,42,0.05)] backdrop-blur-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.6rem] border border-slate-100 bg-white/80 px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen((current) => !current)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 lg:hidden"
                  >
                    <Menu className="size-4" />
                    {sidebarOpen ? "Close" : "Menu"}
                  </button>
                  <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${accent.chip}`}>
                    <Sparkles className="size-3.5" />
                    {copy.eyebrow}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-500 md:block">
                    Next step: <span className="font-semibold text-slate-900">{nextNavItem.label}</span>
                  </div>
                  <button className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm">
                    <Bell className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToPage("/dashboard/profile")}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300"
                  >
                    <div className={`flex size-7 items-center justify-center rounded-full ${accent.icon}`}>
                      {profilePhoto ? (
                        <Image
                          src={profilePhoto}
                          alt={`${profile.fullName} avatar`}
                          width={28}
                          height={28}
                          className="size-7 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold">{profile.fullName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    {profile.fullName}
                  </button>
                  <Button type="button" variant="outline" onClick={handleLogout} className="rounded-full bg-white px-4">
                    Logout
                  </Button>
                </div>
              </div>

              <div className={`mt-3 overflow-hidden rounded-[1.8rem] border border-slate-100 bg-gradient-to-br ${accent.wash} p-6`}>
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_320px] lg:items-end">
                  <div className="max-w-3xl">
                    <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-4xl">{copy.title}</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">{copy.description}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                    <div className="rounded-[1.4rem] bg-white/75 p-4">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Selected amount</div>
                      <div className="mt-2 text-2xl font-black text-slate-950">{money(amount)}</div>
                    </div>
                    <div className="rounded-[1.4rem] bg-white/75 p-4">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Repayment window</div>
                      <div className="mt-2 text-2xl font-black text-slate-950">{tenure} days</div>
                    </div>
                    <div className="rounded-[1.4rem] bg-white/75 p-4">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-slate-400">
                        <span>Progress</span>
                        <span>{completion}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
                        <motion.div className={`h-full rounded-full bg-gradient-to-r ${accent.progress}`} initial={{ width: 0 }} animate={{ width: `${completion}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === activePage
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`inline-flex min-w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                        isActive ? `${accent.chip} shadow-sm` : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="hidden items-center justify-between rounded-[1.6rem] border border-dashed border-slate-200 bg-white/65 px-5 py-4 text-sm text-slate-600 shadow-[0_12px_40px_rgba(15,23,42,0.04)] md:flex">
              <div>Workspace rhythm: finish the current step, collect points, and keep the client moving without friction.</div>
              <div className="font-semibold text-slate-900">{canRedeem ? "Reward unlocked" : `${Math.max(0, 500 - points)} points to unlock rewards`}</div>
            </div>

            <ActivityGuide
              accent={copy.accent}
              title={guideState[activePage].title}
              text={guideState[activePage].text}
              badge={guideState[activePage].badge}
              x={guideState[activePage].x}
              y={guideState[activePage].y}
            />

            {activePage === "overview" && renderOverviewPage()}
            {activePage === "application" && renderApplicationPage()}
            {activePage === "offer-studio" && renderOfferStudioPage()}
            {activePage === "disbursal" && renderDisbursalPage()}
            {activePage === "repayment-plan" && renderRepaymentPage()}
            {activePage === "profile" && renderProfilePage()}

            <AnimatePresence>
              {funded && (
                <motion.div
                  className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-[0_14px_40px_rgba(16,185,129,0.08)]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                >
                  <div className="flex items-center gap-3 font-medium">
                    <CheckCircle2 className="size-5" />
                    {money(amount)} disbursed successfully to {account.bank} ending in {account.accountNumber.slice(-4)}.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </main>
  )
}
