"use client"

import { motion } from "framer-motion"

const steps = [
  {
    num: "01",
    title: "Fill Simple Form",
    desc: "Share your basic details. Our digital form requires absolutely zero paperwork.",
    time: "2 min",
  },
  {
    num: "02",
    title: "AI Credit Check",
    desc: "Our proprietary AI engine evaluates your profile instantly. No CIBIL required.",
    time: "< 60 sec",
  },
  {
    num: "03",
    title: "Instant Approval",
    desc: "Review your personalized loan offer and complete a secure digital e-sign.",
    time: "1 min",
  },
  {
    num: "04",
    title: "Money in Account",
    desc: "Funds transferred via IMPS directly to your bank account. Arrives instantly.",
    time: "5 min",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 md:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-14 max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
            How It Works
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Money in 4 simple steps
          </h2>
          <p className="mt-4 text-base leading-7 text-white/60">
            A fast digital flow designed to move from application to disbursal in minutes.
          </p>
        </motion.div>

        <div className="relative pl-6 md:pl-8">
          <div className="absolute left-0 top-0 h-full w-px bg-white/10" />

          <div className="space-y-5">
            {steps.map((step, index) => (
              <motion.article
                key={step.num}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="absolute -left-[31px] top-7 h-3 w-3 rounded-full border border-white/20 bg-white" />

                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white/40">{step.num}</span>
                    <h3 className="text-xl font-semibold text-white md:text-2xl">
                      {step.title}
                    </h3>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/60">
                    {step.time}
                  </span>
                </div>

                <p className="max-w-2xl text-sm leading-7 text-white/60 md:text-base">
                  {step.desc}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
