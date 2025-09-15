import { Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { applicationsAPI } from "../../lib/api"
import { fetchNotifications, fetchUnreadCount } from "../../store/slices/notificationsSlice"
import store from "../../store/store"
import { StepJobApplicationForm } from "../marketplace/StepJobApplicationForm"
import { StepServiceContactForm } from "../marketplace/StepServiceContactForm"
import { Button } from "../ui/button"
import { showToast } from "../ui/toast"

/**
 * Multi-step Application Modal Component
 * Handles both job applications (artist → client) and service contacts (client → artist)
 * with a 3-step wizard interface
 */
export function MultiStepApplicationModal({ 
  isOpen, 
  onClose, 
  post, 
  onSuccess
}) {
  const dispatch = useDispatch()
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
    additionalNotes: "",
    
    // Step 3 is review only
  })

  if (!isOpen || !post) return null

  // Determine application type based on post type or URL
  const determineApplicationType = () => {
    // Check if we're on jobs section or if post has job-related fields
    const currentPath = window.location.pathname
    
    if (currentPath.includes('/jobs') || currentPath.includes('/marketplace/category/jobs')) {
      return 'artist_to_job'
    }
    
    if (currentPath.includes('/services') || currentPath.includes('/marketplace/category/services')) {
      return 'client_to_service'
    }
    
    // Fallback: check post properties
    if (post.jobId || post.jobPostId || post.type === 'job' || post.section === 'jobs') {
      return 'artist_to_job'
    }
    
    if (post.availabilityPostId || post.postId || post.type === 'availability' || post.section === 'services') {
      return 'client_to_service'
    }
    
    // Default fallback based on post structure
    return post.client ? 'artist_to_job' : 'client_to_service'
  }

  const applicationType = determineApplicationType()
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

      console.log('🔥 Pre-submission debug:', {
        currentUser: {
          userId: user.userId,
          role: user.role,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        post: {
          id: post.id,
          jobId: post.jobId,
          jobPostId: post.jobPostId,
          clientId: post.clientId,
          client: post.client,
          userId: post.userId,
          postType: post.postType
        },
        applicationType: applicationType,
        isJobApplication
      })

      if (isJobApplication) {
        // Artist applying to job - validate user is artist
        if (!user.role || (user.role !== 'artist' && user.role !== 'freelancer')) {
          showToast(`Only artists can apply to jobs. Your current role is: ${user.role || 'unknown'}`, 'error')
          setIsSubmitting(false)
          return
        }

        // Validate receiver (client) exists - use the client's user ID, not the clientId
        const receiverId = post.client?.user?.userId || post.userId
        if (!receiverId) {
          showToast('Unable to identify the job poster. Please try again later.', 'error')
          setIsSubmitting(false)
          return
        }

        // Artist applying to job
        const applicationData = {
          senderId: user.userId, // Current user (artist) applying
          receiverId: receiverId, // Job poster (client)
          jobId: post.jobId || post.jobPostId || post.id,
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
        
        console.log('🔥 Job application data being sent:', {
          ...applicationData,
          currentUser: user,
          currentUserRole: user.role,
          post: post,
          postClient: post.client,
          receiverIdUsed: receiverId,
          receiverIdOptions: {
            'post.client?.user?.userId (USED)': post.client?.user?.userId,
            'post.userId (fallback)': post.userId,
            'post.clientId (NOT used)': post.clientId,
            'post.client?.clientId (NOT used)': post.client?.clientId
          }
        })
        
        await applicationsAPI.applyToJob(applicationData)
      } else {
        // Client contacting artist for service
        const applicationData = {
          senderId: user.userId, // Current user (client) requesting service
          receiverId: post.artistId || post.artist?.artistId || post.userId, // Service provider (artist)
          postId: post.postId, // Use availabilityPostId for service requests
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          proposedBudget: parseFloat(formData.proposedBudget),
          proposedDeadline: formData.proposedDeadline || null,
          proposedStartDate: formData.proposedStartDate || null,
          experience: formData.experience?.trim() || null,
          portfolio: formData.portfolio?.trim() || null,
          additionalNotes: formData.additionalNotes?.trim() || null,
          pastProjects: formData.pastProjects?.trim() || null
        }
        
        await applicationsAPI.applyToService(applicationData)
      }
      
      setSubmitted(true)
      onSuccess?.()
      
      // Show success toast
      showToast("Your application has been sent successfully!", "success")
      
      // Fetch updated notifications after successful application
      try {
        console.log('[MultiStepApplicationModal] Dispatching notification fetch actions...')
        await dispatch(fetchNotifications())
        await dispatch(fetchUnreadCount())
        console.log('[MultiStepApplicationModal] Notification fetch actions dispatched successfully')
      } catch (notificationError) {
        console.warn('Failed to fetch updated notifications:', notificationError)
        // Don't fail the entire flow if notification fetch fails
      }
      
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
        pastProjects: ""
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-1 sm:p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-[95vw] sm:max-w-4xl max-h-[98vh] sm:max-h-[90vh] overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-white/10 flex-shrink-0">
          <div className="min-w-0 flex-1 pr-2 sm:pr-4">
            <h2 className="text-base sm:text-xl font-semibold text-white truncate">{modalTitle}</h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 truncate">
              {post.title || post.serviceName || 'Service Request'} - Step {currentStep} of {totalSteps}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-gray-400 hover:text-white flex-shrink-0 w-8 h-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-white/10">
          <div className="flex items-center justify-center sm:justify-between overflow-x-auto">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-max">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`
                      w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0
                      ${currentStep >= step.number 
                        ? 'bg-[#A95BAB] text-white' 
                        : 'bg-white/10 text-gray-400'
                      }
                    `}>
                      {currentStep > step.number ? (
                        <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-2 sm:ml-3 hidden sm:block">
                    <p className={`text-xs sm:text-sm font-medium ${
                      currentStep >= step.number ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-8 sm:flex-1 h-0.5 mx-2 sm:mx-4
                    ${currentStep > step.number ? 'bg-[#A95BAB]' : 'bg-white/10'}
                  `} />
                )}
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="pb-4 sm:pb-6">
            {error && (
              <div className="mb-4 sm:mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4">
                <p className="text-red-400 text-sm break-words">{error}</p>
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
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 sm:p-6 border-t border-white/10 bg-gray-900 gap-3 sm:gap-0 flex-shrink-0">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="bg-transparent border-white/20 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1 w-full sm:w-auto text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto">
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm"
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
