"use client"

import { ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { authAPI } from "../../../lib/api"

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  
  const { email, verificationToken, resetToken, verified } = location.state || {}

  // Redirect if no verification data
  if (!email || (!verificationToken && !resetToken && !verified)) {
    navigate("/forgot-password")
    return null
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)

    try {
      const changePasswordData = {
        email: email,
        newPassword: formData.newPassword
      };
      
      await authAPI.changePassword(changePasswordData)

      setSuccess(true)
      
      // Redirect to login after success
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            message: "Password changed successfully! Please log in with your new password." 
          } 
        })
      }, 2000)
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to change password. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
                Password Changed!
              </CardTitle>
              <p className="text-gray-300 text-sm mt-2">
                Your password has been successfully updated.
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">
                  Redirecting to login page...
                </p>
                <Button 
                  onClick={() => navigate("/login")}
                  className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl"
                >
                  Continue to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate("/forgot-password")}
          className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              Create New Password
            </CardTitle>
            <p className="text-gray-300 text-sm mt-2">
              Enter your new password below.
            </p>
            <p className="text-[#A95BAB] font-medium">{email}</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-white">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange("newPassword", e.target.value)}
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
                <p className="text-xs text-gray-400">Minimum 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
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

              <Button
                type="submit"
                className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl py-3 font-semibold"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save New Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}