"use client"
import { motion } from "motion/react"
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-columns-1"

const testimonials: Testimonial[] = [
  {
    text: "I’ve tried many apps, but QUA Loan is by far the fastest. Got ₹25K in 12 minutes when I needed it for a medical emergency.",
    image: "https://images.pexels.com/photos/29153202/pexels-photo-29153202.jpeg?cs=srgb&dl=pexels-dream_-makkerzz-1603229-29153202.jpg&fm=jpg",
    name: "Rahul M.",
    role: "Marketing Executive, Delhi",
    amount: "₹25,000",
    time: "12 min",
    rating: 5,
  },
  {
    text: "My salary was delayed and I had EMIs to pay. Applied at 11 PM and had money by 11:12 PM! Unbelievable speed. Would recommend to everyone in an emergency.",
    image: "https://images.pexels.com/photos/33225559/pexels-photo-33225559.jpeg?cs=srgb&dl=pexels-amodita-s-frame-485464413-33225559.jpg&fm=jpg",
    name: "Sneha Iyer",
    role: "Software Engineer, Bengaluru",
    amount: "₹50,000",
    time: "12 min",
    rating: 5,
  },
  {
    text: "No CIBIL check meant I could finally get a loan! My score was low but QuaLoan looked at my income instead. Fair, fast, and the support team was really friendly.",
    image: "https://images.pexels.com/photos/29153207/pexels-photo-29153207.jpeg?cs=srgb&dl=pexels-dream_-makkerzz-1603229-29153207.jpg&fm=jpg",
    name: "Amit Desai",
    role: "Business Owner, Ahmedabad",
    amount: "₹20,000",
    time: "6 min",
    rating: 5,
  },
  {
    text: "Used QuaLoan 3 times now. Each time faster than the last! The QuaCoins cashback on repayments is amazing. Best payday loan app in India hands down.",
    image: "https://images.pexels.com/photos/35157621/pexels-photo-35157621.jpeg?cs=srgb&dl=pexels-kolkatarphotographer-35157621.jpg&fm=jpg",
    name: "Neha Kapoor",
    role: "Sales Manager, Delhi",
    amount: "₹75,000",
    time: "15 min",
    rating: 5,
  },
  {
    text: "I was skeptical about online loans but QuaLoan's transparency won me over. Zero hidden fees, no surprises. Money was in my account before I finished my coffee!",
    image: "https://images.pexels.com/photos/29153205/pexels-photo-29153205.jpeg?cs=srgb&dl=pexels-dream_-makkerzz-1603229-29153205.jpg&fm=jpg",
    name: "Manoj Tiwari",
    role: "College Professor, Hyderabad",
    amount: "₹15,000",
    time: "5 min",
    rating: 5,
  },
  {
    text: "The entire process took place on my phone at midnight. Got ₹40,000 to cover my monthly house rent. The app is super clean and easy to use. Highly recommended!",
    image: "https://images.pexels.com/photos/16605844/pexels-photo-16605844.jpeg?cs=srgb&dl=pexels-jignesh-vasava-376391917-16605844.jpg&fm=jpg",
    name: "Kritika Chauhan",
    role: "Marketing Executive, Pune",
    amount: "₹40,000",
    time: "9 min",
    rating: 5,
  },
  {
    text: "As a self-employed person, banks always rejected me. QuaLoan approved me instantly based on my income. No collateral, no guarantor needed. God sent!",
    image: "https://images.pexels.com/photos/29153202/pexels-photo-29153202.jpeg?cs=srgb&dl=pexels-dream_-makkerzz-1603229-29153202.jpg&fm=jpg",
    name: "Aditya Sen",
    role: "Shop Owner, Chennai",
    amount: "₹25,000",
    time: "7 min",
    rating: 5,
  },
  {
    text: "Repayment was flexible — I chose 60 days and there was zero penalty when I paid early. This is how lending should work. Will definitely use again.",
    image: "https://images.pexels.com/photos/33225559/pexels-photo-33225559.jpeg?cs=srgb&dl=pexels-amodita-s-frame-485464413-33225559.jpg&fm=jpg",
    name: "Pooja Banerjee",
    role: "HR Manager, Noida",
    amount: "₹35,000",
    time: "11 min",
    rating: 5,
  },
  {
    text: "The customer support team helped me through every step. Got my loan sanctioned even at 2 AM. The IMPS transfer was instant. Amazing service!",
    image: "https://images.pexels.com/photos/29153205/pexels-photo-29153205.jpeg?cs=srgb&dl=pexels-dream_-makkerzz-1603229-29153205.jpg&fm=jpg",
    name: "Ravi Verma",
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
      <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent mb-16 max-w-6xl mx-auto" />

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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/50 bg-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-widest shadow-sm"
            >
              💬 Reviews
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-950 text-center tracking-tight mt-2 mb-4">
            Real Stories,{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #ff8a00, #f97316)" }}
            >
              Real Money
            </span>
          </h2>

          <p className="text-[#6f4317] font-medium text-center text-lg leading-relaxed">
            Over 1 lakh Indians share their QuaLoan experience.
          </p>

          {/* Rating pill */}
          <div
            className="mt-6 flex items-center gap-3 px-5 py-2.5 rounded-full border border-orange-200 backdrop-blur-md shadow-sm"
            style={{ background: "rgba(255,251,247,0.82)" }}
          >
            <span className="text-2xl text-orange-500 font-black">4.9</span>
            <div className="text-orange-500 text-sm">⭐⭐⭐⭐⭐</div>
            <div className="w-px h-4 bg-orange-100" />
            <span className="text-[#6f4317] font-bold text-xs">1,24,586 reviews</span>
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
