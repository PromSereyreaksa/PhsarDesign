"use client"

import React, { useCallback, useRef } from "react"
import SEO from "../../components/seo/SEO.jsx"
import FooterSection from "../../components/shared/AuthFooter"
import AuthNavbar from "../../components/shared/AuthNavbar"
import LazyComponent from "../../components/ui/LazyComponent"
import { useIntersectionObserver } from "../../hooks/usePerformance.jsx"
import ArtistsSection from "../HomePage/components/ArtistsSection"
import FreelancingOpportunitiesSection from "../HomePage/components/FreelancingOpportunitiesSection"
import PopularServicesSection from "../HomePage/components/PopularServicesSection"
import ExploreSection from "./components/ExploreSection"
import HeroSectionAuth from "./components/HeroSectionAuth"

// Memoized components for better performance
const MemoizedHeroSection = React.memo(HeroSectionAuth)
const MemoizedExploreSection = React.memo(ExploreSection)
const MemoizedFreelancingSection = React.memo(FreelancingOpportunitiesSection)
const MemoizedServicesSection = React.memo(PopularServicesSection)
const MemoizedArtistsSection = React.memo(ArtistsSection)
const MemoizedFooter = React.memo(FooterSection)

export default function LandingPage() {
  const freelancingRef = useRef(null)

  // Optimized scroll function with useCallback
  const scrollToFreelancing = useCallback(() => {
    if (freelancingRef.current) {
      const navbarHeight = 80 // Fixed navbar height
      const additionalSpacing = 20
      const elementPosition = freelancingRef.current.offsetTop - navbarHeight - additionalSpacing
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      })
    }
  }, [])

  // Intersection observers for lazy loading sections
  const [heroRef, isHeroVisible] = useIntersectionObserver(null, { threshold: 0.1 })
  const [freelancingSectionRef, isFreelancingVisible] = useIntersectionObserver(null, { 
    threshold: 0.1, 
    rootMargin: '100px' 
  })
  const [servicesSectionRef, isServicesVisible] = useIntersectionObserver(null, { 
    threshold: 0.1, 
    rootMargin: '100px' 
  })
  const [artistsSectionRef, isArtistsVisible] = useIntersectionObserver(null, { 
    threshold: 0.1, 
    rootMargin: '100px' 
  })

  return (
    <>
      <SEO 
        title="PhsarDesign - Creative Marketplace | Connect with Talented Artists & Designers"
        description="Discover exceptional creative talent on PhsarDesign. Connect with professional artists, designers, and freelancers for your next project. Quality services, competitive prices."
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "PhsarDesign",
          "description": "Creative marketplace connecting clients with talented artists and designers",
          "url": typeof window !== 'undefined' ? window.location.href : 'https://phsardesign.com',
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${typeof window !== 'undefined' ? window.location.origin : 'https://phsardesign.com'}/marketplace?search={search_term}`,
            "query-input": "required name=search_term"
          }
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] relative">
        {/* Fixed Navigation */}
        <AuthNavbar />
        
        {/* Main Content with top padding for fixed navbar */}
        <div className="pt-20">
          {/* Hero Section - Always loaded immediately for LCP */}
          <div ref={heroRef}>
            <MemoizedHeroSection 
              backgroundImageUrl="/image/hero section background.png"
            />
          </div>
          
          {/* Explore Section - Navigation anchor */}
          <MemoizedExploreSection 
            isExpanded={false} 
            onToggle={scrollToFreelancing} 
          />
          
          {/* Lazy-loaded sections for better performance */}
          <div ref={freelancingSectionRef}>
            <LazyComponent isVisible={isFreelancingVisible} height="400px">
              <MemoizedFreelancingSection 
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
            </LazyComponent>
          </div>
          
          <div ref={servicesSectionRef}>
            <LazyComponent isVisible={isServicesVisible} height="400px">
              <MemoizedServicesSection 
                customImages={[
                  "/image/Service1.jpg",
                  "/image/Service2.jpg",
                  "/image/Service3.jpg",
                  "/image/Service4.jpg",
                ]} 
              />
            </LazyComponent>
          </div>
          
          <div ref={artistsSectionRef}>
            <LazyComponent isVisible={isArtistsVisible} height="400px">
              <MemoizedArtistsSection 
                customImages={[
                  "/image/Artist1.jpg",
                  "/image/Artist2.jpg",
                  "/image/Artist3.jpg",
                  "/image/Artist4.jpg",
                  "/image/Artist5.jpg",
                ]} 
              />
            </LazyComponent>
          </div>
          
          <MemoizedFooter />
        </div>
      </div>
    </>
  )
}
