"use client"

import { useState } from "react"

export default function ExploreSection({ isExpanded, onToggle }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
        <button
          onClick={onToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex items-center space-x-2 p-1 rounded-3xl transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#A95BAB] focus:ring-opacity-50"
          style={{
            transform: isHovered ? 'scale(1.0)' : 'scale(0.8)',
          }}
        >
          <span className="text-2xl md:text-3xl font-bold text-white">
            Explore
          </span>
          
          <div 
            className="w-8 h-8 bg-[#A95BAB] rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <svg 
              className="w-5 h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </div>
        </button>
        </div>
      </div>
    </section>
  )
}
