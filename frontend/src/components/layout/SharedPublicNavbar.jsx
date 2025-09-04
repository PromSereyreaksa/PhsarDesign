"use client"

import { ChevronRight, LayoutDashboard, LogOut, Menu, Settings, User, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { logout } from "../../store/slices/authSlice"
import { Button } from "../ui/button"

export default function SharedPublicNavbar({ showScrollLinks = true, customLinks = [], className = "" }) {
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

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U"
    const firstName = user.firstName || ""
    const lastName = user.lastName || ""
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || "U"
  }

  // Handle About navigation - always go to /about page and scroll to top
  const handleAboutClick = () => {
    // Always navigate to about page
    navigate("/about")
    // Scroll to top immediately
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
    setIsMenuOpen(false)
  }

  // Handle navigation with scroll to top for other links
  const handleNavigation = (href) => {
    navigate(href)
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
    setIsMenuOpen(false)
  }

  // Profile menu items
  const profileMenuItems = [
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
    // Only show Dashboard for artists, not clients
    ...(user?.role === "artist" || user?.role === "freelancer"
      ? [{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" }]
      : []),
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
    navigate("/login")
  }

  const smoothScroll = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
      const navbarHeight = 80 // Fixed navbar height (h-20 = 80px)
      const elementPosition = element.offsetTop - navbarHeight - 20 // Additional spacing
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
    setIsMenuOpen(false)
  }

  // Default navigation links for landing page
  const defaultScrollLinks = [
    { label: "Services", target: "services" },
    { label: "Categories", target: "categories" },
    { label: "Artists", target: "artists" },
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
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent"
            >
              PhsarDesign
            </Link>
          </div>

          {/* Desktop Navigation - Show on larger screens */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigationLinks.map((link, index) =>
              link.target ? (
                <button
                  key={index}
                  onClick={() => smoothScroll(link.target)}
                  className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer whitespace-nowrap"
                >
                  {link.label}
                </button>
              ) : (
                <button
                  key={index}
                  onClick={() => handleNavigation(link.href)}
                  className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer whitespace-nowrap"
                >
                  {link.label}
                </button>
              ),
            )}

            {/* Always show About link with smart navigation */}
            <button
              onClick={handleAboutClick}
              className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer whitespace-nowrap"
            >
              About
            </button>
          </div>

          {/* Desktop Right Side - Profile and Auth */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {isAuthenticated ? (
              // User Profile Dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 xl:space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                >
                  {/* Username first */}
                  <span className="text-white font-medium text-sm xl:text-base">{user?.firstName || "User"}</span>
                  {/* User Avatar - Always circular */}
                  <div className="w-8 h-8 bg-[#A95BAB] profile-avatar-container">
                    {user?.avatarURL ? (
                      <img
                        src={user.avatarURL || "/placeholder.svg"}
                        alt={user.firstName}
                        className="profile-avatar"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">{getUserInitials()}</span>
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#202020] border border-gray-700 rounded-lg shadow-lg z-50">
                    {/* User Info Section */}
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        {/* Profile Picture */}
                        <div className="w-10 h-10 bg-[#A95BAB] profile-avatar-container">
                          {user?.avatarURL ? (
                            <img
                              src={user.avatarURL || "/placeholder.svg"}
                              alt={user.firstName}
                              className="profile-avatar"
                            />
                          ) : (
                            <span className="text-white text-sm font-bold">{getUserInitials()}</span>
                          )}
                        </div>
                        {/* User Name */}
                        <div>
                          <p className="text-white font-bold">
                            {user?.firstName && user?.lastName
                              ? `${user.firstName} ${user.lastName}`
                              : user?.email || "User"}
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
                    className="text-white hover:text-[#A95BAB] hover:bg-white/10 rounded-lg px-4 xl:px-6 transform hover:scale-105 transition-all duration-500 ease-out text-sm xl:text-base"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg px-4 xl:px-6 transform hover:scale-105 transition-all duration-500 ease-out text-sm xl:text-base">
                    Join Us
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Side - Profile and Menu - Show on smaller screens */}
          <div className="flex lg:hidden items-center space-x-2 sm:space-x-3">
            {isAuthenticated ? (
              // Authenticated user: show profile and menu
              <>
                {/* Profile with username on left, picture on right */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-white text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-none">{user?.firstName || "User"}</span>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#A95BAB] profile-avatar-container">
                    {user?.avatarURL ? (
                      <img
                        src={user.avatarURL || "/placeholder.svg"}
                        alt={user.firstName}
                        className="profile-avatar"
                      />
                    ) : (
                      <span className="text-white text-xs font-bold">{getUserInitials()}</span>
                    )}
                  </div>
                </div>
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white hover:text-[#A95BAB] transition-colors duration-300 p-1"
                >
                  {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
                </button>
              </>
            ) : (
              // Non-authenticated user: show login/register and menu
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-[#A95BAB] hover:bg-white/10 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm"
                  >
                    Sign In
                  </Button>
                </Link>
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white hover:text-[#A95BAB] transition-colors duration-300 p-1"
                >
                  {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu - Show on smaller screens */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-[#202020]/95 backdrop-blur-sm rounded-lg mt-2">
              {/* Navigation Links */}
              {navigationLinks.map((link, index) =>
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
                ),
              )}

              <button
                onClick={handleAboutClick}
                className="block px-3 py-2 text-white hover:text-[#A95BAB] transition-colors duration-300"
              >
                About
              </button>

              {/* Profile section for authenticated users */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-700/50">
                  {/* Profile header */}
                  <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                    <span className="text-white text-sm font-medium">{user?.firstName || "User"}</span>
                    <div className="w-8 h-8 bg-[#A95BAB] profile-avatar-container">
                      {user?.avatarURL ? (
                        <img
                          src={user.avatarURL || "/placeholder.svg"}
                          alt={user.firstName}
                          className="profile-avatar"
                        />
                      ) : (
                        <span className="text-white text-xs font-bold">{getUserInitials()}</span>
                      )}
                    </div>
                  </div>

                  {/* Profile menu items */}
                  {profileMenuItems.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          handleProfileMenuClick(item.href)
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center space-x-3 w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300"
                      >
                        <IconComponent size={16} className="text-gray-400" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    )
                  })}

                  {/* Logout button */}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 w-full text-left px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-300 mt-2"
                  >
                    <LogOut size={16} className="text-gray-400" />
                    <span className="text-sm">Log out</span>
                  </button>
                </div>
              ) : (
                /* Auth buttons for non-authenticated users */
                <div className="pt-4 space-y-2">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg">Join Us</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
