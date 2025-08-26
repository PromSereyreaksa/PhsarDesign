import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "../ui/button"
import { applicationsAPI } from "../../lib/api"
import store from "../../store/store"
import { showToast } from "../ui/toast"
import { StepJobApplicationForm } from "../marketplace/StepJobApplicationForm"
import { StepServiceContactForm } from "../marketplace/StepServiceContactForm"

/**
 * Multi-step Application Modal Component
 * Handles both job applications (artist → client) and service contacts (client → artist)
 * with a 3-step wizard interface
 */
export function MultiStepApplicationModal({ 
  isOpen, 
  onClose, 
  post, 
  onSuccess, 
  applicationType = "artist_to_job" // or "client_to_service"
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1 - Basic Information
    subject: "",
    message: "", // Cover letter for jobs, Project description for services
    
    // Step 2 - Details
    proposedBudget: "",
    proposedDeadline: "",
    proposedStartDate: "",
    experience: "", // For job applications
    portfolio: "", // For job applications
    pastProjects: "", // For job applications
    applicationType: "standard", // For service requests (priority)
    additionalNotes: "",
    
    // Step 3 is review only
  })

  if (!isOpen || !post) return null

  const isJobApplication = applicationType === "artist_to_job"
  const modalTitle = isJobApplication ? "Apply for Job" : "Contact Artist for Service"
  const totalSteps = 3

  const steps = isJobApplication 
    ? [
        { number: 1, title: "Job Details" },
        { number: 2, title: "Professional Info" },
        { number: 3, title: "Review" }
      ]
    : [
        { number: 1, title: "Service Details" },
        { number: 2, title: "Project Info" },
        { number: 3, title: "Review" }
      ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear any previous errors when user starts typing
    if (error) setError(null)
  }

  const validateStep = (step) => {
    if (step === 1) {
      return formData.subject.trim() && formData.message.trim()
    }
    if (step === 2) {
      if (isJobApplication) {
        return formData.proposedBudget && formData.proposedDeadline
      } else {
        return formData.proposedBudget
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const state = store.getState()
      const user = state.auth.user
      
      if (!user?.userId) {
        setError('User not properly authenticated. Please log in again.')
        setIsSubmitting(false)
        return
      }

      if (isJobApplication) {
        // Artist applying to job
        const applicationData = {
          jobPostId: post.jobPostId || post.jobId || post.id,
          receiverId: post.clientId || post.client?.clientId || post.userId,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          proposedBudget: parseFloat(formData.proposedBudget),
          proposedDeadline: formData.proposedDeadline,
          proposedStartDate: formData.proposedStartDate || null,
          experience: formData.experience?.trim() || null,
          portfolio: formData.portfolio?.trim() || null,
          additionalNotes: formData.additionalNotes?.trim() || null,
          pastProjects: formData.pastProjects?.trim() || null
        }
        
        await applicationsAPI.applyToJob(applicationData)
      } else {
        // Client contacting artist for service
        const applicationData = {
          availabilityPostId: post.availabilityPostId || post.postId || post.id,
          receiverId: post.artistId || post.artist?.artistId || post.userId,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          proposedBudget: parseFloat(formData.proposedBudget),
          proposedDeadline: formData.proposedDeadline || null,
          proposedStartDate: formData.proposedStartDate || null,
          applicationType: formData.applicationType || "standard",
          additionalNotes: formData.additionalNotes?.trim() || null
        }
        
        await applicationsAPI.applyToService(applicationData)
      }
      
      setSubmitted(true)
      onSuccess?.()
      
      // Show success toast
      showToast("Your application has been sent successfully!", "success")
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose()
      }, 3000)
    } catch (error) {
      console.error('Application submission error:', error)
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to submit application. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    // Reset form state
    setTimeout(() => {
      setCurrentStep(1)
      setSubmitted(false)
      setError(null)
      setFormData({
        subject: "",
        message: "",
        proposedBudget: "",
        proposedDeadline: "",
        proposedStartDate: "",
        experience: "",
        portfolio: "",
        additionalNotes: "",
        pastProjects: "",
        applicationType: "standard"
      })
    }, 100)
  }

  // Show confirmation screen if application was submitted
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg max-w-md w-full p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
            <Check className="h-8 w-8 text-green-400" />
          </div>
          
          {/* Success Message */}
          <h2 className="text-2xl font-semibold text-white mb-4">
            Application Submitted!
          </h2>
          <p className="text-gray-300 mb-6">
            {isJobApplication 
              ? "Your job application has been submitted successfully. The client will review your proposal and get back to you soon."
              : "Your service request has been submitted successfully. The artist will review your requirements and respond shortly."
            }
          </p>
          
          {/* Close Button */}
          <Button
            onClick={handleClose}
            className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
          >
            Close
          </Button>
          
          <p className="text-xs text-gray-400 mt-4">
            This window will close automatically in a few seconds
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">{modalTitle}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {post.title || post.serviceName || 'Service Request'} - Step {currentStep} of {totalSteps}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${currentStep >= step.number 
                      ? 'bg-[#A95BAB] text-white' 
                      : 'bg-white/10 text-gray-400'
                    }
                  `}>
                    {currentStep > step.number ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-0.5 mx-4
                    ${currentStep > step.number ? 'bg-[#A95BAB]' : 'bg-white/10'}
                  `} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)] pb-24">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Conditional Form Rendering */}
          {isJobApplication ? (
            <StepJobApplicationForm
              currentStep={currentStep}
              formData={formData}
              onInputChange={handleInputChange}
              post={post}
            />
          ) : (
            <StepServiceContactForm
              currentStep={currentStep}
              formData={formData}
              onInputChange={handleInputChange}
              post={post}
            />
          )}
        </div>

        {/* Footer Navigation - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-6 border-t border-white/10 bg-gray-900">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="bg-transparent border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-3">
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : `Submit ${isJobApplication ? "Application" : "Request"}`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
