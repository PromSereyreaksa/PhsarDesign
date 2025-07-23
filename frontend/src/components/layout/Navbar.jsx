import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Menu, X, User, Bell, MessageSquare } from 'lucide-react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-green-600">
              FreelanceHub
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Input type="text" placeholder="Search for services..." className="pl-10 pr-4 py-2 w-full" />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/browse-jobs" className="text-gray-700 hover:text-green-600 px-3 py-2">
              Browse Jobs
            </Link>
            <Link to="/post-job" className="text-gray-700 hover:text-green-600 px-3 py-2">
              Post a Job
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Link to="/messages">
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/messages">Messages</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => setIsLoggedIn(true)}>
                  Sign In
                </Button>
                <Button onClick={() => setIsLoggedIn(true)}>Join</Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <div className="mb-3">
                <Input type="text" placeholder="Search for services..." className="w-full" />
              </div>
              <Link to="/browse-jobs" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Browse Jobs
              </Link>
              <Link to="/post-job" className="block px-3 py-2 text-gray-700 hover:text-green-600">
                Post a Job
              </Link>
              {!isLoggedIn && (
                <div className="flex space-x-2 px-3 py-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(true)}>
                    Sign In
                  </Button>
                  <Button size="sm" onClick={() => setIsLoggedIn(true)}>
                    Join
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
