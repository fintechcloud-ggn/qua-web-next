"use client"

import Image from "next/image"
import Link from "next/link"
import { startTransition, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Bell,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  HandCoins,
  LayoutDashboard,
  MoreHorizontal,
  PiggyBank,
  Search,
  Send,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  X,
  Wallet,
  Clock3,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/dashboard-shared"
import { getAvatarTextColor } from "@/components/ui/dashboard-pages/avatar-text-color"
import { ApplicationWorkspace, DisbursalWorkspace, OfferWorkspace, OverviewWorkspace, ProfileWorkspace, RepaymentWorkspace } from "@/components/ui/dashboard-pages"
import type { ApplicationForm, DashboardAccount, DashboardProfile, PageId } from "@/components/ui/dashboard-pages/types"

type StoredProfile = {
  profile?: DashboardProfile
  account?: DashboardAccount
  application?: ApplicationForm
  amount?: number
  tenure?: number
  profilePhoto?: string
}

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
}> = [
  { id: "overview", label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { id: "application", label: "Application", href: "/dashboard/application", icon: FileText },
  { id: "offer-studio", label: "Offer", href: "/dashboard/offer-studio", icon: SlidersHorizontal },
  { id: "disbursal", label: "Disbursal", href: "/dashboard/disbursal", icon: HandCoins },
  { id: "repayment-plan", label: "Repayment", href: "/dashboard/repayment-plan", icon: PiggyBank },
]

const pageCopy: Record<PageId, { title: string; description: string }> = {
  overview: {
    title: "Dashboard",
    description: "A calm overview of your loan journey, current status, and the next action.",
  },
  application: {
    title: "Application",
    description: "A compact place to review borrower details without extra clutter.",
  },
  "offer-studio": {
    title: "Offer",
    description: "Tune amount and tenure in a focused control card.",
  },
  disbursal: {
    title: "Disbursal",
    description: "Confirm the bank account and release the funds.",
  },
  "repayment-plan": {
    title: "Repayment",
    description: "Show the pay amount, QR, and due context in one place.",
  },
  profile: {
    title: "Profile",
    description: "Keep the KYC identity and account details easy to verify.",
  },
}

const purposeOptions = ["Medical Emergency", "Salary Gap", "Home Expenses", "Travel", "Education", "Business", "Other"]
const employmentOptions = ["Salaried", "Self-Employed", "Business Owner", "Freelancer"]

const topActions = [
  { label: "Search", icon: Search },
  { label: "Alerts", icon: Bell },
  { label: "Settings", icon: Settings2 },
]

const activityItems = [
  {
    title: "Application saved",
    detail: "Identity and profile details",
    amount: "Done",
    icon: BadgeCheck,
  },
  {
    title: "Offer updated",
    detail: "Loan amount and tenure",
    amount: "Live",
    icon: Banknote,
  },
  {
    title: "Bank verified",
    detail: "Account and IFSC checked",
    amount: "Queued",
    icon: CreditCard,
  },
  {
    title: "Repayment due",
    detail: "UPI collection link ready",
    amount: "Soon",
    icon: Clock3,
  },
]

function readStoredProfile() {
  if (typeof window === "undefined") {
    return null
  }

  const stored = window.localStorage.getItem("qualoan-client-profile")
  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as StoredProfile
  } catch {
    return null
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function buildPath(values: number[], width = 100, height = 44, padding = 4) {
  if (!values.length) {
    return ""
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = Math.max(max - min, 1)
  const step = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0

  return values
    .map((value, index) => {
      const x = padding + index * step
      const normalized = (value - min) / range
      const y = height - padding - normalized * (height - padding * 2)
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
}

function Sparkline({
  values,
  stroke,
  className = "",
}: {
  values: number[]
  stroke: string
  className?: string
}) {
  const path = useMemo(() => buildPath(values, 86, 38, 7), [values])

  return (
    <svg viewBox="0 0 100 44" className={className} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id={`spark-fill-${stroke.replace(/[^a-zA-Z0-9]/g, "")}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.03" />
        </linearGradient>
      </defs>
      <path d={`${path} L 93 39 L 7 39 Z`} fill={`url(#spark-fill-${stroke.replace(/[^a-zA-Z0-9]/g, "")})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatCard({
  label,
  value,
  delta,
  color,
  values,
  variant = "default",
}: {
  label: string
  value: string
  delta: string
  color: string
  values: number[]
  variant?: "default" | "feature" | "offer"
}) {
  if (variant === "feature") {
    return (
      <div className="overflow-hidden rounded-[1.5rem] border border-[#f0d7bf] bg-[linear-gradient(180deg,#fffdfb_0%,#fff4ea_100%)] p-4 shadow-[0_18px_40px_rgba(156,78,11,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#bf6a22]">{label}</div>
            <div className="mt-3 text-[2rem] font-black tracking-[-0.05em] text-[#201812]">{value}</div>
          </div>
          <div className="flex h-14 w-28 shrink-0 items-center justify-end overflow-hidden rounded-[1rem] bg-white/70 px-2">
            <Sparkline values={values} stroke={color} className="h-full w-full opacity-100" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#fff1e4] text-[#dd8b3d]">
            <ArrowUpRight className="size-4" />
          </div>
          <div className="text-sm font-semibold text-[#6f665f]">{delta}</div>
        </div>
      </div>
    )
  }

  if (variant === "offer") {
    return (
      <div className="overflow-hidden rounded-[1.6rem] border border-[#f0d7bf] bg-[linear-gradient(180deg,#fff8f0_0%,#fff1e3_100%)] p-4 shadow-[0_18px_38px_rgba(156,78,11,0.08)]">
        <div className="space-y-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#bf6a22]">{label}</div>
          <div className="flex h-16 w-full items-center justify-end overflow-hidden rounded-[1.1rem] bg-white/80 px-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <Sparkline values={values} stroke={color} className="h-full w-full opacity-100" />
          </div>
          <div className="min-w-0 text-[2rem] font-black tracking-[-0.05em] text-[#201812]">{value}</div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-[1rem] bg-white/65 px-3 py-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#6f665f]">
            <ArrowUpRight className="size-4 text-[#dd8b3d]" />
            {delta}
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b66a28]">Offer signal</div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-[#f1d8bf] bg-white p-4 shadow-[0_10px_30px_rgba(156,78,11,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#bf6a22]">{label}</div>
          <div className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#201812]">{value}</div>
        </div>
        <div className="flex h-11 w-24 shrink-0 items-center justify-end overflow-hidden">
          <Sparkline values={values} stroke={color} className="h-full w-full opacity-95" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#6f665f]">
        <ArrowUpRight className="size-4 text-[#dd8b3d]" />
        {delta}
      </div>
    </div>
  )
}

function ActivityRow({
  title,
  detail,
  amount,
  icon: Icon,
}: {
  title: string
  detail: string
  amount: string
  icon: typeof BadgeCheck
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[1rem] border border-[#f1d8bf] bg-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[0.95rem] bg-[#fff1e4] text-[#b85a12]">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-[#241a13]">{title}</div>
          <div className="truncate text-xs text-[#8b7c6f]">{detail}</div>
        </div>
      </div>
      <div className="shrink-0 text-sm font-semibold text-[#8d4710]">{amount}</div>
    </div>
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
  const storedProfile = readStoredProfile()

  const [amount, setAmount] = useState(storedProfile?.amount ?? 145000)
  const [tenure, setTenure] = useState(storedProfile?.tenure ?? 84)
  const [funded, setFunded] = useState(false)
  const [disbursing, setDisbursing] = useState(false)
  const [profilePreviewMode, setProfilePreviewMode] = useState<"readonly" | null>(null)
  const [profilePhoto] = useState(storedProfile?.profilePhoto ?? "")
  const [application, setApplication] = useState(
    storedProfile?.application ?? {
      fullName: user.name,
      mobile: user.mobile,
      email: user.email,
      city: user.city || "",
      employmentType: "",
      employer: "",
      monthlyIncome: "",
      purpose: "",
      loanAmount: storedProfile?.amount ?? 25000,
      tenure: storedProfile?.tenure ?? 30,
      panCard: "",
      aadhaar: "",
      bankAccount: "",
      agreed: false,
      status: "draft" as const,
    }
  )
  const [applicationErrors, setApplicationErrors] = useState<Partial<Record<keyof ApplicationForm, string>>>({})
  const [profile, setProfile] = useState(
    storedProfile?.profile ?? {
      fullName: user.name,
      mobile: user.mobile,
      email: user.email,
      city: user.city || "",
      address: user.city || "",
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
  const repaymentAmount = Math.max(500, Math.round(monthlyRepayment))
  const utilization = Math.min(100, Math.round((amount / 180000) * 100))
  const activeIndex = navItems.findIndex((item) => item.id === activePage)
  const nextNavItem = activeIndex === -1 ? navItems[navItems.length - 1] : (navItems[activeIndex + 1] ?? navItems[activeIndex])
  const copy = pageCopy[activePage]
  const applicationSubmitted = application.status === "submitted"

  const completedSteps = useMemo(
    () => ({
      application: applicationSubmitted,
      identity: profile.fullName.trim().length > 3 && profile.mobile.trim().length >= 10 && profile.email.includes("@"),
      profile: profile.city.trim().length > 1 && profile.employer.trim().length > 2 && profile.income >= 25000,
      offer: amount >= 50000 && tenure >= 60,
      bank: account.holder.trim().length > 2 && account.bank.trim().length > 2 && account.accountNumber.trim().length >= 8 && account.ifsc.trim().length >= 5,
      funded,
    }),
    [account.accountNumber, account.bank, account.holder, account.ifsc, amount, applicationSubmitted, funded, profile.city, profile.email, profile.employer, profile.fullName, profile.income, profile.mobile, tenure]
  )

  const stepCount = Object.values(completedSteps).filter(Boolean).length
  const stepTotal = Object.keys(completedSteps).length
  const progress = Math.round((stepCount / stepTotal) * 100)
  const points = stepCount * 100
  const canRedeem = points >= 500

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

  const chartPrimary = useMemo(() => {
    const scale = 0.9 + amount / 260000
    return [20, 28, 24, 31, 29, 38, 34].map((value, index) => Math.round(value * scale + (funded ? index % 2 : 0)))
  }, [amount, funded])

  const chartSecondary = useMemo(() => {
    const scale = 0.84 + tenure / 260
    return [16, 21, 19, 22, 23, 26, 24].map((value) => Math.round(value * scale))
  }, [tenure])

  const heroPrimaryPath = useMemo(() => buildPath(chartPrimary, 96, 56, 10), [chartPrimary])
  const heroSecondaryPath = useMemo(() => buildPath(chartSecondary, 96, 56, 10), [chartSecondary])
  const applicationAmount = application.loanAmount || amount
  const applicationTenure = application.tenure || tenure

  useEffect(() => {
    window.localStorage.setItem(
      "qualoan-client-profile",
      JSON.stringify({
        profile,
        account,
        application,
        amount,
        tenure,
        profilePhoto,
      })
    )
  }, [account, amount, application, profile, profilePhoto, tenure])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    startTransition(() => {
      router.replace("/")
      router.refresh()
    })
  }

  const handleDisbursal = () => {
    setDisbursing(true)
    window.setTimeout(() => {
      setDisbursing(false)
      setFunded(true)
    }, 1200)
  }

  const goToPage = (path: string) => {
    startTransition(() => {
      router.push(path)
    })
  }

  const updateApplication = <K extends keyof ApplicationForm>(key: K, value: ApplicationForm[K]) => {
    setApplication((current) => ({ ...current, [key]: value }))
    setApplicationErrors((current) => ({ ...current, [key]: "" }))
  }

  const submitApplication = () => {
    const nextErrors: Partial<Record<keyof ApplicationForm, string>> = {}

    if (!application.fullName.trim()) nextErrors.fullName = "Required"
    if (!application.mobile.trim() || application.mobile.trim().length < 10) nextErrors.mobile = "Valid mobile required"
    if (!application.email.trim() || !application.email.includes("@")) nextErrors.email = "Valid email required"
    if (!application.city.trim()) nextErrors.city = "Required"
    if (!application.employmentType.trim()) nextErrors.employmentType = "Select employment type"
    if (!application.employer.trim()) nextErrors.employer = "Enter employer or business name"
    if (!application.monthlyIncome.trim() || Number(application.monthlyIncome) < 10000) nextErrors.monthlyIncome = "Minimum monthly income is ₹10,000"
    if (!application.purpose.trim()) nextErrors.purpose = "Select a purpose"
    if (application.loanAmount < 10000) nextErrors.loanAmount = "Minimum amount is ₹10,000"
    if (application.tenure < 30) nextErrors.tenure = "Minimum tenure is 30 days"
    if (!application.panCard.trim() || application.panCard.trim().length !== 10) nextErrors.panCard = "Valid PAN required"
    if (!application.aadhaar.trim() || application.aadhaar.trim().length !== 12) nextErrors.aadhaar = "Valid Aadhaar required"
    if (!application.bankAccount.trim() || application.bankAccount.trim().length < 8) nextErrors.bankAccount = "Bank account required"
    if (!application.agreed) nextErrors.agreed = "Accept the terms to continue"

    setApplicationErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setApplication((current) => ({
      ...current,
      status: "submitted",
      submittedAt: new Date().toISOString(),
      applicationId: current.applicationId || `APP-${Date.now().toString().slice(-6)}`,
    }))

    const submittedApplication = {
      ...application,
      status: "submitted" as const,
      submittedAt: new Date().toISOString(),
      applicationId: application.applicationId || `APP-${Date.now().toString().slice(-6)}`,
    }
    window.localStorage.setItem(
      "qualoan-client-profile",
      JSON.stringify({
        profile,
        account,
        application: submittedApplication,
        amount,
        tenure,
        profilePhoto,
      })
    )

    startTransition(() => {
      router.push("/dashboard/offer-studio")
    })
  }

  const pageWorkspace = (() => {
    if (activePage === "overview") {
      return (
        <OverviewWorkspace
          progress={progress}
          activeLabel={navItems[activeIndex]?.label ?? "Overview"}
          description={copy.description}
          completedSteps={completedSteps}
          onContinue={() => goToPage(completedSteps.application ? nextNavItem.href : "/dashboard/application")}
          onOpenProfile={() => setProfilePreviewMode("readonly")}
        />
      )
    }

    if (activePage === "application") {
      return (
        <ApplicationWorkspace
          application={application}
          applicationErrors={applicationErrors}
          applicationSubmitted={applicationSubmitted}
          applicationAmount={applicationAmount}
          applicationTenure={applicationTenure}
          purposeOptions={purposeOptions}
          employmentOptions={employmentOptions}
          money={money}
          updateApplication={updateApplication}
          submitApplication={submitApplication}
          onBack={() => goToPage("/dashboard")}
        />
      )
    }

    if (activePage === "offer-studio") {
      return (
        <OfferWorkspace
          utilization={utilization}
          amount={amount}
          tenure={tenure}
          interest={interest}
          fee={fee}
          totalPayable={totalPayable}
          money={money}
          setAmount={setAmount}
          setTenure={setTenure}
          onContinue={() => goToPage("/dashboard/disbursal")}
          onBack={() => goToPage("/dashboard")}
        />
      )
    }

    if (activePage === "disbursal") {
      return (
        <DisbursalWorkspace
          funded={funded}
          disbursing={disbursing}
          account={account}
          completedSteps={completedSteps}
          setAccount={setAccount}
          handleDisbursal={handleDisbursal}
          onViewRepayment={() => goToPage("/dashboard/repayment-plan")}
        />
      )
    }

    if (activePage === "repayment-plan") {
      return (
        <RepaymentWorkspace
          monthlyRepayment={monthlyRepayment}
          funded={funded}
          repaymentAmount={repaymentAmount}
          profileName={profile.fullName}
          upiPaymentUrl={upiPaymentUrl}
          money={money}
        />
      )
    }

    if (activePage === "profile") {
      return <ProfileWorkspace initials={initials(profile.fullName)} fullName={profile.fullName} />
    }

    return null
  })()

  const profileName = application.fullName || profile.fullName
  const profileEmail = application.email || profile.email
  const profileCity = profile.address || application.city || profile.city || "-"
  const profileMobile = application.mobile || profile.mobile
  const isOverviewPage = activePage === "overview"
  const isApplicationPage = activePage === "application"
  const isOfferPage = activePage === "offer-studio"
  const avatarTextColor = getAvatarTextColor(profileName)
  const profilePhotoOrInitials = profilePhoto ? (
    <Image src={profilePhoto} alt={profileName} width={192} height={192} className="size-44 rounded-full object-cover ring-4 ring-white shadow-[0_18px_40px_rgba(156,78,11,0.14)]" />
  ) : (
    <div className="flex size-44 items-center justify-center rounded-full bg-[#ffe2c9] text-6xl font-black ring-4 ring-white shadow-[0_18px_40px_rgba(156,78,11,0.14)]" style={{ color: avatarTextColor }}>
      {initials(profileName)}
    </div>
  )

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,247,240,0.98),_rgba(255,236,221,0.94)_42%,_#f6ddc6_100%)] p-3 text-[#201812] md:p-5">
      <div className="mx-auto max-w-[1820px] overflow-hidden rounded-[2rem] border border-white/70 bg-[#fff9f4] shadow-[0_30px_100px_rgba(156,78,11,0.12)]">
        <div className={`grid min-h-[calc(100vh-1.5rem)] ${isApplicationPage || isOverviewPage ? "xl:grid-cols-[250px_minmax(0,1fr)]" : "xl:grid-cols-[250px_minmax(0,1fr)_330px]"}`}>
          <aside className="border-b border-[#f0d7bf] bg-[#fff0e2] p-4 xl:border-b-0 xl:border-r">
            <div className="sticky top-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-[1rem] bg-[#d86c1e] text-white shadow-[0_10px_30px_rgba(216,108,30,0.24)]">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <div className="text-[1.1rem] font-black tracking-[-0.03em] text-[#9e520f]">QuaLoan</div>
                  <div className="text-xs uppercase tracking-[0.22em] text-[#c96a1a]">Client journey</div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-[#f0d7bf] bg-white p-5 shadow-[0_12px_40px_rgba(156,78,11,0.06)]">
                <div className="flex justify-center">
                  <button
                    type="button"
                    aria-label="Open profile preview"
                    onClick={() => setProfilePreviewMode("readonly")}
                    className="rounded-full transition hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d86c1e] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
                  >
                    {profilePhoto ? (
                      <Image src={profilePhoto} alt={profile.fullName} width={144} height={144} className="size-36 shrink-0 rounded-full object-cover ring-4 ring-[#ffe8d3]" />
                    ) : (
                      <div className="flex size-36 shrink-0 items-center justify-center rounded-full bg-[#ffe0c5] text-5xl font-black ring-4 ring-[#ffe8d3]" style={{ color: avatarTextColor }}>
                        {initials(profile.fullName)}
                      </div>
                    )}
                  </button>
                </div>

                <div className="mt-5 rounded-[1.2rem] bg-[#fff7ef] p-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Progress</div>
                  <div className="mt-2 flex items-end justify-between">
                    <div className="text-3xl font-black tracking-[-0.04em]">{progress}%</div>
                    <div className="text-sm font-semibold text-[#6f6358]">Next: {nextNavItem.label}</div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f2d7bf]">
                    <div className="h-full rounded-full bg-[#d86c1e]" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.id === activePage
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center justify-between rounded-[1rem] border px-4 py-3 text-sm transition ${
                        isActive ? "border-[#d86c1e] bg-[#d86c1e] text-white shadow-[0_12px_30px_rgba(216,108,30,0.22)]" : "border-[#f0d7bf] bg-white text-[#201812] hover:bg-[#fff4e9]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="size-4 opacity-55" />
                    </Link>
                  )
                })}
              </nav>

              <div className="space-y-2 pt-2">
                <Button type="button" onClick={() => setProfilePreviewMode("readonly")} className="w-full rounded-full bg-[#d86c1e] text-white hover:bg-[#c85f16]">
                  Profile
                </Button>
                <Button type="button" variant="outline" onClick={handleLogout} className="w-full rounded-full border-[#f0d7bf] bg-white">
                  Sign out
                </Button>
              </div>
            </div>
          </aside>

          <section className="min-w-0 border-b border-[#f0d7bf] bg-[#fffaf6] p-4 md:p-6 xl:border-b-0 xl:border-r">
            {isApplicationPage || isOverviewPage ? (
              <div className="space-y-4">
                {pageWorkspace}
              </div>
            ) : (
              <div className="space-y-4">
              <Card className="overflow-hidden border border-[#ead4bd] bg-[linear-gradient(135deg,#fff9f4_0%,#fff2e6_42%,#f6e1cf_100%)] p-0">
                <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#b7651b] shadow-[0_10px_25px_rgba(156,78,11,0.06)]">
                      Hello {profile.fullName.split(" ")[0] || user.name.split(" ")[0] || "there"}
                    </div>
                    <h1 className="mt-4 max-w-xl text-4xl font-black tracking-[-0.05em] text-[#1f1913] md:text-[3.35rem]">{copy.title}</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f6358]">{copy.description}</p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {[
                        { label: "Live score", value: `${profile.score}/100` },
                        { label: "Stage", value: copy.title === "Dashboard" ? "Overview" : copy.title },
                        { label: "Repayment date", value: profile.repaymentDate },
                      ].map((item) => (
                        <div key={item.label} className="rounded-[1.35rem] border border-white/70 bg-white/72 px-4 py-4 shadow-[0_10px_24px_rgba(156,78,11,0.06)] backdrop-blur-sm">
                          <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">{item.label}</div>
                          <div className="mt-2 text-lg font-black text-[#201812]">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.8rem] border border-white/70 bg-[#2f190c] p-4 text-white shadow-[0_24px_60px_rgba(47,25,12,0.22)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.22em] text-[#ffb15a]">Command deck</div>
                        <div className="mt-2 text-2xl font-black text-white">Daily cockpit</div>
                      </div>
                      <button className="inline-flex h-11 items-center justify-between gap-3 rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white/90">
                        <span className="truncate">Choose account</span>
                        <ChevronDown className="size-4 shrink-0 opacity-75" />
                      </button>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {topActions.map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          type="button"
                          aria-label={label}
                          className="flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 text-sm font-medium text-white/88 transition hover:bg-white/14"
                        >
                          <Icon className="size-4" />
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.35rem] bg-white/8 p-4">
                        <div className="text-[10px] uppercase tracking-[0.22em] text-[#ffcf92]">Loan health</div>
                        <div className="mt-2 text-3xl font-black text-white">{funded ? "Funded" : "In review"}</div>
                        <div className="mt-2 text-sm leading-6 text-white/68">Quick scan of status, score, and next available action.</div>
                      </div>
                      <div className="rounded-[1.35rem] bg-[linear-gradient(180deg,rgba(255,177,90,0.22)_0%,rgba(255,177,90,0.06)_100%)] p-4">
                        <div className="text-[10px] uppercase tracking-[0.22em] text-[#ffd7ac]">Next best move</div>
                        <div className="mt-2 text-lg font-black text-white">{completedSteps.offer ? "Move to disbursal" : "Review application"}</div>
                        <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#ffd7ac]">
                          <ArrowUpRight className="size-4" />
                          Momentum +10%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className={`grid gap-4 ${activePage === "repayment-plan" ? "xl:grid-cols-[minmax(0,1.9fr)_minmax(0,0.9fr)]" : ""}`}>
                {isApplicationPage ? (
                  <Card className="overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,205,153,0.45),_rgba(255,247,239,0.96)_38%,_rgba(255,240,226,0.98)_100%)]">
                    <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.1fr)_360px]">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#8d4710]">My Card</div>
                        <div className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#201812] md:text-[2.9rem]">{money(amount)}</div>
                        <div className="mt-3 max-w-xl text-sm leading-6 text-[#6f6358]">Loan limit, movement, and quick actions grouped into one cleaner performance card.</div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <div className="rounded-[1.1rem] border border-[#f0d7bf] bg-white/85 px-4 py-3 shadow-[0_10px_24px_rgba(156,78,11,0.06)]">
                            <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Available</div>
                            <div className="mt-2 text-lg font-black text-[#201812]">{money(profile.sanctionAmount)}</div>
                          </div>
                          <div className="rounded-[1.1rem] border border-[#f0d7bf] bg-white/85 px-4 py-3 shadow-[0_10px_24px_rgba(156,78,11,0.06)]">
                            <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Movement</div>
                            <div className="mt-2 flex items-center gap-2 text-lg font-black text-[#201812]">
                              <ArrowUpRight className="size-4 text-[#dd8b3d]" />
                              +10%
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                          <Button type="button" className="rounded-full bg-[#d86c1e] px-5 text-white hover:bg-[#c85f16]">
                            Deposit
                          </Button>
                          <Button type="button" variant="outline" className="rounded-full border-[#f0d7bf] bg-white/80 px-5 text-[#3a1d0d] hover:bg-white">
                            Withdraw
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-[1.6rem] border border-[#f0d7bf] bg-white/75 p-4 shadow-[0_20px_40px_rgba(156,78,11,0.08)]">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Flow graph</div>
                            <div className="mt-2 text-lg font-black text-[#201812]">Balance momentum</div>
                          </div>
                          <div className="rounded-full bg-[#fff1e4] px-3 py-1 text-xs font-semibold text-[#b85a12]">Live</div>
                        </div>

                        <div className="mt-5 h-44 overflow-hidden rounded-[1.2rem] bg-[linear-gradient(180deg,#fff9f4_0%,#fff2e7_100%)] p-3">
                          <svg viewBox="0 0 100 64" className="h-full w-full" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="heroAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffb15a" stopOpacity="0.36" />
                                <stop offset="100%" stopColor="#ffb15a" stopOpacity="0.03" />
                              </linearGradient>
                              <linearGradient id="heroLineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#d86c1e" />
                                <stop offset="100%" stopColor="#ffb15a" />
                              </linearGradient>
                            </defs>
                            <path d="M 10 10 L 10 56 L 90 56" fill="none" stroke="#f2d7bf" strokeWidth="1" strokeDasharray="3 4" />
                            <path d={`${heroSecondaryPath} L 90 56 L 10 56 Z`} fill="#ffffff" fillOpacity="0.45" />
                            <path d={heroSecondaryPath} fill="none" stroke="#efcfb2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d={`${heroPrimaryPath} L 90 56 L 10 56 Z`} fill="url(#heroAreaGradient)" />
                            <path d={heroPrimaryPath} fill="none" stroke="url(#heroLineGradient)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : isOfferPage ? (
                  <Card className="overflow-hidden bg-[linear-gradient(135deg,#fff6eb_0%,#ffe7cb_45%,#fff4ea_100%)]">
                    <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.05fr)_380px]">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#8d4710]">Offer studio</div>
                        <div className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#201812] md:text-[2.9rem]">{money(amount)}</div>
                        <div className="mt-3 max-w-xl text-sm leading-6 text-[#6f6358]">Shape the final quote with a more visual card focused on offer value, term, and payoff direction.</div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          {[
                            { label: "Utilization", value: `${utilization}%` },
                            { label: "Tenure", value: `${tenure} days` },
                            { label: "Total payable", value: money(totalPayable) },
                          ].map((item) => (
                            <div key={item.label} className="rounded-[1.1rem] border border-[#efcfb2] bg-white/78 px-4 py-3 shadow-[0_10px_24px_rgba(156,78,11,0.06)]">
                              <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">{item.label}</div>
                              <div className="mt-2 text-lg font-black text-[#201812]">{item.value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 flex gap-2">
                          <Button type="button" className="rounded-full bg-[#d86c1e] px-5 text-white hover:bg-[#c85f16]">
                            Deposit
                          </Button>
                          <Button type="button" variant="outline" className="rounded-full border-[#efcfb2] bg-white/80 px-5 text-[#3a1d0d] hover:bg-white">
                            Withdraw
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-[1.75rem] border border-[#efcfb2] bg-[#2f190c] p-4 text-white shadow-[0_22px_44px_rgba(47,25,12,0.18)]">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.22em] text-[#ffb15a]">Offer curve</div>
                            <div className="mt-2 text-lg font-black text-white">Quoted momentum</div>
                          </div>
                          <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#ffd7ac]">Active</div>
                        </div>

                        <div className="mt-5 h-44 overflow-hidden rounded-[1.25rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.09)_0%,rgba(255,255,255,0.03)_100%)] p-3">
                          <svg viewBox="0 0 100 64" className="h-full w-full" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="offerAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffb15a" stopOpacity="0.34" />
                                <stop offset="100%" stopColor="#ffb15a" stopOpacity="0.02" />
                              </linearGradient>
                              <linearGradient id="offerLineGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ffcf92" />
                                <stop offset="100%" stopColor="#ff9e3d" />
                              </linearGradient>
                              <filter id="offerGlow">
                                <feGaussianBlur stdDeviation="1.8" result="blur" />
                                <feMerge>
                                  <feMergeNode in="blur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                            </defs>
                            <path d="M 10 12 L 90 12" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 5" />
                            <path d="M 10 25 L 90 25" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 5" />
                            <path d="M 10 38 L 90 38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 5" />
                            <path d="M 10 52 L 90 52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 5" />
                            <path d={`${heroSecondaryPath} L 90 56 L 10 56 Z`} fill="#ffffff" fillOpacity="0.04" />
                            <path d={heroSecondaryPath} fill="none" stroke="#f0c18f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" />
                            <path d={`${heroPrimaryPath} L 90 56 L 10 56 Z`} fill="url(#offerAreaGradient)" />
                            <path d={heroPrimaryPath} fill="none" stroke="url(#offerLineGradient)" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#offerGlow)" />
                            <circle cx="90" cy="12" r="0" fill="transparent" />
                            <circle cx="81.3" cy="21.7" r="2.6" fill="#fff5ea" stroke="#ffb15a" strokeWidth="2" />
                          </svg>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3 rounded-[1rem] bg-white/8 px-3 py-2">
                          <div className="flex items-center gap-2 text-sm font-semibold text-[#ffd7ac]">
                            <ArrowUpRight className="size-4" />
                            +10% optimized quote
                          </div>
                          <div className="text-[11px] uppercase tracking-[0.18em] text-white/55">Trend up</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="overflow-hidden border border-[#ead4bd] bg-[linear-gradient(135deg,#29160a_0%,#4a2812_52%,#7e4518_100%)] p-0 text-white">
                    <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1.25fr)_340px]">
                      <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffd2a5]">
                          Command center
                        </div>
                        <div className="mt-4 flex flex-wrap items-end gap-4">
                          <div>
                            <div className="text-sm font-semibold text-white/70">Visible balance</div>
                            <div className="mt-2 text-4xl font-black tracking-[-0.05em] text-white md:text-[3.2rem]">{money(amount)}</div>
                          </div>
                          <div className="rounded-full bg-[#ffb15a] px-4 py-2 text-sm font-bold text-[#3a1d0d] shadow-[0_16px_30px_rgba(255,177,90,0.25)]">
                            +10% this cycle
                          </div>
                        </div>
                        <p className="mt-4 max-w-xl text-sm leading-6 text-white/68">A bolder overview shell with quick money movement, milestone visibility, and a market-board style trend zone.</p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          {[
                            { label: "Sanction", value: money(profile.sanctionAmount) },
                            { label: "Repayment", value: money(monthlyRepayment) },
                            { label: "Points", value: String(points) },
                          ].map((item) => (
                            <div key={item.label} className="rounded-[1.2rem] border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-sm">
                              <div className="text-[10px] uppercase tracking-[0.22em] text-[#ffd2a5]">{item.label}</div>
                              <div className="mt-2 text-xl font-black text-white">{item.value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                          <Button type="button" className="rounded-full bg-[#ffb15a] px-5 text-[#3a1d0d] hover:bg-[#ffa23f]">
                            Deposit
                          </Button>
                          <Button type="button" variant="outline" className="rounded-full border-white/20 bg-transparent px-5 text-white hover:bg-white/10">
                            Withdraw
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)] p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[10px] uppercase tracking-[0.22em] text-[#ffd2a5]">Balance wave</div>
                            <div className="mt-2 text-lg font-black text-white">Intraday shape</div>
                          </div>
                          <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/75">Live</div>
                        </div>

                        <div className="mt-5 h-48 overflow-hidden rounded-[1.35rem] bg-[radial-gradient(circle_at_top,rgba(255,177,90,0.24),rgba(255,255,255,0.04)_58%,rgba(255,255,255,0.02)_100%)] p-3">
                          <svg viewBox="0 0 100 64" className="h-full w-full" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="cardGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#ffb15a" stopOpacity="0.38" />
                                <stop offset="100%" stopColor="#ffb15a" stopOpacity="0.04" />
                              </linearGradient>
                            </defs>
                            <path d="M 8 12 L 92 12" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 5" />
                            <path d="M 8 32 L 92 32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 5" />
                            <path d="M 8 52 L 92 52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 5" />
                            <path d={`${heroSecondaryPath} L 90 56 L 10 56 Z`} fill="#ffffff" fillOpacity="0.04" />
                            <path d={heroSecondaryPath} fill="none" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                            <path d={`${heroPrimaryPath} L 90 56 L 10 56 Z`} fill="url(#cardGradient)" />
                            <path d={heroPrimaryPath} fill="none" stroke="#ffb15a" strokeWidth="3.1" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-[1rem] bg-white/8 px-3 py-3">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-[#ffd2a5]">Current lane</div>
                            <div className="mt-2 text-sm font-semibold text-white">Stable rise</div>
                          </div>
                          <div className="rounded-[1rem] bg-white/8 px-3 py-3">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-[#ffd2a5]">Next action</div>
                            <div className="mt-2 text-sm font-semibold text-white">{funded ? "Track repayment" : "Complete release"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {activePage === "repayment-plan" ? (
                  <Card className="bg-[#ffffff]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Transactions</div>
                        <div className="mt-1 text-sm text-[#7b6d62]">Recent loan activity</div>
                      </div>
                      <button className="inline-flex h-10 items-center gap-2 rounded-full border border-[#f0d7bf] bg-white px-4 text-sm text-[#42362f]">
                        Month
                        <ChevronDown className="size-4" />
                      </button>
                    </div>

                    <div className="mt-4 space-y-2">
                      {activityItems.map((item) => (
                        <ActivityRow key={item.title} {...item} />
                      ))}
                    </div>
                  </Card>
                ) : null}
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,0.95fr)]">
                <Card className={isApplicationPage ? "bg-[linear-gradient(180deg,#fffdfb_0%,#fff4ea_100%)] p-5" : isOfferPage ? "bg-[linear-gradient(180deg,#fff8f0_0%,#fff0e2_100%)] p-5" : "overflow-hidden border border-[#ead7c1] bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ee_100%)] p-5"}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Financial board</div>
                      <div className="mt-1 text-sm text-[#7b6d62]">A cleaner tape of amount, fee, and repayment motion</div>
                    </div>
                    <button className={`inline-flex h-10 items-center gap-2 rounded-full border border-[#f0d7bf] px-4 text-sm text-[#8d4710] ${isApplicationPage || isOfferPage ? "bg-white/85" : "bg-white"}`}>
                      Month
                      <ChevronDown className="size-4" />
                    </button>
                  </div>

                  <div className={`mt-5 ${isApplicationPage || isOfferPage ? "grid gap-4 md:grid-cols-3" : "grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"}`}>
                    {isApplicationPage || isOfferPage ? (
                      <>
                        <StatCard label="Total amount" value={money(amount)} delta="17%" color="#ef8a2f" values={[16, 20, 19, 23, 21, 26, 28]} variant={isApplicationPage ? "feature" : "offer"} />
                        <StatCard label="Total fee" value={money(fee)} delta="44%" color="#ffb15a" values={[10, 12, 11, 15, 14, 16, 17]} variant={isApplicationPage ? "feature" : "offer"} />
                        <StatCard label="Total repay" value={money(totalPayable)} delta="45%" color="#d56a16" values={[14, 16, 15, 19, 20, 24, 22]} variant={isApplicationPage ? "feature" : "offer"} />
                      </>
                    ) : (
                      <>
                        <div className="rounded-[1.65rem] border border-[#edd9c5] bg-white/88 p-4 shadow-[0_18px_34px_rgba(156,78,11,0.07)]">
                          <div className="grid gap-3 md:grid-cols-3">
                            <StatCard label="Principal" value={money(amount)} delta="17%" color="#ef8a2f" values={[16, 20, 19, 23, 21, 26, 28]} />
                            <StatCard label="Service fee" value={money(fee)} delta="44%" color="#ffb15a" values={[10, 12, 11, 15, 14, 16, 17]} />
                            <StatCard label="Payoff" value={money(totalPayable)} delta="45%" color="#d56a16" values={[14, 16, 15, 19, 20, 24, 22]} />
                          </div>
                        </div>
                        <div className="rounded-[1.65rem] border border-[#edd9c5] bg-[#2f190c] p-4 text-white shadow-[0_22px_42px_rgba(47,25,12,0.18)]">
                          <div className="text-[10px] uppercase tracking-[0.22em] text-[#ffcf92]">Runway</div>
                          <div className="mt-2 text-2xl font-black text-white">{money(Math.max(0, amount - fee))}</div>
                          <div className="mt-2 text-sm leading-6 text-white/68">Estimated payout after fee with a faster decision view for client conversations.</div>
                          <div className="mt-4 space-y-2">
                            {[
                              { label: "Utilization", value: `${utilization}%` },
                              { label: "Tenure", value: `${tenure} days` },
                              { label: "Interest", value: money(interest) },
                            ].map((item) => (
                              <div key={item.label} className="flex items-center justify-between rounded-[1rem] bg-white/8 px-3 py-3 text-sm">
                                <span className="text-white/68">{item.label}</span>
                                <span className="font-semibold text-white">{item.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                <Card className="overflow-hidden border border-[#ead7c1] bg-[linear-gradient(180deg,#fff9f4_0%,#fff1e6_100%)] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Wallet shelf</div>
                      <div className="mt-1 text-sm text-[#7b6d62]">Readable card stack with account signatures</div>
                    </div>
                    <button className="text-sm font-semibold text-[#2f2620]">View all</button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      {
                        amount: money(profile.sanctionAmount),
                        number: `**** ${account.accountNumber.slice(-4)}`,
                        label: account.bank,
                        accent: "bg-[#fff0e1]",
                        brand: "VISA",
                      },
                      {
                        amount: money(repaymentAmount),
                        number: `**** ${String(repaymentAmount).slice(-4).padStart(4, "0")}`,
                        label: "Repayment card",
                        accent: "bg-[#fff3e4]",
                        brand: "Card",
                      },
                    ].map((cardItem) => (
                      <div key={cardItem.label} className={`rounded-[1.55rem] ${cardItem.accent} p-4 shadow-[0_14px_34px_rgba(0,0,0,0.04)]`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.24em] text-[#c86a18]">{cardItem.amount}</div>
                            <div className="mt-6 text-lg font-black text-[#352c25]">{cardItem.label}</div>
                            <div className="mt-1 text-sm text-[#5f5349]">Card number {cardItem.number}</div>
                          </div>
                          <div className="rounded-full border border-[#efcfb2] bg-white/70 px-3 py-1 text-sm font-black text-[#8d4710]">{cardItem.brand}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <Card className="overflow-hidden border border-[#ead7c1] bg-[linear-gradient(180deg,#fffdf9_0%,#fff4ea_100%)] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Navigate the flow</div>
                      <div className="mt-1 text-sm text-[#7b6d62]">Fast lane actions with a more directional layout</div>
                    </div>
                    <MoreHorizontal className="size-5 text-[#c86a18]" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: "Application", icon: FileText },
                      { label: "Offer", icon: SlidersHorizontal },
                      { label: "Disbursal", icon: HandCoins },
                      { label: "Repayment", icon: PiggyBank },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => goToPage(`/dashboard${item.label === "Application" ? "/application" : item.label === "Offer" ? "/offer-studio" : item.label === "Disbursal" ? "/disbursal" : "/repayment-plan"}`)}
                          className="group flex min-w-[92px] flex-col gap-4 rounded-[1.4rem] border border-[#f0d7bf] bg-white/88 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(156,78,11,0.08)]"
                        >
                          <div className="flex size-11 items-center justify-center rounded-[1rem] bg-[#d86c1e] text-white transition group-hover:scale-105">
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#241a13]">{item.label}</div>
                            <div className="mt-1 text-xs leading-5 text-[#7a6e63]">Open the {item.label.toLowerCase()} workspace directly.</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </Card>

                <Card className="overflow-hidden border border-[#ead7c1] bg-[linear-gradient(180deg,#fff7ef_0%,#fff1e7_100%)] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Upcoming markers</div>
                      <div className="mt-1 text-sm text-[#7b6d62]">Timeline-style milestones instead of plain tiles</div>
                    </div>
                    <MoreHorizontal className="size-5 text-[#c86a18]" />
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      { label: "Profile review", value: "Today", tone: "bg-[#fff1e2]" },
                      { label: "Bank release", value: funded ? "Done" : "Queued", tone: "bg-[#fff4ea]" },
                      { label: "Repayment QR", value: money(repaymentAmount), tone: "bg-[#fff7ef]" },
                      { label: "Document check", value: "Open", tone: "bg-[#fff2e8]" },
                    ].map((item, index) => (
                      <div key={item.label} className={`flex items-center gap-4 rounded-[1.25rem] ${item.tone} p-4`}>
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/80 text-sm font-black text-[#c86a18]">
                          0{index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">{item.label}</div>
                          <div className="mt-1 text-sm font-bold text-[#241a13]">{item.value}</div>
                        </div>
                        <ChevronRight className="size-4 shrink-0 text-[#b77a4c]" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {pageWorkspace}
            </div>
            )}
          </section>

          {!isApplicationPage && !isOverviewPage ? (
          <aside className="bg-[#fbfaf8] p-4 md:p-6">
            <div className="sticky top-4 space-y-4">
              <Card className="overflow-hidden border border-[#ead7c1] bg-[linear-gradient(180deg,#fffaf6_0%,#fff1e5_100%)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Journey pulse</div>
                    <div className="mt-1 text-sm text-[#7b6d62]">A richer side summary of the live borrower state</div>
                  </div>
                  <button className="rounded-full border border-[#f0d7bf] bg-white px-3 py-1 text-xs font-semibold text-[#8d4710]">
                    {canRedeem ? "Redeem" : "Locked"}
                  </button>
                </div>

                <div className="mt-5 rounded-[1.5rem] bg-[#2f190c] p-4 text-white shadow-[0_20px_40px_rgba(47,25,12,0.16)]">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#ffd2a5]">Borrower</div>
                  <div className="mt-3 text-xl font-black text-white">{profile.fullName}</div>
                  <div className="mt-1 text-sm text-white/70">{profile.email}</div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#ffb15a]" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-white/62">Progress</span>
                    <span className="font-semibold text-[#ffd2a5]">{progress}% complete</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-[1rem] bg-white/8 px-3 py-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#ffd2a5]">Redeemable</div>
                      <div className="mt-2 text-sm font-semibold text-white">{canRedeem ? "Yes" : "Not yet"}</div>
                    </div>
                    <div className="rounded-[1rem] bg-white/8 px-3 py-3">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#ffd2a5]">Focus</div>
                      <div className="mt-2 text-sm font-semibold text-white">{completedSteps.offer ? "Disbursal" : "Offer prep"}</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden border border-[#ead7c1] bg-[linear-gradient(180deg,#fffdfa_0%,#fff4e8_100%)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Money stack</div>
                    <div className="mt-1 text-sm text-[#7b6d62]">Snapshot blocks with a more dashboard-editorial feel</div>
                  </div>
                  <Wallet className="size-5 text-[#c86a18]" />
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-[1.3rem] bg-[#fff1e2] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Balance</div>
                    <div className="mt-2 text-3xl font-black text-[#201812]">{money(amount)}</div>
                    <div className="mt-1 text-sm text-[#6f6358]">Active visible amount</div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.2rem] bg-white p-4 shadow-[0_10px_24px_rgba(156,78,11,0.05)]">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Repayment</div>
                      <div className="mt-2 text-2xl font-black text-[#201812]">{money(monthlyRepayment)}</div>
                    </div>
                    <div className="rounded-[1.2rem] bg-white p-4 shadow-[0_10px_24px_rgba(156,78,11,0.05)]">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Points</div>
                      <div className="mt-2 text-2xl font-black text-[#201812]">{points}</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="overflow-hidden border border-[#ead7c1] bg-[linear-gradient(180deg,#fff7ef_0%,#fff0e2_100%)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Adaptive shell</div>
                    <div className="mt-1 text-sm text-[#7b6d62]">A more intentional mobile and tablet reading pattern</div>
                  </div>
                  <Send className="size-5 text-[#c86a18]" />
                </div>

                <div className="mt-4 rounded-[1.3rem] border border-dashed border-[#f0d7bf] bg-white/85 p-4">
                  <div className="text-sm font-semibold text-[#241a13]">This pass shifts the dashboard away from plain card repetition.</div>
                  <div className="mt-2 text-sm leading-6 text-[#6f6358]">Stronger grouping, clearer emphasis, and more distinct sections help the layout stay readable on narrower screens too.</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Responsive", "Layered cards", "Faster scanning"].map((item) => (
                      <div key={item} className="rounded-full bg-[#fff1e2] px-3 py-1 text-xs font-semibold text-[#9e520f]">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </aside>
          ) : null}
        </div>
      </div>

      {profilePreviewMode && (
        <div
          className="fixed inset-0 z-[230] flex items-center justify-center bg-[#2a1708]/70 p-4 backdrop-blur-xl"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setProfilePreviewMode(null)
            }
          }}
        >
          <div className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-orange-200/70 bg-[#fff8f1] shadow-[0_40px_160px_rgba(120,53,15,0.24)]">
            <div className="flex items-start justify-between gap-4 border-b border-orange-200/70 p-5">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.28em] text-orange-700">Profile photo</div>
                <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">Client identity</h3>
              </div>
              <button
                type="button"
                onClick={() => setProfilePreviewMode(null)}
                className="flex size-10 items-center justify-center rounded-full border border-orange-200 bg-white text-[#8a5a24] transition hover:text-slate-950"
                aria-label="Close profile preview"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="rounded-[1.8rem] bg-white p-5 text-center shadow-[0_16px_40px_rgba(249,115,22,0.08)]">
                <div className="flex justify-center">
                  {profilePhotoOrInitials}
                </div>
                <div className="mt-5 text-2xl font-black tracking-[-0.03em] text-slate-950">{profileName}</div>
                <div className="mt-1 text-sm text-[#6f4317]">{profileEmail}</div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Visible from the left profile button</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Client name", value: profileName },
                  { label: "Mobile", value: profileMobile },
                  { label: "Email", value: profileEmail },
                  { label: "Address", value: profileCity },
                  { label: "PAN", value: profile.panCard },
                  { label: "Aadhaar", value: profile.aadhaarCard },
                  { label: "Bank", value: account.bank },
                  { label: "Account", value: account.accountNumber },
                  { label: "Loan amount", value: money(amount) },
                  { label: "Sanction amount", value: money(profile.sanctionAmount) },
                  { label: "Repayment date", value: profile.repaymentDate },
                  { label: "Score", value: `${profile.score}/100` },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.4rem] border border-orange-100 bg-white px-4 py-3">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-orange-700">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-950">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
