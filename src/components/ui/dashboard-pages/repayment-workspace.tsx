import Image from "next/image"

import { Card, Eyebrow } from "@/components/ui/dashboard-shared"

export function RepaymentWorkspace({
  monthlyRepayment,
  funded,
  repaymentAmount,
  profileName,
  upiPaymentUrl,
  money,
}: {
  monthlyRepayment: number
  funded: boolean
  repaymentAmount: number
  profileName: string
  upiPaymentUrl: string
  money: (value: number) => string
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_320px]">
      <Card className="overflow-hidden bg-[linear-gradient(135deg,#2f190c_0%,#4d2811_100%)] p-5 text-white">
        <Eyebrow>Repayment</Eyebrow>
        <h3 className="mt-2 text-xl font-black text-white">Pay amount and QR</h3>
        <p className="mt-2 text-sm leading-6 text-white/70">A dedicated payment screen for QR collection and current repayment instructions.</p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1rem] bg-white/8 p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Monthly outflow</div>
            <div className="mt-2 text-xl font-bold text-white">{money(monthlyRepayment)}</div>
          </div>
          <div className="rounded-[1rem] bg-white/8 p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">UPI</div>
            <div className="mt-2 text-xl font-bold text-white">qualoan@upi</div>
          </div>
          <div className="rounded-[1rem] bg-white/8 p-4">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Status</div>
            <div className="mt-2 text-xl font-bold text-white">{funded ? "Live" : "Waiting"}</div>
          </div>
        </div>

        <div className="mt-6 flex justify-center rounded-[1.25rem] border border-white/10 bg-white/6 p-4">
          <Image
            src={`/api/payment-qr?data=${encodeURIComponent(upiPaymentUrl)}`}
            alt="QR code for loan repayment"
            width={220}
            height={220}
            unoptimized
            className="rounded-[1rem] border border-[#f0d7bf] bg-white p-2"
          />
        </div>

        <p className="mt-4 text-sm leading-6 text-white/70">Scan from any UPI app to pay the current repayment amount directly.</p>
      </Card>

      <Card className="bg-[linear-gradient(180deg,#fffdfb_0%,#fff1e4_100%)] p-5">
        <Eyebrow>Repayment details</Eyebrow>
        <h3 className="mt-2 text-xl font-black text-[#201812]">Pay now</h3>
        <div className="mt-4 space-y-2">
          <div className="rounded-[1rem] border border-[#f0d7bf] px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Amount</div>
            <div className="mt-2 text-xl font-bold text-[#201812]">{money(repaymentAmount)}</div>
          </div>
          <div className="rounded-[1rem] border border-[#f0d7bf] px-4 py-3">
            <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Reference</div>
            <div className="mt-2 text-xl font-bold text-[#201812]">{profileName}</div>
          </div>
        </div>

        <div className="mt-4 rounded-[1.15rem] border border-[#f0d7bf] bg-white p-4">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#c86a18]">Collection note</div>
          <div className="mt-2 text-sm font-semibold text-[#201812]">{funded ? "Loan is live and ready for repayment collection." : "Repayment stays on hold until the disbursal is completed."}</div>
        </div>
      </Card>
    </div>
  )
}
