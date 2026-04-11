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
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Upload,
  X,
} from "lucide-react"

import { BackgroundPaths } from "@/components/ui/background-paths"
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
    wash: "from-[#fffaf5] via-[#fffefe] to-[#f5f7ff]",
    chip: "border-[#e7ded5] bg-white/85 text-[#4f4338]",
    icon: "bg-[#f6ede3] text-[#7a5c42]",
    panel: "bg-[#faf4ed]",
    progress: "from-[#f6b26b] to-[#d98a5e]",
  },
  mint: {
    wash: "from-[#f8f1e8] via-[#fffefe] to-[#f6fbf8]",
    chip: "border-[#e7ded5] bg-white/85 text-[#4f4338]",
    icon: "bg-[#f1e6db] text-[#7a5c42]",
    panel: "bg-[#faf4ed]",
    progress: "from-[#f4c489] to-[#ce9f73]",
  },
  peach: {
    wash: "from-[#fff8ef] via-[#fffdfa] to-[#fff4ea]",
    chip: "border-[#e7ded5] bg-white/85 text-[#4f4338]",
    icon: "bg-[#f8e8d7] text-[#855d35]",
    panel: "bg-[#fbf2e7]",
    progress: "from-[#f5bf7a] to-[#e18f57]",
  },
  violet: {
    wash: "from-[#fff9f2] via-[#fffefe] to-[#f9f4ef]",
    chip: "border-[#e7ded5] bg-white/85 text-[#4f4338]",
    icon: "bg-[#f7ece1] text-[#7b5b43]",
    panel: "bg-[#faf3ea]",
    progress: "from-[#f6c58d] to-[#d69167]",
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
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-[#e9ddd0] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,250,245,0.84))] p-6 shadow-[0_24px_80px_rgba(73,47,24,0.08)] backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)]" />
      {children}
    </div>
  )
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
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/45 blur-2xl" />
      <div className="absolute inset-x-0 top-0 h-1.5 bg-white/90" />
      <div className="text-[11px] uppercase tracking-[0.24em] text-[#8b7b6a]">{label}</div>
      <div className="mt-3 text-3xl font-black tracking-tight text-[#1f1711]">{value}</div>
      <div className="mt-1 text-sm text-[#75685d]">{note}</div>
    </Card>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#948271]">{children}</div>
}

function GlassTile({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`rounded-[1.6rem] border border-[#eee2d5] bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(251,245,238,0.82))] p-4 shadow-[0_10px_35px_rgba(117,88,57,0.06)] ${className}`}>{children}</div>
}

function StatPill({
  label,
  value,
  tone = "light",
}: {
  label: string
  value: string
  tone?: "light" | "dark"
}) {
  const classes =
    tone === "dark"
      ? "border-[#1f1915] bg-[#181310] text-white"
      : "border-[#eee2d5] bg-white/80 text-[#241c16]"

  return (
    <div className={`rounded-[1.35rem] border p-4 ${classes}`}>
      <div className={`text-[11px] uppercase tracking-[0.22em] ${tone === "dark" ? "text-white/55" : "text-[#9a8979]"}`}>{label}</div>
      <div className="mt-3 text-2xl font-black">{value}</div>
    </div>
  )
}

const inputClassName =
  "rounded-[1.2rem] border border-[#eadfce] bg-[linear-gradient(180deg,#fffdfa,#fbf5ee)] px-4 py-3 text-[#241c16] outline-none transition placeholder:text-[#af9d8d] focus:border-[#d8ad7a] focus:bg-white"

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
        <MetricCard label="Eligible amount" value={money(180000)} note="Pre-approved limit" tint="bg-gradient-to-br from-[#fff8ef] via-white to-[#fff3e4]" />
        <MetricCard label="Selected offer" value={money(amount)} note={`${tenure} day plan`} tint="bg-gradient-to-br from-[#f8f3ec] via-white to-[#fdf7ef]" />
        <MetricCard label="Reward points" value={`${points}`} note={canRedeem ? "Ready to redeem" : "Target 500"} tint="bg-gradient-to-br from-[#fffaf1] via-white to-[#f8eee2]" />
        <MetricCard label="Disbursal" value={funded ? "Released" : "Pending"} note={funded ? "Completed" : "Waiting"} tint="bg-gradient-to-br from-[#fff6ef] via-white to-[#f7efe9]" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_390px]">
        <Card className="overflow-hidden">
          <div className="rounded-[1.8rem] border border-[#efe3d8] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(250,244,237,0.92))] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <SectionLabel>Journey steps</SectionLabel>
                <h2 className="mt-2 text-2xl font-black text-[#241c16]">Move through the loan process</h2>
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
                <GlassTile key={item.title} className="relative overflow-hidden p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-[#241c16]">{item.title}</div>
                      <p className="mt-2 max-w-[20rem] text-sm leading-6 text-[#75685d]">{item.text}</p>
                    </div>
                    <div className={`relative z-10 shrink-0 rounded-full px-3 py-1 text-xs font-medium ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-[#f7ede2] text-[#8a6545]"}`}>
                      {item.done ? "Done" : "Open"}
                    </div>
                  </div>
                  <div className="relative z-10 mt-6 flex items-center justify-between gap-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-[#aa9684]">{item.done ? "Completed checkpoint" : "Next available step"}</div>
                    <Button type="button" variant="outline" onClick={() => goToPage(item.href)} className="shrink-0 rounded-full border-[#eadfce] bg-white/90 px-4">
                      Open
                    </Button>
                  </div>
                </GlassTile>
              ))}
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="rounded-[1.8rem] bg-[#17120f] p-5 text-white">
            <SectionLabel>Reward system</SectionLabel>
            <h2 className="mt-2 text-2xl font-black text-white">Points and redemption</h2>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div className={`h-full rounded-full bg-gradient-to-r ${accent.progress}`} initial={{ width: 0 }} animate={{ width: `${Math.min(100, (points / 500) * 100)}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-white/65">
              <span>{points} points earned</span>
              <span>{Math.max(0, 500 - points)} to unlock</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <StatPill label="Completion" value={`${completion}%`} tone="dark" />
              <StatPill label="Reward target" value="500" tone="dark" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {[
              { label: "Identity completed", earned: completedSteps.identity },
              { label: "Profile completed", earned: completedSteps.profile },
              { label: "Offer chosen", earned: completedSteps.offer },
              { label: "Bank verified", earned: completedSteps.bank },
              { label: "Loan disbursed", earned: completedSteps.funded },
            ].map((item) => (
              <GlassTile key={item.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-[#5e5044]">{item.label}</span>
                <span className={`text-xs font-semibold ${item.earned ? "text-emerald-700" : "text-slate-500"}`}>
                  {item.earned ? "+100 earned" : "+100 pending"}
                </span>
              </GlassTile>
            ))}
          </div>

          <div className={`mt-5 rounded-[1.7rem] border px-5 py-5 ${canRedeem ? "border-emerald-200 bg-emerald-50" : "border-[#ead8c5] bg-[#fff5e8]"}`}>
            <div className="font-semibold text-[#241c16]">{canRedeem ? "Reward unlocked" : "Redemption locked"}</div>
            <p className="mt-1 text-sm leading-6 text-[#6e6054]">
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
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <SectionLabel>Application form</SectionLabel>
            <h2 className="mt-2 text-2xl font-black text-[#1f1711]">Start the borrower application</h2>
          </div>
          <div className={`rounded-full border px-4 py-2 text-sm font-medium ${completedSteps.identity && completedSteps.profile ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
            {completedSteps.identity && completedSteps.profile ? "+200 points earned" : "Earn up to 200 points"}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[#5e5044]">
            Full name
            <input value={profile.fullName} onChange={(event) => setProfile((current) => ({ ...current, fullName: event.target.value }))} className={inputClassName} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#5e5044]">
            Mobile
            <input value={profile.mobile} onChange={(event) => setProfile((current) => ({ ...current, mobile: event.target.value }))} className={inputClassName} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#5e5044]">
            Email
            <input value={profile.email} onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))} className={inputClassName} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#5e5044]">
            City
            <input value={profile.city} onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))} className={inputClassName} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#5e5044]">
            Employer
            <input value={profile.employer} onChange={(event) => setProfile((current) => ({ ...current, employer: event.target.value }))} className={inputClassName} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#5e5044]">
            Monthly income
            <input
              type="number"
              min={0}
              value={profile.income}
              onChange={(event) => setProfile((current) => ({ ...current, income: Number(event.target.value) || 0 }))}
              className={inputClassName}
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

      <Card className="overflow-hidden">
        <div className="rounded-[1.8rem] bg-[#181310] p-5 text-white">
          <SectionLabel>Form status</SectionLabel>
          <h2 className="mt-2 text-2xl font-black text-white">Application checkpoints</h2>
        </div>
        <div className="mt-5 space-y-3">
          {[
            { label: "Identity details complete", done: completedSteps.identity, points: 100 },
            { label: "Profile and income complete", done: completedSteps.profile, points: 100 },
          ].map((item) => (
            <GlassTile key={item.label} className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium text-[#241c16]">{item.label}</div>
                <div className={`rounded-full px-3 py-1 text-xs font-medium ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                  {item.done ? "Complete" : "Pending"}
                </div>
              </div>
              <div className="mt-2 text-sm text-[#75685d]">{item.done ? `+${item.points} points earned` : `Complete this step to earn +${item.points} points`}</div>
            </GlassTile>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderOfferStudioPage = () => (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <SectionLabel>Offer studio</SectionLabel>
            <h2 className="mt-2 text-2xl font-black text-[#241c16]">Tune the amount and tenure</h2>
          </div>
          <div className={`rounded-full border px-4 py-2 text-sm font-medium ${accent.chip}`}>Utilization {utilization}%</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <GlassTile className="bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(249,241,231,0.95))] p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-[#9a8979]">Loan amount</div>
            <motion.div key={amount} className="mt-3 text-4xl font-black text-[#241c16]" initial={{ opacity: 0.7, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }}>
              {money(amount)}
            </motion.div>
            <input type="range" min={10000} max={180000} step={5000} value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-6 w-full" />
            <div className="mt-2 flex justify-between text-xs text-[#9a8979]">
              <span>₹10K</span>
              <span>₹1.8L</span>
            </div>
          </GlassTile>

          <GlassTile className="bg-[linear-gradient(135deg,rgba(255,255,255,0.85),rgba(250,245,237,0.96))] p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-[#9a8979]">Repayment tenure</div>
            <motion.div key={tenure} className="mt-3 text-4xl font-black text-[#241c16]" initial={{ opacity: 0.7, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }}>
              {tenure} days
            </motion.div>
            <input type="range" min={30} max={150} step={6} value={tenure} onChange={(event) => setTenure(Number(event.target.value))} className="mt-6 w-full" />
            <div className="mt-2 flex justify-between text-xs text-[#9a8979]">
              <span>30 days</span>
              <span>150 days</span>
            </div>
          </GlassTile>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { label: "Interest", value: money(interest) },
            { label: "Fee", value: money(fee) },
            { label: "Total payable", value: money(totalPayable) },
          ].map((item) => (
            <StatPill key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="rounded-[1.8rem] bg-[#17120f] p-5 text-white">
          <SectionLabel>Offer result</SectionLabel>
          <h2 className="mt-2 text-2xl font-black text-white">What this offer means</h2>
          <p className="mt-2 text-sm leading-6 text-white/65">A cleaner summary of the amount impact before you move funds.</p>
        </div>
        <div className="mt-5 space-y-3">
          <GlassTile>
            <div className="text-sm text-[#8a7867]">Monthly repayment</div>
            <div className="mt-2 text-3xl font-black text-[#241c16]">{money(monthlyRepayment)}</div>
          </GlassTile>
          <GlassTile>
            <div className="text-sm text-[#8a7867]">Points for this step</div>
            <div className="mt-2 text-lg font-semibold text-[#241c16]">{completedSteps.offer ? "+100 earned" : "+100 pending"}</div>
          </GlassTile>
          <Button type="button" onClick={() => goToPage("/dashboard/disbursal")} className="mt-2 w-full rounded-full bg-slate-950 text-white">
            Continue to disbursal
          </Button>
        </div>
      </Card>
    </div>
  )

  const renderDisbursalPage = () => (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_390px]">
      <div className="space-y-6">
        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-[#181310] px-6 py-7 text-white">
              <SectionLabel>Disbursal hub</SectionLabel>
              <h2 className="mt-2 text-3xl font-black text-white md:text-4xl">Release funds with one final bank check.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
                This section is now focused on a single action: verify the destination account, confirm readiness, and trigger the payout.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <StatPill label="Payout amount" value={money(amount)} tone="dark" />
                <StatPill label="Service fee" value={money(fee)} tone="dark" />
                <StatPill label="Status" value={funded ? "Released" : "Pending"} tone="dark" />
              </div>
            </div>

            <div className="bg-[linear-gradient(180deg,#fff9f2_0%,#f8ede0_100%)] px-6 py-7">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a8979]">Live destination</div>
                  <div className="mt-2 text-2xl font-black text-[#241c16]">{account.bank}</div>
                </div>
                <div className={`flex size-12 items-center justify-center rounded-[1.3rem] ${accent.icon}`}>
                  <Landmark className="size-5" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-[1.4rem] border border-[#eadfce] bg-white/80 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#9a8979]">Account ending</div>
                  <div className="mt-2 text-3xl font-black text-[#241c16]">{account.accountNumber.slice(-4)}</div>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfce] bg-white/80 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-[#9a8979]">IFSC code</div>
                  <div className="mt-2 text-xl font-semibold text-[#241c16]">{account.ifsc}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card className="overflow-hidden">
            <SectionLabel>Beneficiary details</SectionLabel>
            <h3 className="mt-2 text-2xl font-black text-[#241c16]">Primary bank information</h3>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-[#5f5146]">
                Account holder
            <input value={account.holder} onChange={(event) => setAccount((current) => ({ ...current, holder: event.target.value }))} className={inputClassName} />
              </label>
              <label className="grid gap-2 text-sm font-medium text-[#5f5146]">
                Bank name
            <input value={account.bank} onChange={(event) => setAccount((current) => ({ ...current, bank: event.target.value }))} className={inputClassName} />
              </label>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <SectionLabel>Routing details</SectionLabel>
            <h3 className="mt-2 text-2xl font-black text-[#241c16]">Transfer routing check</h3>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-[#5f5146]">
                Account number
            <input value={account.accountNumber} onChange={(event) => setAccount((current) => ({ ...current, accountNumber: event.target.value }))} className={inputClassName} />
              </label>
              <label className="grid gap-2 text-sm font-medium text-[#5f5146]">
                IFSC code
            <input value={account.ifsc} onChange={(event) => setAccount((current) => ({ ...current, ifsc: event.target.value }))} className={inputClassName} />
              </label>
            </div>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="rounded-[1.8rem] bg-[#17120f] p-5 text-white">
            <SectionLabel>Release action</SectionLabel>
            <h3 className="mt-2 text-2xl font-black text-white">Payout control rail</h3>
            <p className="mt-2 text-sm leading-6 text-white/65">Use this side rail to confirm readiness and trigger the disbursal without scrolling through the form again.</p>
          </div>

          <div className="mt-5 space-y-3">
            <GlassTile>
              <div className="text-sm text-[#8a7867]">Borrower</div>
              <div className="mt-1 text-xl font-semibold text-[#241c16]">{profile.fullName}</div>
            </GlassTile>
            <GlassTile>
              <div className="text-sm text-[#8a7867]">Destination bank</div>
              <div className="mt-1 text-xl font-semibold text-[#241c16]">{account.bank}</div>
            </GlassTile>
            <GlassTile>
              <div className="text-sm text-[#8a7867]">Release amount</div>
              <div className="mt-1 text-3xl font-black text-[#241c16]">{money(amount)}</div>
            </GlassTile>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <Button type="button" onClick={handleDisbursal} disabled={disbursing || funded} className="h-12 rounded-full bg-[#17120f] text-white">
              {disbursing ? "Processing..." : funded ? "Disbursed" : "Release funds"}
            </Button>
            <Button type="button" variant="outline" onClick={() => goToPage("/dashboard/repayment-plan")} className="h-12 rounded-full border-[#eadfce] bg-white">
              View repayment
            </Button>
          </div>
        </Card>

        <Card>
          <SectionLabel>Readiness checks</SectionLabel>
          <h3 className="mt-2 text-2xl font-black text-[#241c16]">Before release</h3>
          <div className="mt-5 space-y-3">
            {[
              { label: "Bank details added", done: completedSteps.bank },
              { label: "Offer selected", done: completedSteps.offer },
              { label: "Funds released", done: completedSteps.funded },
            ].map((item, index) => (
              <GlassTile key={item.label} className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-[#f7ede2] text-xs font-bold text-[#8a6545]">{index + 1}</div>
                  <span className="text-sm text-[#5f5146]">{item.label}</span>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                  {item.done ? "Done" : "Pending"}
                </span>
              </GlassTile>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )

  const renderRepaymentPage = () => (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <SectionLabel>Repayment plan</SectionLabel>
            <h2 className="mt-2 text-2xl font-black text-[#241c16]">Comfort over time</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
            <TrendingUp className="size-4" />
            Stable
          </div>
        </div>

        <div className="mt-7 grid grid-cols-8 items-end gap-3 rounded-[1.8rem] border border-[#ece0d5] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(248,241,234,0.95))] px-4 pb-4 pt-8">
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
              <GlassTile key={item.label} className="px-4 py-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#9a8979]">
                  <span>{item.label}</span>
                  <Icon className="size-4" />
                </div>
                <div className="mt-3 text-2xl font-black text-[#241c16]">{item.value}</div>
              </GlassTile>
            )
          })}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="rounded-[1.8rem] bg-[#17120f] p-5 text-white">
          <SectionLabel>Scan to pay</SectionLabel>
          <h2 className="mt-2 text-2xl font-black text-white">Repayment QR</h2>
          <p className="mt-2 text-sm leading-6 text-white/65">A cleaner pay panel that keeps the scan action obvious.</p>
        </div>
        <div className="mt-5 flex justify-center rounded-[1.6rem] border border-[#ece0d5] bg-[#faf5ef] p-4">
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
            <GlassTile key={item.label} className="px-4 py-4">
              <div className="text-sm text-[#8a7867]">{item.label}</div>
              <div className="mt-1 text-xl font-semibold text-[#241c16]">{item.value}</div>
            </GlassTile>
          ))}
        </div>

        <p className="mt-4 text-sm leading-6 text-[#75685d]">
          The client can scan this QR from any UPI app to pay the current repayment amount directly.
        </p>
      </Card>
    </div>
  )

  const renderProfilePage = () => (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <Card className="overflow-hidden">
        <div className="rounded-[1.8rem] bg-[#181310] p-5 text-white">
          <SectionLabel>Profile photo</SectionLabel>
          <h2 className="mt-2 text-2xl font-black text-white">Client identity card</h2>
        </div>

        <div className="mt-6 flex flex-col items-center rounded-[1.8rem] border border-[#ece0d5] bg-[linear-gradient(180deg,#fffdfa,#f8f0e7)] p-6 text-center">
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
              <span className="text-5xl font-black text-[#6e5c4b]">{profile.fullName.charAt(0).toUpperCase()}</span>
            </div>
          )}

          <div className="mt-5 text-2xl font-black text-[#241c16]">{profile.fullName}</div>
          <div className="mt-1 text-sm text-[#75685d]">{profile.email}</div>

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
            <GlassTile key={item.label} className="px-4 py-4">
              <div className="text-sm text-[#8a7867]">{item.label}</div>
              <div className="mt-1 text-xl font-semibold text-[#241c16]">{item.value}</div>
            </GlassTile>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <SectionLabel>Client profile</SectionLabel>
            <h2 className="mt-2 text-2xl font-black text-[#241c16]">View client and loan details</h2>
            <p className="mt-2 text-sm text-[#75685d]">Only the profile picture can be changed here. All loan and KYC details are locked to the actual record.</p>
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
            <GlassTile key={item.label} className="px-4 py-4">
              <div className="text-xs uppercase tracking-[0.2em] text-[#9a8979]">{item.label}</div>
              <div className="mt-2 text-lg font-semibold text-[#241c16]">{item.value}</div>
            </GlassTile>
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
    <main className="relative min-h-screen overflow-x-hidden bg-[#f1e8de] text-[#241c16]">
      <BackgroundPaths
        showContent={false}
        className="absolute inset-0 z-0 min-h-full bg-transparent opacity-75"
        pathClassName="text-[#6f4f35]"
      />
      <div className="relative z-10 mx-auto max-w-[1550px] px-4 py-6 md:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
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
            className={`fixed inset-y-0 left-0 z-40 w-[310px] max-w-[calc(100vw-1.5rem)] px-4 py-6 transition-transform duration-300 md:px-6 lg:hidden ${
              sidebarOpen ? "translate-x-0" : "-translate-x-[110%]"
            }`}
          >
            <Card className="h-full rounded-[2.25rem] bg-[rgba(255,255,255,0.9)] p-4">
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
            <Card className="rounded-[2.2rem] bg-[rgba(255,255,255,0.88)] p-4">
              <div className="mb-5 flex items-center gap-3 rounded-[1.8rem] bg-[linear-gradient(135deg,#17120f,#31251d)] px-4 py-4 text-white">
                <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-base font-black text-white">Q</div>
                <div>
                  <div className="text-sm font-semibold text-white">QuaLoan</div>
                  <div className="text-xs uppercase tracking-[0.22em] text-white/55">Workspace</div>
                </div>
              </div>

              <div className={`rounded-[1.8rem] bg-gradient-to-br ${accent.wash} p-4`}>
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-[1.2rem] bg-white text-[#241c16] shadow-sm">
                    {profilePhoto ? (
                      <Image src={profilePhoto} alt={`${profile.fullName} avatar`} width={56} height={56} className="size-14 rounded-[1.2rem] object-cover" />
                    ) : (
                      <span className="text-xl font-black">{profile.fullName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[#8b7b6a]">Borrower</div>
                    <div className="mt-1 text-lg font-black text-[#241c16]">{profile.fullName}</div>
                    <div className="text-sm text-[#75685d]">{profile.mobile}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[1.2rem] bg-white/80 p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#8b7b6a]">Progress</div>
                    <div className="mt-2 text-2xl font-black text-[#241c16]">{completion}%</div>
                  </div>
                  <div className="rounded-[1.2rem] bg-white/80 p-3">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#8b7b6a]">Points</div>
                    <div className="mt-2 text-2xl font-black text-[#241c16]">{points}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f7d6d]">Loan flow</div>
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = item.id === activePage
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center justify-between rounded-[1.35rem] border px-3 py-3 text-sm transition ${
                          isActive
                            ? "border-[#e6d7c8] bg-white text-[#241c16] shadow-[0_10px_30px_rgba(117,88,57,0.07)]"
                            : "border-transparent text-[#75685d] hover:border-[#eadfce] hover:bg-white/80 hover:text-[#241c16]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex size-10 items-center justify-center rounded-[1rem] ${isActive ? accent.icon : "bg-[#f5eee7] text-[#7b6b5d]"}`}>
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-[#9a8979]">{item.short}</div>
                          </div>
                        </div>
                        <ChevronRight className="size-4 opacity-40" />
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-[1.6rem] bg-[linear-gradient(180deg,#faf5ef,#f5ede4)] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f7d6d]">Reports</div>
                <div className="mt-3 space-y-2 text-sm text-[#5f5146]">
                  <div className="flex items-center justify-between rounded-full bg-white/80 px-3 py-2">
                    <span>Repayment health</span>
                    <span className="font-semibold">{Math.round((points / 500) * 100)}%</span>
                  </div>
                  <div className="flex items-center justify-between rounded-full bg-white/80 px-3 py-2">
                    <span>Bank verified</span>
                    <span className="font-semibold">{completedSteps.bank ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          <section className="space-y-6">
            <div className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.8rem] border border-[#eadfce] bg-[rgba(255,255,255,0.82)] px-4 py-3 shadow-[0_16px_40px_rgba(117,88,57,0.06)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen((current) => !current)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-medium text-[#5b4c40] shadow-sm transition hover:border-[#dbcab6] lg:hidden"
                  >
                    <Menu className="size-4" />
                    {sidebarOpen ? "Close" : "Menu"}
                  </button>
                  <div className="relative hidden min-w-[280px] flex-1 items-center md:flex lg:min-w-[340px]">
                    <Search className="pointer-events-none absolute left-4 size-4 text-[#9a8979]" />
                    <input readOnly value="Try searching borrower insights" className="h-11 w-full rounded-full border border-[#ece1d6] bg-[#fbf8f4] pl-11 pr-4 text-sm text-[#9a8979] outline-none" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex size-11 items-center justify-center rounded-full border border-[#eadfce] bg-white text-[#6f6054] shadow-sm">
                    <Bell className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToPage("/dashboard/profile")}
                    className="inline-flex items-center gap-2 rounded-full border border-[#eadfce] bg-white px-4 py-2 text-sm font-medium text-[#5f5146] shadow-sm transition hover:border-[#dbcab6]"
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
                  <Button type="button" variant="outline" onClick={handleLogout} className="rounded-full border-[#eadfce] bg-white px-4 text-[#5f5146]">
                    Logout
                  </Button>
                </div>
              </div>

              <div className="mt-3 overflow-hidden rounded-[2rem] border border-[#ebdfd2] bg-[rgba(255,255,255,0.78)] p-6 shadow-[0_18px_48px_rgba(117,88,57,0.06)] backdrop-blur-xl">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="max-w-3xl">
                    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${accent.chip}`}>
                      <Sparkles className="size-3.5" />
                      {copy.eyebrow}
                    </div>
                    <h1 className="mt-5 text-3xl font-black tracking-[-0.03em] text-[#1f1711] md:text-5xl">{copy.title}</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#75685d] md:text-base">{copy.description}</p>
                  </div>

                  <div className="grid w-full gap-3 md:grid-cols-3 xl:w-[540px]">
                    <div className="rounded-[1.4rem] border border-[#efe3d7] bg-[#fcf8f4] p-4">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[#9a8979]">Selected amount</div>
                      <div className="mt-3 text-2xl font-black text-[#241c16]">{money(amount)}</div>
                    </div>
                    <div className="rounded-[1.4rem] border border-[#efe3d7] bg-[#fcf8f4] p-4">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[#9a8979]">Repayment window</div>
                      <div className="mt-3 text-2xl font-black text-[#241c16]">{tenure} days</div>
                    </div>
                    <div className="rounded-[1.4rem] border border-[#14110f] bg-[#14110f] p-4 text-white">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-white/60">
                        <span>Progress</span>
                        <span>{completion}%</span>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                        <motion.div className={`h-full rounded-full bg-gradient-to-r ${accent.progress}`} initial={{ width: 0 }} animate={{ width: `${completion}%` }} />
                      </div>
                      <div className="mt-3 text-sm text-white/70">Next step: {nextNavItem.label}</div>
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
                        isActive ? "border-[#e6d7c8] bg-white text-[#241c16] shadow-sm" : "border-[#ece1d6] bg-white/80 text-[#6e5f53] hover:border-[#dbcab6] hover:text-[#241c16]"
                      }`}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="hidden items-center justify-between rounded-[1.6rem] border border-[#e9dfd4] bg-[rgba(255,255,255,0.76)] px-5 py-4 text-sm text-[#75685d] shadow-[0_12px_40px_rgba(117,88,57,0.05)] backdrop-blur-xl md:flex">
              <div>Workspace rhythm: finish the current step, collect points, and keep the client moving without friction.</div>
              <div className="font-semibold text-[#241c16]">{canRedeem ? "Reward unlocked" : `${Math.max(0, 500 - points)} points to unlock rewards`}</div>
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
                  className="rounded-[1.8rem] border border-[#ecd4b8] bg-[#fff6eb] px-5 py-4 text-[#8b5b2f] shadow-[0_14px_40px_rgba(214,145,103,0.12)]"
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
