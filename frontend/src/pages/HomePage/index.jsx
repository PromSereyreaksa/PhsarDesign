"use client"

import { useRef } from "react"
import FooterSection from "../../components/layout/AuthFooter"
import AuthNavbar from "../../components/layout/AuthNavbar"
import ArtistsSection from "./components/ArtistsSection"
import ExploreSection from "./components/ExploreSection"
import FreelancingOpportunitiesSection from "./components/FreelancingOpportunitiesSection"
import HeroSectionAuth from "./components/HeroSectionAuth"
import PopularServicesSection from "./components/PopularServicesSection"

export default function HomePage() {
  const freelancingRef = useRef(null)

  const scrollToFreelancing = () => {
    if (freelancingRef.current) {
      const navbarHeight = 80 // Fixed navbar height
      const additionalSpacing = 20
      const elementPosition = freelancingRef.current.offsetTop - navbarHeight - additionalSpacing
      
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] relative">
      {/* Fixed Navigation */}
      <AuthNavbar />

      {/* Main Content with top padding for fixed navbar */}
      <div className="pt-20">
        {/* Hero Section */}
        <HeroSectionAuth backgroundImageUrl="/image/hero section background.png" />

        {/* Explore Section - acts as navigation anchor */}
        <ExploreSection
          isExpanded={false}
          onToggle={scrollToFreelancing}
        />

        {/* All sections visible by default */}
        <FreelancingOpportunitiesSection
          titleRef={freelancingRef}
          
        />

        <PopularServicesSection
         
        />

        <ArtistsSection/>

        <FooterSection />
      </div>
    </div>
  )
}
