"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
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

const GuideCharacter = dynamic(() => import("@/components/ui/guide-character"), {
  ssr: false,
})

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

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" })
        const data = (await response.json()) as { authenticated: boolean; user: SessionUser | null }

        if (!cancelled) {
          setSessionUser(data.authenticated ? data.user : null)

          if (!data.authenticated && shouldOpenAuth) {
            setShowAuthPopup(true)
          }
        }
      } catch {
        // Ignore transient session fetch failures and render the page normally.
      }
    }

    loadSession()

    return () => {
      cancelled = true
    }
  }, [shouldOpenAuth])

  const handleApplyClick = () => {
    if (sessionUser) {
      router.push("/dashboard/application")
      return
    }

    setShowAuthPopup(true)
  }

  return (
    <main className="relative min-h-screen">
      <ShaderBackground />
      <GuideCharacter onApplyClick={handleApplyClick} />

      <div className="relative z-10">
        <Navbar onApplyClick={handleApplyClick} />
        <div id="hero">
          <HeroSection onApplyClick={handleApplyClick} />
        </div>
        <FadeIn delay={0.1}>
          <div id="stats">
            <StatsSection />
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div id="calculator">
            <LoanCalculator onApplyClick={handleApplyClick} />
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div id="how-it-works">
            <HowItWorks />
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <FeaturesSection />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div id="testimonials">
            <TestimonialsSection />
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div id="faq">
            <FAQSection />
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div id="cta">
            <CtaSection onApplyClick={handleApplyClick} />
          </div>
        </FadeIn>

        <Footer />
      </div>
      <AuthPopup open={showAuthPopup} onClose={() => setShowAuthPopup(false)} onAuthSuccess={setSessionUser} />
    </main>
  )
}
