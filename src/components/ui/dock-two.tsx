"use client"
import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DockProps {
  className?: string
  items: {
    label: string
    onClick?: () => void
    isHighlight?: boolean
  }[]
  logo?: React.ReactNode
}

interface DockTextButtonProps {
  label: string
  onClick?: () => void
  className?: string
  isHighlight?: boolean
}

const floatingAnimation: any = {
  initial: { y: 0 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const DockTextButton = React.forwardRef<HTMLButtonElement, DockTextButtonProps>(
  ({ label, onClick, className, isHighlight }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={cn(
          "relative group px-4 md:px-5 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer",
          isHighlight 
            ? "text-white shadow-lg shadow-orange-500/30" 
            : "text-slate-700 hover:bg-orange-50 hover:text-slate-950",
          className
        )}
        style={isHighlight ? { background: "linear-gradient(135deg,#ff8a00,#f97316)" } : undefined}
      >
        {label}
      </motion.button>
    )
  }
)
DockTextButton.displayName = "DockTextButton"

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  ({ items, logo, className }, ref) => {
    return (
      <div ref={ref} className={cn("w-full flex items-center justify-center p-4", className)}>
        <motion.div
          initial="initial"
          animate="animate"
          variants={floatingAnimation}
          className={cn(
            "flex items-center gap-1 md:gap-2 p-2 rounded-2xl md:rounded-full",
            "backdrop-blur-xl border border-orange-200/70 shadow-[0_20px_40px_rgba(120,53,15,0.08)]",
            "bg-white/75",
            "hover:shadow-[0_25px_50px_rgba(120,53,15,0.12)] transition-shadow duration-500 pointer-events-auto"
          )}
        >
          
          {/* LOGO SECTION */}
          {logo && (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="px-4 py-1 flex items-center cursor-pointer"
            >
              {logo}
            </motion.div>
          )}

          {logo && <div className="hidden md:block w-px h-6 bg-slate-200 mx-1" />}

          {/* TEXT LINKS SECTION */}
          <div className="hidden md:flex items-center gap-1">
             {items.filter(i => !i.isHighlight).map((item) => (
                <DockTextButton key={item.label} {...item} />
             ))}
          </div>

          <div className="hidden md:block w-px h-6 bg-slate-200 mx-1" />

          {/* CTA/HIGHLIGHT SECTION */}
          <div className="flex items-center">
             {items.filter(i => i.isHighlight).map((item) => (
                <DockTextButton key={item.label} {...item} />
             ))}
          </div>

        </motion.div>
      </div>
    )
  }
)
Dock.displayName = "Dock"

export { Dock }
