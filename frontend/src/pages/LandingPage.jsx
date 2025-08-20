"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { ArrowRight, Palette, DollarSign, Shield, Star, Sparkles, Search, MessageSquare } from "lucide-react"
import { Button } from "../shared/components/ui/button"
import { Input } from "../shared/components/ui/input"
import { Card, CardContent } from "../shared/components/ui/card"
import SharedPublicNavbar from "../shared/components/layout/navigation/SharedPublicNavbar"
import SharedPublicFooter from "../shared/components/layout/footer/SharedPublicFooter"
import { fetchPosts } from "../store/slices/marketplaceSlice"
import { fetchArtists } from "../store/slices/artistsSlice"
import { fetchPosts as fetchPostsForServices, fetchCategories } from "../store/slices/postsSlice"

export default function LandingPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { posts, loading: postsLoading } = useSelector((state) => state.marketplace)
  const { artists, loading: artistsLoading } = useSelector((state) => state.artists)
  const { posts: servicePosts, categories, loading: servicesLoading } = useSelector((state) => state.posts)

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchArtists())
    dispatch(fetchPostsForServices())
    dispatch(fetchCategories())
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/home")
    } else {
      navigate("/register")
    }
  }

  const featuredPosts = posts?.slice(0, 6) || []
  const featuredArtists = artists?.slice(0, 6) || []
  const featuredServices = servicePosts?.slice(0, 6) || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <SharedPublicNavbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/image/hero section background.png')"
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                Discover Amazing
                <span className="block bg-gradient-to-r from-[#A95BAB] to-[#7B68EE] bg-clip-text text-transparent">
                  Creative Talent
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Connect with talented freelancers and creative professionals. 
                Find the perfect match for your next project or showcase your skills to the world.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search for services, skills, or freelancers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-[#A95BAB] transition-all duration-300"
                  />
                </div>
                <Button 
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-[#A95BAB] to-[#7B68EE] hover:from-[#A95BAB]/80 hover:to-[#7B68EE]/80 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Search
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-[#A95BAB] to-[#7B68EE] hover:from-[#A95BAB]/80 hover:to-[#7B68EE]/80 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link to="/marketplace">
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  Browse Marketplace
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-gray-300">Active Freelancers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-gray-300">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-gray-300">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99%</div>
                <div className="text-gray-300">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose PhsarDesign?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We provide a seamless platform for creative collaboration
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#A95BAB] to-[#7B68EE] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Quality Talent</h3>
                <p className="text-gray-300">
                  Connect with vetted creative professionals who deliver exceptional results
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#A95BAB] to-[#7B68EE] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Secure Payments</h3>
                <p className="text-gray-300">
                  Safe and secure payment processing with buyer and seller protection
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[#A95BAB] to-[#7B68EE] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">24/7 Support</h3>
                <p className="text-gray-300">
                  Round-the-clock customer support to help you succeed
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-gray-300">
              Discover trending services from our talented community
            </p>
          </div>

          {servicesLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-6 animate-pulse">
                  <div className="h-48 bg-white/10 rounded-lg mb-4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <Card key={service.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group overflow-hidden">
                  <div className="relative">
                    <img 
                      src={service.image || '/image/Service1.jpg'} 
                      alt={service.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#A95BAB] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ${service.price}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#A95BAB] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">4.9</span>
                        <span className="text-gray-400 text-sm">(127)</span>
                      </div>
                      <Link 
                        to={`/marketplace/${service.slug}`}
                        className="text-[#A95BAB] hover:text-[#A95BAB]/80 text-sm font-semibold transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/marketplace">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#A95BAB] to-[#7B68EE] hover:from-[#A95BAB]/80 hover:to-[#7B68EE]/80 text-white px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105"
              >
                View All Services
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#202020]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Featured Artists
            </h2>
            <p className="text-xl text-gray-300">
              Meet our top-rated creative professionals
            </p>
          </div>

          {artistsLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-6 animate-pulse">
                  <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredArtists.map((artist) => (
                <Card key={artist.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-6">
                      <img 
                        src={artist.avatar || '/image/Artist1.jpg'} 
                        alt={artist.name}
                        className="w-20 h-20 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 w-6 h-6 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#A95BAB] transition-colors">
                      {artist.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {artist.specialty || 'Creative Professional'}
                    </p>
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white text-sm">4.9</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {artist.completedProjects || 45} projects
                      </div>
                    </div>
                    <Link 
                      to={`/profile/artist/${artist.id}`}
                      className="inline-flex items-center text-[#A95BAB] hover:text-[#A95BAB]/80 text-sm font-semibold transition-colors"
                    >
                      View Profile
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/marketplace">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#A95BAB] to-[#7B68EE] hover:from-[#A95BAB]/80 hover:to-[#7B68EE]/80 text-white px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Browse All Artists
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#A95BAB] to-[#7B68EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Ready to Start Your Creative Journey?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of creators and clients who trust PhsarDesign for their projects
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-white text-[#A95BAB] hover:bg-white/90 px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Join as Freelancer
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold transition-all duration-300"
              >
                Hire Talent
                <DollarSign className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SharedPublicFooter />
    </div>
  )
}