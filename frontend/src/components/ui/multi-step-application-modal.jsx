"use client"

import { useState } from "react"
import { X, ArrowLeft, ArrowRight, User, MessageSquare, DollarSign, Calendar, Check } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { Textarea } from "./textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { applicationsAPI } from "../../services/api"

const steps = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Proposal", icon: MessageSquare },
  { id: 3, title: "Terms", icon: DollarSign },
  { id: 4, title: "Review", icon: Check }
]

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
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    proposedBudget: "",
    proposedDeadline: "",
    portfolio: "",
    experience: "",
    additionalNotes: ""
  })

  if (!isOpen || !post) return null

  const isJobApplication = applicationType === "artist_to_job"
  const modalTitle = isJobApplication ? "Apply for Job" : "Hire Artist"

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
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
    setError(null)
    
    // Validate message length
    if (!formData.message || formData.message.trim().length < 10) {
      setError('Message must be at least 10 characters long')
      setIsSubmitting(false)
      return
    }
    
    try {
      if (isJobApplication) {
        // Artist applying to job
        const applicationData = {
          jobPostId: post.id || post.jobId,
          artistId: 1, // TODO: Get from auth context
          message: formData.message,
          proposedBudget: parseFloat(formData.proposedBudget),
          proposedDeadline: formData.proposedDeadline,
          applicationType: "artist_to_job"
        }
        await applicationsAPI.create(applicationData)
      } else {
        // Client hiring artist
        const applicationData = {
          availabilityPostId: post.postId || post.id,
          clientId: 1, // TODO: Get from auth context
          applicationType: "client_to_service",
          message: formData.message,
          proposedBudget: formData.proposedBudget ? parseFloat(formData.proposedBudget) : null,
          proposedDeadline: formData.proposedDeadline || null
        }
        console.log('Sending application data:', applicationData);
        await applicationsAPI.applyToService(applicationData)
      }
      
      onSuccess?.()
      onClose()
      setCurrentStep(1)
      setFormData({
        name: "",
        message: "",
        proposedBudget: "",
        proposedDeadline: "",
        portfolio: "",
        experience: "",
        additionalNotes: ""
      })
    } catch (error) {
      console.error('Application submission error:', error)
      setError(error.response?.data?.message || error.message || 'Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                {isJobApplication ? "Tell us about yourself" : "Your contact information"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                {isJobApplication && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Portfolio URL (Optional)
                    </label>
                    <Input
                      value={formData.portfolio}
                      onChange={(e) => handleInputChange('portfolio', e.target.value)}
                      placeholder="https://your-portfolio.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                {isJobApplication ? "Your Proposal" : "Project Details"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isJobApplication ? "Cover Letter" : "Project Description"}
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder={
                      isJobApplication 
                        ? "Explain why you're the perfect fit for this job..."
                        : "Describe your project requirements in detail..."
                    }
                    rows={6}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                {isJobApplication && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Relevant Experience
                    </label>
                    <Textarea
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="Describe your relevant experience for this project..."
                      rows={4}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Project Terms
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isJobApplication ? "Your Rate" : "Proposed Budget"}
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={formData.proposedBudget}
                      onChange={(e) => handleInputChange('proposedBudget', e.target.value)}
                      placeholder="0"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-8"
                    />
                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {isJobApplication 
                      ? "Your proposed rate for this project"
                      : "Your budget for this project"
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {isJobApplication ? "Estimated Delivery" : "Preferred Deadline"}
                  </label>
                  <Input
                    type="date"
                    value={formData.proposedDeadline}
                    onChange={(e) => handleInputChange('proposedDeadline', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <Textarea
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional terms or requirements..."
                    rows={3}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">
                Review Your Application
              </h3>
              <div className="space-y-4">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">
                      {isJobApplication ? "Job Details" : "Service Details"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-white font-medium">{post.title}</p>
                    <p className="text-gray-300 text-sm line-clamp-2">{post.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-white/20 text-gray-300">
                        {post.category}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-gray-300">
                        {post.budget}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Your Application</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-gray-300 text-sm font-medium">Contact</p>
                      <p className="text-white">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm font-medium">
                        {isJobApplication ? "Proposed Rate" : "Budget"}
                      </p>
                      <p className="text-white">${formData.proposedBudget}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm font-medium">Timeline</p>
                      <p className="text-white">
                        {new Date(formData.proposedDeadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm font-medium">Message</p>
                      <p className="text-white text-sm line-clamp-3">{formData.message}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">{modalTitle}</h2>
            <p className="text-gray-400 text-sm mt-1">
              Step {currentStep} of {steps.length}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isCompleted
                      ? "bg-[#A95BAB] border-[#A95BAB] text-white"
                      : isActive
                      ? "border-[#A95BAB] text-[#A95BAB] bg-[#A95BAB]/10"
                      : "border-gray-600 text-gray-400"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`ml-2 text-sm ${
                    isActive ? "text-white" : isCompleted ? "text-[#A95BAB]" : "text-gray-400"
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      step.id < currentStep ? "bg-[#A95BAB]" : "bg-gray-600"
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="border-white/20 text-white hover:bg-white/10 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}