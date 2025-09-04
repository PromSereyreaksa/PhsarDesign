"use client"

import { ArrowLeft, Mail } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"

export default function CheckEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const { email, type = "registration", message } = location.state || {}

  // Redirect if no email data
  if (!email) {
    navigate("/register")
    return null
  }

  const getTitle = () => {
    return type === "registration" ? "Check Your Email" : "Check Your Email"
  }

  const getDescription = () => {
    if (message) return message
    
    return type === "registration"
      ? "We've sent a magic link to your email address. Please click the link to complete your registration."
      : "We've sent a magic link to your email address. Please click the link to reset your password."
  }

  const getBackLink = () => {
    return type === "registration" ? "/register" : "/forgot-password"
  }

  const getBackText = () => {
    return type === "registration" ? "Back to Register" : "Back to Forgot Password"
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
          {getBackText()}
        </button>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-[#A95BAB]/10 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-[#A95BAB]" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
              {getTitle()}
            </CardTitle>
            <p className="text-gray-300 text-sm mt-2">
              {getDescription()}
            </p>
            <p className="text-[#A95BAB] font-medium mt-2">{email}</p>
          </CardHeader>
          
          <CardContent>
            <div className="text-center space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-400 text-sm">
                  <strong>Didn't receive the email?</strong> Check your spam folder or try refreshing your inbox.
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate("/login")}
                  className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl"
                >
                  Back to Login
                </Button>
                
                {type === "registration" && (
                  <Button 
                    onClick={() => navigate("/register")}
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 rounded-xl"
                  >
                    Try Different Email
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
