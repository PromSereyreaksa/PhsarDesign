"use client"

import { useState } from "react"

export default function HoverOverlay({ label, borderRadius = "rounded-xl" }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`absolute inset-0 ${borderRadius} transition-all duration-500 ease-out cursor-pointer transform group-hover:scale-105`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
      }}
    >
      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="text-white text-lg font-bold text-center px-4 transition-opacity duration-500 ease-out"
            style={{
              opacity: isHovered ? 1 : 0,
            }}
          >
            {label}
          </div>
        </div>
      )}
    </div>
  )
}
