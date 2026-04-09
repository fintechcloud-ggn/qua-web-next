"use client"
import React from "react"
import { Dock } from "@/components/ui/dock-two"
import BrandLogo from "@/components/ui/brand-logo"

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
      <BrandLogo className="sm:hidden" compact />
      <BrandLogo className="hidden sm:inline-flex" />
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
