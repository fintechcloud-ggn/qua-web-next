"use client"
import { startTransition } from "react"
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

  const handleApplyClick = () => {
    startTransition(() => {
      router.push("/auth")
    })
  }

  return (
    <main className="relative min-h-screen">
      {/* ─── Global shader — fixed, behind everything ─── */}
      <ShaderBackground />

      {/* ─── All page content sits in z-10+ relative stack ─── */}
      <div className="relative z-10">
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
    </main>
  )
}
