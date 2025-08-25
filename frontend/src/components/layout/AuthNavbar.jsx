"use client"

import {
  Bell, Briefcase, ChevronRight, LayoutDashboard, LogOut,
  Plus, Search, Settings, User, Users
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { logout } from "../../store/slices/authSlice"

// Import from the correct slice - matching MarketplacePage
import { setFilters } from "../../store/slices/marketplaceSlice"
import {
  fetchAvailabilityPosts,
  fetchJobPosts,
  setActiveTab,
} from "../../store/slices/postsSlice"

export default function AuthNavbar() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // Pull what we need from store - matching MarketplacePage structure
  const { user } = useSelector((s) => s.auth)
  const { filters } = useSelector((s) => s.marketplace)  // filters from marketplace slice
  const activeTab = useSelector((s) => s.posts?.activeTab) // activeTab from posts slice

  // Which parent menu is visually active
  const [activeMenu, setActiveMenu] = useState(null) // "home" | "talents" | "works" | "community" | null

  // keep menu highlight in sync with Redux activeTab and current location
  useEffect(() => {
    if (location.pathname === "/home") setActiveMenu("home")
    else if (activeTab === "availability") setActiveMenu("talents")
    else if (activeTab === "jobs") setActiveMenu("works")
    else setActiveMenu(null)
  }, [activeTab, location.pathname])

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Helpers
  const getUserInitials = () => {
    if (!user) return "U"
    const first = user.firstName || ""
    const last = user.lastName || ""
    return (first.charAt(0) + last.charAt(0)).toUpperCase() || "U"
  }

  // --- Core: Tab switching function matching MarketplacePage approach
  const handleTabSwitch = (tabType, targetPath = "/marketplace") => {
    console.log(`Navbar: Switching to ${tabType} tab, navigating to ${targetPath}`)
    
    // 1. Set the active tab in Redux
    dispatch(setActiveTab(tabType))
    
    // 2. Update filters based on tab type (matching MarketplacePage logic)
    const newFilters = { ...filters }
    if (tabType === "availability") newFilters.section = "services"
    if (tabType === "jobs") newFilters.section = "jobs"
    dispatch(setFilters(newFilters))
    
    // 3. Navigate to target path with type parameter
    const params = new URLSearchParams()
    params.set("type", tabType)
    
    // Preserve existing category filter if we're on marketplace
    if (location.pathname === "/marketplace" && filters.category) {
      params.set("category", filters.category)
    }
    
    const finalUrl = `${targetPath}?${params.toString()}`
    console.log('Navbar: Navigating to:', finalUrl)
    navigate(finalUrl, { replace: targetPath === location.pathname })
    
    // 4. Fetch appropriate posts (matching MarketplacePage)
    if (tabType === "availability") {
      dispatch(fetchAvailabilityPosts(newFilters))
    } else if (tabType === "jobs") {
      dispatch(fetchJobPosts(newFilters))
    }
  }

  // Profile menu items
  const profileMenuItems = [
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  ]

  // Dropdown menu data (each has tabType + href)
  const findTalentsItems = [
    { 
      title: "Post a Recruitment", 
      icon: Plus, 
      tabType: "jobs", 
      href: "/marketplace/create",
      action: () => {
        // For create pages, just navigate without tab switching
        navigate("/marketplace/create?type=jobs")
      }
    },
    { 
      title: "Browse Available Artists", 
      icon: Users, 
      tabType: "availability", 
      href: "/marketplace",
      action: () => handleTabSwitch("availability", "/marketplace")
    },
  ]
  
  const findWorksItems = [
    { 
      title: "Post your services", 
      icon: Briefcase, 
      tabType: "availability", 
      href: "/marketplace/create",
      action: () => {
        // For create pages, just navigate without tab switching
        navigate("/marketplace/create?type=availability")
      }
    },
    { 
      title: "Browse Available Works", 
      icon: Search, 
      tabType: "jobs", 
      href: "/marketplace",
      action: () => handleTabSwitch("jobs", "/marketplace")
    },
  ]

  const handleProfileMenuClick = (href) => {
    setIsProfileDropdownOpen(false)
    navigate(href)
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100)
  }

  const handleLogout = () => {
    dispatch(logout())
    setIsProfileDropdownOpen(false)
    navigate("/login")
  }

  // Reusable dropdown (parent clickable + children clickable)
  const DropdownItem = ({ text, items = [], isActive, onParentClick }) => {
    const [open, setOpen] = useState(false)
    const hasDropdown = items.length > 0

    return (
      <div
        className="relative"
        onMouseEnter={() => hasDropdown && setOpen(true)}
        onMouseLeave={() => hasDropdown && setOpen(false)}
      >
        {/* Parent label */}
        <button
          type="button"
          onClick={onParentClick}
          className="cursor-pointer transition-all duration-300 px-4 py-2"
        >
          <div className="flex items-center space-x-1">
            <span className={`font-medium text-base transition-colors duration-300 ${isActive ? "text-[#A95BAB]" : "text-white hover:text-[#A95BAB]"}`}>
              {text}
            </span>
            {hasDropdown && (
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"} ${isActive ? "text-[#A95BAB]" : "text-white"}`}
              />
            )}
          </div>
        </button>

        {/* Dropdown panel */}
        {hasDropdown && open && (
          <div className="absolute top-full left-0 w-72 bg-[#202020] border border-gray-700 rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-150">
            <div className="p-2">
              {items.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    console.log('Navbar: Menu item clicked:', item.title)
                    // Use the custom action for each item
                    item.action()
                    setOpen(false)
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-white" />
                    <span className="text-white font-medium whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#202020]/98 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              PhsarDesign
            </h1>
          </div>

          {/* Center nav */}
          <div className="flex items-center justify-center flex-1">
            <div className="flex items-center space-x-6 md:space-x-8">
              {/* Home */}
              <DropdownItem
                text="Home"
                items={[]}
                isActive={activeMenu === "home"}
                onParentClick={() => {
                  setActiveMenu("home")
                  navigate("/home")
                }}
              />
              {/* Clicking parent sets default tab + navigates */}
              <DropdownItem
                text="Find Talents"
                items={findTalentsItems}
                isActive={activeMenu === "talents"}
                onParentClick={() => {
                  setActiveMenu("talents")
                  handleTabSwitch("availability", "/marketplace") // default of this menu
                }}
              />
              <DropdownItem
                text="Find Works"
                items={findWorksItems}
                isActive={activeMenu === "works"}
                onParentClick={() => {
                  setActiveMenu("works")
                  handleTabSwitch("jobs", "/marketplace") // default of this menu
                }}
              />
              <DropdownItem
                text="Community"
                items={[]}
                isActive={activeMenu === "community"}
                onParentClick={() => {
                  setActiveMenu("community")
                  navigate("/community")
                }}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out">
              <Bell />
            </button>

            {/* Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-8 h-8 bg-[#A95BAB] rounded-full flex items-center justify-center">
                  {user?.avatarURL ? (
                    <img
                      src={user.avatarURL}
                      alt={user.firstName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">{getUserInitials()}</span>
                  )}
                </div>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#202020] border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#A95BAB] rounded-full flex items-center justify-center">
                        {user?.avatarURL ? (
                          <img
                            src={user.avatarURL}
                            alt={user.firstName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-bold">{getUserInitials()}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold">
                          {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.email || "User"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    {profileMenuItems.map((item, i) => {
                      const IconComponent = item.icon
                      return (
                        <button
                          key={i}
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