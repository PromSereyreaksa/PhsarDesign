"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
// import { register } from "../../../store/actions/authActions"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { authAPI } from "../../../lib/api"
import { loginFailure, loginStart } from "../../../store/slices/authSlice"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Add a submission tracker to prevent duplicate form submissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    
    // Prevent multiple submissions
    if (loading || isSubmitting) {
      return;
    }
    
    setError("");
    setIsSubmitting(true);

    // Validate form
    if (!formData.firstName.trim()) {
      setError("First name is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsSubmitting(false);
      return;
    }

    if (!formData.role) {
      setError("Please select your role");
      setIsSubmitting(false);
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the terms and conditions");
      setIsSubmitting(false);
      return;
    }

    dispatch(loginStart());

    try {
      // Convert 'freelancer' role to 'artist' if needed (backward compatibility)
      const role = formData.role === 'freelancer' ? 'artist' : formData.role;
      
      // Prepare registration data with all required fields
      const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: role
      };
      
      
      // Step 1: Register user (send to /register)
      await authAPI.register(requestData);
      
      // Navigate to OTP verification page
      // Note: OTP is automatically sent by the /register endpoint
      navigate("/verify-otp", { 
        state: { 
          email: formData.email, 
          type: "registration",
          fromRegister: true
        } 
      });
    } catch (error) {
      
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMessage);
      dispatch(loginFailure(errorMessage));
      setIsSubmitting(false);
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

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent mb-2">
              Join PhsarDesign
            </CardTitle>
            <p className="text-gray-300 text-lg">Create your account and start your creative journey</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white font-medium">
                    First Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl h-11 focus:ring-2 focus:ring-[#A95BAB]/50 focus:border-[#A95BAB]/50 transition-all duration-200"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white font-medium">
                    Last Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl h-11 focus:ring-2 focus:ring-[#A95BAB]/50 focus:border-[#A95BAB]/50 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl h-11 focus:ring-2 focus:ring-[#A95BAB]/50 focus:border-[#A95BAB]/50 transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-white font-medium">
                  I want to <span className="text-red-400">*</span>
                </Label>
                <Select value={formData.role} onValueChange={(value) => {
                  handleInputChange("role", value);
                }}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl h-11 focus:ring-2 focus:ring-[#A95BAB]/50 focus:border-[#A95BAB]/50 transition-all duration-200">
                    <SelectValue placeholder="Choose your role" value={formData.role} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="client" className="text-white hover:bg-gray-700">
                      🏢 Hire artists
                    </SelectItem>
                    <SelectItem value="artist" className="text-white hover:bg-gray-700">
                      🎨 Work as an artist
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formData.role && (
                  <p className="text-sm text-gray-400">
                    Selected: {formData.role === 'client' ? '🏢 Hire artists' : '🎨 Work as an artist'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white font-medium">
                  Password <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl pr-12 h-11 focus:ring-2 focus:ring-[#A95BAB]/50 focus:border-[#A95BAB]/50 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#A95BAB] transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400">Minimum 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white font-medium">
                  Confirm Password <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl pr-12 h-11 focus:ring-2 focus:ring-[#A95BAB]/50 focus:border-[#A95BAB]/50 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#A95BAB] transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded" 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
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
                disabled={loading}
                onClick={(e) => {
                  // This prevents any possible double submission
                  if (loading) {
                    e.preventDefault();
                    return;
                  }
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <span className="ml-2">Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
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
