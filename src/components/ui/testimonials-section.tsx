"use client"
import { motion } from "motion/react"
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1"

const testimonials: Testimonial[] = [
  {
    text: "I needed ₹30,000 urgently for my daughter's medical bills. QuaLoan approved it in just 8 minutes! The process was so simple — no branch visit, no paperwork. Absolute lifesaver!",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&crop=face",
    name: "Priya Sharma",
    role: "School Teacher, Mumbai",
    amount: "₹30,000",
    time: "8 min",
    rating: 5,
  },
  {
    text: "My salary was delayed and I had EMIs to pay. Applied at 11 PM and had money by 11:12 PM! Unbelievable speed. Would recommend to everyone in an emergency.",
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&crop=face",
    name: "Rahul Mehra",
    role: "Software Engineer, Bengaluru",
    amount: "₹50,000",
    time: "12 min",
    rating: 5,
  },
  {
    text: "No CIBIL check meant I could finally get a loan! My score was low but QuaLoan looked at my income instead. Fair, fast, and the support team was really friendly.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    name: "Ananya Patel",
    role: "Business Owner, Ahmedabad",
    amount: "₹20,000",
    time: "6 min",
    rating: 5,
  },
  {
    text: "Used QuaLoan 3 times now. Each time faster than the last! The QuaCoins cashback on repayments is amazing. Best payday loan app in India hands down.",
    image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=80&h=80&fit=crop&crop=face",
    name: "Vikram Singh",
    role: "Sales Manager, Delhi",
    amount: "₹75,000",
    time: "15 min",
    rating: 5,
  },
  {
    text: "I was skeptical about online loans but QuaLoan's transparency won me over. Zero hidden fees, no surprises. Money was in my account before I finished my coffee!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    name: "Deepti Rao",
    role: "College Professor, Hyderabad",
    amount: "₹15,000",
    time: "5 min",
    rating: 5,
  },
  {
    text: "The entire process took place on my phone at midnight. Got ₹40,000 to cover my monthly house rent. The app is super clean and easy to use. Highly recommended!",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    name: "Kavya Reddy",
    role: "Marketing Executive, Pune",
    amount: "₹40,000",
    time: "9 min",
    rating: 5,
  },
  {
    text: "As a self-employed person, banks always rejected me. QuaLoan approved me instantly based on my income. No collateral, no guarantor needed. God sent!",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
    name: "Suresh Kumar",
    role: "Shop Owner, Chennai",
    amount: "₹25,000",
    time: "7 min",
    rating: 5,
  },
  {
    text: "Repayment was flexible — I chose 60 days and there was zero penalty when I paid early. This is how lending should work. Will definitely use again.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face",
    name: "Meera Joshi",
    role: "HR Manager, Noida",
    amount: "₹35,000",
    time: "11 min",
    rating: 5,
  },
  {
    text: "The customer support team helped me through every step. Got my loan sanctioned even at 2 AM. The IMPS transfer was instant. Amazing service!",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=80&h=80&fit=crop&crop=face",
    name: "Arjun Nair",
    role: "Freelance Designer, Kochi",
    amount: "₹18,000",
    time: "4 min",
    rating: 5,
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

export default function TestimonialsSection() {
  return (
    <section id="reviews" className="py-24 relative">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16 max-w-6xl mx-auto" />

      <div className="container z-10 mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[560px] mx-auto mb-4"
        >
          <div className="flex justify-center mb-4">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-widest shadow-sm"
            >
              💬 Reviews
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 text-center tracking-tight mt-2 mb-4">
            Real Stories,{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
            >
              Real Money
            </span>
          </h2>

          <p className="text-gray-500 font-medium text-center text-lg leading-relaxed">
            Over 1 lakh Indians share their QuaLoan experience.
          </p>

          {/* Rating pill */}
          <div
            className="mt-6 flex items-center gap-3 px-5 py-2.5 rounded-full border border-gray-200 backdrop-blur-md shadow-sm"
            style={{ background: "rgba(255,255,255,0.7)" }}
          >
            <span className="text-2xl text-amber-400 font-black">4.9</span>
            <div className="text-amber-400 text-sm">⭐⭐⭐⭐⭐</div>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-gray-500 font-bold text-xs">1,24,586 reviews</span>
          </div>
        </motion.div>

        {/* Scrolling columns */}
        <div
          className="flex justify-center gap-5 mt-12 overflow-hidden"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            maxHeight: "760px",
          }}
        >
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={22}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={20}
          />
        </div>
      </div>
    </section>
  )
}
