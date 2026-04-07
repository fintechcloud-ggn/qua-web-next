import React from "react"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer id="footer" className="bg-black/60 backdrop-blur-xl border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-1">
             <div className="flex items-center gap-2.5 mb-6">
               <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md"
                 style={{ background: "linear-gradient(135deg,#3b82f6,#4f46e5)" }}>Q</div>
               <span className="text-white font-bold text-lg tracking-tight">QuaLoan</span>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Quick, Urgent, Assured Loans (QUA). Fast, easy, and completely paperless financial solutions for salaried individuals across India.
             </p>
          </div>

          {/* Quick Links */}
          <div>
             <h4 className="text-white font-bold mb-6">Quick Links</h4>
             <ul className="space-y-3">
                {['About Us', 'Loan Calculator', 'Repay Now', 'Contact Us'].map(link => (
                   <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{link}</a>
                   </li>
                ))}
             </ul>
          </div>

          {/* Legal */}
          <div>
             <h4 className="text-white font-bold mb-6">Legal</h4>
             <ul className="space-y-3">
                {['Privacy Policy', 'Terms & Conditions', 'Fair Practice Code'].map(link => (
                   <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{link}</a>
                   </li>
                ))}
             </ul>
          </div>

          {/* Contact */}
          <div>
             <h4 className="text-white font-bold mb-6">Contact Us</h4>
             <ul className="space-y-4">
                <li className="flex items-start gap-3">
                   <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                   <span className="text-gray-400 text-sm">1800-XXX-XXXX <br/> (Mon-Sat, 9AM-6PM)</span>
                </li>
                <li className="flex items-center gap-3">
                   <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                   <a href="mailto:support@qualoan.com" className="text-gray-400 hover:text-white text-sm transition-colors">support@qualoan.com</a>
                </li>
                <li className="flex items-start gap-3">
                   <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                   <span className="text-gray-400 text-sm leading-relaxed">
                      Naman Finlease Pvt. Ltd.<br/>
                      Official RBI Registered NBFC<br/>
                      New Delhi, India
                   </span>
                </li>
             </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} QuaLoan (Naman Finlease Pvt. Ltd.). All rights reserved.
           </p>
           <p className="text-gray-600 text-xs text-center md:text-right max-w-xl">
              Subject to status and credit checks. Late repayment could cause you serious money problems. For help, please review our Fair Practice Code.
           </p>
        </div>
      </div>
    </footer>
  )
}
