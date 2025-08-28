"use client"

import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import AuthNavbar from "../../components/layout/AuthNavbar"
import Loader from "../../components/ui/Loader"
import { showToast } from "../../components/ui/toast"
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux"
import { applicationsAPI } from "../../lib/api"
import { clearCurrentPost, fetchPostById, fetchPostBySlug } from "../../store/slices/marketplaceSlice"

const ContactArtistPage = () => {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { currentPost, loading, error } = useAppSelector((state) => state.marketplace)
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    proposedBudget: "",
    proposedDeadline: "",
    additionalNotes: ""
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?return=' + encodeURIComponent(window.location.pathname))
      return
    }

    if (slug) {
      // Check if slug contains postId (format: title-slug-postId) or is just a slug
      const parts = slug.split('-')
      const lastPart = parts[parts.length - 1]
      
      if (lastPart && !isNaN(lastPart)) {
        // Extract postId from slug format: title-slug-postId
        dispatch(fetchPostById(parseInt(lastPart)))
      } else {
        // Use slug directly for slug-based lookup
        dispatch(fetchPostBySlug(slug))
      }
    }

    return () => {
      dispatch(clearCurrentPost())
    }
  }, [dispatch, slug, isAuthenticated, navigate])

  // Check if user is trying to contact themselves
  useEffect(() => {
    if (currentPost && user?.userId === currentPost?.artist?.userId) {
      showToast("You cannot contact yourself!", 'error')
      navigate(`/marketplace/${slug}`)
    }
  }, [currentPost, user, slug, navigate])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Validate message length
    if (!formData.message || formData.message.trim().length < 10) {
      showToast('Message must be at least 10 characters long', 'error')
      setIsSubmitting(false)
      return
    }
    
    try {
      const applicationData = {
        availabilityPostId: currentPost.postId || currentPost.id,
        applicationType: "client_to_service",
        message: formData.message,
        proposedBudget: formData.proposedBudget ? parseFloat(formData.proposedBudget) : null,
        proposedDeadline: formData.proposedDeadline || null,
        name: formData.name,
        additionalNotes: formData.additionalNotes
      }
      
      await applicationsAPI.applyToService(applicationData)
      
      showToast("Your application has been sent to the artist successfully!", 'success')
      navigate(`/marketplace/${slug}`)
      
    } catch (error) {
      showToast(error.response?.data?.message || error.message || 'Failed to submit application', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate(`/marketplace/${slug}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
          <Loader />
          <p className="text-lg text-gray-300 mt-4">Loading post details...</p>
        </div>
      </div>
    )
  }

  if (error || !currentPost) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
        <AuthNavbar />
        <div className="pt-28 px-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBack}
              className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Post</span>
            </button>

            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-3xl font-bold text-white mb-4">Post Not Found</h2>
              <p className="text-lg text-gray-300 mb-8">The post you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={() => navigate('/marketplace')}
                className="px-8 py-3 bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-white"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const artistName = currentPost.artist?.user?.firstName && currentPost.artist?.user?.lastName 
    ? `${currentPost.artist.user.firstName} ${currentPost.artist.user.lastName}`
    : currentPost.artist?.name || "Artist"

  const steps = [
    { number: 1, title: "Personal Info", description: "Tell the artist about yourself" },
    { number: 2, title: "Project Details", description: "Describe your project requirements" },
    { number: 3, title: "Review", description: "Confirm your application" }
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Project Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Describe your project requirements in detail..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Minimum 10 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Budget *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.proposedBudget}
                      onChange={(e) => handleInputChange('proposedBudget', e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all pl-8"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Your budget for this project</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.proposedDeadline}
                    onChange={(e) => handleInputChange('proposedDeadline', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional terms or requirements..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Review Your Application
              </h3>
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-medium mb-4">Service Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Service:</span>
                      <span className="text-white">{currentPost.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Artist:</span>
                      <span className="text-white">{artistName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Service Price:</span>
                      <span className="text-white">${currentPost.budget || 'Negotiable'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="text-white font-medium mb-4">Your Application</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-300 font-medium">Contact</p>
                      <p className="text-white">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">Budget</p>
                      <p className="text-white">${formData.proposedBudget}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">Timeline</p>
                      <p className="text-white">
                        {formData.proposedDeadline ? new Date(formData.proposedDeadline).toLocaleDateString() : 'Flexible'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">Message</p>
                      <p className="text-white text-sm line-clamp-3">{formData.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />
      
      <div className="pt-28 max-w-4xl mx-auto px-6 pb-12">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="inline-flex items-center space-x-2 mb-8 px-4 py-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/60 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Application Form</h1>
          <p className="text-gray-300 text-lg">
            Apply for "{currentPost.title}" by {artistName}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  currentStep >= step.number
                    ? 'bg-[#A95BAB] text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {step.number}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-4 transition-all ${
                    currentStep > step.number ? 'bg-[#A95BAB]' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 font-medium transition-all hover:bg-gray-700/50 hover:border-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-4">
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !formData.name.trim()) ||
                  (currentStep === 2 && (!formData.message.trim() || formData.message.trim().length < 10))
                }
                className="px-8 py-3 bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactArtistPage
