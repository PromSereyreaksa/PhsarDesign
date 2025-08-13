"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { Button } from "../../ui/button"

export default function SharedPublicNavbar({ 
  showScrollLinks = true, 
  customLinks = [],
  className = ""
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const smoothScroll = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
      const navbarHeight = 80 // Fixed navbar height (h-20 = 80px)
      const elementPosition = element.offsetTop - navbarHeight - 20 // Additional spacing
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      })
    }
    setIsMenuOpen(false)
  }

  // Default navigation links for landing page
  const defaultScrollLinks = [
    { label: "Services", target: "services" },
    { label: "Categories", target: "categories" },
    { label: "Artists", target: "artists" }
  ]

  // Navigation links based on page context
  const getNavigationLinks = () => {
    if (customLinks.length > 0) {
      return customLinks
    }
    
    if (location.pathname === "/" && showScrollLinks) {
      return defaultScrollLinks
    }
    
    return []
  }

  const navigationLinks = getNavigationLinks()

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-[#202020]/98 backdrop-blur-sm shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              PhsarDesign
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link, index) => (
              link.target ? (
                <button
                  key={index}
                  onClick={() => smoothScroll(link.target)}
                  className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={index}
                  to={link.href}
                  className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
                >
                  {link.label}
                </Link>
              )
            ))}
            
            {/* Always show About link */}
            <Link
              to="/about"
              className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
            >
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-white hover:text-[#A95BAB] hover:bg-white/10 rounded-lg px-6 transform hover:scale-105 transition-all duration-500 ease-out"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg px-6 transform hover:scale-105 transition-all duration-500 ease-out">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#A95BAB] transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#202020]/95 backdrop-blur-sm rounded-lg mt-2">
              {navigationLinks.map((link, index) => (
                link.target ? (
                  <button
                    key={index}
                    onClick={() => smoothScroll(link.target)}
                    className="block px-3 py-2 text-white hover:text-[#A95BAB] transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={index}
                    to={link.href}
                    className="block px-3 py-2 text-white hover:text-[#A95BAB] transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              
              <Link
                to="/about"
                className="block px-3 py-2 text-white hover:text-[#A95BAB] transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="pt-4 space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:text-[#A95BAB] hover:bg-white/10 rounded-lg"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
