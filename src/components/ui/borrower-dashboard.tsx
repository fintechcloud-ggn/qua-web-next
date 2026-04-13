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
  PencilLine,
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

type PageId = "overview" | "application" | "offer-studio" | "disbursal" | "repayment-plan" | "profile"

type StoredProfile = {
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
  application?: ApplicationForm
  amount?: number
  tenure?: number
  profilePhoto?: string
}

type ApplicationForm = {
  fullName: string
  mobile: string
  email: string
  city: string
  employmentType: string
  employer: string
  monthlyIncome: string
  purpose: string
  loanAmount: number
  tenure: number
  panCard: string
  aadhaar: string
  bankAccount: string
  agreed: boolean
  status: "draft" | "submitted"
  submittedAt?: string
  applicationId?: string
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
  { id: "profile", label: "Profile", href: "/dashboard/profile", icon: PencilLine },
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
  const path = useMemo(() => buildPath(values), [values])

  return (
    <svg viewBox="0 0 100 44" className={className} aria-hidden="true">
      <path d={`${path} L 96 40 L 4 40 Z`} fill={stroke} fillOpacity="0.08" />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-[1.5rem] border border-[#f0d7bf] bg-white/96 shadow-[0_18px_55px_rgba(156,78,11,0.08)] backdrop-blur ${className}`}>
      {children}
    </div>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bf6a22]">{children}</div>
}

const inputClassName =
  "h-12 w-full rounded-[1rem] border border-[#f0cfb4] bg-[#fff8f2] px-4 text-[#201812] outline-none transition placeholder:text-[#b89883] focus:border-[#dd8b3d] focus:bg-white"

function StatCard({
  label,
  value,
  delta,
  color,
  values,
}: {
  label: string
  value: string
  delta: string
  color: string
  values: number[]
}) {
  return (
    <div className="rounded-[1.35rem] border border-[#f1d8bf] bg-white p-4 shadow-[0_10px_30px_rgba(156,78,11,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#bf6a22]">{label}</div>
          <div className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#201812]">{value}</div>
        </div>
        <Sparkline values={values} stroke={color} className="h-11 w-24 shrink-0 opacity-95" />
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
  const [showProfilePreview, setShowProfilePreview] = useState(false)
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
  const [profile] = useState(
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
  const repaymentAmount = Math.max(500, Math.round(monthlyRepayment))
  const utilization = Math.min(100, Math.round((amount / 180000) * 100))
  const activeIndex = navItems.findIndex((item) => item.id === activePage)
  const nextNavItem = navItems[activeIndex + 1] ?? navItems[activeIndex]
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

  const heroPrimaryPath = useMemo(() => buildPath(chartPrimary, 112, 64, 6), [chartPrimary])
  const heroSecondaryPath = useMemo(() => buildPath(chartSecondary, 112, 64, 6), [chartSecondary])
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

  const renderPageWorkspace = () => {
    if (activePage === "overview") {
      return (
        <Card className="p-0">
          <div className="flex items-start justify-between gap-4 border-b border-[#eee6da] px-5 py-4">
            <div>
              <Eyebrow>Journey</Eyebrow>
              <h3 className="mt-2 text-lg font-black text-[#201812]">Continue from here</h3>
            </div>
            <div className="rounded-full bg-[#d86c1e] px-3 py-1 text-xs font-semibold text-white">{progress}%</div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-[minmax(0,1.1fr)_320px]">
            <div className="rounded-[1.25rem] bg-[#fff4ea] p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Current stage</div>
              <div className="mt-2 text-2xl font-black text-[#201812]">{navItems[activeIndex]?.label}</div>
              <p className="mt-2 text-sm leading-6 text-[#6f6358]">{copy.description}</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={() => goToPage(completedSteps.application ? nextNavItem.href : "/dashboard/application")}
                  className="rounded-full bg-[#d86c1e] px-5 text-white hover:bg-[#c85f16]"
                >
                  {completedSteps.application ? "Continue" : "Start application"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowProfilePreview(true)}
                  className="rounded-full border-[#f0d7bf] bg-white px-5"
                >
                  Open profile
                </Button>
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-[#f0d7bf] bg-white p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Checklist</div>
              <div className="mt-3 space-y-2">
                {[
                  { label: "Application", done: completedSteps.application },
                  { label: "Identity", done: completedSteps.identity },
                  { label: "Profile", done: completedSteps.profile },
                  { label: "Offer", done: completedSteps.offer },
                  { label: "Bank", done: completedSteps.bank },
                  { label: "Funds", done: completedSteps.funded },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-[1rem] border border-[#efe6dc] px-4 py-3">
                    <span className="text-sm text-[#584b40]">{item.label}</span>
                    <span className={`text-xs font-semibold ${item.done ? "text-emerald-700" : "text-slate-500"}`}>{item.done ? "Done" : "Pending"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )
    }

    if (activePage === "application") {
      return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_330px]">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Eyebrow>Application</Eyebrow>
                <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#201812]">Client loan application</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f6358]">
                  Fill this once, save it, and continue the journey into offer, disbursal, and repayment.
                </p>
              </div>
              <div className="rounded-full bg-[#d86c1e] px-3 py-1 text-xs font-semibold text-white">
                {applicationSubmitted ? "Submitted" : "Draft"}
              </div>
            </div>

            {applicationSubmitted && (
              <div className="mt-5 rounded-[1.25rem] border border-[#f0d7bf] bg-[#fff4ea] p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Application status</div>
                <div className="mt-2 text-lg font-black text-[#201812]">
                  Submitted {application.applicationId ? `• ${application.applicationId}` : ""}
                </div>
                <p className="mt-2 text-sm leading-6 text-[#6f6358]">
                  The application is ready for offer processing. You can still edit it below if anything changes.
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-6">
              <section className="grid gap-4 rounded-[1.35rem] border border-[#f0d7bf] bg-[#fffaf6] p-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c86a18]">Personal</div>
                </div>
                <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                  Full name
                  <input value={application.fullName} onChange={(event) => updateApplication("fullName", event.target.value)} className={inputClassName} />
                  {applicationErrors.fullName && <span className="text-xs text-red-600">{applicationErrors.fullName}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                  Mobile
                  <input value={application.mobile} onChange={(event) => updateApplication("mobile", event.target.value)} className={inputClassName} />
                  {applicationErrors.mobile && <span className="text-xs text-red-600">{applicationErrors.mobile}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                  Email
                  <input value={application.email} onChange={(event) => updateApplication("email", event.target.value)} className={inputClassName} />
                  {applicationErrors.email && <span className="text-xs text-red-600">{applicationErrors.email}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                  City
                  <input value={application.city} onChange={(event) => updateApplication("city", event.target.value)} className={inputClassName} />
                  {applicationErrors.city && <span className="text-xs text-red-600">{applicationErrors.city}</span>}
                </label>
              </section>

              <section className="grid gap-4 rounded-[1.35rem] border border-[#f0d7bf] bg-[#fffaf6] p-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c86a18]">Loan request</div>
                </div>
                <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                  Purpose
                  <select value={application.purpose} onChange={(event) => updateApplication("purpose", event.target.value)} className={inputClassName}>
                    <option value="">Select purpose</option>
                    {purposeOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {applicationErrors.purpose && <span className="text-xs text-red-600">{applicationErrors.purpose}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                  Employment type
                  <select value={application.employmentType} onChange={(event) => updateApplication("employmentType", event.target.value)} className={inputClassName}>
                    <option value="">Select type</option>
                    {employmentOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  {applicationErrors.employmentType && <span className="text-xs text-red-600">{applicationErrors.employmentType}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                  Employer / business
                  <input value={application.employer} onChange={(event) => updateApplication("employer", event.target.value)} className={inputClassName} />
                  {applicationErrors.employer && <span className="text-xs text-red-600">{applicationErrors.employer}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                  Monthly income
                  <input value={application.monthlyIncome} onChange={(event) => updateApplication("monthlyIncome", event.target.value)} className={inputClassName} inputMode="numeric" />
                  {applicationErrors.monthlyIncome && <span className="text-xs text-red-600">{applicationErrors.monthlyIncome}</span>}
                </label>
                <div className="md:col-span-2 rounded-[1.25rem] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.24em] text-[#c86a18]">Loan amount</div>
                      <div className="mt-1 text-2xl font-black text-[#201812]">{money(applicationAmount)}</div>
                    </div>
                    <div className="text-sm font-semibold text-[#8d4710]">{applicationTenure} days</div>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={180000}
                    step={5000}
                    value={applicationAmount}
                    onChange={(event) => updateApplication("loanAmount", Number(event.target.value))}
                    className="mt-4 w-full"
                  />
                  {applicationErrors.loanAmount && <span className="mt-2 block text-xs text-red-600">{applicationErrors.loanAmount}</span>}

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.24em] text-[#c86a18]">Tenure</div>
                      <div className="mt-1 text-2xl font-black text-[#201812]">{applicationTenure} days</div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={30}
                    max={180}
                    step={6}
                    value={applicationTenure}
                    onChange={(event) => updateApplication("tenure", Number(event.target.value))}
                    className="mt-4 w-full"
                  />
                  {applicationErrors.tenure && <span className="mt-2 block text-xs text-red-600">{applicationErrors.tenure}</span>}
                </div>
              </section>

              <section className="grid gap-4 rounded-[1.35rem] border border-[#f0d7bf] bg-[#fffaf6] p-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c86a18]">KYC</div>
                </div>
                <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                  PAN
                  <input value={application.panCard} onChange={(event) => updateApplication("panCard", event.target.value.toUpperCase())} className={inputClassName} />
                  {applicationErrors.panCard && <span className="text-xs text-red-600">{applicationErrors.panCard}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                  Aadhaar
                  <input value={application.aadhaar} onChange={(event) => updateApplication("aadhaar", event.target.value)} className={inputClassName} />
                  {applicationErrors.aadhaar && <span className="text-xs text-red-600">{applicationErrors.aadhaar}</span>}
                </label>
                <label className="grid gap-2 text-sm font-medium text-[#5f5247] md:col-span-2">
                  Bank account
                  <input value={application.bankAccount} onChange={(event) => updateApplication("bankAccount", event.target.value)} className={inputClassName} />
                  {applicationErrors.bankAccount && <span className="text-xs text-red-600">{applicationErrors.bankAccount}</span>}
                </label>
              </section>

              <label className="flex items-start gap-3 rounded-[1.35rem] border border-[#f0d7bf] bg-[#fff4ea] p-4 text-sm text-[#5f5247]">
                <input
                  type="checkbox"
                  checked={application.agreed}
                  onChange={(event) => updateApplication("agreed", event.target.checked)}
                  className="mt-1 size-4 rounded border-[#d9b38a]"
                />
                <span>
                  I confirm that the details above are accurate and I agree to the loan checks and repayment terms.
                  {applicationErrors.agreed && <span className="mt-2 block text-xs text-red-600">{applicationErrors.agreed}</span>}
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" onClick={submitApplication} className="rounded-full bg-[#d86c1e] px-5 text-white hover:bg-[#c85f16]">
                {applicationSubmitted ? "Update application" : "Submit application"}
              </Button>
              <Button type="button" variant="outline" onClick={() => goToPage("/dashboard")} className="rounded-full border-[#f0d7bf] bg-white px-5">
                Back
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Eyebrow>Application status</Eyebrow>
                <h4 className="mt-2 text-xl font-black text-[#201812]">Live snapshot</h4>
              </div>
              <div className="rounded-full bg-[#d86c1e] px-3 py-1 text-xs font-semibold text-white">
                {applicationSubmitted ? "Ready" : "Draft"}
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[1.6rem] bg-[#fff4ea] p-5 shadow-[0_12px_35px_rgba(156,78,11,0.06)]">
              <div className="flex items-center gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[#ffe2c9] text-3xl font-black text-[#9e520f]">
                  {initials(application.fullName || profile.fullName)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-2xl font-black tracking-[-0.03em] text-[#201812]">{application.fullName || profile.fullName}</div>
                  <div className="truncate text-sm text-[#6f6358]">{application.email || profile.email}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.22em] text-[#c86a18]">
                    {applicationSubmitted ? "Submitted application" : "Draft application"}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.15rem] bg-white p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Requested amount</div>
                  <div className="mt-2 text-xl font-black text-[#201812]">{money(applicationAmount)}</div>
                </div>
                <div className="rounded-[1.15rem] bg-white p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Requested tenure</div>
                  <div className="mt-2 text-xl font-black text-[#201812]">{applicationTenure} days</div>
                </div>
                <div className="rounded-[1.15rem] bg-white p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Purpose</div>
                  <div className="mt-2 text-sm font-semibold text-[#201812]">{application.purpose || "Not selected"}</div>
                </div>
                <div className="rounded-[1.15rem] bg-white p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Next step</div>
                  <div className="mt-2 text-sm font-semibold text-[#201812]">Offer review</div>
                </div>
              </div>

              <div className="mt-5 rounded-[1.15rem] border border-dashed border-[#f0d7bf] bg-white p-4">
                <div className="text-sm font-semibold text-[#241a13]">Your application will drive the rest of the loan journey.</div>
                <div className="mt-2 text-sm leading-6 text-[#6f6358]">
                  Once submitted, the offer and disbursal steps can be continued from the dashboard menu.
                </div>
              </div>
            </div>
          </Card>
        </div>
      )
    }

    if (activePage === "offer-studio") {
      return (
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Eyebrow>Offer</Eyebrow>
              <h3 className="mt-2 text-xl font-black text-[#201812]">Amount and tenure</h3>
            </div>
            <div className="rounded-full bg-[#d86c1e] px-3 py-1 text-xs font-semibold text-white">{utilization}% utilization</div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.2rem] bg-[#fff4ea] p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Amount</div>
              <div className="mt-2 text-3xl font-black text-[#201812]">{money(amount)}</div>
              <input type="range" min={10000} max={180000} step={5000} value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-5 w-full" />
            </div>

            <div className="rounded-[1.2rem] bg-[#fff4ea] p-4">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Tenure</div>
              <div className="mt-2 text-3xl font-black text-[#201812]">{tenure} days</div>
              <input type="range" min={30} max={150} step={6} value={tenure} onChange={(event) => setTenure(Number(event.target.value))} className="mt-5 w-full" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-[1rem] border border-[#f0d7bf] px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Interest</div>
              <div className="mt-2 text-xl font-bold text-[#201812]">{money(interest)}</div>
            </div>
            <div className="rounded-[1rem] border border-[#f0d7bf] px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Fee</div>
              <div className="mt-2 text-xl font-bold text-[#201812]">{money(fee)}</div>
            </div>
            <div className="rounded-[1rem] border border-[#f0d7bf] px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Total</div>
              <div className="mt-2 text-xl font-bold text-[#201812]">{money(totalPayable)}</div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={() => goToPage("/dashboard/disbursal")} className="rounded-full bg-[#d86c1e] px-5 text-white hover:bg-[#c85f16]">
              Continue to disbursal
            </Button>
            <Button type="button" variant="outline" onClick={() => goToPage("/dashboard")} className="rounded-full border-[#f0d7bf] bg-white px-5">
              Back
            </Button>
          </div>
        </Card>
      )
    }

    if (activePage === "disbursal") {
      return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_320px]">
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <Eyebrow>Disbursal</Eyebrow>
                <h3 className="mt-2 text-xl font-black text-[#201812]">Bank verification</h3>
              </div>
              <div className="rounded-full bg-[#d86c1e] px-3 py-1 text-xs font-semibold text-white">{funded ? "Released" : "Pending"}</div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                Account holder
                <input value={account.holder} onChange={(event) => setAccount((current) => ({ ...current, holder: event.target.value }))} className={inputClassName} />
              </label>
              <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                Bank name
                <input value={account.bank} onChange={(event) => setAccount((current) => ({ ...current, bank: event.target.value }))} className={inputClassName} />
              </label>
              <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                Account number
                <input value={account.accountNumber} onChange={(event) => setAccount((current) => ({ ...current, accountNumber: event.target.value }))} className={inputClassName} />
              </label>
              <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
                IFSC code
                <input value={account.ifsc} onChange={(event) => setAccount((current) => ({ ...current, ifsc: event.target.value }))} className={inputClassName} />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" onClick={handleDisbursal} disabled={disbursing || funded} className="rounded-full bg-[#d86c1e] px-5 text-white hover:bg-[#c85f16]">
                {disbursing ? "Processing..." : funded ? "Disbursed" : "Release funds"}
              </Button>
              <Button type="button" variant="outline" onClick={() => goToPage("/dashboard/repayment-plan")} className="rounded-full border-[#f0d7bf] bg-white px-5">
                View repayment
              </Button>
            </div>
          </Card>

          <Card>
            <Eyebrow>Readiness</Eyebrow>
            <h3 className="mt-2 text-xl font-black text-[#201812]">Checklist</h3>
            <div className="mt-4 space-y-2">
              {[
                { label: "Offer selected", done: completedSteps.offer },
                { label: "Bank verified", done: completedSteps.bank },
                { label: "Funds released", done: completedSteps.funded },
              ].map((item, index) => (
                <div key={item.label} className="flex items-center justify-between rounded-[1rem] border border-[#efe6dc] px-4 py-3">
                  <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#ffe2c9] text-xs font-bold text-[#9e520f]">{index + 1}</div>
                    <span className="text-sm text-[#584b40]">{item.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${item.done ? "text-emerald-700" : "text-slate-500"}`}>{item.done ? "Done" : "Pending"}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )
    }

    if (activePage === "repayment-plan") {
      return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_320px]">
          <Card>
            <Eyebrow>Repayment</Eyebrow>
            <h3 className="mt-2 text-xl font-black text-[#201812]">Pay amount and QR</h3>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1rem] bg-[#fff4ea] p-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Monthly outflow</div>
                <div className="mt-2 text-xl font-bold text-[#201812]">{money(monthlyRepayment)}</div>
              </div>
              <div className="rounded-[1rem] bg-[#fff4ea] p-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">UPI</div>
                <div className="mt-2 text-xl font-bold text-[#201812]">qualoan@upi</div>
              </div>
              <div className="rounded-[1rem] bg-[#fff4ea] p-4">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Status</div>
                <div className="mt-2 text-xl font-bold text-[#201812]">{funded ? "Live" : "Waiting"}</div>
              </div>
            </div>

            <div className="mt-6 flex justify-center rounded-[1.25rem] border border-[#f0d7bf] bg-[#fff6ef] p-4">
              <Image
                src={`/api/payment-qr?data=${encodeURIComponent(upiPaymentUrl)}`}
                alt="QR code for loan repayment"
                width={220}
                height={220}
                unoptimized
                className="rounded-[1rem] border border-[#f0d7bf] bg-white p-2"
              />
            </div>

            <p className="mt-4 text-sm leading-6 text-[#6f6358]">Scan from any UPI app to pay the current repayment amount directly.</p>
          </Card>

          <Card>
            <Eyebrow>Repayment details</Eyebrow>
            <h3 className="mt-2 text-xl font-black text-[#201812]">Pay now</h3>
            <div className="mt-4 space-y-2">
              <div className="rounded-[1rem] border border-[#f0d7bf] px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Amount</div>
                <div className="mt-2 text-xl font-bold text-[#201812]">{money(repaymentAmount)}</div>
              </div>
              <div className="rounded-[1rem] border border-[#f0d7bf] px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Reference</div>
                <div className="mt-2 text-xl font-bold text-[#201812]">{profile.fullName}</div>
              </div>
            </div>
          </Card>
        </div>
      )
    }

    if (activePage === "profile") {
      return (
        <Card className="p-6">
          <div className="flex flex-col items-start gap-5 rounded-[1.75rem] border border-dashed border-[#f0d7bf] bg-[#fff4ea] p-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>Profile</Eyebrow>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#201812]">Profile details now live in the login popup</h3>
              <p className="mt-3 text-sm leading-6 text-[#6f6358]">
                The detailed client identity card has been removed from the dashboard to keep this workspace focused. Click the round avatar in the auth popup to view the full profile.
              </p>
            </div>

            <div className="flex size-28 items-center justify-center rounded-full bg-[#ffe2c9] text-4xl font-black text-[#9e520f] ring-8 ring-white shadow-[0_18px_40px_rgba(156,78,11,0.14)]">
              {initials(profile.fullName)}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Dashboard profile", value: "Removed from this page" },
              { label: "Profile photo", value: "Shown in popup" },
              { label: "Client details", value: "Tap avatar to open" },
              { label: "Photo upload", value: "Available in popup" },
              { label: "Loan details", value: "Continue in other tabs" },
              { label: "Navigation", value: "Still available on the left" },
            ].map((item) => (
              <div key={item.label} className="rounded-[1rem] border border-[#f0d7bf] bg-white px-4 py-3">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">{item.label}</div>
                <div className="mt-2 text-sm font-semibold text-[#201812]">{item.value}</div>
              </div>
            ))}
          </div>
        </Card>
      )
    }

    return null
  }

  const profileName = application.fullName || profile.fullName
  const profileEmail = application.email || profile.email
  const profileCity = application.city || profile.city || "-"
  const profileMobile = application.mobile || profile.mobile
  const profilePhotoOrInitials = profilePhoto ? (
    <Image src={profilePhoto} alt={profileName} width={192} height={192} className="size-44 rounded-full object-cover ring-4 ring-white shadow-[0_18px_40px_rgba(156,78,11,0.14)]" />
  ) : (
    <div className="flex size-44 items-center justify-center rounded-full bg-[#ffe2c9] text-6xl font-black text-[#9e520f] ring-4 ring-white shadow-[0_18px_40px_rgba(156,78,11,0.14)]">
      {initials(profileName)}
    </div>
  )

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,247,240,0.98),_rgba(255,236,221,0.94)_42%,_#f6ddc6_100%)] p-3 text-[#201812] md:p-5">
      <div className="mx-auto max-w-[1640px] overflow-hidden rounded-[2rem] border border-white/70 bg-[#fff9f4] shadow-[0_30px_100px_rgba(156,78,11,0.12)]">
        <div className="grid min-h-[calc(100vh-1.5rem)] xl:grid-cols-[250px_minmax(0,1fr)_330px]">
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
                <div className="flex items-center gap-4">
                  {profilePhoto ? (
                    <Image src={profilePhoto} alt={profile.fullName} width={96} height={96} className="size-24 shrink-0 rounded-full object-cover ring-4 ring-[#ffe8d3]" />
                  ) : (
                    <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-[#ffe0c5] text-3xl font-black text-[#9e520f] ring-4 ring-[#ffe8d3]">
                      {initials(profile.fullName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-xl font-black tracking-[-0.03em] text-[#201812]">{profile.fullName}</div>
                    <div className="truncate text-sm text-[#8a7a6d]">{profile.email}</div>
                  </div>
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
                  if (item.id === "profile") {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setShowProfilePreview(true)}
                        className={`flex w-full items-center justify-between rounded-[1rem] border px-4 py-3 text-sm transition ${
                          isActive ? "border-[#d86c1e] bg-[#d86c1e] text-white shadow-[0_12px_30px_rgba(216,108,30,0.22)]" : "border-[#f0d7bf] bg-white text-[#201812] hover:bg-[#fff4e9]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="size-4" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="size-4 opacity-55" />
                      </button>
                    )
                  }
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
                <Button type="button" onClick={() => setShowProfilePreview(true)} className="w-full rounded-full bg-[#d86c1e] text-white hover:bg-[#c85f16]">
                  Profile
                </Button>
                <Button type="button" variant="outline" onClick={handleLogout} className="w-full rounded-full border-[#f0d7bf] bg-white">
                  Sign out
                </Button>
              </div>
            </div>
          </aside>

          <section className="min-w-0 border-b border-[#f0d7bf] bg-[#fffaf6] p-4 md:p-6 xl:border-b-0 xl:border-r">
            <div className="space-y-4">
              <Card className="p-4 md:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c86a18]">Hello {profile.fullName.split(" ")[0] || user.name.split(" ")[0] || "there"} 👋</div>
                    <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#1f1913] md:text-4xl">{copy.title}</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f6358]">{copy.description}</p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <button className="inline-flex h-11 items-center justify-between gap-3 rounded-full border border-[#f0d7bf] bg-white px-4 text-sm text-[#45382f] shadow-[0_8px_20px_rgba(156,78,11,0.04)]">
                      <span className="truncate">Choose account</span>
                      <ChevronDown className="size-4 shrink-0 opacity-65" />
                    </button>

                    <div className="flex items-center gap-2">
                      {topActions.map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          type="button"
                          aria-label={label}
                          className="flex size-11 items-center justify-center rounded-full border border-[#f0d7bf] bg-white text-[#9e520f] shadow-[0_8px_20px_rgba(156,78,11,0.04)] transition hover:-translate-y-0.5"
                        >
                          <Icon className="size-4" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(0,0.9fr)]">
                <Card className="overflow-hidden bg-[#3a1d0d] text-white">
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white/88">My Card</div>
                      <div className="mt-5 text-4xl font-black tracking-[-0.05em] text-white md:text-[2.8rem]">{money(amount)}</div>
                      <div className="mt-3 text-sm text-white/60">Loan limit and progress stay visible in one place.</div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="button" className="rounded-full bg-[#ffb15a] px-5 text-[#3a1d0d] hover:bg-[#ffa23f]">
                        Deposit
                      </Button>
                      <Button type="button" variant="outline" className="rounded-full border-white/20 bg-transparent px-5 text-white hover:bg-white/10">
                        Withdraw
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 px-5 pb-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#ffb15a]">
                      <ArrowUpRight className="size-4" />
                      +10%
                    </div>
                    <div className="h-16 w-28">
                      <svg viewBox="0 0 112 64" className="h-full w-full">
                        <path d={`${heroSecondaryPath} L 106 58 L 6 58 Z`} fill="#ffffff" fillOpacity="0.04" />
                        <path d={heroSecondaryPath} fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d={`${heroPrimaryPath} L 106 58 L 6 58 Z`} fill="url(#cardGradient)" fillOpacity="0.16" />
                        <path d={heroPrimaryPath} fill="none" stroke="#ffb15a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <defs>
                          <linearGradient id="cardGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#ffb15a" />
                            <stop offset="100%" stopColor="#ffb15a" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </Card>

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
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,0.95fr)]">
                <Card className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Financial record</div>
                      <div className="mt-1 text-sm text-[#7b6d62]">Amount, fees, and payoff visibility</div>
                    </div>
                    <button className="inline-flex h-10 items-center gap-2 rounded-full border border-[#f0d7bf] bg-white px-4 text-sm text-[#8d4710]">
                      Month
                      <ChevronDown className="size-4" />
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <StatCard label="Total amount" value={money(amount)} delta="17%" color="#ef8a2f" values={[16, 20, 19, 23, 21, 26, 28]} />
                    <StatCard label="Total fee" value={money(fee)} delta="44%" color="#ffb15a" values={[10, 12, 11, 15, 14, 16, 17]} />
                    <StatCard label="Total repay" value={money(totalPayable)} delta="45%" color="#d56a16" values={[14, 16, 15, 19, 20, 24, 22]} />
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Available card</div>
                      <div className="mt-1 text-sm text-[#7b6d62]">Your active account details</div>
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
                      <div key={cardItem.label} className={`rounded-[1.35rem] ${cardItem.accent} p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)]`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.24em] text-[#c86a18]">{cardItem.amount}</div>
                            <div className="mt-5 text-sm font-semibold text-[#352c25]">{cardItem.label}</div>
                            <div className="mt-1 text-sm text-[#5f5349]">Card number {cardItem.number}</div>
                          </div>
                          <div className="text-sm font-black text-[#8d4710]">{cardItem.brand}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <Card className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Send money to</div>
                      <div className="mt-1 text-sm text-[#7b6d62]">Shortcut actions for the loan flow</div>
                    </div>
                    <MoreHorizontal className="size-5 text-[#c86a18]" />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
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
                          className="flex min-w-[92px] flex-1 flex-col items-center gap-2 rounded-[1.25rem] border border-[#f0d7bf] bg-white px-3 py-4 text-center transition hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(156,78,11,0.06)]"
                        >
                          <div className="flex size-11 items-center justify-center rounded-full bg-[#d86c1e] text-white">
                            <Icon className="size-4" />
                          </div>
                          <div className="text-sm font-semibold text-[#241a13]">{item.label}</div>
                        </button>
                      )
                    })}
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Scheduled payments</div>
                      <div className="mt-1 text-sm text-[#7b6d62]">The next visible milestones</div>
                    </div>
                    <MoreHorizontal className="size-5 text-[#c86a18]" />
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    {[
                      { label: "Profile review", value: "Today", tone: "bg-[#fff1e2]" },
                      { label: "Bank release", value: funded ? "Done" : "Queued", tone: "bg-[#fff4ea]" },
                      { label: "Repayment QR", value: money(repaymentAmount), tone: "bg-[#fff7ef]" },
                      { label: "Document check", value: "Open", tone: "bg-[#fff2e8]" },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-[1.15rem] ${item.tone} p-4`}>
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">{item.label}</div>
                        <div className="mt-2 text-sm font-bold text-[#241a13]">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {renderPageWorkspace()}
            </div>
          </section>

          <aside className="bg-[#fbfaf8] p-4 md:p-6">
            <div className="sticky top-4 space-y-4">
              <Card className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Quick status</div>
                    <div className="mt-1 text-sm text-[#7b6d62]">Minimal view of the current journey</div>
                  </div>
                  <button className="rounded-full border border-[#f0d7bf] bg-white px-3 py-1 text-xs font-semibold text-[#8d4710]">
                    {canRedeem ? "Redeem" : "Locked"}
                  </button>
                </div>

                <div className="mt-5 rounded-[1.3rem] bg-[#fff4ea] p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Borrower</div>
                  <div className="mt-2 text-lg font-black text-[#201812]">{profile.fullName}</div>
                  <div className="mt-1 text-sm text-[#6f6358]">{profile.email}</div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-[#6f6358]">Redeemable</span>
                    <span className={`font-semibold ${canRedeem ? "text-[#d86c1e]" : "text-[#8b5b2f]"}`}>{canRedeem ? "Yes" : "Not yet"}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Recent totals</div>
                    <div className="mt-1 text-sm text-[#7b6d62]">A compact financial snapshot</div>
                  </div>
                  <Wallet className="size-5 text-[#c86a18]" />
                </div>

                <div className="mt-5 space-y-3">
                  <div className="rounded-[1.15rem] bg-[#fff1e2] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Balance</div>
                    <div className="mt-2 text-2xl font-black text-[#201812]">{money(amount)}</div>
                  </div>
                  <div className="rounded-[1.15rem] bg-[#fff1e2] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Repayment</div>
                    <div className="mt-2 text-2xl font-black text-[#201812]">{money(monthlyRepayment)}</div>
                  </div>
                  <div className="rounded-[1.15rem] bg-[#fff1e2] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#c86a18]">Points</div>
                    <div className="mt-2 text-2xl font-black text-[#201812]">{points}</div>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-2xl font-black tracking-[-0.04em] text-[#201812]">Mobile ready</div>
                    <div className="mt-1 text-sm text-[#7b6d62]">Work well on smaller screens too</div>
                  </div>
                  <Send className="size-5 text-[#c86a18]" />
                </div>

                <div className="mt-4 rounded-[1.3rem] border border-dashed border-[#f0d7bf] bg-white p-4">
                  <div className="text-sm font-semibold text-[#241a13]">Clear spacing, one stable shell, and a responsive layout.</div>
                  <div className="mt-2 text-sm leading-6 text-[#6f6358]">
                    The goal is to keep the banking-style dashboard readable on desktop and still usable when the screen gets narrow.
                  </div>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {showProfilePreview && (
        <div
          className="fixed inset-0 z-[230] flex items-center justify-center bg-[#2a1708]/70 p-4 backdrop-blur-xl"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowProfilePreview(false)
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
                onClick={() => setShowProfilePreview(false)}
                className="flex size-10 items-center justify-center rounded-full border border-orange-200 bg-white text-[#8a5a24] transition hover:text-slate-950"
                aria-label="Close profile preview"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid gap-5 p-5 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="rounded-[1.8rem] bg-white p-5 text-center shadow-[0_16px_40px_rgba(249,115,22,0.08)]">
                {profilePhotoOrInitials}
                <div className="mt-5 text-2xl font-black tracking-[-0.03em] text-slate-950">{profileName}</div>
                <div className="mt-1 text-sm text-[#6f4317]">{profileEmail}</div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Visible from the left profile button</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Client name", value: profileName },
                  { label: "Mobile", value: profileMobile },
                  { label: "Email", value: profileEmail },
                  { label: "City", value: profileCity },
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
