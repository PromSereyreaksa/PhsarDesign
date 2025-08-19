"use client"

import React, { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { authAPI } from "../../../services/api"
import { loginStart, loginSuccess as loginSuccessAction, loginFailure } from "../../../store/slices/authSlice"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading } = useSelector((state) => state.auth)

  // Check for success message from password change
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
    }
  }, [location.state])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    
    dispatch(loginStart())

    try {
      const response = await authAPI.login({ email, password })
      const { user, token } = response.data
      
      // Store JWT token securely in localStorage for cross-app sharing
      localStorage.setItem('jwt_token', token)
      localStorage.setItem('user_data', JSON.stringify(user))
      localStorage.setItem('token_timestamp', Date.now().toString())
      
      dispatch(loginSuccessAction({ user, token }))
      setSuccessMessage(`Welcome back, ${user.firstName}! Login successful.`)

      // Redirect to authenticated home page after successful login
      setTimeout(() => {
        navigate("/home")
      }, 1500)
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed. Please try again."
      setError(errorMessage)
      dispatch(loginFailure(errorMessage))
    }
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
            {successMessage ? (
              <div className="text-center space-y-4">
                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="text-green-400 text-lg font-semibold mb-2">✅ Login Successful!</div>
                  <p className="text-green-300 text-sm">{successMessage}</p>
                  <p className="text-gray-400 text-xs mt-2">Redirecting you to PhsarDesign app...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                {successMessage && !successMessage.includes('Welcome back') && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-green-400 text-sm">{successMessage}</p>
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

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
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <span className="ml-2">Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            )}

            {!successMessage && (
              <div className="mt-6 text-center">
                <p className="text-gray-300">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-[#A95BAB] hover:underline font-semibold">
                    Sign up
                  </Link>
                </p>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
