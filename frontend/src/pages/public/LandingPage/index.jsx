"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Palette, DollarSign, Shield, Star, Sparkles } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent } from "../../../components/ui/card"
import SharedPublicNavbar from "../../../components/layout/navigation/SharedPublicNavbar"
import SharedPublicFooter from "../../../components/layout/footer/SharedPublicFooter"

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
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] relative">
      {/* Shared Navigation */}
      <SharedPublicNavbar showScrollLinks={true} />

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
            {popularServices.map((service) => (
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

      {/* Shared Footer */}
      <SharedPublicFooter />
      </div>
    </div>
  )
}
