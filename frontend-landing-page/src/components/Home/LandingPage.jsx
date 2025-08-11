"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Palette, DollarSign, Shield, Star, Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"

export default function LandingPage() {
  const [email, setEmail] = useState("")

  // Mock artwork data for masonry grid
  const artworks = [
    {
      id: 1,
      image: "/DigitalArt.jpg",
      title: "Digital Art",
      artist: "vicky gujjar",
      category: "Digital Art",
      height: "h-64",
    },
    {
      id: 2,
      image: "/LogoDesign.jpg",
      title: "Brand Identity",
      artist: "Mike Rodriguez",
      category: "Logo Design",
      height: "h-80",
    },
    {
      id: 3,
      image: "/CharacterDesign.jpg",
      title: "Character Design",
      artist: "Emma Wilson",
      category: "Illustration",
      height: "h-72",
    },
    {
      id: 4,
      image: "/GraphicDesign.jpg",
      title: "Poster Design",
      artist: "David Kim",
      category: "Graphic Design",
      height: "h-96",
    },
    {
      id: 5,
      image: "/3DDesign.jpg",
      title: "3D Product Render",
      artist: "Lisa Park",
      category: "3D Design",
      height: "h-64",
    },
  ]

  const categories = [
    {
      name: "Digital Art",
      icon: Palette,
      count: "2.5k+",
      bgImage: "/DigitalArt.jpg",
    },
    {
      name: "Logo Design",
      icon: Sparkles,
      count: "1.8k+",
      bgImage: "/LogoDesign.jpg",
    },
    {
      name: "Illustration",
      icon: Palette,
      count: "3.2k+",
      bgImage: "/CharacterDesign.jpg",
    },
    {
      name: "Graphic Design",
      icon: Sparkles,
      count: "1.5k+",
      bgImage: "/GraphicDesign.jpg",
    },
    {
      name: "Icon Design",
      icon: Star,
      count: "2.1k+",
      bgImage: "/LogoDesign.jpg",
    },
    {
      name: "3D Design",
      icon: Shield,
      count: "890+",
      bgImage: "/3DDesign.jpg",
    },
  ]

  const stats = [
    { number: "50k+", label: "Creative Artists" },
    { number: "100k+", label: "Projects Completed" },
    { number: "99%", label: "Client Satisfaction" },
    { number: "24/7", label: "Support" },
  ]

  const featuredArtists = [
    {
      id: 1,
      name: "vicky gujjar",
      specialty: "Digital Artist",
      image: "/DigitalArt.jpg",
      rating: 4.9,
      projects: 127,
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      specialty: "Logo Designer",
      image: "/LogoDesign.jpg",
      rating: 4.8,
      projects: 89,
    },
    {
      id: 3,
      name: "Emma Wilson",
      specialty: "Illustrator",
      image: "/CharacterDesign.jpg",
      rating: 4.9,
      projects: 156,
    },
  ]

  const popularServices = [
    { name: "Logo Design", price: "Starting at $25", image: "/LogoDesign.jpg" },
    { name: "Digital Art", price: "Starting at $50", image: "/DigitalArt.jpg" },
    { name: "Character Design", price: "Starting at $75", image: "/CharacterDesign.jpg" },
    { name: "Graphic Design", price: "Starting at $35", image: "/GraphicDesign.jpg" },
  ]

  const valueProps = [
    {
      icon: Palette,
      title: "Wide Range of Art Styles",
      description: "From minimalist designs to complex illustrations, find the perfect style for your project",
    },
    {
      icon: DollarSign,
      title: "Standardized Pricing",
      description: "Transparent, fair pricing with no hidden fees. Know exactly what you'll pay upfront",
    },
    {
      icon: Shield,
      title: "Trusted System",
      description: "Verified artists, secure payments, and quality guarantee for peace of mind",
    },
  ]

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
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] via-[#1a1a1a] to-[#000000] relative">
      {/* Fixed Navigation - Updated to match Flutter behavior */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#202020]/98 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
                PhsarDesign
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => smoothScroll("services")}
                className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
              >
                Services
              </button>
              <button
                onClick={() => smoothScroll("categories")}
                className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
              >
                Categories
              </button>
              <button
                onClick={() => smoothScroll("artists")}
                className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
              >
                Artists
              </button>
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
          </div>
        </div>
      </nav>

      {/* Main Content with top padding for fixed navbar */}
      <div className="pt-20">

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
                    Creative
                  </span>
                  <br />
                  <span className="text-white">Freelancers</span>
                  <br />
                  <span className="bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
                    Marketplace
                  </span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  Connect with talented digital artists, designers, and creative professionals. Bring your vision to
                  life with world-class creative services.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/home">
                  <Button
                    size="lg"
                    className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg px-8 py-4 text-lg font-semibold group transform hover:scale-105 transition-all duration-500 ease-out"
                  >
                    Explore Talent
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 !text-gray-900 bg-white hover:bg-gray-100 hover:border-[#A95BAB]/50 hover:!text-gray-900 rounded-lg px-8 py-4 text-lg font-semibold group transform hover:scale-105 transition-all duration-500 ease-out"
                  >
                    <Sparkles className="mr-2 h-5 w-5 !text-gray-900" />
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-[#A95BAB] mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Improved Masonry Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  {artworks
                    .filter((_, index) => index % 2 === 0)
                    .map((artwork, index) => (
                      <Card
                        key={artwork.id}
                        className={`bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer ${artwork.height} transform hover:scale-105 transition-all duration-500 ease-out`}
                        style={{
                          animationDelay: `${index * 0.2}s`,
                        }}
                      >
                        <div className="relative overflow-hidden h-full">
                          <img
                            src={artwork.image || "/placeholder.svg"}
                            alt={artwork.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 ease-out" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <h3 className="font-semibold text-sm mb-1">{artwork.title}</h3>
                            <p className="text-xs text-gray-300">by {artwork.artist}</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-[#A95BAB]/20 rounded-full text-xs">
                              {artwork.category}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
                <div className="space-y-4 mt-8">
                  {artworks
                    .filter((_, index) => index % 2 === 1)
                    .map((artwork, index) => (
                      <Card
                        key={artwork.id}
                        className={`bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer ${artwork.height} transform hover:scale-105 transition-all duration-500 ease-out`}
                        style={{
                          animationDelay: `${(index + 1) * 0.2}s`,
                        }}
                      >
                        <div className="relative overflow-hidden h-full">
                          <img
                            src={artwork.image || "/placeholder.svg"}
                            alt={artwork.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 ease-out" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <h3 className="font-semibold text-sm mb-1">{artwork.title}</h3>
                            <p className="text-xs text-gray-300">by {artwork.artist}</p>
                            <span className="inline-block mt-2 px-2 py-1 bg-[#A95BAB]/20 rounded-full text-xs">
                              {artwork.category}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </div>

              {/* Floating Elements */}
              <div
                className="absolute -top-4 -right-4 w-20 h-20 bg-[#A95BAB]/20 rounded-full blur-xl animate-bounce"
                style={{ animationDelay: "1s" }}
              />
              <div
                className="absolute top-1/2 -left-8 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse"
                style={{ animationDelay: "2s" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Popular Services</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Most requested creative services by our clients</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularServices.map((service, index) => (
              <Card
                key={service.name}
                className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 rounded-2xl cursor-pointer group overflow-hidden relative transform hover:scale-105 transition-all duration-500 ease-out"
              >
                {/* Background Image on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <CardContent className="p-4 text-center relative z-10">
                  <h3 className="font-semibold text-white mb-1">{service.name}</h3>
                  <p className="text-sm text-[#A95BAB]">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Creative Categories</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover talented freelancers across various creative disciplines
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card
                  key={category.name}
                  className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 rounded-2xl cursor-pointer group overflow-hidden relative transform hover:scale-105 transition-all duration-500 ease-out"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Background Image on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out">
                    <img
                      src={category.bgImage || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <CardContent className="p-6 text-center relative z-10">
                    <div className="w-12 h-12 bg-[#A95BAB]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#A95BAB]/30 transition-colors duration-500 ease-out">
                      <IconComponent className="h-6 w-6 text-[#A95BAB]" />
                    </div>
                    <h3 className="font-semibold text-white mb-2 text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-400">{category.count} freelancers</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Artists You May Like */}
      <section id="artists" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Artists You May Like</h2>
            <p className="text-xl text-gray-300">Meet some of our top-rated creative professionals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredArtists.map((artist) => (
              <Card
                key={artist.id}
                className="bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer relative transform hover:scale-105 transition-all duration-500 ease-out"
              >
                {/* Background Image on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out">
                  <img
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <CardContent className="p-6 text-center relative z-10">
                  <h3 className="font-semibold text-white text-lg mb-1">{artist.name}</h3>
                  <p className="text-gray-300 mb-3">{artist.specialty}</p>
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-white">{artist.rating}</span>
                    </div>
                    <div className="text-gray-400">{artist.projects} projects</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Creative Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied clients who found their perfect creative partner
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-lg px-6"
            />
            <Link to="/register">
              <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg px-8 whitespace-nowrap transform hover:scale-105 transition-all duration-500 ease-out">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Updated to match Flutter implementation */}
      <footer className="py-10 md:py-16">
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
                <a href="#" className="w-10 h-10 bg-[#2A2A2A] border border-white/20 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#2A2A2A] border border-white/20 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#2A2A2A] border border-white/20 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-[#2A2A2A] border border-white/20 rounded-lg flex items-center justify-center text-gray-300 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.887.492-1.667 1.218-2.052L12 9.545l10.782-6.14A1.636 1.636 0 0 1 24 5.457z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Section - Newsletter */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white">Our Newsletter</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-[#2A2A2A] border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#A95BAB] transition-colors duration-500 ease-out"
                />
                <button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-500 ease-out transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-center text-sm text-gray-300">© 2025 Phsar Design by Coppsary. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  )
}
