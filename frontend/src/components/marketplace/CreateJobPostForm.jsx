"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Upload, Trash2, DollarSign, MapPin, Tag, Calendar, Users, Briefcase } from "lucide-react"
import { createPost } from "../../store/slices/marketplaceSlice" // Update path as needed
import Loader from "../ui/Loader"

const CreateJobPostForm = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    budgetType: "",
    deadline: "",
    skillRequired: "",
    experienceLevel: "",
    categoryId: "",
    location: "",
    attachments: [],
  })

  const [uploadingImages, setUploadingImages] = useState(false)

  const categories = [
    "Graphic Design",
    "Web Design",
    "Logo Design",
    "Illustration",
    "Photography",
    "Video Editing",
    "Animation",
    "UI/UX Design",
  ]

  const experienceLevels = ["Entry Level", "Intermediate", "Expert", "Any Level"]

  const budgetTypes = ["Fixed Price", "Hourly Rate", "Negotiable"]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB

      if (!isValidType) {
        alert(`${file.name} is not a valid image file`)
        return false
      }
      if (!isValidSize) {
        alert(`${file.name} is too large (max 10MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

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
      alert(`${newAttachments.length} image(s) added successfully! Images will be uploaded when you submit the form.`)
    } catch (error) {
      console.error("Image processing failed:", error)
      alert(`Failed to process images: ${error.message}`)
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

  // Form submission function
  const handleFormSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim()) {
      alert("Please enter a job title")
      return
    }

    if (!formData.description.trim()) {
      alert("Please enter a job description")
      return
    }

    if (!formData.budget) {
      alert("Please enter a budget")
      return
    }

    if (!formData.deadline) {
      alert("Please select a deadline")
      return
    }

    // Check if deadline is in the future
    const deadlineDate = new Date(formData.deadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (deadlineDate <= today) {
      alert("Deadline must be in the future")
      return
    }

    try {
      setUploadingImages(true)

      // Construct multipart payload expected by backend route upload.array('attachment', 10)
      const submitData = new FormData()
      const appendIfPresent = (key, value) => {
        if (value !== undefined && value !== null && `${value}` !== "") {
          submitData.append(key, value)
        }
      }

      appendIfPresent("title", formData.title?.trim())
      appendIfPresent("description", formData.description?.trim())
      appendIfPresent("budget", formData.budget)
      appendIfPresent("budgetType", formData.budgetType)
      appendIfPresent("skillRequired", formData.skillRequired?.trim())
      appendIfPresent("experienceLevel", formData.experienceLevel)
      appendIfPresent("categoryId", formData.categoryId)
      appendIfPresent("location", formData.location?.trim())
      // Convert date to ISO if possible
      appendIfPresent("deadline", formData.deadline ? new Date(formData.deadline).toISOString() : undefined)
      appendIfPresent("isActive", true)

      // Append files
      ;(formData.attachments || [])
        .map((a) => a?.file)
        .filter(Boolean)
        .forEach((file) => submitData.append("attachment", file))

      // Add postType to indicate this is a job post for the Redux thunk
      submitData.append("postType", "job")

      // Use Redux action instead of calling API directly
      const response = await dispatch(createPost(submitData)).unwrap()

      console.log("Job post submitted successfully:", response)
      alert("Job post created successfully!")

      // Reset form
      setFormData({
        title: "",
        description: "",
        budget: "",
        budgetType: "",
        deadline: "",
        skillRequired: "",
        experienceLevel: "",
        categoryId: "",
        location: "",
        attachments: [],
      })

      if (onSubmit) {
        onSubmit(response)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      alert(`Failed to submit job post: ${error.response?.data?.error || error.message || error}`)
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
              Category
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
            >
              <option value="">Select a category</option>
              {categories.map((category, index) => (
                <option key={category} value={index + 1}>
                  {category}
                </option>
              ))}
            </select>
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
              <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600/50 border-dashed rounded-lg hover:border-[#A95BAB]/50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-400 text-sm">Click to upload reference images</p>
                <p className="text-gray-500 text-xs">PNG, JPG, or JPEG up to 10MB each (max 10 files)</p>
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
                <Loader />
                <span className="ml-2 text-gray-300">Processing images...</span>
              </div>
            )}

            {formData.attachments && formData.attachments.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.attachments.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.url || "/placeholder.svg"}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-600"
                        onError={(e) => {
                          console.error("Image failed to load:", photo.url)
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEzVjE5QTIgMiAwIDAgMSAxOSAyMUg1QTIgMiAwIDAgMSAzIDE5VjVBMiAyIDAgMCAxIDUgM0gxM00xNSA5TDIxIDNNMjEgM0gxNk0yMSAzVjgiIHN0cm9rZT0iIzk5OTk4OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+"
                        }}
                      />
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded max-w-full truncate">
                        {photo.name}
                      </div>
                      {photo.uploaded && (
                        <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">✓</div>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  {formData.attachments.length} attachment{formData.attachments.length !== 1 ? "s" : ""} selected
                </div>
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
                <Loader />
                <span className="ml-2">Creating Job Post...</span>
              </div>
            ) : uploadingImages ? (
              <div className="flex items-center justify-center">
                <Loader />
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