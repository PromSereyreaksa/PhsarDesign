"use client"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Bell, User, Settings, LayoutDashboard, LogOut, ChevronRight, Plus, Search, Users, Briefcase } from "lucide-react"
import { logout } from "../../../store/slices/authSlice"

export default function AuthNavbar() {
  const [isHovered, setIsHovered] = useState({})
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [hoverTimeouts, setHoverTimeouts] = useState({})
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get authentication state
  const { user } = useSelector((state) => state.auth)

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

  const handleDropdownHover = (item, isHovering) => {
    // Clear any existing timeout for this item
    if (hoverTimeouts[item]) {
      clearTimeout(hoverTimeouts[item])
      setHoverTimeouts(prev => {
        const newTimeouts = { ...prev }
        delete newTimeouts[item]
        return newTimeouts
      })
    }

    if (isHovering) {
      // Show immediately
      setIsHovered(prev => ({
        ...prev,
        [item]: true
      }))
    } else {
      // Hide after a short delay to prevent flicker
      const closeTimeoutId = setTimeout(() => {
        setIsHovered(prev => ({
          ...prev,
          [item]: false
        }))
        setHoverTimeouts(prev => {
          const newTimeouts = { ...prev }
          delete newTimeouts[item]
          return newTimeouts
        })
      }, 150) // 150ms delay to prevent flicker
      
      setHoverTimeouts(prev => ({
        ...prev,
        [item]: closeTimeoutId
      }))
    }
  }

  // Profile menu items
  const profileMenuItems = [
    { label: 'Profile', icon: User, href: '/profile' },
    { label: 'Settings', icon: Settings, href: '/settings' },
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  ]

  // Dropdown menu data
  const findTalentsItems = [
    { title: "Post a Recruitment", icon: Plus, href: "/marketplace/create" },
    { title: "Browse Available Artists", icon: Users, href: "/marketplace" },
  ]

  const findWorksItems = [
    { title: "Post Works", icon: Briefcase, href: "/marketplace/create" },
    { title: "Browse Available Works", icon: Search, href: "/marketplace" },
  ]

  // Handle profile menu item click
  const handleProfileMenuClick = (href) => {
    setIsProfileDropdownOpen(false)
    navigate(href)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  // Handle logout
  const handleLogout = () => {
    dispatch(logout())
    setIsProfileDropdownOpen(false)
    navigate('/login')
  }

  
const DropdownItem = ({ text, items = [], isMobile = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasDropdown = items && items.length > 0;
  
  const handleMouseEnter = () => {
    if (hasDropdown) {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (hasDropdown) {
      setIsHovered(false);
    }
  };

  const handleDropdownItemClick = (href) => {
    if (href) {
      navigate(href);
      setIsHovered(false);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Nav Item */}
      <div className={`cursor-pointer transition-all duration-300 px-${isMobile ? "2" : "4"} py-2`}>
        <div className="flex items-center space-x-1">
          <span
            className={`text-white hover:text-[#A95BAB] transition-colors duration-300 font-medium ${
              isMobile ? "text-sm" : "text-base"
            }`}
          >
            {text}
          </span>
          {hasDropdown && (
            <ChevronRight
              className={`w-4 h-4 text-white transition-transform duration-300 ${
                isHovered ? "rotate-90" : "rotate-0"
              }`}
            />
          )}
        </div>
      </div>
      
      {/* Dropdown Menu */}
      {hasDropdown && isHovered && (
        <div className="absolute top-full left-0 w-72 bg-[#202020] border border-gray-700 rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="p-2">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => handleDropdownItemClick(item.href)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-white" />
                  <span className="text-white font-medium whitespace-nowrap">{item.title}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#202020]/98 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with gradient text */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              PhsarDesign
            </h1>
          </div>

          {/* Navigation links - visible on all screen sizes */}
          <div className="flex items-center justify-center flex-1">
            <div className="flex items-center space-x-6 md:space-x-8">
              <DropdownItem text="Find Talents" items={findTalentsItems} />
              <DropdownItem text="Find Works" items={findWorksItems} />
              <DropdownItem text="Community" />
            </div>
          </div>

          {/* Right section - Notifications and Profile */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out">
              <Bell />
            </button>
            
            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 bg-[#A95BAB] rounded-full flex items-center justify-center">
                  {user?.avatarURL ? (
                    <img
                      src={user.avatarURL}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {getUserInitials()}
                    </span>
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
          </div>
        </div>
      </div>
    </nav>
  )

}
