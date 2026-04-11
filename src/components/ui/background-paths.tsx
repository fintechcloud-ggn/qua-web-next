"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function FloatingPaths({
  position,
  pathClassName,
}: {
  position: number
  pathClassName?: string
}) {
  const paths = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
          380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
          152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
          684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.75 + i * 0.035,
        duration: 10 + (i % 7),
      })),
    [position],
  )

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className={cn("h-full w-full scale-[1.15] text-slate-950", pathClassName)}
        viewBox="0 0 696 316"
        preserveAspectRatio="none"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.14 + path.id * 0.016}
            strokeLinecap="round"
            initial={{ opacity: 0.18, pathLength: 0.18, pathOffset: 0, pathSpacing: 0.72 }}
            animate={{
              opacity: [0.18, 0.42, 0.18],
              pathLength: [0.18, 0.34, 0.18],
              pathOffset: position > 0 ? [0, 1, 0] : [1, 0, 1],
              pathSpacing: [0.72, 0.34, 0.72],
            }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export function BackgroundPaths({
  title = "Background Paths",
  className,
  pathClassName,
  showContent = true,
}: {
  title?: string
  className?: string
  pathClassName?: string
  showContent?: boolean
}) {
  const words = title.split(" ").filter(Boolean)

  return (
    <div className={cn("relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white", className)}>
      <div className="absolute inset-0">
        <FloatingPaths position={1} pathClassName={pathClassName} />
        <FloatingPaths position={-1} pathClassName={pathClassName} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.45),transparent_48%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.3),transparent_38%)]" />
      </div>

      {showContent ? (
        <div className="relative z-10 container mx-auto px-4 text-center md:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="mx-auto max-w-4xl"
          >
            <h1 className="mb-8 text-5xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
              {words.map((word, wordIndex) => (
                <span key={wordIndex} className="mr-4 inline-block last:mr-0">
                  {word.split("").map((letter, letterIndex) => (
                    <motion.span
                      key={`${wordIndex}-${letterIndex}`}
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: wordIndex * 0.1 + letterIndex * 0.03,
                        type: "spring",
                        stiffness: 150,
                        damping: 25,
                      }}
                      className="inline-block bg-gradient-to-r from-neutral-900 to-neutral-700/80 bg-clip-text text-transparent"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </span>
              ))}
            </h1>

            <div className="group relative inline-block overflow-hidden rounded-2xl bg-gradient-to-b from-black/10 to-white/10 p-px shadow-lg backdrop-blur-lg transition-shadow duration-300 hover:shadow-xl">
              <Button
                variant="ghost"
                className="rounded-[1.15rem] border border-black/10 bg-white/95 px-8 py-6 text-lg font-semibold text-black backdrop-blur-md transition-all duration-300 hover:bg-white group-hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="opacity-90 transition-opacity group-hover:opacity-100">Discover Excellence</span>
                <span className="ml-3 opacity-70 transition-all duration-300 group-hover:translate-x-1.5 group-hover:opacity-100">→</span>
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </div>
  )
}
