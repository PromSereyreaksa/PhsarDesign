"use client"

import { CheckCircle, Loader2, X } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { authAPI } from "../../../lib/api"
import { loginFailure, loginStart, loginSuccess } from "../../../store/slices/authSlice"

export default function RegisterVerificationPage() {
  const [status, setStatus] = useState("verifying") // verifying, success, error
  const [message, setMessage] = useState("")
  const [user, setUser] = useState(null)
  const hasVerified = useRef(false) // Prevent double verification
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // Prevent double calls in React Strict Mode
    if (hasVerified.current) {
      console.log("⚠️ Verification already in progress, skipping duplicate call")
      return
    }
    
    hasVerified.current = true

    const verifyRegistrationMagicLink = async () => {
      dispatch(loginStart())
      
      try {
        // Extract tokens from URL hash (as used by Supabase)
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        
        const accessToken = params.get("access_token")
        const refreshToken = params.get("refresh_token")
        const type = params.get("type")

        console.log("=== REGISTRATION MAGIC LINK VERIFICATION ===")
        console.log("Access token:", !!accessToken)
        console.log("Refresh token:", !!refreshToken)
        console.log("Type:", type)
        console.log("===============================================")

        if (!accessToken || !refreshToken) {
          throw new Error("Invalid magic link. Missing required tokens.")
        }

        // Verify the magic link for registration
        const response = await authAPI.verifyMagicLink({
          access_token: accessToken,
          refresh_token: refreshToken,
          type: type
        })

        console.log("=== REGISTRATION VERIFICATION RESPONSE ===")
        console.log("Full response:", response)
        console.log("Response status:", response.status)
        console.log("Response statusText:", response.statusText)
        console.log("Response headers:", response.headers)
        console.log("Response data:", response.data)
        console.log("Response data type:", typeof response.data)
        console.log("Success:", response.data?.success)
        console.log("Success type:", typeof response.data?.success)
        console.log("isPasswordReset:", response.data?.isPasswordReset)
        console.log("Has user:", !!response.data?.user)
        console.log("Has token:", !!response.data?.token)
        console.log("Message:", response.data?.message)
        console.log("==========================================")
        
        // Check if response exists and has data
        if (!response || !response.data) {
          throw new Error("No response data received from server")
        }
        
        // Check if response.data.success is explicitly true
        if (response.data.success === true) {
          console.log("✅ SUCCESS FLAG IS TRUE - Processing successful response")
          setStatus("success")
          setMessage(response.data.message || "Registration successful!")
          
          // This should be a registration, not password reset
          if (response.data.isPasswordReset === true) {
            console.log("⚠️ WARNING: Got password reset flag on registration page")
            throw new Error("This appears to be a password reset link. Please use the forgot password flow.")
          }
          
          // Check for successful registration with user and token
          if (response.data.user && response.data.token) {
            console.log("👤 REGISTRATION SUCCESS: Logging in user")
            setUser(response.data.user)
            dispatch(loginSuccess({ 
              user: response.data.user, 
              token: response.data.token 
            }))
            
            // Auto redirect to dashboard after successful registration
            setTimeout(() => {
              navigate("/home")
            }, 3000)
            return
          }
          
          // If success but no user/token, show success message and redirect to login
          console.log("✅ REGISTRATION VERIFIED: Redirecting to login")
          setTimeout(() => {
            navigate("/login")
          }, 3000)
        } else {
          // Handle failed response
          console.log("❌ SUCCESS FLAG IS NOT TRUE - Processing failed response")
          console.log("Success value:", response.data?.success)
          const errorMessage = response.data?.message || "Registration verification failed"
          throw new Error(errorMessage)
        }
      } catch (error) {
        console.error("=== REGISTRATION VERIFICATION ERROR ===")
        console.error("Error object:", error)
        console.error("Error message:", error.message)
        console.error("Error response:", error.response)
        console.error("Error response data:", error.response?.data)
        console.error("Error response status:", error.response?.status)
        console.error("Error config:", error.config)
        console.error("=========================================")
        
        dispatch(loginFailure(error.message))
        setStatus("error")
        
        // Enhanced error message handling
        let errorMessage = "Verification failed. Please try again."
        
        if (error.response) {
          // Server responded with error status
          console.log("Server error response detected")
          errorMessage = error.response.data?.message || `Server error (${error.response.status}): ${error.response.statusText}`
        } else if (error.request) {
          // Request was made but no response received
          console.log("Network error detected")
          errorMessage = "Network error. Please check your connection and try again."
        } else {
          // Something else happened
          console.log("Other error detected")
          errorMessage = error.message || "An unexpected error occurred."
        }
        
        setMessage(errorMessage)
      }
    }

    verifyRegistrationMagicLink()
  }, [dispatch, navigate])

  if (status === "verifying") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#A95BAB] mb-4" />
            <p className="text-gray-300">Verifying your registration...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 mb-4">
              <X className="h-6 w-6 text-red-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-gray-300 text-sm mb-6">
                {message}
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={() => navigate("/register")}
                className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl"
              >
                Try Registration Again
              </Button>
              
              <Button
                onClick={() => navigate("/login")}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl"
              >
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/10 mb-4">
            <CheckCircle className="h-6 w-6 text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
            Registration Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-6">
              {message}
            </p>
            {user && (
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-gray-400 text-xs mb-2">Welcome</p>
                <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-[#A95BAB] text-sm">{user.email}</p>
                <p className="text-gray-400 text-xs mt-2">Role: {user.role}</p>
              </div>
            )}
            <p className="text-gray-400 text-xs">
              {user ? "Redirecting to your dashboard..." : "Redirecting to login page..."}
            </p>
          </div>
          
          <Button
            onClick={() => navigate(user ? "/home" : "/login")}
            className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl"
          >
            {user ? "Continue to Dashboard" : "Continue to Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
