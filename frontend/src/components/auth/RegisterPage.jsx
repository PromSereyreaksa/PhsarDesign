"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match")
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock successful registration
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: Date.now(),
          email: formData.email,
          name: formData.name,
          role: formData.role,
        }),
      )
      navigate("/home")
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
              Join PhsarDesign
            </CardTitle>
            <p className="text-gray-300">Create your account and start your creative journey</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">
                  I want to
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white rounded-xl">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/30">
                    <SelectItem value="client" className="text-white hover:bg-white/10">
                      Hire freelancers
                    </SelectItem>
                    <SelectItem value="freelancer" className="text-white hover:bg-white/10">
                      Work as a freelancer
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input type="checkbox" className="mt-1 rounded" required />
                <label className="text-sm text-gray-300">
                  I agree to the{" "}
                  <Link to="/terms" className="text-[#A95BAB] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#A95BAB] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl py-3 font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300">
                Already have an account?{" "}
                <Link to="/login" className="text-[#A95BAB] hover:underline font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
