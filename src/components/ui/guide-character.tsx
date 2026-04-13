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
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const hintTimerRef = useRef<number | null>(null)
  const bubbleTimerRef = useRef<number | null>(null)
  const jumpTimerRef = useRef<number | null>(null)
  const waveTimerRef = useRef<number | null>(null)
  const blinkTimerRef = useRef<number | null>(null)
  const celebrateTimerRef = useRef<number | null>(null)
  const moveTimerRef = useRef<number | null>(null)

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

  const moveFox = useCallback(
    (nextPosition?: { x: number; y: number }) => {
      const size = viewport.width < 640 ? 110 : 128
      const padding = viewport.width < 640 ? 12 : 20
      const maxX = Math.max(padding, viewport.width - size - padding)
      const maxY = Math.max(padding, viewport.height - size - padding)
      const next =
        nextPosition ?? {
          x: padding + Math.random() * Math.max(1, maxX - padding),
          y: padding + Math.random() * Math.max(1, maxY - padding),
        }

      setPosition((current) => {
        const isMovingRight = next.x >= current.x
        setIsFacingRight(isMovingRight)
        return {
          x: Math.max(padding, Math.min(next.x, maxX)),
          y: Math.max(padding, Math.min(next.y, maxY)),
        }
      })
    },
    [viewport.height, viewport.width]
  )

  useEffect(() => {
    const syncViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    syncViewport()
    window.addEventListener("resize", syncViewport)

    hintTimerRef.current = window.setTimeout(() => {
      setShowHint(false)
    }, 5000)

    const initialX = Math.max(16, window.innerWidth * 0.08)
    const initialY = Math.max(16, window.innerHeight * 0.68)
    const initTimer = window.setTimeout(() => {
      moveFox({ x: initialX, y: initialY })
    }, 0)

    const tipLoop = window.setInterval(() => {
      showMessage()
    }, 9000)

    const blinkLoop = window.setInterval(() => {
      triggerBlink()
    }, 5200)

    moveTimerRef.current = window.setInterval(() => {
      moveFox()
    }, 5200)

    return () => {
      window.removeEventListener("resize", syncViewport)
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
      if (moveTimerRef.current !== null) {
        window.clearInterval(moveTimerRef.current)
      }
      window.clearTimeout(initTimer)
      window.clearInterval(tipLoop)
      window.clearInterval(blinkLoop)
    }
  }, [moveFox, showMessage, triggerBlink])

  const handleClick = () => {
    setIsJumping(true)
    setIsWaving(true)
    setIsFacingRight((prev) => !prev)
    showMessage()
    triggerCelebrate()
    moveFox()
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
    <div className="fixed inset-0 z-50 pointer-events-none">
      <motion.div
        className="pointer-events-auto fixed left-0 top-0"
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 70, damping: 18, mass: 1.2 }}
        style={{ opacity: viewport.width > 0 ? 1 : 0 }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <AnimatePresence>
            {showBubble && (
              <motion.div
                className="absolute left-1/2 top-[-5.5rem] w-[min(82vw,20rem)] -translate-x-1/2 rounded-2xl border border-white/70 bg-white/95 px-4 py-2.5 text-center text-xs font-semibold text-slate-800 shadow-xl backdrop-blur-xl"
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-[0.28em] text-orange-600">
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
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff8a2a] to-[#f97316] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-105"
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
                className="absolute left-1/2 top-[-3rem] -translate-x-1/2 rounded-full bg-[#f97316] px-3 py-1 text-[11px] font-bold text-white shadow-lg shadow-orange-500/20"
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
            onClick={handleClick}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 -z-10 rounded-full bg-orange-300/30 blur-3xl"
              animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.55, 0.85, 0.55] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />

            <AnimatePresence>
              {isCelebrating &&
                SPARKLES.map((sparkle, index) => (
                  <motion.span
                    key={`${sparkle.x}-${sparkle.y}-${index}`}
                    className={`absolute left-1/2 top-1/2 rounded-full bg-orange-300 shadow-[0_0_16px_rgba(251,146,60,0.9)] ${sparkle.size}`}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], x: sparkle.x, y: sparkle.y, scale: [0, 1.2, 0] }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 1.0, delay: sparkle.delay, ease: "easeOut" }}
                  />
                ))}
            </AnimatePresence>

              <div className="relative mx-auto h-24 w-24 drop-shadow-[0_18px_28px_rgba(249,115,22,0.18)]">
                <svg viewBox="0 0 160 160" className="h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="foxBody" x1="0" y1="0" x2="0.95" y2="1">
                      <stop offset="0%" stopColor="#ffb55d" />
                      <stop offset="55%" stopColor="#f47d2f" />
                      <stop offset="100%" stopColor="#d6531b" />
                    </linearGradient>
                    <linearGradient id="foxShadow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffa948" />
                      <stop offset="100%" stopColor="#be4516" />
                    </linearGradient>
                    <linearGradient id="foxCream" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fff7ee" />
                      <stop offset="100%" stopColor="#ffe9cf" />
                    </linearGradient>
                    <radialGradient id="foxGlow" cx="50%" cy="42%" r="58%">
                      <stop offset="0%" stopColor="#fed7a3" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <motion.g
                    animate={{ y: isWaving ? [0, -2, 0] : [0, 1, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ellipse cx="80" cy="114" rx="28" ry="18" fill="url(#foxGlow)" opacity="0.55" />

                    <motion.path
                      d="M 49 104 C 54 85 70 74 88 74 C 105 74 116 84 118 100 C 120 118 111 129 93 133 C 74 137 58 129 51 116 C 47 111 46 108 49 104 Z"
                      fill="url(#foxBody)"
                      stroke="#92360d"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M 94 82 C 107 85 115 94 116 107 C 112 118 104 125 93 126 C 101 119 104 108 103 99 C 102 92 99 86 94 82 Z"
                      fill="#fff0dc"
                      opacity="0.95"
                    />

                    <motion.path
                      d="M 108 100 C 126 91 136 102 129 114 C 136 121 137 137 125 142 C 114 146 108 133 109 124 C 110 115 106 108 108 100 Z"
                      fill="url(#foxShadow)"
                      stroke="#92360d"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      animate={{ rotate: isWaving ? [8, -10, 8] : [4, 10, 4] }}
                      style={{ transformOrigin: "118px 110px" }}
                    />
                    <path
                      d="M 111 104 C 121 100 127 106 126 116 C 131 122 131 133 122 137 C 115 140 111 132 112 124 C 112 116 109 109 111 104 Z"
                      fill="#fff4e6"
                    />

                    <path
                      d="M 58 88 C 55 66 63 48 79 42 L 84 63 Z"
                      fill="url(#foxBody)"
                      stroke="#92360d"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path d="M 60 89 C 59 74 64 59 75 54 L 78 65 Z" fill="#fff7ef" />

                    <path
                      d="M 83 42 C 99 48 107 67 104 88 L 90 65 Z"
                      fill="url(#foxBody)"
                      stroke="#92360d"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path d="M 84 54 C 93 59 98 71 97 85 L 89 65 Z" fill="#fff7ef" />

                    <path
                      d="M 64 86 C 70 76 80 71 91 71 C 100 72 108 78 114 87 C 108 102 97 109 82 110 C 70 109 62 101 64 86 Z"
                      fill="url(#foxCream)"
                    />
                    <circle cx="84" cy="90" r="4.2" fill="#1f130b" />
                    <circle cx="85.5" cy="88.7" r="1.1" fill="#fff8ef" />
                    <path d="M 86 96 C 82 100 78 102 74 102" fill="none" stroke="#92360d" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 86 96 C 89 99 92 101 95 101" fill="none" stroke="#92360d" strokeWidth="2" strokeLinecap="round" />
                    <motion.circle
                      cx="84"
                      cy="90"
                      r="4.2"
                      fill="#1f130b"
                      animate={{ scaleY: isBlinking ? [1, 0.08, 1] : 1 }}
                      transition={{ duration: 0.18, ease: "easeInOut" }}
                    />

                    <motion.path
                      d="M 66 112 C 72 118 79 121 87 120"
                      fill="none"
                      stroke="#92360d"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      animate={{ scaleX: isCelebrating ? [1, 1.18, 1] : 1 }}
                      style={{ transformOrigin: "76px 116px" }}
                    />

                    <motion.rect
                      x="60"
                      y="118"
                      width="13"
                      height="18"
                      rx="6.5"
                      fill="url(#foxBody)"
                      stroke="#92360d"
                      strokeWidth="2"
                      animate={{ rotate: isWaving ? -8 : -3 }}
                      style={{ transformOrigin: "66px 118px" }}
                    />
                    <motion.rect
                      x="79"
                      y="119"
                      width="13"
                      height="18"
                      rx="6.5"
                      fill="url(#foxBody)"
                      stroke="#92360d"
                      strokeWidth="2"
                      animate={{ rotate: isWaving ? 3 : 0 }}
                      style={{ transformOrigin: "85px 119px" }}
                    />
                    <motion.rect
                      x="96"
                      y="119"
                      width="12"
                      height="17"
                      rx="6"
                      fill="url(#foxBody)"
                      stroke="#92360d"
                      strokeWidth="2"
                      animate={{ rotate: isWaving ? 8 : 3 }}
                      style={{ transformOrigin: "101px 119px" }}
                    />
                  </motion.g>
                </svg>
              </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
