import { Button } from "@/components/ui/button"
import { Card, Eyebrow, inputClassName } from "@/components/ui/dashboard-shared"

import type { CompletedSteps, DashboardAccount } from "./types"

export function DisbursalWorkspace({
  funded,
  disbursing,
  account,
  completedSteps,
  setAccount,
  handleDisbursal,
  onViewRepayment,
}: {
  funded: boolean
  disbursing: boolean
  account: DashboardAccount
  completedSteps: CompletedSteps
  setAccount: React.Dispatch<React.SetStateAction<DashboardAccount>>
  handleDisbursal: () => void
  onViewRepayment: () => void
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_320px]">
      <Card className="overflow-hidden bg-[linear-gradient(180deg,#fffaf6_0%,#fff0e1_100%)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Eyebrow>Disbursal</Eyebrow>
            <h3 className="mt-2 text-xl font-black text-[#201812]">Bank verification</h3>
            <p className="mt-2 text-sm leading-6 text-[#6f6358]">Confirm the payout account before the loan amount is released.</p>
          </div>
          <div className="rounded-full bg-[#d86c1e] px-3 py-1 text-xs font-semibold text-white">{funded ? "Released" : "Pending"}</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
            Account holder
            <input value={account.holder} onChange={(event) => setAccount((current) => ({ ...current, holder: event.target.value }))} className={`${inputClassName} bg-white`} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
            Bank name
            <input value={account.bank} onChange={(event) => setAccount((current) => ({ ...current, bank: event.target.value }))} className={`${inputClassName} bg-white`} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
            Account number
            <input value={account.accountNumber} onChange={(event) => setAccount((current) => ({ ...current, accountNumber: event.target.value }))} className={`${inputClassName} bg-white`} />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[#5f5247]">
            IFSC code
            <input value={account.ifsc} onChange={(event) => setAccount((current) => ({ ...current, ifsc: event.target.value }))} className={`${inputClassName} bg-white`} />
          </label>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Account owner", value: account.holder || "Pending" },
            { label: "Bank", value: account.bank || "Pending" },
            { label: "Status", value: funded ? "Released" : "Awaiting release" },
          ].map((item) => (
            <div key={item.label} className="rounded-[1rem] border border-[#f0d7bf] bg-white/85 px-4 py-3">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">{item.label}</div>
              <div className="mt-2 text-sm font-black text-[#201812]">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={handleDisbursal} disabled={disbursing || funded} className="rounded-full bg-[#d86c1e] px-5 text-white hover:bg-[#c85f16]">
            {disbursing ? "Processing..." : funded ? "Disbursed" : "Release funds"}
          </Button>
          <Button type="button" variant="outline" onClick={onViewRepayment} className="rounded-full border-[#f0d7bf] bg-white px-5">
            View repayment
          </Button>
        </div>
      </Card>

      <Card className="bg-[#2f190c] p-5 text-white">
        <Eyebrow>Readiness</Eyebrow>
        <h3 className="mt-2 text-xl font-black text-white">Checklist</h3>
        <div className="mt-4 space-y-2">
          {[
            { label: "Offer selected", done: completedSteps.offer },
            { label: "Bank verified", done: completedSteps.bank },
            { label: "Funds released", done: completedSteps.funded },
          ].map((item, index) => (
            <div key={item.label} className="flex items-center justify-between rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#ffe2c9] text-xs font-bold text-[#9e520f]">{index + 1}</div>
                <span className="text-sm text-white">{item.label}</span>
              </div>
              <span className={`text-xs font-semibold ${item.done ? "text-[#8ff0b8]" : "text-white/60"}`}>{item.done ? "Done" : "Pending"}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[1.15rem] bg-white/8 p-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Release flow</div>
          <div className="mt-2 text-sm font-semibold text-white">{funded ? "Funds have been marked as released." : "Verification is still required before release."}</div>
          <div className="mt-2 text-sm leading-6 text-white/68">This page is now focused only on bank setup and payout readiness.</div>
        </div>
      </Card>
    </div>
  )
}
