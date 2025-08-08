"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { authAPI } from "../../services/api"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      await authAPI.requestOtp({ 
        email, 
        type: "password-reset" 
      })
      
      setSuccess(true)
      // Navigate to OTP verification after successful request
      setTimeout(() => {
        navigate("/verify-otp", { 
          state: { 
            email, 
            type: "password-reset" 
          } 
        })
      }, 2000)
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send reset code. Please try again."
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
                <Mail className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
                Check Your Email
              </CardTitle>
              <p className="text-gray-300 text-sm mt-2">
                We've sent a verification code to
              </p>
              <p className="text-[#A95BAB] font-medium">{email}</p>
            </CardHeader>
            
            <CardContent>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-4">
                  Redirecting to verification page...
                </p>
                <Button 
                  onClick={() => navigate("/verify-otp", { state: { email, type: "password-reset" } })}
                  className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl"
                >
                  Continue to Verification
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
        <Link to="/login" className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Login
        </Link>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              Forgot Password?
            </CardTitle>
            <p className="text-gray-300 text-sm mt-2">
              No worries! Enter your email address and we'll send you a verification code to reset your password.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email Address
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

              <Button
                type="submit"
                className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl py-3 font-semibold"
                disabled={loading}
              >
                {loading ? "Sending Code..." : "Send Verification Code"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                Remember your password?{" "}
                <Link to="/login" className="text-[#A95BAB] hover:underline font-semibold">
                  Back to Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}