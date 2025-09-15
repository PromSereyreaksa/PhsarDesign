import { useState } from "react"
import { DollarSign, Calendar } from "lucide-react"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Button } from "../ui/button"

export function ServiceContactForm({ 
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
        } else if (value.length < 20) {
          newErrors.message = 'Message must be at least 20 characters'
        } else if (value.length > 1500) {
          newErrors.message = 'Message must be 1500 characters or less'
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
            delete newErrors.proposedDeadline
          }
        } else {
          delete newErrors.proposedDeadline
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
    const requiredFields = ['subject', 'message', 'proposedBudget']
    
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
    if (formData.message.length < 20 || formData.message.length > 1500) return false
    
    const budget = parseFloat(formData.proposedBudget)
    if (isNaN(budget) || budget < 0 || budget > 50000) return false

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
          placeholder="Brief description of your project needs"
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
          Project Description *
        </label>
        <Textarea
          value={formData.message || ''}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder="Describe your project requirements, style preferences, and any specific details the artist should know..."
          rows={6}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 break-all"
          maxLength={1500}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
          <p className="text-gray-400 text-xs ml-auto">
            {(formData.message || '').length}/1500 (min 20)
          </p>
        </div>
      </div>

      {/* Proposed Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Project Budget * (USD)
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
          Your budget for this project (max $50,000)
        </p>
      </div>

      {/* Proposed Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Preferred Deadline (Optional)
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
          When you'd like the project completed
        </p>
      </div>

      {/* Proposed Start Date */}
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
        <p className="text-gray-400 text-xs mt-1">
          When you'd like to start the project
        </p>
      </div>

      {/* Application Type / Priority */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Project Priority (Optional)
        </label>
        <select
          value={formData.applicationType || 'standard'}
          onChange={(e) => handleInputChange('applicationType', e.target.value)}
          className="w-full bg-white/10 border-white/20 border rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB]"
        >
          <option value="flexible" className="bg-gray-800 text-white">
            Flexible - No rush, can work around artist's schedule
          </option>
          <option value="standard" className="bg-gray-800 text-white">
            Standard - Normal timeline expected
          </option>
          <option value="urgent" className="bg-gray-800 text-white">
            Urgent - Need to start soon
          </option>
        </select>
        <p className="text-gray-400 text-xs mt-1">
          How quickly you need this project completed
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
          placeholder="Any additional requirements, style references, or specific requests..."
          rows={3}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 break-all"
          maxLength={500}
        />
        <p className="text-gray-400 text-xs mt-1">
          Any additional information or specific requests
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={onSubmit}
          disabled={!isValid() || isSubmitting}
          className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Sending Request..." : "Send Service Request"}
        </Button>
      </div>
    </div>
  )
}
