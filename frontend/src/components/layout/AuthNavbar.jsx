"use client"

import {
    Bell,
    ChevronRight,
    FileText,
    FolderKanban,
    LayoutDashboard,
    LogOut,
    Menu,
    Settings,
    User,
    X,
} from "lucide-react"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { useNotifications } from "../../hooks/useNotifications"
import { fetchIncomingApplications } from "../../store/slices/applicationsSlice"
import { logout } from "../../store/slices/authSlice"
import { markAllAsRead, markAsRead } from "../../store/slices/notificationsSlice"

// Import from the correct slice - matching MarketplacePage
import { setFilters } from "../../store/slices/marketplaceSlice"
import { fetchAvailabilityPosts, fetchJobPosts, setActiveTab } from "../../store/slices/postsSlice"

// Memoized notification badge component to prevent flashing
const NotificationBadge = React.memo(({ unreadCount, isNewNotification }) => {
  console.log('[NotificationBadge] Received props:', { unreadCount, isNewNotification, type: typeof unreadCount });
  
  // Safety check for unreadCount
  const safeUnreadCount = unreadCount ?? 0;
  console.log('[NotificationBadge] Safe unreadCount:', safeUnreadCount);
  
  if (safeUnreadCount <= 0) {
    console.log('[NotificationBadge] No unread notifications, returning null');
    return null;
  }

  return (
    <span 
      className={`absolute -top-1 -right-1 h-4 w-4 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center ${
        isNewNotification ? '' : ''
      }`}
    >
      {safeUnreadCount.toString()}
    </span>
  );
});

// Application badge for pending applications count
const ApplicationBadge = React.memo(({ pendingCount }) => {
  const safePendingCount = pendingCount ?? 0;
  
  if (safePendingCount <= 0) {
    return null;
  }

  return (
    <span className="absolute -top-1 -right-1 h-4 w-4 text-xs font-bold text-white bg-[#A95BAB] rounded-full flex items-center justify-center">
      {safePendingCount.toString()}
    </span>
  );
});

// Memoized notification item to prevent unnecessary re-renders
const NotificationItem = ({ notification, onNotificationClick, onMarkAsRead }) => {
  const handleClick = useCallback(() => {
    onNotificationClick(notification)
  }, [notification, onNotificationClick])

  const handleMarkAsRead = useCallback((e) => {
    e.stopPropagation()
    console.log('[NotificationItem] Marking as read, notification object:', notification)
    console.log('[NotificationItem] Notification ID:', notification?.id || notification?.notificationId || notification?.notification_id)
    const notificationId = notification?.id || notification?.notificationId || notification?.notification_id
    if (notificationId) {
      onMarkAsRead(notificationId)
    } else {
      console.error('[NotificationItem] No valid notification ID found in:', notification)
    }
  }, [notification, onMarkAsRead])

  return (
    <div
      key={notification.id}
      className={`p-4 border-b border-gray-700/50 last:border-b-0 ${
        !notification.isRead ? 'bg-[#A95BAB]/10' : ''
      }`}
    >
      <div className="flex justify-between items-start gap-3">
        <div 
          className="flex-1 cursor-pointer"
          onClick={handleClick}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`text-sm ${!notification.isRead ? 'font-semibold text-white' : 'text-gray-300'}`}>
                {notification.title}
              </p>
              <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                {notification.message}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(notification.createdAt).toLocaleDateString()}
              </p>
            </div>
            {!notification.isRead && (
              <span className="w-2 h-2 bg-[#A95BAB] rounded-full ml-2 mt-1 flex-shrink-0"></span>
            )}
          </div>
        </div>
        
        {/* Mark as read button */}
        {!notification.isRead && (
          <button
            onClick={handleMarkAsRead}
            className="text-xs text-[#A95BAB] hover:text-white transition-colors px-2 py-1 rounded border border-[#A95BAB]/30 hover:border-[#A95BAB]/60"
          >
            Mark read
          </button>
        )}
      </div>
    </div>
  )
}

export default function AuthNavbar() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const desktopProfileDropdownRef = useRef(null)
  const mobileProfileDropdownRef = useRef(null)
  const notificationDropdownRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // Pull what we need from store - matching MarketplacePage structure
  const { user } = useSelector((s) => s.auth)
  const { filters } = useSelector((s) => s.marketplace) // filters from marketplace slice
  const activeTab = useSelector((s) => s.posts?.activeTab) // activeTab from posts slice
  
  // Get applications for the mailbox badge
  const { incoming } = useSelector((s) => s.applications)

  // Notification system with stable reference
  const { notifications, unreadCount: rawUnreadCount, loading } = useNotifications()
  
  // Calculate pending applications count
  const pendingApplicationsCount = useMemo(() => {
    if (!Array.isArray(incoming)) return 0
    return incoming.filter(app => app.status === 'pending').length
  }, [incoming])
  
  // Ensure unreadCount is always a valid number
  const unreadCount = useMemo(() => {
    const safeCount = typeof rawUnreadCount === 'number' ? rawUnreadCount : 0;
    console.log('[AuthNavbar] UnreadCount calculation:', { 
      rawUnreadCount, 
      type: typeof rawUnreadCount, 
      safeCount,
      notificationsLength: notifications?.length 
    });
    return safeCount;
  }, [rawUnreadCount, notifications?.length])
  
  // Memoize handlers to prevent unnecessary re-renders
  const handleNotificationClick = useCallback((notification) => {
    console.log('[AuthNavbar] Notification clicked:', notification)
    const notificationId = notification?.id || notification?.notificationId || notification?.notification_id
    
    if (!notification.isRead && notificationId) {
      dispatch(markAsRead(notificationId))
    }
    
    // Navigate to relevant page based on notification type
    switch (notification.type) {
      case 'application_received':
      case 'application_accepted':
      case 'application_rejected':
      case 'application':
        navigate('/dashboard/applications')
        break
      case 'project_created':
        navigate('/dashboard/projects')
        break
      case 'message_received':
        navigate('/dashboard/messages')
        break
      default:
        // For other notifications, go to notifications page
        navigate('/dashboard/notifications')
        break
    }
    setIsNotificationDropdownOpen(false)
  }, [dispatch, navigate])

  const handleMarkAllAsRead = useCallback(() => {
    dispatch(markAllAsRead())
  }, [dispatch])

  const handleMarkAsRead = useCallback((notificationId) => {
    dispatch(markAsRead(notificationId))
  }, [dispatch])

  // Which parent menu is visually active
  const [activeMenu, setActiveMenu] = useState(null) // "home" | "talents" | "works" | "community" | null

  // keep menu highlight in sync with Redux activeTab and current location
  useEffect(() => {
    if (location.pathname === "/home") {
      setActiveMenu("home")
    } else if (location.pathname === "/community") {
      setActiveMenu("community")
    } else if (location.pathname.startsWith("/marketplace")) {
      // For marketplace, check the active tab
      if (activeTab === "availability" || activeTab === "services") {
        setActiveMenu("talents")
      } else if (activeTab === "jobs") {
        setActiveMenu("works")
      } else {
        setActiveMenu(null)
      }
    } else {
      setActiveMenu(null)
    }
  }, [activeTab, location.pathname])

  // Fetch applications periodically for badge count
  useEffect(() => {
    const fetchAppsForBadge = () => {
      dispatch(fetchIncomingApplications())
    }

    fetchAppsForBadge() // Initial fetch
    const interval = setInterval(fetchAppsForBadge, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [dispatch])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Check desktop profile dropdown
      if (desktopProfileDropdownRef.current && !desktopProfileDropdownRef.current.contains(event.target) &&
          mobileProfileDropdownRef.current && !mobileProfileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
      // Check notification dropdown
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setIsNotificationDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

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
    console.log("Navbar: Navigating to:", finalUrl)
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
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Projects", icon: FolderKanban, href: "/projects" },
    { label: "Applications", icon: FileText, href: "/dashboard/applications" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ]

  // Navigation items
  const navigationItems = [
    { text: "Home", path: "/home", key: "home" },
    { text: "Find Talents", path: "/marketplace", key: "talents", tabType: "services" },
    { text: "Find Works", path: "/marketplace", key: "works", tabType: "jobs" },
    { text: "Community", path: "/community", key: "community" },
  ]

  const handleProfileMenuClick = (href) => {
    setIsProfileDropdownOpen(false)
    
    // Handle settings with maintenance message
    if (href === '/settings') {
      alert('Settings page is under maintenance. Please check back later!')
      return
    }
    
    navigate(href)
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100)
  }

  const handleLogout = () => {
    dispatch(logout())
    setIsProfileDropdownOpen(false)
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#202020]/98 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate("/home")}
              className="cursor-pointer"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
                PhsarDesign
              </h1>
            </button>
          </div>

          {/* Center nav - Desktop */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-6 md:space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveMenu(item.key)
                    if (item.tabType) {
                      handleTabSwitch(item.tabType, item.path)
                    } else {
                      navigate(item.path)
                    }
                  }}
                  className={`text-base font-medium transition-colors duration-300 hover:text-[#A95BAB] ${
                    activeMenu === item.key 
                      ? "text-[#A95BAB]" 
                      : "text-white"
                  }`}
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Applications Mailbox */}
            <div className="relative">
              <button
                onClick={() => navigate('/dashboard/applications')}
                className="relative p-2 text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out"
                title="View Applications"
              >
                <FileText className="h-6 w-6" />
                <ApplicationBadge pendingCount={pendingApplicationsCount} />
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notificationDropdownRef}>
              <button
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className="relative p-2 text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out"
              >
                <Bell className="h-6 w-6" />
                <NotificationBadge unreadCount={unreadCount} />
              </button>

              {/* Notification Dropdown */}
              {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#202020] border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-[#A95BAB] hover:text-white transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-400">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-700">
                        {notifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onNotificationClick={handleNotificationClick}
                            onMarkAsRead={handleMarkAsRead}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-700">
                    <button
                      onClick={() => {
                        navigate('/dashboard/notifications')
                        setIsNotificationDropdownOpen(false)
                      }}
                      className="w-full text-center text-sm text-[#A95BAB] hover:text-white py-2 transition-colors"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={desktopProfileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-8 h-8 bg-[#A95BAB] rounded-full flex items-center justify-center">
                  {user?.avatarURL ? (
                    <img
                      src={user.avatarURL || "/placeholder.svg"}
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
                            src={user.avatarURL || "/placeholder.svg"}
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

          {/* Mobile right side - All icons and menu grouped together */}
          <div className="flex md:hidden items-center space-x-1 sm:space-x-2">
            {/* Mobile Applications Icon */}
            <div className="relative">
              <button
                onClick={() => navigate('/dashboard/applications')}
                className="relative p-1.5 sm:p-2 text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out"
                title="View Applications"
              >
                <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                <ApplicationBadge pendingCount={pendingApplicationsCount} />
              </button>
            </div>

            {/* Mobile Notification Bell */}
            <div className="relative" ref={notificationDropdownRef}>
              <button
                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                className="relative p-1.5 sm:p-2 text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <NotificationBadge unreadCount={unreadCount} />
              </button>

              {/* Mobile Notification Dropdown */}
              {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#202020] border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-3 sm:p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="font-semibold text-white text-sm sm:text-base">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs sm:text-sm text-[#A95BAB] hover:text-white transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                      <div className="p-4 text-center text-gray-400">
                        Loading notifications...
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-700">
                        {notifications.map((notification) => (
                          <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onNotificationClick={handleNotificationClick}
                            onMarkAsRead={handleMarkAsRead}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-700">
                    <button
                      onClick={() => {
                        navigate('/dashboard/notifications')
                        setIsNotificationDropdownOpen(false)
                      }}
                      className="w-full text-center text-sm text-[#A95BAB] hover:text-white py-2 transition-colors"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Profile */}
            <div className="relative" ref={mobileProfileDropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center p-1 sm:p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#A95BAB] rounded-full flex items-center justify-center">
                  {user?.avatarURL ? (
                    <img
                      src={user.avatarURL || "/placeholder.svg"}
                      alt={user.firstName}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xs font-bold">{getUserInitials()}</span>
                  )}
                </div>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-[#202020] border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-3 sm:p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#A95BAB] rounded-full flex items-center justify-center">
                        {user?.avatarURL ? (
                          <img
                            src={user.avatarURL || "/placeholder.svg"}
                            alt={user.firstName}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-sm font-bold">{getUserInitials()}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm sm:text-base">
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
                          className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <IconComponent size={14} className="text-gray-400 sm:w-4 sm:h-4" />
                            <span className="text-sm">{item.label}</span>
                          </div>
                          <ChevronRight size={12} className="text-gray-400 sm:w-3.5 sm:h-3.5" />
                        </button>
                      )
                    })}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <LogOut size={14} className="text-gray-400 sm:w-4 sm:h-4" />
                        <span className="text-sm">Log out</span>
                      </div>
                      <ChevronRight size={12} className="text-gray-400 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button - grouped with other icons */}
            <div className="border-l border-gray-600 pl-1 sm:pl-2 ml-1 sm:ml-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 sm:p-2 text-white hover:text-[#A95BAB] transition-colors duration-300"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#202020]/95 backdrop-blur-sm border-t border-gray-700/50">
            <div className="px-4 py-4 space-y-3">
              {/* Navigation Items */}
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveMenu(item.key)
                    if (item.tabType) {
                      handleTabSwitch(item.tabType, item.path)
                    } else {
                      navigate(item.path)
                    }
                    setIsMobileMenuOpen(false)
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-lg transition-colors duration-300 ${
                    activeMenu === item.key 
                      ? "text-[#A95BAB] bg-[#A95BAB]/10" 
                      : "text-white hover:text-[#A95BAB] hover:bg-white/5"
                  }`}
                >
                  {item.text}
                </button>
              ))}

              {/* Mobile Profile Quick Actions */}
              <div className="pt-4 border-t border-gray-700/50">
                <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                  <div className="w-8 h-8 bg-[#A95BAB] rounded-full flex items-center justify-center">
                    {user?.avatarURL ? (
                      <img
                        src={user.avatarURL || "/placeholder.svg"}
                        alt={user.firstName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xs font-bold">{getUserInitials()}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email || "User"}
                    </p>
                  </div>
                </div>

                {profileMenuItems.map((item, i) => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        handleProfileMenuClick(item.href)
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300"
                    >
                      <IconComponent size={16} className="text-gray-400" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  )
                })}
                
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 w-full text-left px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-300"
                >
                  <LogOut size={16} className="text-gray-400" />
                  <span className="text-sm">Log out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
