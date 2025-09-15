import { useState } from "react"
import { DollarSign, Calendar, Star, FileText, Palette } from "lucide-react"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

export function StepServiceContactForm({ currentStep, formData, onInputChange, post }) {
  const [errors, setErrors] = useState({})

  const validateField = (field, value, currentFormData = formData) => {
    const newErrors = { ...errors }

    switch (field) {
      case 'subject':
        if (!value.trim()) {
          newErrors.subject = 'Subject is required'
        } else if (value.length > 255) {
          newErrors.subject = 'Subject must be 255 characters or less'
        } else {
          delete newErrors.subject
        }
        break

      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Project description is required'
        } else if (value.length < 20) {
          newErrors.message = 'Project description must be at least 20 characters'
        } else if (value.length > 1500) {
          newErrors.message = 'Project description must be 1500 characters or less'
        } else {
          delete newErrors.message
        }
        break

      case 'proposedBudget': {
        if (!value) {
          newErrors.proposedBudget = 'Budget is required'
        } else {
          const budget = parseFloat(value)
          if (isNaN(budget) || budget < 0 || budget > 50000) {
            newErrors.proposedBudget = 'Budget must be between $0 and $50,000'
          } else {
            delete newErrors.proposedBudget
          }
        }
        break
      }

      case 'proposedDeadline': {
        if (value) {
          const selectedDate = new Date(value)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          if (selectedDate < today) {
            newErrors.proposedDeadline = 'Deadline cannot be in the past'
          } else {
            // Use the current form data for validation
            const startDateValue = field === 'proposedStartDate' ? value : currentFormData.proposedStartDate
            if (startDateValue) {
              const startDate = new Date(startDateValue)
              if (selectedDate <= startDate) {
                newErrors.proposedDeadline = 'Deadline must be after the start date'
              } else {
                delete newErrors.proposedDeadline
              }
            } else {
              delete newErrors.proposedDeadline
            }
          }
        } else {
          delete newErrors.proposedDeadline
        }
        break
      }

      case 'proposedStartDate': {
        if (value) {
          const selectedDate = new Date(value)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          
          if (selectedDate < today) {
            newErrors.proposedStartDate = 'Start date cannot be in the past'
          } else {
            // Use the current form data for validation
            const deadlineValue = field === 'proposedDeadline' ? value : currentFormData.proposedDeadline
            if (deadlineValue) {
              const deadlineDate = new Date(deadlineValue)
              if (selectedDate >= deadlineDate) {
                newErrors.proposedStartDate = 'Start date must be before the deadline'
              } else {
                delete newErrors.proposedStartDate
              }
            } else {
              delete newErrors.proposedStartDate
            }
          }
        } else {
          delete newErrors.proposedStartDate
        }
        break
      }

      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    // Update the parent state first
    onInputChange(field, value)
    
    // Create updated form data for validation
    const updatedFormData = { ...formData, [field]: value }
    
    // Validate the current field
    validateField(field, value, updatedFormData)
    
    // If changing date fields, re-validate the other date field too
    if (field === 'proposedStartDate' && updatedFormData.proposedDeadline) {
      validateField('proposedDeadline', updatedFormData.proposedDeadline, updatedFormData)
    } else if (field === 'proposedDeadline' && updatedFormData.proposedStartDate) {
      validateField('proposedStartDate', updatedFormData.proposedStartDate, updatedFormData)
    }
  }

  // Handle numeric input restrictions
  const handleNumericKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if ([8, 9, 27, 13, 46, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        (e.keyCode === 90 && e.ctrlKey === true) ||
        // Allow: home, end, left, right, down, up
        (e.keyCode >= 35 && e.keyCode <= 40)) {
      return
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  const handleNumericInput = (e) => {
    // Remove any non-numeric characters except decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '')
    // Ensure only one decimal point
    const parts = value.split('.')
    if (parts.length > 2) {
      e.target.value = parts[0] + '.' + parts.slice(1).join('')
    } else {
      e.target.value = value
    }
  }

  // Step 1: Service Details, Subject, Project Description
  if (currentStep === 1) {
    return (
      <div className="space-y-6">
        {/* Service Summary */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-start gap-3">
            <Palette className="h-5 w-5 text-[#A95BAB] mt-0.5" />
            <div className="flex-1">
              <h3 className="text-white font-medium mb-2">Service Details</h3>
              <div className="space-y-2">
                <p className="text-gray-300 font-medium break-all line-clamp-2">{post.serviceName || post.title}</p>
                {post.description && (
                  <p className="text-gray-400 text-sm break-all line-clamp-3">{post.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {post.category && (
                    <span className="px-2 py-1 bg-[#A95BAB]/20 text-[#A95BAB] text-xs rounded">
                      {post.category.name || post.category}
                    </span>
                  )}
                  {post.priceRange && (
                    <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">
                      Price: {post.priceRange}
                    </span>
                  )}
                  {post.availabilityStatus && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                      {post.availabilityStatus}
                    </span>
                  )}
                </div>
                {/* Artist Info */}
                {(post.artist || post.user) && (
                  <div className="mt-3 p-2 sm:p-3 bg-white/5 rounded border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Artist</p>
                    <p className="text-white text-sm font-medium break-words truncate">
                      {post.artist?.username || post.user?.username || 'Artist'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subject Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Subject *
          </label>
          <Input
            value={formData.subject || ''}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Brief title for your service request (e.g., 'Logo Design for Tech Startup')"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 break-all"
            maxLength={255}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.subject && <p className="text-red-400 text-xs">{errors.subject}</p>}
            <p className="text-gray-400 text-xs ml-auto">
              {(formData.subject || '').length}/255
            </p>
          </div>
        </div>

        {/* Project Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Description *
          </label>
          <Textarea
            value={formData.message || ''}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Describe your project in detail:
• What type of service do you need?
• What is the scope of the project?
• What are your specific requirements?
• Do you have any design preferences or style in mind?
• What is the intended use/purpose?
• Any reference materials or inspiration?"
            rows={8}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 break-all"
            maxLength={1500}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
            <p className="text-gray-400 text-xs ml-auto">
              {(formData.message || '').length}/1500 (min 20)
            </p>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            Be as detailed as possible to help the artist understand your needs
          </p>
        </div>
      </div>
    )
  }

  // Step 2: Budget, Deadline, Start Date, Priority, Notes
  if (currentStep === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-[#A95BAB]" />
          <h3 className="text-lg font-medium text-white">Project Information</h3>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Budget * (USD)
          </label>
          <div className="relative max-w-md">
            <Input
              type="number"
              value={formData.proposedBudget || ''}
              onChange={(e) => handleInputChange('proposedBudget', e.target.value)}
              onKeyDown={handleNumericKeyDown}
              onInput={handleNumericInput}
              placeholder="0"
              min="0"
              max="50000"
              step="0.01"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-8"
            />
            <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.proposedBudget && (
            <p className="text-red-400 text-xs mt-1">{errors.proposedBudget}</p>
          )}
          <p className="text-gray-400 text-xs mt-1">
            Your budget for this service (max $50,000)
          </p>
        </div>

        {/* Timeline Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preferred Start Date (Optional)
            </label>
            <div className="relative">
              <Input
                type="date"
                value={formData.proposedStartDate || ''}
                onChange={(e) => handleInputChange('proposedStartDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:transform [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-10"
                style={{
                  colorScheme: 'dark',
                  transform: 'translateX(0)'
                }}
              />
              <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-0" />
            </div>
            {errors.proposedStartDate && (
              <p className="text-red-400 text-xs mt-1">{errors.proposedStartDate}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              When you'd like to start this project
            </p>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deadline (Optional)
            </label>
            <div className="relative">
              <Input
                type="date"
                value={formData.proposedDeadline || ''}
                onChange={(e) => handleInputChange('proposedDeadline', e.target.value)}
                min={formData.proposedStartDate || new Date().toISOString().split('T')[0]}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:transform [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-10"
                style={{
                  colorScheme: 'dark',
                  transform: 'translateX(0)'
                }}
              />
              <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-0" />
            </div>
            {errors.proposedDeadline && (
              <p className="text-red-400 text-xs mt-1">{errors.proposedDeadline}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              When you need this completed
            </p>
          </div>
        </div>

        {/* Priority Level */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Priority Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: 'standard', label: 'Standard', desc: 'Normal timeline' },
              { value: 'urgent', label: 'Urgent', desc: 'Faster delivery needed' },
              { value: 'rush', label: 'Rush', desc: 'ASAP delivery' }
            ].map((priority) => (
              <button
                key={priority.value}
                type="button"
                onClick={() => handleInputChange('applicationType', priority.value)}
                className={`
                  p-3 rounded-lg border text-left transition-colors
                  ${formData.applicationType === priority.value
                    ? 'border-[#A95BAB] bg-[#A95BAB]/10 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-white/30'
                  }
                `}
              >
                <div className="font-medium">{priority.label}</div>
                <div className="text-xs text-gray-400">{priority.desc}</div>
              </button>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Select the urgency level for your project
          </p>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Additional Notes (Optional)
          </label>
          <Textarea
            value={formData.additionalNotes || ''}
            onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
            placeholder="Additional information:
• Special requirements or considerations
• Preferred communication methods
• File formats needed
• Revision expectations
• Any other important details"
            rows={4}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 break-all"
            maxLength={1000}
          />
          <p className="text-gray-400 text-xs mt-1">
            Any additional information for the artist ({(formData.additionalNotes || '').length}/1000)
          </p>
        </div>
      </div>
    )
  }

  // Step 3: Review
  if (currentStep === 3) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-[#A95BAB]" />
          <h3 className="text-lg font-medium text-white">Review Your Request</h3>
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Please review your service request before submitting. You can go back to make changes if needed.
        </p>

        {/* Request Summary */}
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Request Details</h4>
            <div className="space-y-2">
              <div>
                <span className="text-gray-400 text-sm">Subject:</span>
                <p className="text-white">{formData.subject}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Project Description:</span>
                <p className="text-white whitespace-pre-wrap line-clamp-4">{formData.message}</p>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Project Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 text-sm">Budget:</span>
                <p className="text-white">${formData.proposedBudget}</p>
              </div>
              {formData.proposedDeadline && (
                <div>
                  <span className="text-gray-400 text-sm">Deadline:</span>
                  <p className="text-white">{new Date(formData.proposedDeadline).toLocaleDateString()}</p>
                </div>
              )}
              {formData.proposedStartDate && (
                <div>
                  <span className="text-gray-400 text-sm">Start Date:</span>
                  <p className="text-white">{new Date(formData.proposedStartDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <span className="text-gray-400 text-sm">Priority:</span>
                <p className="text-white capitalize">
                  {formData.applicationType === 'standard' && 'Standard'}
                  {formData.applicationType === 'urgent' && 'Urgent'}
                  {formData.applicationType === 'rush' && 'Rush'}
                </p>
              </div>
            </div>

            {formData.additionalNotes && (
              <div className="mt-4">
                <span className="text-gray-400 text-sm">Additional Notes:</span>
                <p className="text-white whitespace-pre-wrap">{formData.additionalNotes}</p>
              </div>
            )}
          </div>

          {/* Service Provider Info */}
          <div className="p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3 text-sm sm:text-base">Service Provider</h4>
            <div className="space-y-2">
              <div>
                <span className="text-gray-400 text-sm">Artist:</span>
                <p className="text-white text-sm break-words">{post.artist?.username || post.user?.username || 'Artist'}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Service:</span>
                <p className="text-white text-sm break-all">{post.serviceName || post.title}</p>
              </div>
              {post.category && (
                <div>
                  <span className="text-gray-400 text-sm">Category:</span>
                  <p className="text-white text-sm break-words">{post.category.name || post.category}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-sm">
            <strong>Important:</strong> Once submitted, your service request will be sent to the artist. 
            They will review your requirements and respond with their availability and any clarifying questions.
          </p>
        </div>
      </div>
    )
  }

  return null
}
