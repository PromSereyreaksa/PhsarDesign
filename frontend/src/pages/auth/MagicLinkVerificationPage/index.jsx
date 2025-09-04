"use client"

import { CheckCircle, Loader2, X } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { authAPI } from "../../../lib/api"
import { loginFailure, loginStart, loginSuccess } from "../../../store/slices/authSlice"

export default function MagicLinkVerificationPage() {
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

    const verifyMagicLink = async () => {
      dispatch(loginStart())
      
      try {
        // Extract tokens from URL hash (as used by Supabase)
        const hash = window.location.hash.substring(1)
        const params = new URLSearchParams(hash)
        
        const accessToken = params.get("access_token")
        const refreshToken = params.get("refresh_token")
        // Note: type parameter is available but we determine flow from response data

        if (!accessToken || !refreshToken) {
          throw new Error("Invalid magic link. Missing required tokens.")
        }

        // Verify the magic link
        const response = await authAPI.verifyMagicLink({
          access_token: accessToken,
          refresh_token: refreshToken,
          type: params.get("type") // Include type parameter for password reset detection
        })

        // Check if the response is successful
        console.log("=== MAGIC LINK VERIFICATION RESPONSE ===")
        console.log("Full response:", response)
        console.log("Response data:", response.data)
        console.log("Success:", response.data?.success)
        console.log("isPasswordReset:", response.data?.isPasswordReset)
        console.log("isPasswordReset type:", typeof response.data?.isPasswordReset)
        console.log("Has user:", !!response.data?.user)
        console.log("Has token:", !!response.data?.token)
        console.log("Message:", response.data?.message)
        console.log("Email:", response.data?.email)
        console.log("=========================================")
        
        if (response.data && response.data.success) {
          setStatus("success")
          setMessage(response.data.message || "Verification successful!")
          
          // IMPORTANT: Check for password reset FIRST and ONLY
          console.log("🔍 CHECKING: response.data.isPasswordReset ===", response.data.isPasswordReset)
          console.log("🔍 CHECKING: response.data.isPasswordReset === true:", response.data.isPasswordReset === true)
          
          if (response.data.isPasswordReset === true) {
            console.log("🔑 PASSWORD RESET FLOW: Redirecting to change password page")
            // For password reset, redirect to change password page
            setTimeout(() => {
              navigate("/change-password", {
                state: {
                  email: response.data.email || "user@example.com",
                  verified: true
                }
              })
            }, 2000)
            return // Exit early to prevent other flows
          }
          
          // Only check for registration if it's NOT a password reset
          if (response.data.user && response.data.token && !response.data.isPasswordReset) {
            console.log("👤 REGISTRATION FLOW: Logging in user")
            setUser(response.data.user)
            dispatch(loginSuccess({ 
              user: response.data.user, 
              token: response.data.token 
            }))
            
            // Auto redirect to dashboard after successful registration
            setTimeout(() => {
              navigate("/")
            }, 3000)
            return // Exit early
          }
          
          // Fallback for other types
          console.log("❓ UNKNOWN FLOW: Redirecting to login")
          setTimeout(() => {
            navigate("/login")
          }, 2000)
        } else {
          // Handle failed response
          const errorMessage = response.data?.message || "Verification failed"
          throw new Error(errorMessage)
        }
      } catch (error) {
        console.error("Magic link verification error:", error)
        console.error("Error response:", error.response?.data)
        setStatus("error")
        
        // Better error message handling
        let errorMessage = "Invalid or expired magic link"
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        setMessage(errorMessage)
        dispatch(loginFailure(errorMessage))
      }
    }

    verifyMagicLink()
  }, [dispatch, navigate])

  const getIcon = () => {
    switch (status) {
      case "verifying":
        return <Loader2 className="h-8 w-8 text-[#A95BAB] animate-spin" />
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-400" />
      case "error":
        return <X className="h-8 w-8 text-red-400" />
      default:
        return <Loader2 className="h-8 w-8 text-[#A95BAB] animate-spin" />
    }
  }

  const getTitle = () => {
    switch (status) {
      case "verifying":
        return "Verifying Magic Link..."
      case "success":
        return "Verification Successful!"
      case "error":
        return "Verification Failed"
      default:
        return "Verifying..."
    }
  }

  const getDescription = () => {
    switch (status) {
      case "verifying":
        return "Please wait while we verify your magic link..."
      case "success":
        return message || "Your email has been verified successfully!"
      case "error":
        return message || "There was an error verifying your magic link."
      default:
        return "Processing..."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
              {getIcon()}
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              {getTitle()}
            </CardTitle>
            <p className="text-gray-300 text-sm mt-2">
              {getDescription()}
            </p>
            
            {status === "success" && user && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 text-sm">
                  Welcome, {user.firstName} {user.lastName}!
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Redirecting you to the dashboard...
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            <div className="text-center">
              {status === "error" && (
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate("/register")}
                    className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => navigate("/login")}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl"
                  >
                    Back to Login
                  </Button>
                </div>
              )}
              
              {status === "verifying" && (
                <p className="text-gray-400 text-sm">
                  This may take a few moments...
                </p>
              )}
              
              {status === "success" && !user && (
                <Button 
                  onClick={() => navigate("/login")}
                  className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl"
                >
                  Continue to Login
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
