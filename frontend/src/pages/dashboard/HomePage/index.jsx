"use client"

import { useRef } from "react"
import HeroSectionAuth from "./components/HeroSectionAuth"
import ExploreSection from "./components/ExploreSection"
import FreelancingOpportunitiesSection from "../../../features/freelancing/FreelancingOpportunitiesSection"
import PopularServicesSection from "../../../features/services/PopularServicesSection"
import ArtistsSection from "../../../features/artists/ArtistsSection"
import FooterSection from "../../../components/layout/footer/AuthFooter"
import AuthNavbar from "../../../components/layout/navigation/AuthNavbar"

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
          customImages={[
            "/image/freelance1.png",
            "/image/freelance2.png", 
            "/image/freelance3.png",
            "/image/freelance4.png",
            "/image/freelance5.png",
            "/image/freelance6.png",
          ]}
        />

        <PopularServicesSection
          customImages={[
            "/image/Service1.jpg",
            "/image/Service2.jpg",
            "/image/Service3.jpg", 
            "/image/Service4.jpg",
          ]}
        />

        <ArtistsSection
          customImages={[
            "/image/Artist1.jpg",
            "/image/Artist2.jpg",
            "/image/Artist3.jpg",
            "/image/Artist4.jpg", 
            "/image/Artist5.jpg",
          ]}
        />

        <FooterSection />
      </div>
    </div>
  )
}
