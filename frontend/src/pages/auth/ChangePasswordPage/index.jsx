"use client"

import { ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { authAPI } from "../../../lib/api"
import { loginSuccess } from "../../../store/slices/authSlice"

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
  const [email, setEmail] = useState("")
  const [isValidReset, setIsValidReset] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user: currentUser } = useSelector((state) => state.auth)
  
  const { email: stateEmail, verified } = location.state || {}

  useEffect(() => {
    // Check if this is a magic link password reset (from /auth/reset-password route)
    if (location.pathname === "/auth/reset-password") {
      // For direct magic link access, we need to verify the magic link first
      // to get the user's email. Redirect to magic link verification.
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      
      const accessToken = params.get("access_token")
      const refreshToken = params.get("refresh_token")
      const type = params.get("type")
      
      if (type === "recovery" && accessToken && refreshToken) {
        // Redirect to magic link verification which will handle the tokens
        // and then redirect back here with the proper email
        navigate("/verify-magic-link" + window.location.hash)
        return
      } else {
        // Invalid magic link for password reset
        navigate("/forgot-password")
        return
      }
    } else {
      // Regular change password flow (from state)
      if (!stateEmail || !verified) {
        console.log("Missing state data:", { stateEmail, verified })
        // Don't redirect immediately, show form with warning instead
        setEmail("") // Set empty email to trigger validation error
        setIsValidReset(true) // Allow form to show
        return
      }
      console.log("Setting email from state:", stateEmail)
      setEmail(stateEmail)
      setIsValidReset(true)
    }
  }, [location, stateEmail, verified, navigate])

  // Auto-redirect after successful password change
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        const isGoingHome = currentUser && currentUser.email === email
        navigate(isGoingHome ? "/home" : "/login")
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [success, navigate, currentUser, email])

  // Show loading while validating reset permissions - but be less restrictive
  if (!isValidReset && !loading && !success) {
    // Give it a moment to set up, then show the form anyway with a warning
    setTimeout(() => setIsValidReset(true), 1000)
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center p-4">
        <div className="text-center text-white">
          <p>Validating reset link...</p>
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-yellow-400 text-sm">
              If this takes too long, try requesting a new reset link.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!email || email.trim() === "") {
      setError("Email is required for password reset")
      return
    }

    if (!formData.newPassword || formData.newPassword.trim() === "") {
      setError("New password is required")
      return
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    console.log("Submitting password change for email:", email)
    setLoading(true)

    try {
      const changePasswordData = {
        email: email,
        newPassword: formData.newPassword
      };
      
      console.log("Change password data:", changePasswordData)
      const response = await authAPI.changePassword(changePasswordData)
      
      console.log("Password change response:", response.data)
      setSuccess(true)
      
      // Check if user is already logged in
      if (currentUser && currentUser.email === email) {
        console.log("User is already authenticated, redirecting to home")
        // User is already logged in, redirect to home
        setTimeout(() => {
          navigate("/home", { 
            state: { 
              message: "Password changed successfully!" 
            } 
          })
        }, 2000)
      } else {
        console.log("User not authenticated, attempting auto-login")
        // Try to log the user in automatically with the new password
        try {
          const loginResponse = await authAPI.login({
            email: email,
            password: formData.newPassword
          })
          
          if (loginResponse.data.user && loginResponse.data.token) {
            console.log("Auto-login successful")
            dispatch(loginSuccess({
              user: loginResponse.data.user,
              token: loginResponse.data.token
            }))
            
            setTimeout(() => {
              navigate("/home", { 
                state: { 
                  message: "Password changed successfully! Welcome back!" 
                } 
              })
            }, 2000)
          } else {
            throw new Error("Login failed")
          }
        } catch (loginError) {
          console.log("Auto-login failed:", loginError.message)
          // Auto-login failed, redirect to login
          setTimeout(() => {
            navigate("/login", { 
              state: { 
                message: "Password changed successfully! Please log in with your new password.",
                email: email
              } 
            })
          }, 2000)
        }
      }
    } catch (error) {
      console.error("Password change error:", error)
      const errorMessage = error.response?.data?.message || "Failed to change password. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    const isGoingHome = currentUser && currentUser.email === email
    
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
                  {isGoingHome ? "Redirecting to your dashboard..." : "Redirecting to login page..."}
                </p>
                <Button 
                  onClick={() => navigate(isGoingHome ? "/home" : "/login")}
                  className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl"
                >
                  {isGoingHome ? "Continue to Dashboard" : "Continue to Login"}
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
            {/* Debug info - remove in production */}
            {import.meta.env.DEV && (
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-blue-400 text-xs">Debug Info:</p>
                <p className="text-blue-400 text-xs">Email: {email || 'NOT SET'}</p>
                <p className="text-blue-400 text-xs">Valid Reset: {isValidReset ? 'YES' : 'NO'}</p>
                <p className="text-blue-400 text-xs">Route: {location.pathname}</p>
                <p className="text-blue-400 text-xs">Loading: {loading ? 'YES' : 'NO'}</p>
                <p className="text-blue-400 text-xs">Form Data: {JSON.stringify(formData)}</p>
                <div className="mt-2">
                  <input 
                    type="text" 
                    placeholder="Test input (should work)" 
                    className="w-full p-2 bg-gray-800 text-white rounded border"
                    onChange={(e) => console.log("Test input:", e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {!email && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ No email detected. You may need to request a new password reset link.
                  </p>
                  <button 
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="mt-2 text-[#A95BAB] hover:underline text-sm"
                  >
                    Request new reset link
                  </button>
                </div>
              )}
              
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl pr-10 h-12"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl pr-10 h-12"
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1"
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