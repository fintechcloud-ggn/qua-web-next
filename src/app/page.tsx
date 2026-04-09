"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import ShaderBackground from "@/components/ui/shader-background"
import Navbar from "@/components/ui/navbar"
import HeroSection from "@/components/ui/hero"
import StatsSection from "@/components/ui/stats-section"
import LoanCalculator from "@/components/ui/loan-calculator"
import HowItWorks from "@/components/ui/how-it-works"
import FeaturesSection from "@/components/ui/features-section"
import TestimonialsSection from "@/components/ui/testimonials-section"
import CtaSection from "@/components/ui/cta-section"
import FAQSection from "@/components/ui/faq-section"
import Footer from "@/components/ui/footer"
import AuthPopup from "@/components/ui/auth-popup"
import { Button } from "@/components/ui/button"

type SessionUser = {
  name: string
  email: string
  mobile: string
  city?: string
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAuthPopup, setShowAuthPopup] = useState(false)
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" })
        const data = (await response.json()) as { authenticated: boolean; user: SessionUser | null }
        if (!cancelled) {
          setSessionUser(data.authenticated ? data.user : null)
          setAuthReady(true)
          if (!data.authenticated && searchParams.get("auth") === "1") {
            setShowAuthPopup(true)
          }
        }
      } catch {
        if (!cancelled) {
          setAuthReady(true)
        }
      }
    }

    loadSession()
    return () => {
      cancelled = true
    }
  }, [searchParams])

  const handleApplyClick = () => {
    if (sessionUser) {
      router.push("/dashboard")
      return
    }
    setShowAuthPopup(true)
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setSessionUser(null)
    setShowAuthPopup(false)
    router.refresh()
  }

  return (
    <main className="relative min-h-screen">
      {/* ─── Global shader — fixed, behind everything ─── */}
      <ShaderBackground />

      {/* ─── All page content sits in z-10+ relative stack ─── */}
      <div className="relative z-10">
        {authReady && sessionUser && (
          <div className="mx-auto flex max-w-7xl justify-end px-6 pt-4">
            <div className="flex items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm shadow-sm backdrop-blur">
              <span className="text-slate-700">Signed in as {sessionUser.name}</span>
              <Button type="button" size="sm" onClick={() => router.push("/dashboard")} className="rounded-full bg-slate-950 px-4 text-white">
                Dashboard
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={handleLogout} className="rounded-full px-4">
                Logout
              </Button>
            </div>
          </div>
        )}
        <Navbar onApplyClick={handleApplyClick} />
        <HeroSection onApplyClick={handleApplyClick} />
        <FadeIn delay={0.1}><StatsSection /></FadeIn>
        <FadeIn delay={0.1}><LoanCalculator onApplyClick={handleApplyClick} /></FadeIn>
        <FadeIn delay={0.1}><HowItWorks /></FadeIn>
        <FadeIn delay={0.1}><FeaturesSection /></FadeIn>
        <FadeIn delay={0.1}><TestimonialsSection /></FadeIn>
        <FadeIn delay={0.1}><FAQSection /></FadeIn>
        <FadeIn delay={0.1}><CtaSection onApplyClick={handleApplyClick} /></FadeIn>
        <Footer />
      </div>
      <AuthPopup open={showAuthPopup} onClose={() => setShowAuthPopup(false)} onAuthSuccess={setSessionUser} />
    </main>
  )
}
