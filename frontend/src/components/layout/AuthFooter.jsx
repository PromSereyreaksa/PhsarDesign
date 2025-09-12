"use client"

import { useState } from "react"

export default function FooterSection({ className = "" }) {
  const [email, setEmail] = useState("")

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter subscription for authenticated users
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <footer className={`py-10 md:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          {/* Left Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">PhsarDesign</h3>

            <div className="space-y-2">
              <a href="#" className="block text-sm text-gray-300 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                Terms and Conditions
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                Privacy Policy
              </a>
              <a href="#" className="block text-sm text-gray-300 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                Cookie Settings
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61567582710788" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#2A2A2A] border border-white/20 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/prom-sereyreaksa-2a2298364/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#2A2A2A] border border-white/20 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://t.me/souuJ" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#2A2A2A] border border-white/20 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="mailto:coppsary@gmail.com" className="w-10 h-10 bg-[#2A2A2A] border border-white/20 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.887.492-1.667 1.218-2.052L12 9.545l10.782-6.14A1.636 1.636 0 0 1 24 5.457z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Section - Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white">Our Newsletter</h4>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#2A2A2A] border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#A95BAB] transition-colors duration-500 ease-out"
                required
              />
              <button
                type="submit"
                className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 ease-out transform hover:scale-105"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-center text-sm text-gray-300">© 2025 Phsar Design by Coppsary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


