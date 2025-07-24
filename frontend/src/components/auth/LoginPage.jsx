"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Mock admin credentials
  const ADMIN_EMAIL = "admin@phsardesign.com"
  const ADMIN_PASSWORD = "admin123"

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Mock successful login
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: 1,
            email: ADMIN_EMAIL,
            role: "admin",
            name: "Admin User",
          }),
        )
        navigate("/home")
      } else {
        alert("Invalid credentials. Use admin@phsardesign.com / admin123")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-gray-300">Sign in to your PhsarDesign account</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input type="checkbox" className="rounded" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-[#A95BAB] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl py-3 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#A95BAB] hover:underline font-semibold">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-[#A95BAB]/10 rounded-xl border border-[#A95BAB]/20">
              <p className="text-sm text-gray-300 mb-2">Demo Credentials:</p>
              <p className="text-xs text-gray-400">Email: admin@phsardesign.com</p>
              <p className="text-xs text-gray-400">Password: admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
