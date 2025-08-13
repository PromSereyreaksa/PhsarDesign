"use client"

import { useState } from "react"
import SearchBox from "../../../../components/common/SearchBox"
import SuggestionChip from "../../../../components/common/SuggestionChip"

export default function HeroSectionAuth({ backgroundImageUrl }) {
  const [searchController, setSearchController] = useState("")

  const buildSuggestionButtons = () => {
    const suggestions = ['logo', 'graphic design', '3D Render', 'illustration', 'branding']

    // Responsive font sizing
    const getFontSize = () => {
      if (typeof window === 'undefined') return 'text-base'
      if (window.innerWidth >= 1024) return 'text-base' // Desktop: 16px
      if (window.innerWidth >= 768) return 'text-sm' // Tablet: 14px
      return 'text-xs' // Mobile: 12px
    }

    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024

    if (isDesktop) {
      return (
        <div className="flex flex-wrap gap-3">
          {suggestions.map((suggestion, index) => (
            <SuggestionChip
              key={index}
              label={suggestion}
              onTap={() => setSearchController(suggestion)}
              fontSize={getFontSize()}
            />
          ))}
        </div>
      )
    }

    // For mobile and tablet, use flex wrap with intrinsic width
    return (
      <div className="flex flex-wrap gap-3 items-start">
        {suggestions.map((suggestion, index) => (
          <SuggestionChip
            key={index}
            label={suggestion}
            onTap={() => setSearchController(suggestion)}
            fontSize={getFontSize()}
          />
        ))}
      </div>
    )
  }

  const buildMobileLayout = () => {
    return (
      <div className="flex flex-col space-y-6">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Find Artists, See Work, Be Discovered
          </h1>
          <div className="space-y-4">
            <SearchBox 
              value={searchController}
              onChange={setSearchController}
            />
            {buildSuggestionButtons()}
          </div>
          <div className="mt-8">
            <GradientTitle />
          </div>
        </div>
      </div>
    )
  }

  const buildTabletLayout = () => {
    return (
      <div className="flex flex-col space-y-6">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Find Artists, See Work, Be Discovered
          </h1>
          <div className="space-y-4">
            <SearchBox 
              value={searchController}
              onChange={setSearchController}
            />
            {buildSuggestionButtons()}
          </div>
          <div className="mt-8">
            <GradientTitle />
          </div>
        </div>
      </div>
    )
  }

  const buildDesktopLayout = () => {
    return (
      <div className="relative">
        <div className="flex">
          <div className="flex-1 max-w-2xl">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Find Artists, See Work, Be Discovered
              </h1>
              <div className="space-y-4">
                <SearchBox 
                  value={searchController}
                  onChange={setSearchController}
                />
                {buildSuggestionButtons()}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-5">
          <GradientTitle />
        </div>
      </div>
    )
  }

  const WelcomeText = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
          Welcome, User!
        </h2>
      </div>
    )
  }

  const GradientTitle = () => {
    return (
      <div className="text-right">
        <div className="space-y-1">
          <div className="text-3xl md:text-4xl font-bold text-gray-400 leading-tight">
            A Marketplace Where Creative
          </div>
          <div className="text-3xl md:text-4xl font-bold text-green-500 leading-tight">
            Dreams Take Shape.
          </div>
        </div>
      </div>
    )
  }

  const getLayout = () => {
    if (typeof window === 'undefined') return buildDesktopLayout()
    
    const screenWidth = window.innerWidth
    const isMobile = screenWidth < 768
    const isTablet = screenWidth >= 768 && screenWidth < 1024

    if (isMobile) return buildMobileLayout()
    if (isTablet) return buildTabletLayout()
    return buildDesktopLayout()
  }

  return (
    <div className="w-full">
      <WelcomeText />
      
      <div 
        className="w-full min-h-[400px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${backgroundImageUrl || '/image/hero section background.png'})`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {getLayout()}
        </div>
      </div>
    </div>
  )
}
