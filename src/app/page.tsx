"use client"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ShaderBackground from "@/components/ui/shader-background"
import Navbar from "@/components/ui/navbar"
import HeroSection from "@/components/ui/hero"
import StatsSection from "@/components/ui/stats-section"
import LoanCalculator from "@/components/ui/loan-calculator"
import HowItWorks from "@/components/ui/how-it-works"
import FeaturesSection from "@/components/ui/features-section"
import TestimonialsSection from "@/components/ui/testimonials-section"
import CtaSection from "@/components/ui/cta-section"
import LoanApplyModal from "@/components/ui/loan-apply-modal"
import Confetti from "@/components/ui/confetti"
import Footer from "@/components/ui/footer"

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSuccess = () => {
    setShowModal(false)
    setShowConfetti(true)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 6000)
  }

  return (
    <main className="relative min-h-screen" style={{ background: "#000" }}>
      {/* ─── Global shader — fixed, behind everything ─── */}
      <ShaderBackground />

      {/* ─── All page content sits in z-10+ relative stack ─── */}
      <div className="relative z-10">
        <Navbar onApplyClick={() => setShowModal(true)} />
        <HeroSection onApplyClick={() => setShowModal(true)} />
        <StatsSection />
        <LoanCalculator onApplyClick={() => setShowModal(true)} />
        <HowItWorks />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection onApplyClick={() => setShowModal(true)} />
        <Footer />
      </div>


      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <LoanApplyModal
            onClose={() => setShowModal(false)}
            onSuccess={handleSuccess}
          />
        )}
      </AnimatePresence>

      {/* Confetti */}
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}

      {/* Success toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed bottom-28 left-1/2 z-[200] -translate-x-1/2 px-8 py-4 rounded-2xl text-white font-semibold text-sm shadow-2xl flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: "0 20px 40px rgba(16,185,129,0.4)",
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <span className="text-2xl">🎉</span>
            <div>
              <div className="font-black text-base mb-0.5">Application Submitted!</div>
              <div className="text-white/70 text-xs">Our team will call you within 5 minutes</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
