import { Button } from "@/components/ui/button"
import { Card, Eyebrow, inputClassName } from "@/components/ui/dashboard-shared"

import type { ApplicationErrors, ApplicationForm } from "./types"

export function ApplicationWorkspace({
  application,
  applicationErrors,
  applicationSubmitted,
  applicationAmount,
  applicationTenure,
  purposeOptions,
  employmentOptions,
  money,
  updateApplication,
  submitApplication,
  onBack,
}: {
  application: ApplicationForm
  applicationErrors: ApplicationErrors
  applicationSubmitted: boolean
  applicationAmount: number
  applicationTenure: number
  purposeOptions: string[]
  employmentOptions: string[]
  money: (value: number) => string
  updateApplication: <K extends keyof ApplicationForm>(key: K, value: ApplicationForm[K]) => void
  submitApplication: () => void
  onBack: () => void
}) {
  return (
    <div>
      <Card className="overflow-hidden bg-[linear-gradient(180deg,#fffaf6_0%,#fff1e4_100%)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Eyebrow>Application</Eyebrow>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#201812]">Client loan application</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f6358]">
              Fill this once, save it, and continue the journey into offer, disbursal, and repayment.
            </p>
          </div>
          <div className="rounded-full bg-[#d86c1e] px-3 py-1 text-xs font-semibold text-white">{applicationSubmitted ? "Submitted" : "Draft"}</div>
        </div>

        {applicationSubmitted && (
          <div className="mt-5 rounded-[1.25rem] border border-[#f0d7bf] bg-white/85 p-4">
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
          <section className="grid gap-4 rounded-[1.35rem] border border-[#f0d7bf] bg-white/85 p-4 md:grid-cols-2">
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

          <section className="grid gap-4 rounded-[1.35rem] border border-[#f0d7bf] bg-[#2f190c] p-4 text-white md:grid-cols-2">
            <div className="md:col-span-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#c86a18]">Loan request</div>
            </div>
            <label className="grid gap-2 text-sm font-medium text-white/80">
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
            <label className="grid gap-2 text-sm font-medium text-white/80">
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
            <label className="grid gap-2 text-sm font-medium text-white/80">
              Employer / business
              <input value={application.employer} onChange={(event) => updateApplication("employer", event.target.value)} className={inputClassName} />
              {applicationErrors.employer && <span className="text-xs text-red-600">{applicationErrors.employer}</span>}
            </label>
            <label className="grid gap-2 text-sm font-medium text-white/80">
              Monthly income
              <input value={application.monthlyIncome} onChange={(event) => updateApplication("monthlyIncome", event.target.value)} className={inputClassName} inputMode="numeric" />
              {applicationErrors.monthlyIncome && <span className="text-xs text-red-600">{applicationErrors.monthlyIncome}</span>}
            </label>
            <div className="md:col-span-2 rounded-[1.25rem] bg-white/8 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#c86a18]">Loan amount</div>
                  <div className="mt-1 text-2xl font-black text-white">{money(applicationAmount)}</div>
                </div>
                <div className="text-sm font-semibold text-[#ffd1a4]">{applicationTenure} days</div>
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
                  <div className="mt-1 text-2xl font-black text-white">{applicationTenure} days</div>
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

          <section className="grid gap-4 rounded-[1.35rem] border border-[#f0d7bf] bg-white/85 p-4 md:grid-cols-2">
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

          <label className="flex items-start gap-3 rounded-[1.35rem] border border-[#f0d7bf] bg-white/85 p-4 text-sm text-[#5f5247]">
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
          <Button type="button" variant="outline" onClick={onBack} className="rounded-full border-[#f0d7bf] bg-white px-5">
            Back
          </Button>
        </div>
      </Card>
    </div>
  )
}
