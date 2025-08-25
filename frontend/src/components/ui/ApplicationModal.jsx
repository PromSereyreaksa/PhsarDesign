import { useState } from "react"
import { X, Check } from "lucide-react"
import { Button } from "../ui/button"
import { applicationsAPI } from "../../lib/api"
import store from "../../store/store"
import { JobApplicationForm } from "../marketplace/JobApplicationForm"
import { ServiceContactForm } from "../marketplace/ServiceContactForm"
import { showToast } from "../ui/toast"

/**
 * Reusable Application Modal Component
 * Handles both job applications (artist → client) and service contacts (client → artist)
 */
export function ApplicationModal({ 
  isOpen, 
  onClose, 
  post, 
  onSuccess, 
  applicationType = "artist_to_job" // or "client_to_service"
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    proposedBudget: "",
    proposedDeadline: "",
    proposedStartDate: "",
    experience: "",
    portfolio: "",
    additionalNotes: "",
    pastProjects: "",
    applicationType: "standard" // for service contact form priority
  })

  if (!isOpen || !post) return null

  const isJobApplication = applicationType === "artist_to_job"
  const modalTitle = isJobApplication ? "Apply for Job" : "Contact Artist for Service"

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear any previous errors when user starts typing
    if (error) setError(null)
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
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">{modalTitle}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {post.title || post.serviceName || 'Service Request'}
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Post Summary */}
          <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-white font-medium mb-2">
              {isJobApplication ? "Job Details" : "Service Details"}
            </h3>
            <div className="space-y-1">
              <p className="text-gray-300">{post.title || post.serviceName}</p>
              {post.description && (
                <p className="text-gray-400 text-sm line-clamp-2">{post.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {post.category && (
                  <span className="px-2 py-1 bg-[#A95BAB]/20 text-[#A95BAB] text-xs rounded">
                    {post.category.name || post.category}
                  </span>
                )}
                {post.budget && (
                  <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">
                    Budget: {post.budget}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Conditional Form Rendering */}
          {isJobApplication ? (
            <JobApplicationForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          ) : (
            <ServiceContactForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  )
}
