import { useState } from "react"
import { DollarSign, Calendar, Briefcase, FileText, Star } from "lucide-react"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

export function StepJobApplicationForm({ currentStep, formData, onInputChange, post }) {
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
          newErrors.message = 'Cover letter is required'
        } else if (value.length < 50) {
          newErrors.message = 'Cover letter must be at least 50 characters'
        } else if (value.length > 2000) {
          newErrors.message = 'Cover letter must be 2000 characters or less'
        } else {
          delete newErrors.message
        }
        break

      case 'proposedBudget': {
        const budget = parseFloat(value)
        if (value && (isNaN(budget) || budget < 0 || budget > 100000)) {
          newErrors.proposedBudget = 'Budget must be between $0 and $100,000'
        } else {
          delete newErrors.proposedBudget
        }
        break
      }

      case 'proposedDeadline': {
        if (!value) {
          newErrors.proposedDeadline = 'Proposed deadline is required'
        } else {
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

  // Step 1: Job Details, Subject, Cover Letter
  if (currentStep === 1) {
    return (
      <div className="space-y-6">
        {/* Job Post Summary */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-[#A95BAB] mt-0.5" />
            <div className="flex-1">
              <h3 className="text-white font-medium mb-2">Job Details</h3>
              <div className="space-y-2">
                <p className="text-gray-300 font-medium">{post.title}</p>
                {post.description && (
                  <p className="text-gray-400 text-sm line-clamp-3">{post.description}</p>
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
                  {post.deadline && (
                    <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded">
                      Deadline: {new Date(post.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
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
            placeholder="Brief title for your application (e.g., 'Experienced UI/UX Designer for Mobile App Project')"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            maxLength={255}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.subject && <p className="text-red-400 text-xs">{errors.subject}</p>}
            <p className="text-gray-400 text-xs ml-auto">
              {(formData.subject || '').length}/255
            </p>
          </div>
        </div>

        {/* Cover Letter Field */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Cover Letter *
          </label>
          <Textarea
            value={formData.message || ''}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Write a compelling cover letter that explains:
• Why you're the perfect fit for this job
• Your relevant experience and skills
• Your approach to completing this project
• What makes you unique as a candidate
• Any questions you have about the project"
            rows={8}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
            <p className="text-gray-400 text-xs ml-auto">
              {(formData.message || '').length}/2000 (min 50)
            </p>
          </div>
          <p className="text-gray-400 text-xs mt-1">
            Take time to craft a personalized message that showcases your expertise
          </p>
        </div>
      </div>
    )
  }

  // Step 2: Budget, Deadline, Start Date, Experience, Portfolio, Past Projects, Notes
  if (currentStep === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-[#A95BAB]" />
          <h3 className="text-lg font-medium text-white">Professional Information</h3>
        </div>

        {/* Budget and Timeline Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Proposed Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proposed Budget * (USD)
            </label>
            <div className="relative">
              <Input
                type="number"
                value={formData.proposedBudget || ''}
                onChange={(e) => handleInputChange('proposedBudget', e.target.value)}
                onKeyDown={handleNumericKeyDown}
                onInput={handleNumericInput}
                placeholder="0"
                min="0"
                max="100000"
                step="0.01"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-8"
              />
              <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.proposedBudget && (
              <p className="text-red-400 text-xs mt-1">{errors.proposedBudget}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Your proposed rate for this project
            </p>
          </div>

          {/* Proposed Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proposed Start Date (Optional)
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
              When you prefer to start working on this project
            </p>
          </div>
        </div>

        {/* Proposed Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Proposed Deadline *
          </label>
          <div className="relative max-w-md">
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
            When you can deliver this project
          </p>
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Relevant Experience (Optional)
          </label>
          <Textarea
            value={formData.experience || ''}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="Describe your relevant experience for this type of project:
• Years of experience in this field
• Similar projects you've completed
• Specific skills that match this job
• Certifications or qualifications"
            rows={4}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            maxLength={1000}
          />
          <p className="text-gray-400 text-xs mt-1">
            Highlight experience relevant to this specific project ({(formData.experience || '').length}/1000)
          </p>
        </div>

        {/* Portfolio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Portfolio Items (Optional)
          </label>
          <Textarea
            value={formData.portfolio || ''}
            onChange={(e) => handleInputChange('portfolio', e.target.value)}
            placeholder="Share links to relevant work samples:
• Direct links to your best work
• Behance, Dribbble, or personal website
• Specific projects similar to this job
• Max 10 portfolio pieces"
            rows={4}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          <p className="text-gray-400 text-xs mt-1">
            Links to portfolio pieces relevant to this project
          </p>
        </div>

        {/* Past Projects */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Past Projects (Optional)
          </label>
          <Textarea
            value={formData.pastProjects || ''}
            onChange={(e) => handleInputChange('pastProjects', e.target.value)}
            placeholder="Describe similar projects you've completed:
• Project names and brief descriptions
• Technologies or tools used
• Results achieved
• Client testimonials or feedback"
            rows={4}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            maxLength={1000}
          />
          <p className="text-gray-400 text-xs mt-1">
            Brief description of similar projects you've successfully completed ({(formData.pastProjects || '').length}/1000)
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
            placeholder="Any additional information:
• Questions about the project
• Special requirements or considerations
• Your working style or preferences
• Availability notes"
            rows={3}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            maxLength={500}
          />
          <p className="text-gray-400 text-xs mt-1">
            Any additional information you'd like to share ({(formData.additionalNotes || '').length}/500)
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
          <h3 className="text-lg font-medium text-white">Review Your Application</h3>
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Please review your application details before submitting. You can go back to make changes if needed.
        </p>

        {/* Application Summary */}
        <div className="space-y-4">
          {/* Basic Information */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Application Details</h4>
            <div className="space-y-2">
              <div>
                <span className="text-gray-400 text-sm">Subject:</span>
                <p className="text-white">{formData.subject}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Cover Letter:</span>
                <p className="text-white whitespace-pre-wrap line-clamp-4">{formData.message}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white font-medium mb-3">Professional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 text-sm">Proposed Budget:</span>
                <p className="text-white">${formData.proposedBudget}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Proposed Deadline:</span>
                <p className="text-white">
                  {formData.proposedDeadline ? new Date(formData.proposedDeadline).toLocaleDateString() : 'Not specified'}
                </p>
              </div>
              {formData.proposedStartDate && (
                <div>
                  <span className="text-gray-400 text-sm">Start Date:</span>
                  <p className="text-white">{new Date(formData.proposedStartDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {formData.experience && (
              <div className="mt-4">
                <span className="text-gray-400 text-sm">Experience:</span>
                <p className="text-white whitespace-pre-wrap line-clamp-3">{formData.experience}</p>
              </div>
            )}

            {formData.portfolio && (
              <div className="mt-4">
                <span className="text-gray-400 text-sm">Portfolio:</span>
                <p className="text-white whitespace-pre-wrap line-clamp-2">{formData.portfolio}</p>
              </div>
            )}

            {formData.pastProjects && (
              <div className="mt-4">
                <span className="text-gray-400 text-sm">Past Projects:</span>
                <p className="text-white whitespace-pre-wrap line-clamp-3">{formData.pastProjects}</p>
              </div>
            )}

            {formData.additionalNotes && (
              <div className="mt-4">
                <span className="text-gray-400 text-sm">Additional Notes:</span>
                <p className="text-white whitespace-pre-wrap">{formData.additionalNotes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-sm">
            <strong>Important:</strong> Once submitted, your application will be sent to the client. 
            Make sure all information is accurate and complete.
          </p>
        </div>
      </div>
    )
  }

  return null
}
