"use client"

import { useState, useEffect } from "react"
import { uploadImages } from "../../store/api/marketplaceAPI"

const EditPostForm = ({ initialData, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    duration: "",
    location: "",
    skills: [],
    category: "",
    photos: [],
  })

  const [newSkill, setNewSkill] = useState("")
  const [uploadingImages, setUploadingImages] = useState(false)

  // Populate form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        budgetMin: initialData.budgetMin || "",
        budgetMax: initialData.budgetMax || "",
        duration: initialData.duration || "",
        location: initialData.location || "",
        skills: initialData.skills || [],
        category: initialData.category || "",
        photos: initialData.attachments || [],
      })
    }
  }, [initialData])

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

  const popularSkills = [
    "Photoshop",
    "Illustrator",
    "Figma",
    "After Effects",
    "Premiere Pro",
    "Sketch",
    "InDesign",
    "Blender",
    "HTML/CSS",
    "JavaScript",
    "React",
    "Vue.js",
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSkillAdd = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }))
    }
    setNewSkill("")
  }

  const handleSkillRemove = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploadingImages(true)
    try {
      const response = await uploadImages(files)
      const imageUrls = response.data.urls || response.data

      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...imageUrls],
      }))
    } catch (error) {
      alert("Failed to upload images. Please try again.")
      console.error("Image upload error:", error)
    } finally {
      setUploadingImages(false)
    }
  }

  const handleImageRemove = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, index) => index !== indexToRemove),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim()) {
      alert("Please enter a title")
      return
    }
    if (!formData.description.trim()) {
      alert("Please enter a description")
      return
    }
    if (!formData.category) {
      alert("Please select a category")
      return
    }

    // Convert budget to numbers
    const postData = {
      ...formData,
      budgetMin: formData.budgetMin ? Number.parseInt(formData.budgetMin) : null,
      budgetMax: formData.budgetMax ? Number.parseInt(formData.budgetMax) : null,
    }

    onSubmit(postData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] py-8">
      <div className="max-w-4xl mx-auto px-6">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-2xl p-8"
        >
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">Basic Information</h3>

            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Professional Logo Design Available"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your services, experience, and what makes you unique..."
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Updating Post..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPostForm
