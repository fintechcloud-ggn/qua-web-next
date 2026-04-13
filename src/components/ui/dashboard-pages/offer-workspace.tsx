import { Button } from "@/components/ui/button"
import { Card, Eyebrow } from "@/components/ui/dashboard-shared"

export function OfferWorkspace({
  utilization,
  amount,
  tenure,
  interest,
  fee,
  totalPayable,
  money,
  setAmount,
  setTenure,
  onContinue,
  onBack,
}: {
  utilization: number
  amount: number
  tenure: number
  interest: number
  fee: number
  totalPayable: number
  money: (value: number) => string
  setAmount: (value: number) => void
  setTenure: (value: number) => void
  onContinue: () => void
  onBack: () => void
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_340px]">
      <Card className="overflow-hidden bg-[linear-gradient(135deg,#fff7ef_0%,#ffe2c1_42%,#fff8f2_100%)] p-0">
        <div className="border-b border-[#efcfb2] px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Eyebrow>Offer</Eyebrow>
              <h3 className="mt-2 text-[2.2rem] font-black tracking-[-0.05em] text-[#201812]">Offer studio</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f6358]">Shape the quote like a control desk: adjust amount, stretch tenure, and see the payout impact instantly.</p>
            </div>
            <div className="rounded-full border border-[#efcfb2] bg-white/80 px-4 py-2 text-sm font-semibold text-[#8d4710] shadow-[0_10px_24px_rgba(156,78,11,0.05)]">
              {utilization}% utilization
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-6 xl:grid-cols-[minmax(0,1.1fr)_320px]">
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] border border-[#efcfb2] bg-white/88 p-5 shadow-[0_16px_34px_rgba(156,78,11,0.08)]">
                <div className="text-[10px] uppercase tracking-[0.24em] text-[#c86a18]">Borrow amount</div>
                <div className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#201812]">{money(amount)}</div>
                <div className="mt-2 text-sm leading-6 text-[#6f6358]">Use the slider to balance approval comfort and client need.</div>
                <input type="range" min={10000} max={180000} step={5000} value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="mt-6 w-full" />
              </div>

              <div className="rounded-[1.6rem] border border-[#3f2312] bg-[linear-gradient(180deg,#2f190c_0%,#4e2a12_100%)] p-5 text-white shadow-[0_22px_42px_rgba(47,25,12,0.2)]">
                <div className="text-[10px] uppercase tracking-[0.24em] text-[#ffb15a]">Tenure window</div>
                <div className="mt-3 text-4xl font-black tracking-[-0.05em] text-white">{tenure}</div>
                <div className="text-sm font-semibold text-[#ffd6ab]">days</div>
                <div className="mt-2 text-sm leading-6 text-white/72">Longer duration softens repayment pressure but lifts total payout.</div>
                <input type="range" min={30} max={150} step={6} value={tenure} onChange={(event) => setTenure(Number(event.target.value))} className="mt-6 w-full" />
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-[#efcfb2] bg-white/70 p-5 shadow-[0_16px_34px_rgba(156,78,11,0.07)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-[#c86a18]">Quote structure</div>
                  <div className="mt-2 text-xl font-black text-[#201812]">Cost breakdown</div>
                </div>
                <div className="rounded-full bg-[#fff0e1] px-3 py-1 text-xs font-semibold text-[#b85a12]">Live refresh</div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-[1.2rem] bg-[#fff8f2] p-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Interest</div>
                  <div className="mt-2 text-2xl font-black text-[#201812]">{money(interest)}</div>
                </div>
                <div className="rounded-[1.2rem] bg-[#fff8f2] p-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Fee</div>
                  <div className="mt-2 text-2xl font-black text-[#201812]">{money(fee)}</div>
                </div>
                <div className="rounded-[1.2rem] bg-[#2f190c] p-4 text-white">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#ffb15a]">Total payable</div>
                  <div className="mt-2 text-2xl font-black text-white">{money(totalPayable)}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={onContinue} className="rounded-full bg-[#d86c1e] px-6 text-white hover:bg-[#c85f16]">
                Continue to disbursal
              </Button>
              <Button type="button" variant="outline" onClick={onBack} className="rounded-full border-[#f0d7bf] bg-white/85 px-6">
                Back
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[1.8rem] border border-[#efcfb2] bg-[linear-gradient(180deg,#2f190c_0%,#4a2811_100%)] p-5 text-white shadow-[0_24px_44px_rgba(47,25,12,0.18)]">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#ffb15a]">Offer snapshot</div>
              <div className="mt-2 text-2xl font-black text-white">Quick quote</div>
              <div className="mt-5 space-y-3">
                {[
                  { label: "Selected amount", value: money(amount) },
                  { label: "Tenure", value: `${tenure} days` },
                  { label: "Estimated payout", value: money(Math.max(0, amount - fee)) },
                  { label: "Total repayment", value: money(totalPayable) },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1rem] bg-white/8 px-4 py-3">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[#ffb15a]">{item.label}</div>
                    <div className="mt-2 text-lg font-black text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-[#efcfb2] bg-white/85 p-5 shadow-[0_16px_32px_rgba(156,78,11,0.07)]">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Offer actions</div>
              <div className="mt-2 text-xl font-black text-[#201812]">What changes here</div>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Adjust amount", value: "Increase or reduce the requested amount" },
                  { label: "Adjust tenure", value: "Shape the repayment duration" },
                  { label: "Review costs", value: "See fee, interest, and total together" },
                  { label: "Lock quote", value: "Move to disbursal when the quote looks right" },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1rem] border border-[#f0d7bf] bg-[#fff8f2] px-4 py-3">
                    <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold text-[#201812]">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
