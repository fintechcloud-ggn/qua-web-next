type BrandLogoProps = {
  compact?: boolean
  className?: string
}

export default function BrandLogo({ compact = false, className }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg
        width={compact ? 42 : 52}
        height={compact ? 42 : 52}
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="26" cy="26" r="18" stroke="#f97316" strokeWidth="4.5" />
        <path d="M36.5 16.5V34" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M26 18.5L17.5 35" stroke="#f97316" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="26" cy="29" r="2.2" fill="#f97316" />
      </svg>

      <div className="flex flex-col leading-none">
        <div className="flex items-end gap-1">
          <span className={`${compact ? "text-[26px]" : "text-[32px]"} font-black tracking-[-0.08em] text-slate-700`}>O</span>
          <span className={`${compact ? "text-[26px]" : "text-[32px]"} font-black tracking-[-0.08em] text-slate-700`}>U</span>
          <span className={`${compact ? "text-[26px]" : "text-[32px]"} font-black tracking-[-0.08em] text-slate-700`}>A</span>
        </div>
        <span className={`${compact ? "text-[8px] tracking-[0.28em]" : "text-[9px] tracking-[0.3em]"} mt-1 font-medium text-slate-500`}>
          QUICK URGENT ASSURED
        </span>
      </div>
    </div>
  )
}
