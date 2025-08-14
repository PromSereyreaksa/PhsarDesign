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
        photos: initialData.photos || [],
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
    <div className="create-post-form">
      <form onSubmit={handleSubmit} className="form-container">
        {/* Basic Information */}
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Professional Logo Design Available"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your services, experience, and what makes you unique..."
              rows={6}
              required
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn" disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Updating Post..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditPostForm
