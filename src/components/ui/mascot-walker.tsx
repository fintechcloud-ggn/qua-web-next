"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const MESSAGES = [
  "💰 Hey! Get ₹50,000 in 5 minutes!",
  "⚡ Zero processing fee this week!",
  "🎉 98% approval rate — try now!",
  "🚀 No CIBIL required. Apply free!",
  "💎 1 Lakh+ happy customers!",
]

export default function MascotWalker({ onApplyClick }: { onApplyClick: () => void }) {
  const [message, setMessage] = useState("")
  const [showBubble, setShowBubble] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    setTimeout(() => setShowHint(false), 5000)
    const t = setInterval(() => {
      const next = (msgIndex + 1) % MESSAGES.length
      setMsgIndex(next)
      setMessage(MESSAGES[next])
      setShowBubble(true)
      setTimeout(() => setShowBubble(false), 3500)
    }, 9000)
    return () => clearInterval(t)
  }, [msgIndex])

  const handleClick = () => {
    setIsJumping(true)
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    setMessage(msg)
    setShowBubble(true)
    setTimeout(() => setIsJumping(false), 500)
    setTimeout(() => setShowBubble(false), 3500)
  }

  return (
    <div className="fixed bottom-0 left-0 w-full h-28 pointer-events-none z-50 overflow-hidden">
      <div
        className="absolute bottom-2 pointer-events-auto cursor-pointer flex flex-col items-center"
        style={{ animation: "mascotWalk 20s linear infinite" }}
        onClick={handleClick}
      >
        {/* Speech bubble */}
        <AnimatePresence>
          {showBubble && (
            <motion.div
              className="bg-white text-gray-800 px-4 py-2.5 rounded-2xl text-xs font-semibold shadow-xl border border-gray-100 mb-2 max-w-[200px] text-center whitespace-nowrap relative"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              {message}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click hint */}
        <AnimatePresence>
          {showHint && !showBubble && (
            <motion.div
              className="bg-cyan-500 text-white px-3 py-1 rounded-full text-[11px] font-bold mb-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ animation: "bounce 1s ease infinite" }}
            >
              👆 Click me!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot */}
        <div style={{ animation: isJumping ? "jump 0.4s ease" : "bobble 0.5s ease-in-out infinite" }}>
          <img
            src="/mascot.png"
            alt="QuaLoan Mascot"
            className="w-20 h-20 object-contain"
            style={{ filter: "drop-shadow(0 6px 16px rgba(6,182,212,0.4))" }}
          />
          <div
            className="mx-auto mt-1 w-12 h-2 rounded-full"
            style={{
              background: "radial-gradient(ellipse, rgba(6,182,212,0.5) 0%, transparent 70%)",
              filter: "blur(3px)",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes mascotWalk {
          0% { left: -120px; transform: scaleX(1); }
          48% { left: calc(100% + 20px); transform: scaleX(1); }
          50% { left: calc(100% + 20px); transform: scaleX(-1); }
          98% { left: -120px; transform: scaleX(-1); }
          100% { left: -120px; transform: scaleX(1); }
        }
        @keyframes bobble {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes jump {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-18px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}
