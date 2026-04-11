"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert, Fingerprint, Lock, ChevronDown, CheckCircle2 } from "lucide-react"

const faqs = [
  {
    q: "What is QUA Loan?",
    a: "QUA Loan is an online platform offering quick and hassle-free personal loans to salaried individuals. As part of Naman Finlease Pvt. Ltd. (An RBI registered NBFC), we aim to provide accessible financial solutions for emergencies, home improvement, or celebrations."
  },
  {
    q: "Who is eligible for a personal loan?",
    a: "To be eligible, you must be an Indian citizen, between 21 and 55 years of age, and a salaried individual with a minimum monthly income of ₹15,000."
  },
  {
    q: "What documents are required?",
    a: "Our process is fundamentally digital. Primarily, we only require KYC-based documents (Aadhar and PAN) representing a fully paperless digital flow."
  }
]

function FAQItem({ q, a, index, expanded, setExpanded }: any) {
  const isExpanded = expanded === index
  return (
    <motion.div
       className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-sm cursor-pointer"
       onClick={() => setExpanded(isExpanded ? null : index)}
       whileHover={{ scale: 1.01 }}
       transition={{ duration: 0.2 }}
    >
       <div className="flex items-center justify-between p-5 md:p-6">
          <h3 className="text-white font-bold text-base md:text-lg">{q}</h3>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
             <ChevronDown className="w-5 h-5 text-gray-500" />
          </motion.div>
       </div>
       <AnimatePresence>
          {isExpanded && (
             <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
             >
                <div className="px-5 md:px-6 pb-6 text-gray-400 leading-relaxed font-medium">
                   {a}
                </div>
             </motion.div>
          )}
       </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const [expanded, setExpanded] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
        
        {/* LEFT: Trust and Security Panel */}
        <motion.div
           initial={{ opacity: 0, x: -40 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            <Lock className="w-3.5 h-3.5" /> Security First
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-6">
             Your Safety is Our <br/> <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #ef4444, #f97316)" }}>Top Priority.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed max-w-md">
             We operate with absolute transparency and bank-grade digital security to ensure your financial health remains protected.
          </p>

          {/* Fraud Block */}
          <div className="bg-[linear-gradient(180deg,rgba(255,251,247,0.96),rgba(255,242,227,0.92))] backdrop-blur-md rounded-3xl p-8 border border-orange-200/70 shadow-[0_20px_40px_rgba(120,53,15,0.10)] relative overflow-hidden">
             {/* decorative background shield */}
             <ShieldAlert className="absolute -right-8 -bottom-8 w-48 h-48 text-orange-200/80" />
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                      <Fingerprint className="w-5 h-5" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-950">Fraud Awareness</h3>
                </div>
                <div className="space-y-4">
                   <p className="text-[#6f4317] text-sm leading-relaxed">
                      Stay vigilant against financial fraud. We will <b className="text-slate-950">never</b> ask you to pay advance fees for loan processing or ask for your confidential OTP / passwords over a phone call.
                   </p>
                   <div className="flex items-start gap-2 text-sm text-[#6f4317]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Official partner of <b className="text-slate-950">Naman Finlease Pvt. Ltd.</b>, an RBI Registered NBFC.</span>
                   </div>
                   <div className="flex items-start gap-2 text-sm text-[#6f4317]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Never click on unknown or suspicious links claiming to be QuaLoan.</span>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>

        {/* RIGHT: Questions Accordion */}
        <motion.div
           initial={{ opacity: 0, x: 40 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="mb-8">
             <h2 className="text-3xl font-black text-slate-950 mb-2">Frequently Asked Questions</h2>
             <p className="text-[#6f4317]">Everything you need to know about getting a loan with QUA.</p>
          </div>

          <div className="space-y-4">
             {faqs.map((faq, idx) => (
                <FAQItem 
                   key={idx} 
                   {...faq} 
                   index={idx} 
                   expanded={expanded} 
                   setExpanded={setExpanded} 
                />
             ))}
          </div>

          <div className="mt-8 p-6 bg-orange-50 border border-orange-200 backdrop-blur-sm rounded-2xl flex items-center justify-between">
             <div>
                <h4 className="text-slate-950 font-bold mb-1">Still have questions?</h4>
                <p className="text-[#6f4317] text-sm">Our support team is here 24/7.</p>
             </div>
             <button className="px-5 py-2.5 bg-gradient-to-r from-[#ff8a00] to-[#f97316] hover:from-[#ff9800] hover:to-[#fb923c] text-white font-bold text-sm rounded-xl transition-colors">
                Contact Us
             </button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
