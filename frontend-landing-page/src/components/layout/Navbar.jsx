"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Search, Menu, X, User, Bell, MessageSquare } from 'lucide-react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { GlobalSearch } from "../ui/global-search"
import { logout } from "../../store/slices/authSlice"
import { notificationsAPI } from "../../services/api"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Fetch unread notifications count
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUnreadCount()
      // Set up polling for notification updates every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, user])

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getUnreadCount()
      if (response.data.success) {
        setUnreadCount(response.data.data.total)
      }
    } catch (error) {
      // Handle 401 errors silently (user not authenticated)
      if (error.response?.status === 401) {
        console.debug('User not authenticated for notifications')
        setUnreadCount(0)
        return
      }
      console.error('Failed to fetch unread count:', error)
      setUnreadCount(0)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/")
  }

  return (
    <nav className="bg-[#202020]/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent"
            >
              PhsarDesign
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for artists and clients..."
                onClick={() => setIsSearchOpen(true)}
                className="pl-10 pr-4 py-2 w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 cursor-pointer"
                readOnly
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/browse-jobs"
              className="text-white hover:text-[#A95BAB] px-3 py-2 transition-colors duration-500 ease-out"
            >
              Browse Jobs
            </Link>
            <Link
              to="/browse-artists"
              className="text-white hover:text-[#A95BAB] px-3 py-2 transition-colors duration-500 ease-out"
            >
              Browse Artists
            </Link>
            {user?.role === 'client' && (
              <Link
                to="/post-job-client"
                className="text-white hover:text-[#A95BAB] px-3 py-2 transition-colors duration-500 ease-out"
              >
                Hire Talent
              </Link>
            )}
            {user?.role === 'artist' && (
              <Link
                to="/post-job-freelancer"
                className="text-white hover:text-[#A95BAB] px-3 py-2 transition-colors duration-500 ease-out"
              >
                Offer Services
              </Link>
            )}
            <Link
              to="/about"
              className="text-white hover:text-[#A95BAB] px-3 py-2 transition-colors duration-500 ease-out"
            >
              About
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/notifications">
                  <Button variant="ghost" size="sm" className="text-white hover:text-[#A95BAB] hover:bg-white/10 relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0 bg-red-500"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-white hover:text-[#A95BAB] hover:bg-white/10">
                  <Link to="/messages">
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:text-[#A95BAB] hover:bg-white/10">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black border-gray-600 z-[100]">
                    <DropdownMenuItem className="text-white hover:text-[#A95BAB] hover:bg-white/10">
                      <Link to="/notifications">Notifications</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:text-[#A95BAB] hover:bg-white/10">
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {user?.role === 'artist' && (
                      <DropdownMenuItem className="text-white hover:text-[#A95BAB] hover:bg-white/10">
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-white hover:text-[#A95BAB] hover:bg-white/10">
                      <Link to="/messages">Messages</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-white hover:text-[#A95BAB] hover:bg-white/10"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-[#A95BAB] hover:bg-white/10 transform hover:scale-105 transition-all duration-500 ease-out"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white transform hover:scale-105 transition-all duration-500 ease-out"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-[#A95BAB]"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-white/10">
              <div className="mb-3">
                <Input
                  type="text"
                  placeholder="Search for artists and clients..."
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 cursor-pointer"
                  readOnly
                />
              </div>
              <Link to="/browse-jobs" className="block px-3 py-2 text-white hover:text-[#A95BAB]">
                Browse Jobs
              </Link>
              <Link to="/browse-artists" className="block px-3 py-2 text-white hover:text-[#A95BAB]">
                Browse Artists
              </Link>
              {user?.role === 'client' && (
                <Link to="/post-job-client" className="block px-3 py-2 text-white hover:text-[#A95BAB]">
                  Hire Talent
                </Link>
              )}
              {user?.role === 'artist' && (
                <Link to="/post-job-freelancer" className="block px-3 py-2 text-white hover:text-[#A95BAB]">
                  Offer Services
                </Link>
              )}
              <Link to="/about" className="block px-3 py-2 text-white hover:text-[#A95BAB]">
                About
              </Link>
              {!isAuthenticated && (
                <div className="flex space-x-2 px-3 py-2">
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-[#A95BAB]"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Global Search Modal */}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </nav>
  )
}
