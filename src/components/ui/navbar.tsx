"use client"
import React from "react"
import { Dock } from "@/components/ui/dock-two"

export default function Navbar({ onApplyClick }: { onApplyClick: () => void }) {
  const items = [
    { label: "Home", onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: "About Us", onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: "Loan Calculator", onClick: () => document.getElementById("calculator")?.scrollIntoView({ behavior: 'smooth' }) },
    { label: "Contact Us", onClick: () => document.getElementById("footer")?.scrollIntoView({ behavior: 'smooth' }) },
    { label: "Repay Now", onClick: onApplyClick },
    { label: "Login / Sign Up", onClick: onApplyClick, isHighlight: true }
  ]

  const logo = (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center font-black text-sm md:text-base text-white shadow-md shadow-blue-200/50"
        style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)" }}>Q</div>
      <span className="text-gray-900 font-bold text-base md:text-lg tracking-tight hidden sm:block">QuaLoan</span>
      <span className="text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 ml-1 hidden lg:block">PAYDAY</span>
    </div>
  )

  return (
    // We add pointer-events-none to the wrapper so that the invisible full-width wrapper 
    // doesn't block clicks on the content underneath it, but the inner dock reenables them.
    <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none pt-2 md:pt-4">
       <Dock items={items} logo={logo} />
    </div>
  )
}
