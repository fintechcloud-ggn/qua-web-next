"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles } from "lucide-react"

const MESSAGES = [
  "Fast, friendly, and a little foxy.",
  "Tap me to keep the flow moving.",
  "Tiny fox, big energy.",
  "Let's dash to the next step.",
  "I bring the sparkles. You bring the click.",
]

const SPARKLES = [
  { x: -18, y: -20, delay: 0, size: "h-2 w-2" },
  { x: 18, y: -18, delay: 0.14, size: "h-1.5 w-1.5" },
  { x: -14, y: 18, delay: 0.28, size: "h-1.5 w-1.5" },
  { x: 20, y: 16, delay: 0.4, size: "h-2 w-2" },
]

export default function GuideCharacter({ onApplyClick }: { onApplyClick: () => void }) {
  const [message, setMessage] = useState("")
  const [showBubble, setShowBubble] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [isJumping, setIsJumping] = useState(false)
  const [isWaving, setIsWaving] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [isFacingRight, setIsFacingRight] = useState(true)

  const hintTimerRef = useRef<number | null>(null)
  const bubbleTimerRef = useRef<number | null>(null)
  const jumpTimerRef = useRef<number | null>(null)
  const waveTimerRef = useRef<number | null>(null)
  const blinkTimerRef = useRef<number | null>(null)
  const celebrateTimerRef = useRef<number | null>(null)

  const showMessage = useCallback((nextMessage?: string) => {
    const selected = nextMessage ?? MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    setMessage(selected)
    setShowBubble(true)

    if (bubbleTimerRef.current !== null) {
      window.clearTimeout(bubbleTimerRef.current)
    }

    bubbleTimerRef.current = window.setTimeout(() => {
      setShowBubble(false)
    }, 3500)
  }, [])

  const triggerBlink = useCallback(() => {
    setIsBlinking(true)
    if (blinkTimerRef.current !== null) {
      window.clearTimeout(blinkTimerRef.current)
    }
    blinkTimerRef.current = window.setTimeout(() => {
      setIsBlinking(false)
    }, 180)
  }, [])

  const triggerCelebrate = useCallback(() => {
    setIsCelebrating(true)

    if (celebrateTimerRef.current !== null) {
      window.clearTimeout(celebrateTimerRef.current)
    }

    celebrateTimerRef.current = window.setTimeout(() => {
      setIsCelebrating(false)
    }, 700)
  }, [])

  useEffect(() => {
    hintTimerRef.current = window.setTimeout(() => {
      setShowHint(false)
    }, 5000)

    const tipLoop = window.setInterval(() => {
      showMessage()
    }, 9000)

    const blinkLoop = window.setInterval(() => {
      triggerBlink()
    }, 5200)

    return () => {
      if (hintTimerRef.current !== null) {
        window.clearTimeout(hintTimerRef.current)
      }
      if (bubbleTimerRef.current !== null) {
        window.clearTimeout(bubbleTimerRef.current)
      }
      if (jumpTimerRef.current !== null) {
        window.clearTimeout(jumpTimerRef.current)
      }
      if (waveTimerRef.current !== null) {
        window.clearTimeout(waveTimerRef.current)
      }
      if (blinkTimerRef.current !== null) {
        window.clearTimeout(blinkTimerRef.current)
      }
      if (celebrateTimerRef.current !== null) {
        window.clearTimeout(celebrateTimerRef.current)
      }
      window.clearInterval(tipLoop)
      window.clearInterval(blinkLoop)
    }
  }, [showMessage, triggerBlink])

  const handleClick = () => {
    setIsJumping(true)
    setIsWaving(true)
    setIsFacingRight((prev) => !prev)
    showMessage()
    triggerCelebrate()
    onApplyClick()

    if (jumpTimerRef.current !== null) {
      window.clearTimeout(jumpTimerRef.current)
    }
    if (waveTimerRef.current !== null) {
      window.clearTimeout(waveTimerRef.current)
    }

    jumpTimerRef.current = window.setTimeout(() => {
      setIsJumping(false)
    }, 500)

    waveTimerRef.current = window.setTimeout(() => {
      setIsWaving(false)
    }, 700)
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 h-28 w-full overflow-hidden pointer-events-none">
      <motion.div
        className="absolute bottom-2 pointer-events-auto flex cursor-pointer flex-col items-center"
        style={{ animation: "mascotWalk 20s linear infinite" }}
        onClick={handleClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence>
          {showBubble && (
            <motion.div
              className="relative mb-2 max-w-[220px] rounded-2xl border border-white/70 bg-white/95 px-4 py-2.5 text-center text-xs font-semibold text-slate-800 shadow-xl backdrop-blur-xl"
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-600">
                <Sparkles className="h-3 w-3" />
                Fox Guide
              </div>
              <div className="mt-1.5 whitespace-normal leading-relaxed">{message}</div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onApplyClick()
                }}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105"
              >
                Apply now
              </button>
              <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showHint && !showBubble && (
            <motion.div
              className="mb-1.5 rounded-full bg-cyan-500 px-3 py-1 text-[11px] font-bold text-white shadow-lg shadow-cyan-500/20"
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: [0, -3, 0], scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              👆 Click me!
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative"
          animate={
            isJumping
              ? { y: -18, rotate: 4, scale: 1.05, scaleX: isFacingRight ? 1 : -1 }
              : isCelebrating
                ? { y: [0, -6, 0], rotate: [0, -8, 8, 0], scale: [1, 1.06, 1], scaleX: isFacingRight ? 1 : -1 }
                : { y: [0, -5, 0], rotate: [-1, 2, -1], scaleX: isFacingRight ? 1 : -1 }
          }
          transition={
            isJumping || isCelebrating
              ? { type: "spring", stiffness: 320, damping: 16 }
              : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <motion.div
            className="absolute inset-0 -z-10 rounded-full bg-cyan-300/30 blur-3xl"
            animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />

          <AnimatePresence>
            {isCelebrating &&
              SPARKLES.map((sparkle, index) => (
                <motion.span
                  key={`${sparkle.x}-${sparkle.y}-${index}`}
                  className={`absolute left-1/2 top-1/2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)] ${sparkle.size}`}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], x: sparkle.x, y: sparkle.y, scale: [0, 1.2, 0] }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 1.0, delay: sparkle.delay, ease: "easeOut" }}
                />
              ))}
          </AnimatePresence>

          <div className="relative mx-auto h-20 w-20">
            <motion.div
              className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 rounded-full bg-gradient-to-br from-[#ffb04f] via-[#f47e2f] to-[#d9551c] shadow-[0_16px_30px_rgba(251,146,60,0.28)]"
              style={{ boxShadow: "inset 0 2px 0 rgba(255,255,255,0.55)" }}
            >
              <div className="absolute left-1 top-1 h-0 w-0 border-x-[8px] border-x-transparent border-b-[14px] border-b-[#d9551c]" />
              <div className="absolute right-1 top-1 h-0 w-0 border-x-[8px] border-x-transparent border-b-[14px] border-b-[#d9551c]" />
              <div className="absolute left-2 top-2 h-0 w-0 border-x-[7px] border-x-transparent border-b-[12px] border-b-[#ffb04f]" />
              <div className="absolute right-2 top-2 h-0 w-0 border-x-[7px] border-x-transparent border-b-[12px] border-b-[#ffb04f]" />
              <motion.div
                className="absolute left-1/2 top-5 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-slate-800"
                animate={{ scaleY: isBlinking ? [1, 0.1, 1] : 1 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute left-1/2 top-7 h-2 w-4 -translate-x-1/2 rounded-b-full border-b-2 border-slate-800/80"
                animate={{ scaleX: isCelebrating ? [1, 1.25, 1] : 1 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute left-1/2 top-8 h-2 w-2 -translate-x-1/2 rounded-[2px] bg-[#1f130b]"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                animate={{ y: isCelebrating ? [0, -1, 0] : 0 }}
              />
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-5 -translate-x-1/2"
              animate={{ rotate: isWaving ? [-8, 10, -8] : [-4, 4, -4] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative h-8 w-6 rounded-t-[16px] bg-gradient-to-b from-[#1f140f] to-[#0e0a08]">
                <div className="absolute -left-1 top-0 h-4 w-4 rotate-[-28deg] rounded-tl-full rounded-br-full bg-[#2f1c12]" />
                <div className="absolute -right-1 top-0 h-4 w-4 rotate-[28deg] rounded-tr-full rounded-bl-full bg-[#2f1c12]" />
              </div>
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-11 flex -translate-x-1/2 items-end gap-0.5"
              animate={{ y: isWaving ? [0, -3, 0] : [0, 1, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="relative h-11 w-9 rounded-[22px] bg-gradient-to-b from-[#ff9f38] via-[#ef7d2f] to-[#d95f21] shadow-[0_16px_26px_rgba(8,145,178,0.16)]"
                animate={{ rotate: isWaving ? -4 : -1 }}
              >
                <div className="absolute left-1/2 top-1.5 h-6 w-6 -translate-x-1/2 rounded-[18px] bg-[#fff1de]" />
                <div className="absolute left-1/2 bottom-0.5 h-2.5 w-5 -translate-x-1/2 rounded-b-[14px] bg-[#fff1de]" />
              </motion.div>

              <motion.div
                className="h-7 w-2.5 rounded-full bg-[#ffb96a]"
                animate={{ rotate: isWaving ? 34 : 18, y: isWaving ? -5 : 0 }}
                style={{ transformOrigin: "top center" }}
              />
              <motion.div
                className="h-7 w-2.5 rounded-full bg-[#ffb96a]"
                animate={{ rotate: isWaving ? -20 : -12, y: 1 }}
                style={{ transformOrigin: "top center" }}
              />
            </motion.div>

            <motion.div
              className="absolute right-[-14px] top-[30px] h-10 w-12 origin-left"
              animate={{ rotate: isWaving ? [12, -10, 12] : [16, 22, 16] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute left-0 top-0 h-7 w-7 rounded-full bg-gradient-to-br from-[#fbb14d] via-[#f47d2e] to-[#db5d1d]" />
              <div className="absolute left-4 top-0 h-7 w-7 rounded-full bg-gradient-to-br from-[#fff5e2] to-[#ffe0b8]" />
            </motion.div>

            <motion.div
              className="absolute left-1/2 bottom-1 h-3 w-16 -translate-x-1/2 rounded-full bg-cyan-400/25 blur-xl"
              animate={{ scaleX: [1, 1.14, 1], opacity: [0.55, 0.9, 0.55] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes mascotWalk {
          0% { left: -120px; transform: scaleX(1); }
          48% { left: calc(100% + 20px); transform: scaleX(1); }
          50% { left: calc(100% + 20px); transform: scaleX(-1); }
          98% { left: -120px; transform: scaleX(-1); }
          100% { left: -120px; transform: scaleX(1); }
        }
      `}</style>
    </div>
  )
}
