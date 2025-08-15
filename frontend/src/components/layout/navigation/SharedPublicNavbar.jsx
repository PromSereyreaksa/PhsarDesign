"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Menu, X, User, Settings, LayoutDashboard, LogOut, ChevronRight } from "lucide-react"
import { Button } from "../../ui/button"
import { logout } from "../../../store/slices/authSlice"

export default function SharedPublicNavbar({ 
  showScrollLinks = true, 
  customLinks = [],
  className = ""
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const dropdownRef = useRef(null)

  // Get authentication state
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U'
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U'
  }

  // Handle About navigation - always go to /about page and scroll to top
  const handleAboutClick = () => {
    // Always navigate to about page
    navigate('/about')
    // Scroll to top immediately
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
    setIsMenuOpen(false)
  }

  // Handle navigation with scroll to top for other links
  const handleNavigation = (href) => {
    navigate(href)
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
    setIsMenuOpen(false)
  }

  // Profile menu items
  const profileMenuItems = [
    { label: 'Profile', icon: User, href: '/profile' },
    { label: 'Settings', icon: Settings, href: '/settings' },
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  ]

  // Handle profile menu item click
  const handleProfileMenuClick = (href) => {
    setIsProfileDropdownOpen(false)
    handleNavigation(href)
  }

  // Handle logout
  const handleLogout = () => {
    // Dispatch logout action
    dispatch(logout())
    setIsProfileDropdownOpen(false)
    // Navigate to login page
    navigate('/login')
  }

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
    setIsMenuOpen(false)
  }

  // Default navigation links for landing page
  const defaultScrollLinks = [
    { label: "Services", target: "services" },
    { label: "Categories", target: "categories" },
    { label: "Artists", target: "artists" }
  ]

  // Navigation links based on page context
  const getNavigationLinks = () => {
    if (customLinks.length > 0) {
      return customLinks
    }
    
    if (location.pathname === "/" && showScrollLinks) {
      return defaultScrollLinks
    }
    
    return []
  }

  const navigationLinks = getNavigationLinks()

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-[#202020]/98 backdrop-blur-sm shadow-lg ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              PhsarDesign
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link, index) => (
              link.target ? (
                <button
                  key={index}
                  onClick={() => smoothScroll(link.target)}
                  className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
                >
                  {link.label}
                </button>
              ) : (
                <button
                  key={index}
                  onClick={() => handleNavigation(link.href)}
                  className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
                >
                  {link.label}
                </button>
              )
            ))}
            
            {/* Always show About link with smart navigation */}
            <button
              onClick={handleAboutClick}
              className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
            >
              About
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              // User Profile Dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                >
                  {/* User Avatar */}
                  <div className="w-8 h-8 bg-[#A95BAB] rounded-full flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.firstName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                  <span className="text-white hidden sm:block">
                    {user?.firstName || 'User'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#202020] border border-gray-700 rounded-lg shadow-lg z-50">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        {/* Profile Picture */}
                        <div className="w-10 h-10 bg-[#A95BAB] rounded-full flex items-center justify-center">
                          {user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.firstName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-sm font-bold">
                              {getUserInitials()}
                            </span>
                          )}
                        </div>
                        {/* User Name */}
                        <div>
                          <p className="text-white font-bold">
                            {user?.firstName && user?.lastName 
                              ? `${user.firstName} ${user.lastName}` 
                              : user?.email || 'User'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {profileMenuItems.map((item, index) => {
                        const IconComponent = item.icon
                        return (
                          <button
                            key={index}
                            onClick={() => handleProfileMenuClick(item.href)}
                            className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <IconComponent size={16} className="text-gray-400" />
                              <span>{item.label}</span>
                            </div>
                            <ChevronRight size={14} className="text-gray-400" />
                          </button>
                        )
                      })}
                      
                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <LogOut size={16} className="text-gray-400" />
                          <span>Log out</span>
                        </div>
                        <ChevronRight size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Login/Register Buttons for non-authenticated users
              <>
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
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#A95BAB] transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#202020]/95 backdrop-blur-sm rounded-lg mt-2">
              {navigationLinks.map((link, index) => (
                link.target ? (
                  <button
                    key={index}
                    onClick={() => smoothScroll(link.target)}
                    className="block px-3 py-2 text-white hover:text-[#A95BAB] transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                ) : (
                  <button
                    key={index}
                    onClick={() => handleNavigation(link.href)}
                    className="block px-3 py-2 text-white hover:text-[#A95BAB] transition-colors duration-300"
                  >
                    {link.label}
                  </button>
                )
              ))}
              
              <button
                onClick={handleAboutClick}
                className="block px-3 py-2 text-white hover:text-[#A95BAB] transition-colors duration-300"
              >
                About
              </button>
              
              <div className="pt-4 space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:text-[#A95BAB] hover:bg-white/10 rounded-lg"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
