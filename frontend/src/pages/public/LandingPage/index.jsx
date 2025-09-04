"use client"

import { ArrowRight, DollarSign, MessageSquare, Palette, Search, Shield, Sparkles, Star } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import SharedPublicFooter from "../../../components/layout/SharedPublicFooter"
import SharedPublicNavbar from "../../../components/layout/SharedPublicNavbar"
// import { HomeSEO } from "../../../components/seo/SEO"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { useDebounce, useIntersectionObserver } from "../../../hooks/usePerformance.jsx"
import { fetchArtists } from "../../../store/slices/artistsSlice"
import { fetchCategories } from "../../../store/slices/categoriesSlice"
import { fetchPosts } from "../../../store/slices/marketplaceSlice"
import { fetchAvailabilityPosts } from "../../../store/slices/postsSlice"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get authentication state for navigation
  const { isAuthenticated } = useSelector((state) => state.auth)

  // Get data from Redux store
  const { posts: marketplacePosts, loading: marketplaceLoading } = useSelector((state) => state.marketplace)
  const { artists, loading: artistsLoading } = useSelector((state) => state.artists)
  const { availabilityPosts: servicePosts, loading: servicesLoading } = useSelector((state) => state.posts)
  const { categories: apiCategories, loading: categoriesLoading } = useSelector((state) => state.categories)

  // Memoize frequently used data
  const memoizedCategories = useMemo(() => apiCategories || [], [apiCategories])
  const memoizedArtists = useMemo(() => artists || [], [artists])
  const memoizedServicePosts = useMemo(() => servicePosts || [], [servicePosts])

  // Debounced email input for newsletter
  const debouncedEmailChange = useDebounce((value) => {
    setEmail(value)
  }, 300)

  // Intersection observers for lazy loading sections
  const [setHeroRef, isHeroInView] = useIntersectionObserver({ threshold: 0.1 })
  const [setFeaturesRef, isFeaturesInView] = useIntersectionObserver({ threshold: 0.1 })
  const [setCategoriesRef, isCategoriesInView] = useIntersectionObserver({ threshold: 0.1 })
  const [setArtistsRef, isArtistsInView] = useIntersectionObserver({ threshold: 0.1 })

  // Optimized data fetching
  const fetchInitialData = useCallback(() => {
    dispatch(fetchPosts({ limit: 6, isActive: true }))
    dispatch(fetchCategories())
  }, [dispatch])

  const fetchAdditionalData = useCallback(() => {
    if (isArtistsInView && !artistsLoading && memoizedArtists.length === 0) {
      dispatch(fetchArtists())
    }
    if (isCategoriesInView && !servicesLoading && memoizedServicePosts.length === 0) {
      dispatch(fetchAvailabilityPosts())
    }
  }, [dispatch, isArtistsInView, isCategoriesInView, artistsLoading, servicesLoading, memoizedArtists.length, memoizedServicePosts.length])

  // Fetch critical data on component mount
  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  // Fetch additional data when sections come into view
  useEffect(() => {
    fetchAdditionalData()
  }, [fetchAdditionalData])

  // Debug logging to understand data structures
  useEffect(() => {
    console.log('Loading states:', { categoriesLoading, servicesLoading, artistsLoading, marketplaceLoading })
    if (apiCategories) {
      console.log('API Categories:', apiCategories)
      console.log('First category structure:', apiCategories[0])
    }
    if (servicePosts) {
      console.log('Service Posts:', servicePosts)
      console.log('First service post structure:', servicePosts[0])
    }
    if (artists) {
      console.log('Artists:', artists)
    }
    if (marketplacePosts) {
      console.log('Marketplace Posts:', marketplacePosts)
      console.log('First marketplace post structure:', marketplacePosts[0])
    }
  }, [apiCategories, servicePosts, artists, marketplacePosts, categoriesLoading, servicesLoading, artistsLoading, marketplaceLoading])

  // Handle navigation - always go to the requested path
  const handleNavigation = (path) => {
    navigate(path)
  }

  // Handle conditional navigation based on authentication status
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/home")
    } else {
      navigate("/register")
    }
  }

  // Mock artwork data for masonry grid - enhanced with real data
  const getArtworkData = () => {
    if (marketplacePosts && marketplacePosts.length > 0) {
      return marketplacePosts.slice(0, 5).map((post, index) => ({
        id: post.id || index + 1,
        image: ["/DigitalArt.jpg", "/LogoDesign.jpg", "/CharacterDesign.jpg", "/GraphicDesign.jpg", "/3DDesign.jpg"][index] || "/DigitalArt.jpg",
        title: post.title || "Creative Work",
        artist: post.artist?.firstName && post.artist?.lastName 
          ? `${post.artist.firstName} ${post.artist.lastName}` 
          : post.artist?.firstName || "Artist",
        category: typeof post.category === 'string' 
          ? post.category 
          : (post.category?.name || "Creative"),
        height: index % 2 === 0 ? "h-64" : index % 3 === 0 ? "h-80" : "h-72",
      }))
    }
    // Fallback to mock data
    return [
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
  }

  const artworks = getArtworkData()

  // Categories data - enhanced with real data from categoryAPI
  const getCategoriesData = () => {
    if (apiCategories && apiCategories.length > 0) {
      return apiCategories.slice(0, 6).map((category, index) => ({
        id: category.id || category._id,
        name: category.name || category.title || 'Category',
        description: category.description || '',
        icon: [Palette, Sparkles, Palette, Sparkles, Star, Shield][index] || Palette,
        count: category.postCount ? `${category.postCount}+` : `${Math.floor(Math.random() * 3000) + 500}+`,
        bgImage: category.image || category.imageUrl || ["/DigitalArt.jpg", "/LogoDesign.jpg", "/CharacterDesign.jpg", "/GraphicDesign.jpg", "/LogoDesign.jpg", "/3DDesign.jpg"][index] || "/DigitalArt.jpg",
      }))
    }
    // Fallback to mock data
    return [
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
  }

  const categories = getCategoriesData()

  // Stats data - enhanced with real data
  const getStats = () => {
    const artistCount = artists?.length || 0
    const postCount = marketplacePosts?.length || 0
    
    return [
      { number: artistCount > 0 ? `${Math.max(artistCount * 10, 500)}+` : "50k+", label: "Creative Artists" },
      { number: postCount > 0 ? `${Math.max(postCount * 50, 1000)}+` : "100k+", label: "Projects Completed" },
      { number: "99%", label: "Client Satisfaction" },
      { number: "24/7", label: "Support" },
    ]
  }

  const stats = getStats()

  // Featured artists data - enhanced with real data
  const getFeaturedArtists = () => {
    if (artists && Array.isArray(artists) && artists.length > 0) {
      return artists.slice(0, 3).map((artist, index) => ({
        id: artist.id || artist.artistId || index + 1,
        name: artist.firstName && artist.lastName 
          ? `${artist.firstName} ${artist.lastName}` 
          : artist.firstName || artist.name || "Creative Artist",
        specialty: artist.specialty || artist.bio?.substring(0, 50) || "Creative Specialist",
        image: ["/DigitalArt.jpg", "/LogoDesign.jpg", "/CharacterDesign.jpg"][index] || "/DigitalArt.jpg",
        rating: artist.rating || (4.8 + Math.random() * 0.2), // Random rating if not available
        projects: artist.completedProjects || Math.floor(Math.random() * 200) + 50,
      }))
    }
    // Fallback to mock data
    return [
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
  }

  const featuredArtists = getFeaturedArtists()

  // Popular services data - enhanced with real data
  const getPopularServices = () => {
    if (servicePosts && servicePosts.length > 0) {
      return servicePosts.slice(0, 4).map((post, index) => ({
        name: post.title || (typeof post.category === 'string' ? post.category : post.category?.name) || "Creative Service",
        price: post.budget ? `Starting at $${post.budget}` : `Starting at $${[25, 50, 75, 35][index]}`,
        image: ["/LogoDesign.jpg", "/DigitalArt.jpg", "/CharacterDesign.jpg", "/GraphicDesign.jpg"][index] || "/DigitalArt.jpg",
        category: typeof post.category === 'string' 
          ? post.category 
          : (post.category?.name || null),
      }))
    }
    // Fallback to mock data
    return [
      { name: "Logo Design", price: "Starting at $25", image: "/LogoDesign.jpg" },
      { name: "Digital Art", price: "Starting at $50", image: "/DigitalArt.jpg" },
      { name: "Character Design", price: "Starting at $75", image: "/CharacterDesign.jpg" },
      { name: "Graphic Design", price: "Starting at $35", image: "/GraphicDesign.jpg" },
    ]
  }

  const popularServices = getPopularServices()

  const valueProps = [
    {
      icon: Palette,
      title: "Endless Creative Variety",
      description: "From minimalist designs to complex illustrations, discover diverse art styles and creative approaches from talented artists worldwide",
    },
    {
      icon: DollarSign,
      title: "Transparent, Standardized Pricing",
      description: "Fair, upfront pricing with no hidden fees. Know exactly what you'll pay before you start your project",
    },
    {
      icon: Shield,
      title: "Reliable & Trusted Platform",
      description: "Verified artists, secure payments, and quality guarantee. Built by artists, for artists and clients who value creativity",
    },
    {
      icon: Star,
      title: "Art-Focused Marketplace",
      description: "From one creative to another - we understand art. Every feature is designed with artistic vision and creative collaboration in mind",
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
    <>
      {/* SEO removed */}
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] relative">
        {/* Shared Navigation */}
        <SharedPublicNavbar showScrollLinks={true} />

        {/* Main Content with top padding for fixed navbar */}
        <main className="pt-20">

        {/* Hero Section */}
        <section ref={setHeroRef} className="relative py-12 sm:py-16 md:py-20 overflow-hidden" role="banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
                <div className="space-y-4 sm:space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
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

                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Connect with talented digital artists, designers, and creative professionals. Bring your vision to
                  life with world-class creative services.
                </p>
                <p className="text-sm sm:text-base text-yellow-500 max-w-lg mx-auto lg:mx-0">Reminder: We are still in testing / development, sorry in advance if something is broken or not working as expected. Mobiles responsiveness isn't perfect either, please be patient as we improve this experience.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
                <Button
                  size="lg"
                  className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold group transform hover:scale-105 transition-all duration-500 ease-out w-full sm:w-auto"
                  onClick={() => handleNavigation('/home')}
                >
                  Explore Talent
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
                </Button>
                <Link to="/about" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 !text-gray-900 bg-white hover:bg-gray-100 hover:border-[#A95BAB]/50 hover:!text-gray-900 rounded-lg px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold group transform hover:scale-105 transition-all duration-500 ease-out w-full"
                  >
                    <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5 !text-gray-900" />
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8 max-w-md sm:max-w-none mx-auto lg:mx-0">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-[#A95BAB] mb-1">{stat.number}</div>
                    <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Improved Masonry Grid */}
            <div className="relative mt-8 lg:mt-0">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-3 sm:space-y-4">
                  {artworks
                    .filter((_, index) => index % 2 === 0)
                    .map((artwork, index) => (
                      <Card
                        key={artwork.id}
                        className={`bg-white/5 border-white/10 hover:bg-white/10 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer ${artwork.height} transform hover:scale-105 transition-all duration-500 ease-out`}
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
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <h3 className="font-semibold text-xs sm:text-sm mb-1">{artwork.title}</h3>
                            <p className="text-xs text-gray-300">by {artwork.artist}</p>
                            <span className="inline-block mt-1 sm:mt-2 px-2 py-1 bg-[#A95BAB]/20 rounded-full text-xs">
                              {artwork.category}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
                <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8">
                  {artworks
                    .filter((_, index) => index % 2 === 1)
                    .map((artwork, index) => (
                      <Card
                        key={artwork.id}
                        className={`bg-white/5 border-white/10 hover:bg-white/10 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer ${artwork.height} transform hover:scale-105 transition-all duration-500 ease-out`}
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
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                            <h3 className="font-semibold text-xs sm:text-sm mb-1">{artwork.title}</h3>
                            <p className="text-xs text-gray-300">by {artwork.artist}</p>
                            <span className="inline-block mt-1 sm:mt-2 px-2 py-1 bg-[#A95BAB]/20 rounded-full text-xs">
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
                className="absolute top-1/2 -left-8 w-16 h-16 bg-white/10 rounded-full blur-lg"
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
                key={`service-${index}-${service.name}`}
                className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 rounded-2xl cursor-pointer group overflow-hidden relative transform hover:scale-105 transition-all duration-500 ease-out"
                onClick={() => handleNavigation(service.category ? `/marketplace?category=${encodeURIComponent(service.category)}` : '/marketplace')}
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
      <section id="categories" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Creative Categories</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Discover talented freelancers across various creative disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categoriesLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={`skeleton-${index}`}
                  className="bg-white/5 border-white/10 rounded-xl sm:rounded-2xl"
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-600/50 rounded-full mx-auto mb-3 sm:mb-4"></div>
                    <div className="h-3 sm:h-4 bg-gray-600/50 rounded mb-1 sm:mb-2"></div>
                    <div className="h-2 sm:h-3 bg-gray-600/50 rounded w-2/3 mx-auto"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              categories.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <Card
                    key={`category-${index}-${category.name}`}
                    className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 rounded-xl sm:rounded-2xl cursor-pointer group overflow-hidden relative transform hover:scale-105 transition-all duration-500 ease-out"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                    onClick={() => handleNavigation(`/marketplace?category=${encodeURIComponent(category.name)}`)}
                  >
                    {/* Background Image on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out">
                      <img
                        src={category.bgImage || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <CardContent className="p-4 sm:p-6 text-center relative z-10">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#A95BAB]/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#A95BAB]/30 transition-colors duration-500 ease-out">
                        <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-[#A95BAB]" />
                      </div>
                      <h3 className="font-semibold text-white mb-1 sm:mb-2 text-base sm:text-lg">{category.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-400">{category.count} freelancers</p>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Artists You May Like */}
      <section id="artists" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Artists You May Like</h2>
            <p className="text-lg sm:text-xl text-gray-300">Meet some of our top-rated creative professionals</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredArtists.map((artist) => (
              <Card
                key={artist.id}
                className="bg-white/5 border-white/10 hover:bg-white/10 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer relative transform hover:scale-105 transition-all duration-500 ease-out"
                onClick={() => handleNavigation(`/marketplace?artistId=${artist.id}`)}
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
                <CardContent className="p-4 sm:p-6 text-center relative z-10">
                  <h3 className="font-semibold text-white text-base sm:text-lg mb-1">{artist.name}</h3>
                  <p className="text-gray-300 mb-2 sm:mb-3 text-sm sm:text-base">{artist.specialty}</p>
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-xs sm:text-sm">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-white">{typeof artist.rating === 'number' ? artist.rating.toFixed(1) : artist.rating}</span>
                    </div>
                    <div className="text-gray-400">{artist.projects} projects</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose PhsarDesign?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From one creative to another - we understand what matters in the world of art and design
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => {
              const IconComponent = prop.icon
              return (
                <Card
                  key={index}
                  className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 rounded-2xl cursor-pointer group overflow-hidden relative transform hover:scale-105 transition-all duration-500 ease-out"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <CardContent className="p-6 sm:p-8 text-center relative z-10">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#A95BAB]/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-[#A95BAB]/30 transition-colors duration-500 ease-out">
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-[#A95BAB]" />
                    </div>
                    <h3 className="font-semibold text-white mb-2 sm:mb-3 text-base sm:text-lg">{prop.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{prop.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Simple, secure, and straightforward - get your projects done in four easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Search,
                number: "01",
                title: "Browse & Discover",
                description: "Explore diverse portfolios and find the perfect artist for your creative vision",
                color: "from-yellow-400 to-orange-500",
                bgGlow: "bg-yellow-400/10"
              },
              {
                icon: MessageSquare,
                number: "02", 
                title: "Connect & Collaborate",
                description: "Share your ideas and work together to bring your project to life with talented artists",
                color: "from-blue-400 to-purple-500",
                bgGlow: "bg-blue-400/10"
              },
              {
                icon: Shield,
                number: "03",
                title: "Secure Payment",
                description: "Pay safely with escrow protection and milestone-based payments",
                color: "from-green-400 to-emerald-500",
                bgGlow: "bg-green-400/10"
              },
              {
                icon: Star,
                number: "04",
                title: "Create & Deliver",
                description: "Watch your vision come to life with regular updates and final delivery",
                color: "from-purple-400 to-pink-500", 
                bgGlow: "bg-purple-400/10"
              }
            ].map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={index} className="relative text-center group">
                  <Card className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 relative z-10 transform hover:scale-105 sm:hover:scale-110 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-700 ease-out overflow-hidden group-hover:shadow-2xl group-hover:shadow-[#A95BAB]/20"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                    {/* Background glow effect */}
                    <div className={`absolute inset-0 ${step.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out`}></div>
                    
                    <CardContent className="p-0 relative z-10">
                      {/* Icon with gradient background */}
                      <div className="relative mb-4 sm:mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto relative overflow-hidden group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500">
                          <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-full`}></div>
                          <div className="absolute inset-0 bg-[#A95BAB]/20 group-hover:bg-[#A95BAB]/30 transition-colors duration-500 rounded-full"></div>
                          <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-[#A95BAB] relative z-10 group-hover:text-white transition-colors duration-500" />
                        </div>
                      </div>
                      
                      {/* Step number - large and stylized */}
                      <div className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500`}>
                        {step.number}
                      </div>
                      
                      <h3 className="font-bold text-white text-lg sm:text-xl mb-3 sm:mb-4 group-hover:text-[#A95BAB] transition-colors duration-500">
                        {step.title}
                      </h3>
                      
                      <p className="text-gray-400 leading-relaxed text-xs sm:text-sm group-hover:text-gray-300 transition-colors duration-500">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
          
          {/* Creative bottom section */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex items-center space-x-3 sm:space-x-4 bg-white/5 rounded-full px-6 sm:px-8 py-3 sm:py-4 border border-white/10 group hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105">
              <div className="flex space-x-1.5 sm:space-x-2 relative">
                {/* Yellow circle - Wave sequence start */}
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-smooth-wave-jump cursor-pointer transform hover:scale-150 transition-transform duration-300" 
                     style={{ animationDelay: '0s' }}></div>
                
                {/* Blue circle - Wave sequence */}
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-smooth-wave-jump cursor-pointer transform hover:scale-150 transition-transform duration-300" 
                     style={{ animationDelay: '0.15s' }}></div>
                
                {/* Green circle - Wave sequence */}
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-smooth-wave-jump cursor-pointer transform hover:scale-150 transition-transform duration-300" 
                     style={{ animationDelay: '0.3s' }}></div>
                
                {/* Purple circle - Wave sequence end */}
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-smooth-wave-jump cursor-pointer transform hover:scale-150 transition-transform duration-300" 
                     style={{ animationDelay: '0.45s' }}></div>
              </div>
              <span className="text-gray-300 font-medium group-hover:text-white transition-colors duration-500 text-sm sm:text-base">Your creative journey starts here</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to Start Your Creative Journey?</h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
            Join thousands of satisfied clients who found their perfect creative partner
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-xs sm:max-w-md mx-auto">
            
            <Button 
              className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg px-6 sm:px-8 py-3 sm:py-4 w-full whitespace-nowrap transform hover:scale-105 transition-all duration-500 ease-out text-sm sm:text-base font-medium"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Shared Footer */}
      <SharedPublicFooter />
      </main>
      </div>
    </>
  )
}
