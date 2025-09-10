"use client"

import { Briefcase, Calendar, DollarSign, MapPin, Tag, Trash2, Upload, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "../../store/slices/categoriesSlice"
import Loader from "../ui/Loader"

const CreateJobPostForm = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const dispatch = useDispatch()
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories)
  const { user } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    budgetType: "fixed",
    deadline: "",
    skillRequired: "",
    experienceLevel: "",
    categoryId: "",
    location: "",
    attachments: [],
    isActive: true,
  })

  const [uploadingImages, setUploadingImages] = useState(false)

  // RBAC Check - Only clients can use this form
  useEffect(() => {
    if (user && user.role !== 'client') {
      const showToast = async () => {
        const { showToast } = await import("../../components/ui/toast")
        showToast(`Access denied. Only clients can create job posts. Your role: ${user.role}`, 'error')
      }
      showToast()
    }
  }, [user])

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const experienceLevels = ["Entry Level", "Intermediate", "Expert", "Any Level"]

  const budgetTypes = ["Fixed Price", "Hourly Rate", "Negotiable"]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Numeric input validation handlers
  const handleNumericKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, period for decimals
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
        (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
        (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
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
    const value = e.target.value
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '')
    
    // Ensure only one decimal point
    const parts = numericValue.split('.')
    if (parts.length > 2) {
      e.target.value = parts[0] + '.' + parts.slice(1).join('')
    } else {
      e.target.value = numericValue
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB

      if (!isValidType) {
        const showToast = async () => {
          const { showToast } = await import("../../components/ui/toast")
          showToast(`${file.name} is not a valid image file`, 'error')
        }
        showToast()
        return false
      }
      if (!isValidSize) {
        const showToast = async () => {
          const { showToast } = await import("../../components/ui/toast")
          showToast(`${file.name} is too large (max 10MB)`, 'error')
        }
        showToast()
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Check total attachments limit
    if (formData.attachments.length + validFiles.length > 5) {
      const { showToast } = await import("../../components/ui/toast")
      showToast('You can upload maximum 5 images', 'error')
      return;
    }

    setUploadingImages(true)

    try {
      // Create local URLs for preview while keeping the File objects for upload
      const newAttachments = await Promise.all(
        validFiles.map(async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              resolve({
                url: e.target.result, // base64 data URL for preview
                file: file, // Keep the actual File object for upload
                name: file.name,
                uploaded: false, // Will be set to true after successful backend upload
                size: file.size,
              })
            }
            reader.readAsDataURL(file)
          })
        }),
      )

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
      }))

      console.log("Files prepared for upload:", newAttachments.length)
      const { showToast } = await import("../../components/ui/toast")
      showToast(`${newAttachments.length} image(s) added successfully! Images will be uploaded when you submit the form.`, 'success')
    } catch (error) {
      console.error("Image processing failed:", error)
      const { showToast } = await import("../../components/ui/toast")
      showToast(`Failed to process images: ${error.message}`, 'error')
    } finally {
      setUploadingImages(false)
      // Reset file input
      e.target.value = ""
    }
  }

  // Remove attachment function
  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  // Form submission function - Redux-only approach with RBAC
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    // RBAC enforcement - Double check user role
    if (!user || user.role !== 'client') {
      const { showToast } = await import("../../components/ui/toast")
      showToast('Access denied. Only clients can create job posts.', 'error')
      return;
    }

    try {
      setUploadingImages(true)

      // Validation with toast notifications
      if (!formData.title.trim()) {
        const { showToast } = await import("../../components/ui/toast")
        showToast("Please enter a job title", 'error')
        setUploadingImages(false)
        return
      }

      if (formData.title.trim().length < 5 || formData.title.trim().length > 255) {
        const { showToast } = await import("../../components/ui/toast")
        showToast("Job title must be between 5 and 255 characters", 'error')
        setUploadingImages(false)
        return
      }

      if (!formData.description.trim()) {
        const { showToast } = await import("../../components/ui/toast")
        showToast("Please enter a job description", 'error')
        setUploadingImages(false)
        return
      }

      if (formData.description.trim().length < 20 || formData.description.trim().length > 5000) {
        const { showToast } = await import("../../components/ui/toast")
        showToast("Job description must be between 20 and 5000 characters", 'error')
        setUploadingImages(false)
        return
      }

      if (!formData.categoryId) {
        const { showToast } = await import("../../components/ui/toast")
        showToast("Please select a category", 'error')
        setUploadingImages(false)
        return
      }

      if (!formData.budget || parseFloat(formData.budget) <= 0) {
        const { showToast } = await import("../../components/ui/toast")
        showToast("Please enter a valid budget", 'error')
        setUploadingImages(false)
        return
      }

      if (!formData.deadline) {
        const { showToast } = await import("../../components/ui/toast")
        showToast("Please select a deadline", 'error')
        setUploadingImages(false)
        return
      }

      // Check if deadline is in the future
      const deadlineDate = new Date(formData.deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (deadlineDate <= today) {
        const { showToast } = await import("../../components/ui/toast")
        showToast("Deadline must be in the future", 'error')
        setUploadingImages(false)
        return
      }

      // Get client ID
      const clientId = user.userId || user.clientId || user.id || user._id;
      console.log("=== CLIENT ID DETECTION ===");
      console.log("Detected clientId:", clientId);
      
      if (!clientId) {
        console.error("=== CLIENT ID ERROR ===");
        console.error("Could not find any valid user ID field");
        console.error("Available user fields:", Object.keys(user || {}));
        const { showToast } = await import("../../components/ui/toast")
        showToast("Unable to identify your user ID. Please try logging out and logging in again.", 'error')
        setUploadingImages(false);
        return;
      }

      // Construct multipart payload expected by backend route upload.array('attachment', 10)
      const submitData = new FormData()
      const appendIfPresent = (key, value) => {
        if (value !== undefined && value !== null && `${value}` !== "") {
          submitData.append(key, value)
        }
      }

      appendIfPresent("clientId", clientId)
      appendIfPresent("title", formData.title?.trim())
      appendIfPresent("description", formData.description?.trim())
      appendIfPresent("budget", parseFloat(formData.budget))
      appendIfPresent("budgetType", formData.budgetType)
      appendIfPresent("skillRequired", formData.skillRequired?.trim())
      appendIfPresent("experienceLevel", formData.experienceLevel)
      appendIfPresent("categoryId", parseInt(formData.categoryId))
      appendIfPresent("location", formData.location?.trim())
      // Convert date to ISO if possible
      appendIfPresent("deadline", formData.deadline ? new Date(formData.deadline).toISOString() : undefined)
      appendIfPresent("isActive", formData.isActive.toString())

      // Add postType to indicate this is a job post for the Redux thunk
      submitData.append("postType", "job")

      // Append files
      ;(formData.attachments || [])
        .map((a) => a?.file)
        .filter(Boolean)
        .forEach((file) => submitData.append("attachment", file))

      console.log("=== JOB POST FORM SUBMISSION DEBUG ===");
      console.log("Submitting form data:");
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      // Reset form after validation passes
      setFormData({
        title: "",
        description: "",
        budget: "",
        budgetType: "fixed",
        deadline: "",
        skillRequired: "",
        experienceLevel: "",
        categoryId: "",
        location: "",
        attachments: [],
        isActive: true,
      })

      // Call parent onSubmit (which uses Redux)
      onSubmit(submitData)
    } catch (error) {
      console.error("=== JOB POST FORM SUBMISSION ERROR ===");
      console.error("Error object:", error);
      const { showToast } = await import("../../components/ui/toast")
      const errorMessage = error.message || "An unexpected error occurred";
      showToast(`Failed to submit job post: ${errorMessage}`, 'error')
    } finally {
      setUploadingImages(false)
    }
  }

  const handleRemoveImage = (index) => {
    const imageToRemove = formData.attachments[index]

    // If it's a blob URL, revoke it to free memory
    if (imageToRemove.url && imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url)
    }

    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  // Early return for unauthorized users
  if (!user || user.role !== 'client') {
    return (
      <div className="bg-gray-800/20 backdrop-blur border border-red-500/50 rounded-xl p-8">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-xl">🚫 Access Denied</div>
          <h3 className="text-xl font-semibold text-white">Clients Only</h3>
          <p className="text-gray-300">
            Only clients can create job posts.
            {user ? ` Your current role is: ${user.role}` : ' Please log in as a client.'}
          </p>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-xl p-8">
      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Job Information
          </h3>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Need Professional Logo Design for Startup"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300">
              Category *
            </label>
            {categoriesLoading ? (
              <div className="flex items-center py-3">
                <Loader size="sm" />
                <span className="ml-2 text-gray-400">Loading categories...</span>
              </div>
            ) : (
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Job Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the project requirements, deliverables, and any specific details..."
              rows={6}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all resize-none"
              required
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Requirements
          </h3>

          <div className="space-y-2">
            <label htmlFor="skillRequired" className="block text-sm font-medium text-gray-300">
              <Tag className="inline w-4 h-4 mr-1" />
              Skills Required
            </label>
            <input
              type="text"
              id="skillRequired"
              name="skillRequired"
              value={formData.skillRequired}
              onChange={handleInputChange}
              placeholder="e.g., Photoshop, Illustrator, Logo Design"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-300">
              <Users className="inline w-4 h-4 mr-1" />
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
            >
              <option value="">Select experience level</option>
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-300">
              <MapPin className="inline w-4 h-4 mr-1" />
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Remote, New York, Worldwide"
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
            />
          </div>
        </div>

        {/* Budget & Timeline */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Budget & Timeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="budget" className="block text-sm font-medium text-gray-300">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Budget *
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                onKeyDown={handleNumericKeyDown}
                onInput={handleNumericInput}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="budgetType" className="block text-sm font-medium text-gray-300">
                <Briefcase className="inline w-4 h-4 mr-1" />
                Budget Type
              </label>
              <select
                id="budgetType"
                name="budgetType"
                value={formData.budgetType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
              >
                <option value="">Select budget type</option>
                {budgetTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-300">
              <Calendar className="inline w-4 h-4 mr-1" />
              Deadline *
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]} // Prevent past dates
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
              required
            />
          </div>
        </div>

        {/* Attachments */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Attachments
          </h3>
          <div className="space-y-4">
            <label htmlFor="attachments" className="cursor-pointer">
              <div className="border-2 border-gray-600/50 border-dashed rounded-lg hover:border-[#A95BAB]/50 transition-colors p-6">
                {!formData.attachments || formData.attachments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-32">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-400 text-sm">Click to upload reference images</p>
                    <p className="text-gray-500 text-xs">PNG, JPG, or JPEG up to 10MB each (max 10 files)</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center py-4 border-b border-gray-600/30">
                      <Upload className="w-6 h-6 text-gray-400 mr-2" />
                      <p className="text-gray-400 text-sm">Click to add more images ({formData.attachments.length}/10)</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.attachments.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo.preview}
                            alt={`Attachment ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-600/50"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                            {photo.file?.name || 'Image'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </label>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleImageUpload}
              className="hidden"
              id="attachments"
              disabled={uploadingImages}
            />

            {uploadingImages && (
              <div className="flex items-center justify-center py-4">
                <Loader size="sm" />
                <span className="ml-2 text-gray-300">Processing images...</span>
              </div>
            )}

          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700/50">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting || uploadingImages}
            className="px-8 py-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || uploadingImages}
            className={`flex-1 px-8 py-3 bg-gradient-to-r from-[#A95BAB] to-[#A95BAB]/80 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              isSubmitting || uploadingImages
                ? "opacity-50 cursor-not-allowed transform-none"
                : "hover:from-[#A95BAB]/90 hover:to-[#A95BAB]/70"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader size="sm" />
                <span className="ml-2">Creating Job Post...</span>
              </div>
            ) : uploadingImages ? (
              <div className="flex items-center justify-center">
                <Loader size="sm" />
                <span className="ml-2">Processing Images...</span>
              </div>
            ) : (
              "Post Job"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateJobPostForm