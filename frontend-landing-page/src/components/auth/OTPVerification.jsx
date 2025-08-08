"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { authAPI } from "../../services/api"
import { loginStart, loginSuccess, loginFailure } from "../../store/slices/authSlice"

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [resendDisabled, setResendDisabled] = useState(true)
  const inputRefs = useRef([])
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading } = useSelector((state) => state.auth)

  const { email, type = "registration", fromRegister = false } = location.state || {}

  useEffect(() => {
    if (!email) {
      navigate("/login")
      return
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, navigate])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResendOtp = async () => {
    try {
      await authAPI.requestOtp({ email, type })
      setTimeLeft(300)
      setResendDisabled(true)
      setError("")
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP")
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    const otpCode = otp.join("")
    
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setError("")
    dispatch(loginStart())

    try {
      const response = await authAPI.verifyOtp({ 
        email, 
        otp: otpCode, 
        type 
      })

      if (type === "registration") {
        const { user, token } = response.data
        dispatch(loginSuccess({ user, token }))
        navigate("/profile-setup")
      } else if (type === "password-reset") {
        // For password reset, navigate to change password with verification token
        navigate("/change-password", { 
          state: { 
            email, 
            verificationToken: response.data.verificationToken 
          } 
        })
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again."
      setError(errorMessage)
      dispatch(loginFailure(errorMessage))
    }
  }

  const getTitle = () => {
    return type === "registration" ? "Verify Your Email" : "Verify OTP"
  }

  const getDescription = () => {
    return type === "registration" 
      ? "We've sent a verification code to your email address. Please enter it below to complete your registration."
      : "We've sent a verification code to your email address. Please enter it below to reset your password."
  }

  const getBackLink = () => {
    if (type === "registration" && fromRegister) return "/register"
    return type === "password-reset" ? "/forgot-password" : "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate(getBackLink())}
          className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              {getTitle()}
            </CardTitle>
            <p className="text-gray-300 text-sm mt-2">
              {getDescription()}
            </p>
            <p className="text-[#A95BAB] font-medium">{email}</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-white">Enter 6-digit verification code</Label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold bg-white/10 border-white/20 text-white rounded-xl focus:ring-2 focus:ring-[#A95BAB]/50"
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl py-3 font-semibold"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {timeLeft > 0 ? (
                <p className="text-gray-400 text-sm">
                  Resend code in {formatTime(timeLeft)}
                </p>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleResendOtp}
                  disabled={resendDisabled}
                  className="text-[#A95BAB] hover:text-[#A95BAB]/80 hover:bg-[#A95BAB]/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend Code
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}