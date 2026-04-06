import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "QuaLoan — Instant Payday Loans in 5 Minutes 🚀",
  description: "India's #1 payday loan platform. Get up to ₹1 Lakh instantly. No CIBIL required. 100% digital. Apply in 2 min, get money in 5 min.",
  keywords: "payday loan, instant loan, personal loan, quick cash, India, no cibil, emergency loan",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
