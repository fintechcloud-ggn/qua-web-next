export type PageId = "overview" | "application" | "offer-studio" | "disbursal" | "repayment-plan" | "profile"

export type DashboardProfile = {
  fullName: string
  mobile: string
  email: string
  city: string
  address?: string
  employer: string
  income: number
  score: number
  panCard: string
  aadhaarCard: string
  sanctionAmount: number
  repaymentDate: string
}

export type DashboardAccount = {
  holder: string
  bank: string
  accountNumber: string
  ifsc: string
}

export type ApplicationForm = {
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

export type ApplicationErrors = Partial<Record<keyof ApplicationForm, string>>

export type CompletedSteps = {
  application: boolean
  identity: boolean
  profile: boolean
  offer: boolean
  bank: boolean
  funded: boolean
}
