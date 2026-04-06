"use client"
import MountainVistaParallax from "@/components/ui/mountain-vista-bg"

const footerLinks = {
  "Products": ["Payday Loan", "Salary Advance", "Emergency Loan", "Business Loan"],
  "Company": ["About Us", "Careers", "Press Kit", "Blog"],
  "Legal": ["Privacy Policy", "Terms of Service", "Loan Agreement", "Grievance"],
  "Support": ["Help Center", "Contact Us", "Track Application", "Repayment"],
}

export default function Footer() {
  return (
    <footer className="relative mt-12 overflow-hidden border-t border-orange-200/50 bg-gradient-to-b from-transparent to-orange-100/30">
      {/* Dynamic Parallax Background injected behind content */}
      <MountainVistaParallax />

      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 relative z-20">
        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-sm"
                style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)" }}>Q</div>
              <span className="text-gray-900 font-bold text-lg">QuaLoan</span>
            </div>
            <p className="text-gray-900 text-xs leading-relaxed mb-6 font-bold">India&apos;s fastest payday loan. Safe, instant, transparent.</p>
            <div className="flex gap-2">
              {[
                { 
                  icon: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>, 
                  href: "#" 
                },
                { 
                  icon: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>, 
                  href: "#" 
                },
                { 
                  icon: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, 
                  href: "#" 
                },
                { 
                  icon: (props: any) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>, 
                  href: "#" 
                }
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-gray-400/50 flex items-center justify-center text-gray-800 hover:bg-black hover:text-white hover:border-black shadow-sm transition-all hover:-translate-y-1">
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <div className="text-black text-xs font-black uppercase tracking-widest mb-6">{section}</div>
              <ul className="space-y-3.5">
                {links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-gray-900 font-bold text-sm hover:text-blue-700 transition-colors drop-shadow-sm">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-gray-900/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="text-gray-900 font-bold text-[11px] tracking-wide">
            © 2025 QuaLoan Financial Services Pvt. Ltd. | NBFC License No. N-14.03221
          </div>
          <div className="text-gray-800 font-medium text-[11px] max-w-lg md:text-right mix-blend-multiply">
            Loans are subject to credit approval and eligibility. Interest rates and processing fees may vary based on your risk profile. Read all associated terms, conditions, and the loan agreement carefully before applying.
          </div>
        </div>
      </div>
    </footer>
  )
}
