"use client"

import { useState } from "react"
import { Bell } from "lucide-react"

export default function AuthNavbar() {
  const [isHovered, setIsHovered] = useState({})

  const handleDropdownHover = (item, isHovering) => {
    setIsHovered(prev => ({
      ...prev,
      [item]: isHovering
    }))
  }

  const DropdownItem = ({ text, isMobile = false }) => {
    return (
      <div
        className={`cursor-pointer transition-all duration-500 ease-out px-${isMobile ? '2' : '4'} py-2`}
        onMouseEnter={() => handleDropdownHover(text, true)}
        onMouseLeave={() => handleDropdownHover(text, false)}
      >
        <div className="flex items-center space-x-1">
          <span 
            className={`text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out font-medium ${isMobile ? 'text-sm' : 'text-base'}`}
          >
            {text}
          </span>
          <svg 
            className={`w-${isMobile ? '4' : '5'} h-${isMobile ? '4' : '5'} text-white transition-transform duration-500 ease-out ${isHovered[text] ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#202020]/98 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with gradient text */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              PhsarDesign
            </h1>
          </div>

          {/* Navigation links - visible on all screen sizes */}
          <div className="flex items-center justify-center flex-1">
            <div className="flex items-center space-x-6 md:space-x-8">
              <DropdownItem text="Find Talents" />
              <DropdownItem text="Find Works" />
              <DropdownItem text="Community" />
            </div>
          </div>

          {/* Right section - Notifications and Profile */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out">
              <Bell />
            </button>
            <div className="w-9 h-9 bg-[#A95BAB] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
