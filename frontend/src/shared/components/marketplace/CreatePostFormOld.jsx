"use client"

import { useState } from "react"
import { Plus, X, Upload, Trash2 } from "lucide-react"
import { uploadImages } from "../../../store/api/marketplaceAPI"

const CreatePostForm = ({ onSubmit, onCancel, isSubmitting = false }) => {
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
    <div className="bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Basic Information
          </h3>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Project Title *
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

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">
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

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Project Description *
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

        {/* Pricing & Timeline */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Pricing & Timeline
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budgetMin">Minimum Budget ($)</label>
              <input
                type="number"
                id="budgetMin"
                name="budgetMin"
                value={formData.budgetMin}
                onChange={handleInputChange}
                placeholder="25"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="budgetMax">Maximum Budget ($)</label>
              <input
                type="number"
                id="budgetMax"
                name="budgetMax"
                value={formData.budgetMax}
                onChange={handleInputChange}
                placeholder="500"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Typical Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="e.g., 1-2 weeks, 3-5 days"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Remote, New York, USA"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="form-section">
          <h3>Skills & Expertise</h3>

          <div className="skills-section">
            <div className="popular-skills">
              <label>Popular Skills (click to add):</label>
              <div className="skills-grid">
                {popularSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={`skill-chip ${formData.skills.includes(skill) ? "selected" : ""}`}
                    onClick={() => handleSkillAdd(skill)}
                    disabled={formData.skills.includes(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="custom-skill">
              <label htmlFor="newSkill">Add Custom Skill:</label>
              <div className="skill-input-group">
                <input
                  type="text"
                  id="newSkill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleSkillAdd(newSkill)
                    }
                  }}
                />
                <button type="button" onClick={() => handleSkillAdd(newSkill)} disabled={!newSkill.trim()}>
                  Add
                </button>
              </div>
            </div>

            {formData.skills.length > 0 && (
              <div className="selected-skills">
                <label>Selected Skills:</label>
                <div className="skills-list">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                      <button type="button" onClick={() => handleSkillRemove(skill)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Images */}
        <div className="form-section">
          <h3>Portfolio Images</h3>

          <div className="image-upload-section">
            <div className="upload-area">
              <input
                type="file"
                id="images"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImages}
              />
              <label htmlFor="images" className={`upload-label ${uploadingImages ? "uploading" : ""}`}>
                {uploadingImages ? "Uploading..." : "Click to upload images or drag and drop"}
                <span className="upload-hint">PNG, JPG, GIF up to 10MB each</span>
              </label>
            </div>

            {formData.photos.length > 0 && (
              <div className="uploaded-images">
                <label>Uploaded Images:</label>
                <div className="images-grid">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="image-preview">
                      <img src={photo || "/placeholder.svg"} alt={`Portfolio ${index + 1}`} />
                      <button type="button" className="remove-image" onClick={() => handleImageRemove(index)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="cancel-btn" disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating Post..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePostForm
