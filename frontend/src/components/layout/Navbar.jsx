"use client"

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
                placeholder="Search for creative services..."
                className="pl-10 pr-4 py-2 w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
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
              to="/post-job/client"
              className="text-white hover:text-[#A95BAB] px-3 py-2 transition-colors duration-500 ease-out"
            >
              Hire Talent
            </Link>
            <Link
              to="/post-job/freelancer"
              className="text-white hover:text-[#A95BAB] px-3 py-2 transition-colors duration-500 ease-out"
            >
              Offer Services
            </Link>
            <Link
              to="/about"
              className="text-white hover:text-[#A95BAB] px-3 py-2 transition-colors duration-500 ease-out"
            >
              About
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="text-white hover:text-[#A95BAB] hover:bg-white/10">
                  <Bell className="h-4 w-4" />
                </Button>
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
                  <DropdownMenuContent align="end" className="bg-black border-gray-600">
                    <DropdownMenuItem className="text-white hover:text-[#A95BAB] hover:bg-white/10">
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:text-[#A95BAB] hover:bg-white/10">
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:text-[#A95BAB] hover:bg-white/10">
                      <Link to="/messages">Messages</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsLoggedIn(false)}
                      className="text-white hover:text-[#A95BAB] hover:bg-white/10"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsLoggedIn(true)}
                  className="text-white hover:text-[#A95BAB] hover:bg-white/10 transform hover:scale-105 transition-all duration-500 ease-out"
                >
                  <span className="text-white">Sign In</span>
                </Button>
                <Button
                  onClick={() => setIsLoggedIn(true)}
                  className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white transform hover:scale-105 transition-all duration-500 ease-out"
                >
                  <span className="text-white">Join</span>
                </Button>
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
                  placeholder="Search for creative services..."
                  className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <Link to="/browse-jobs" className="block px-3 py-2 text-white hover:text-[#A95BAB]">
                Browse Jobs
              </Link>
              <Link to="/post-job/client" className="block px-3 py-2 text-white hover:text-[#A95BAB]">
                Hire Talent
              </Link>
              <Link to="/post-job/freelancer" className="block px-3 py-2 text-white hover:text-[#A95BAB]">
                Offer Services
              </Link>
              <Link to="/about" className="block px-3 py-2 text-white hover:text-[#A95BAB]">
                About
              </Link>
              {!isLoggedIn && (
                <div className="flex space-x-2 px-3 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLoggedIn(true)}
                    className="text-white hover:text-[#A95BAB]"
                  >
                    <span className="text-white">Sign In</span>
                  </Button>
                  <Button size="sm" onClick={() => setIsLoggedIn(true)} className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white">
                    <span className="text-white">Join</span>
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
