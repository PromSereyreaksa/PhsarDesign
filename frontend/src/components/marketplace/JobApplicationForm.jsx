import { useState } from "react"
import { DollarSign, Calendar } from "lucide-react"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

export function JobApplicationForm({ 
  formData, 
  onInputChange, 
  onSubmit, 
  isSubmitting, 
  error 
}) {
  const [errors, setErrors] = useState({})

  const validateField = (field, value) => {
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
          newErrors.message = 'Message is required'
        } else if (value.length < 50) {
          newErrors.message = 'Message must be at least 50 characters'
        } else if (value.length > 2000) {
          newErrors.message = 'Message must be 2000 characters or less'
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
            delete newErrors.proposedDeadline
          }
        }
        break
      }

      case 'portfolio':
        if (value && formData.portfolio.length > 10) {
          newErrors.portfolio = 'Maximum 10 portfolio items allowed'
        } else {
          delete newErrors.portfolio
        }
        break

      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    onInputChange(field, value)
    validateField(field, value)
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

  const isValid = () => {
    const requiredFields = ['subject', 'message', 'proposedBudget', 'proposedDeadline']
    
    // Check required fields
    for (const field of requiredFields) {
      if (!formData[field] || !formData[field].toString().trim()) {
        return false
      }
    }

    // Check for validation errors
    if (Object.keys(errors).length > 0) {
      return false
    }

    // Validate field values
    if (formData.subject.length > 255) return false
    if (formData.message.length < 50 || formData.message.length > 2000) return false
    
    const budget = parseFloat(formData.proposedBudget)
    if (isNaN(budget) || budget < 0 || budget > 100000) return false

    return true
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Subject Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Subject *
        </label>
        <Input
          value={formData.subject || ''}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          placeholder="Brief title for your application"
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

      {/* Message Field */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Cover Letter *
        </label>
        <Textarea
          value={formData.message || ''}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder="Explain why you're the perfect fit for this job. Describe your relevant experience, approach, and what makes you unique..."
          rows={6}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 break-all"
          maxLength={2000}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
          <p className="text-gray-400 text-xs ml-auto">
            {(formData.message || '').length}/2000 (min 50)
          </p>
        </div>
      </div>

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
          Your proposed rate for this project (max $100,000)
        </p>
      </div>

      {/* Proposed Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Proposed Deadline *
        </label>
        <div className="relative">
          <Input
            type="date"
            value={formData.proposedDeadline || ''}
            onChange={(e) => handleInputChange('proposedDeadline', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
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

      {/* Optional: Proposed Start Date */}
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
        <p className="text-gray-400 text-xs mt-1">
          When you prefer to start working on this project
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
          placeholder="Describe your relevant experience for this type of project..."
          rows={3}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 break-all"
          maxLength={1000}
        />
        <p className="text-gray-400 text-xs mt-1">
          Highlight experience relevant to this specific project
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
          placeholder="Share links to relevant work samples (max 10 items)..."
          rows={3}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 break-all"
        />
        {errors.portfolio && (
          <p className="text-red-400 text-xs mt-1">{errors.portfolio}</p>
        )}
        <p className="text-gray-400 text-xs mt-1">
          Links to portfolio pieces relevant to this project (max 10)
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
          placeholder="Describe similar projects you've completed..."
          rows={3}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 break-all"
          maxLength={1000}
        />
        <p className="text-gray-400 text-xs mt-1">
          Brief description of similar projects you've successfully completed
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
          placeholder="Any additional information or questions..."
          rows={3}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 break-all"
          maxLength={500}
        />
        <p className="text-gray-400 text-xs mt-1">
          Any additional information you'd like to share
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={onSubmit}
          disabled={!isValid() || isSubmitting}
          className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Submitting Application..." : "Submit Job Application"}
        </Button>
      </div>
    </div>
  )
}
