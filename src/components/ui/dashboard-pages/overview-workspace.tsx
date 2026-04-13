import { Card, Eyebrow } from "@/components/ui/dashboard-shared"

import type { CompletedSteps } from "./types"

export function OverviewWorkspace({
  progress,
  activeLabel,
  description,
  completedSteps,
}: {
  progress: number
  activeLabel: string
  description: string
  completedSteps: CompletedSteps
  onContinue: () => void
  onOpenProfile: () => void
}) {
  return (
    <Card className="overflow-hidden border border-[#ead7c1] bg-[linear-gradient(180deg,#fffdf9_0%,#fff1e6_100%)] p-0">
      <div className="border-b border-[#efdbc7] px-5 py-4">
        <Eyebrow>Dashboard</Eyebrow>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-[2rem] font-black tracking-[-0.05em] text-[#201812]">Graph overview</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f6358]">{description}</p>
          </div>
          <div className="rounded-full bg-[#d86c1e] px-3 py-1 text-xs font-semibold text-white">{progress}% progress</div>
        </div>
      </div>

      <div className="p-5">
        <div className="rounded-[1.8rem] border border-[#3f2312] bg-[linear-gradient(180deg,#2f190c_0%,#4f2b14_100%)] p-5 text-white shadow-[0_24px_50px_rgba(47,25,12,0.2)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#ffb15a]">Performance</div>
              <div className="mt-2 text-2xl font-black text-white">{activeLabel}</div>
            </div>
            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#ffd7ac]">
              {completedSteps.funded ? "Funded" : "Live"}
            </div>
          </div>

          <div className="mt-5 h-72 overflow-hidden rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.03)_100%)] p-3">
            <svg viewBox="0 0 100 64" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="dashboardGraphFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffb15a" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="#ffb15a" stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="dashboardGraphLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ffcf92" />
                  <stop offset="100%" stopColor="#ff9e3d" />
                </linearGradient>
              </defs>
              <path d="M 10 12 L 90 12" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 5" />
              <path d="M 10 25 L 90 25" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 5" />
              <path d="M 10 38 L 90 38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 5" />
              <path d="M 10 52 L 90 52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 5" />
              <path d="M 10 45 L 21 31 L 33 35 L 46 18 L 58 26 L 70 10 L 82 20 L 90 15 L 90 56 L 10 56 Z" fill="url(#dashboardGraphFill)" />
              <path d="M 10 45 L 21 31 L 33 35 L 46 18 L 58 26 L 70 10 L 82 20 L 90 15" fill="none" stroke="url(#dashboardGraphLine)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              {[
                { cx: 10, cy: 45 },
                { cx: 21, cy: 31 },
                { cx: 33, cy: 35 },
                { cx: 46, cy: 18 },
                { cx: 58, cy: 26 },
                { cx: 70, cy: 10 },
                { cx: 82, cy: 20 },
                { cx: 90, cy: 15 },
              ].map((point, index) => (
                <circle key={index} cx={point.cx} cy={point.cy} r="1.4" fill="#fff5ea" stroke="#ffb15a" strokeWidth="1.2" />
              ))}
              {[
                { label: "JAN", x: 10 },
                { label: "FEB", x: 23 },
                { label: "MAR", x: 36 },
                { label: "APR", x: 49 },
                { label: "MAY", x: 62 },
                { label: "JUN", x: 75 },
                { label: "JUL", x: 88 },
              ].map((month) => (
                <text key={month.label} x={month.x} y="63" textAnchor="middle" fontSize="1.8" fontWeight="700" fill="rgba(255,255,255,0.48)">
                  {month.label}
                </text>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </Card>
  )
}
