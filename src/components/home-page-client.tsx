"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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

type SessionUser = {
  name: string
  email: string
  mobile: string
  city?: string
}

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
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

export default function HomePageClient({ shouldOpenAuth }: { shouldOpenAuth: boolean }) {
  const router = useRouter()
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

          if (!data.authenticated && shouldOpenAuth) {
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
  }, [shouldOpenAuth])

  const handleApplyClick = () => {
    if (sessionUser) {
      router.push("/dashboard")
      return
    }

    setShowAuthPopup(true)
  }

  return (
    <main className="relative min-h-screen">
      <ShaderBackground />

      <div className="relative z-10">
        <Navbar onApplyClick={handleApplyClick} />
        <HeroSection onApplyClick={handleApplyClick} />
        <FadeIn delay={0.1}>
          <StatsSection />
        </FadeIn>
        <FadeIn delay={0.1}>
          <LoanCalculator onApplyClick={handleApplyClick} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <HowItWorks />
        </FadeIn>
        <FadeIn delay={0.1}>
          <FeaturesSection />
        </FadeIn>
        <FadeIn delay={0.1}>
          <TestimonialsSection />
        </FadeIn>
        <FadeIn delay={0.1}>
          <FAQSection />
        </FadeIn>
        <FadeIn delay={0.1}>
          <CtaSection onApplyClick={handleApplyClick} />
        </FadeIn>
        <Footer />
      </div>
      <AuthPopup open={showAuthPopup} onClose={() => setShowAuthPopup(false)} onAuthSuccess={setSessionUser} />
    </main>
  )
}
