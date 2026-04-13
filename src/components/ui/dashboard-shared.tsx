import type React from "react"

export function Card({
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

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#bf6a22]">{children}</div>
}

export const inputClassName =
  "h-12 w-full rounded-[1rem] border border-[#f0cfb4] bg-[#fff8f2] px-4 text-[#201812] outline-none transition placeholder:text-[#b89883] focus:border-[#dd8b3d] focus:bg-white"
