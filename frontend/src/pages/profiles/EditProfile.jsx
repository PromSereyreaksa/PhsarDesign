"use client"

import { useState, useRef, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { updateProfile } from "../../store/slices/authSlice"
import { usersAPI, uploadAPI } from "../../services/api"
import { Plus, X, ToggleLeft, ToggleRight } from "lucide-react"
import AuthNavbar from "../../components/layout/navigation/AuthNavbar"
import AuthFooter from "../../components/layout/footer/AuthFooter"

const EditProfile = () => {
  const { user, token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fileInputRef = useRef(null)

  const [initialFormData, setInitialFormData] = useState(null)
  const [formData, setFormData] = useState(null)
  const [previewImage, setPreviewImage] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [aboutExpanded, setAboutExpanded] = useState(false)
  const [isAddingSkill, setIsAddingSkill] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [error, setError] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  console.log("[v0] EditProfile component loaded, auth state:", { user, token })

  // Redirect if no user
  const redirectIfNoUser = () => {
    if (!user) {
      console.log("[v0] No user found in Redux store, redirecting to login")
      navigate("/login")
    }
  }

  useEffect(() => {
    redirectIfNoUser()
  }, [user])

  // Helper function to parse location string into city and country
  const parseLocation = (locationStr) => {
    if (!locationStr) return { city: "", country: "" }
    const parts = locationStr.split(",").map((part) => part.trim())
    return {
      city: parts[0] || "",
      country: parts[1] || "",
    }
  }

  // Helper function to parse availability string to boolean
  const parseAvailability = (availabilityStr) => {
    return availabilityStr === "Available"
  }

  // Initialize form data based on user role
  const getInitialFormData = () => {
    if (!user) {
      console.log("[v0] Cannot initialize form data - user is null")
      return null
    }

    console.log("[v0] Initializing form data for user:", user)

    const isArtist = user?.role === "freelancer" || user?.role === "artist"

    const data = {
      // Common fields for all users
      about: user?.about || user?.bio || "",
      avatar: user?.avatar || "",
      bio: user?.bio || user?.about || "",
      website: user?.website || "",
      location: parseLocation(user?.location),
      phoneNumber: user?.phoneNumber || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",

      // Artist-specific fields (empty if not artist)
      skills: isArtist ? (user?.skills ? user.skills.split(",").filter(Boolean) : []) : [],
      tools: isArtist ? (user?.tools ? user.tools.split(",").filter(Boolean) : []) : [],
      availability: isArtist ? (user?.availability ? parseAvailability(user.availability) : true) : false,
      responseTime: isArtist ? user?.responseTime || "" : "",
      hourlyRate: isArtist ? user?.hourlyRate || "" : "",
    }

    console.log("[v0] Initialized form data:", data)
    return data
  }

  useEffect(() => {
    // Store initial form data for change detection
    const data = getInitialFormData()
    setInitialFormData(data)
    setFormData(data)
  }, [user])

  useEffect(() => {
    if (initialFormData) {
      const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData)
      setHasChanges(hasFormChanges)
    }
  }, [formData, initialFormData])

  useEffect(() => {
    console.log("[v0] EditProfile component mounted successfully")
    return () => {
      console.log("[v0] EditProfile component unmounting")
    }
  }, [])

  const serviceCategories = [
    "Graphic Design",
    "Web Design",
    "Logo Design",
    "Illustration",
    "Photography",
    "Video Editing",
    "Animation",
    "UI/UX Design",
    "3D Modeling",
    "Digital Art",
    "Branding",
    "Print Design",
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

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    return "U"
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "city" || name === "country") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setIsUploadingImage(true)

      // Step 1: Show temporary preview immediately
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target.result)
      }
      reader.readAsDataURL(file)

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB")
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        throw new Error("File must be an image (JPEG, PNG, GIF, or WebP)")
      }

      console.log("[v0] File validation passed:", {
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        type: file.type,
      })

      // Step 2: Upload image to Cloudinary through our API
      // Create a new FormData instance
      const formData = new FormData()

      // First, verify we have a valid file
      if (!(file instanceof File)) {
        throw new Error("Invalid file object")
      }

      // Log file details before appending
      console.log("[v0] File object details:", {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        isFile: file instanceof File,
        isBlob: file instanceof Blob,
      })

      // Add both common field names to try all possibilities
      formData.append("avatar", file, file.name)
      formData.append("userId", user.userId) // Add user ID for association

      // Log file details
      console.log("[v0] Preparing upload:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId: user.userId,
      })

      // Log the exact FormData contents
      console.log(
        "[v0] FormData fields:",
        Array.from(formData.entries())
          .map(
            ([key, value]) =>
              `${key}: ${value instanceof File ? `File(${value.name}, ${value.type}, ${value.size} bytes)` : value}`,
          )
          .join("\n"),
      )

      // Log the FormData contents
      console.log("[v0] FormData entries:")
      for (const pair of formData.entries()) {
        console.log(
          `- ${pair[0]}: ${pair[1] instanceof File ? `File(${pair[1].name}, ${pair[1].type}, ${pair[1].size} bytes)` : pair[1]}`,
        )
      }

      // Make the API call
      // Make the API call and capture the full response
      const response = await uploadAPI.uploadAvatar(formData)

      console.log("[v0] Full upload response:", response)

      // The URL is nested in response.data.data.url
      if (!response?.data?.data?.url) {
        console.error("[v0] Invalid response format:", response.data)
        throw new Error("Could not find image URL in response")
      }

      // If we got here, we have a valid URL
      const imageUrl = response.data.data.url
      console.log("[v0] Successfully got image URL:", imageUrl)

      // Update form data with the new image URL
      setFormData((prev) => ({
        ...prev,
        avatar: imageUrl,
      }))

      console.log("[v0] Image uploaded successfully:", imageUrl)
    } catch (error) {
      // Log the complete error details including response data
      // Log full error details including the raw response
      const errorDetails = {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        rawResponse: error.response?.request?.responseText,
        serverMessage: error.response?.data?.message || error.response?.data?.error,
        requestConfig: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      }

      console.error("[v0] Image upload error details:", errorDetails)
      console.error("[v0] Server error message:", errorDetails.serverMessage)

      // Try to parse any additional error info
      try {
        if (typeof error.response?.data === "string") {
          console.error("[v0] Raw error response:", error.response.data)
        }
      } catch (e) {
        console.error("[v0] Could not parse error response")
      }

      // If we get a specific error about field name, log it prominently
      if (error.response?.data?.message?.includes("field")) {
        console.error("[v0] Server field name error:", error.response.data.message)
      }

      setError(error.response?.data?.message || error.message || "Failed to upload image. Please try again.")

      // Reset preview if upload failed
      setPreviewImage(formData.avatar)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const isArtist = user?.role === "freelancer" || user?.role === "artist"

  const handleSkillToggle = (skill) => {
    if (!isArtist) return
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  const handleAddCustomSkill = () => {
    if (!isArtist) return
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    if (!isArtist) return
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleToolToggle = (tool) => {
    if (!isArtist) return
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool) ? prev.tools.filter((t) => t !== tool) : [...prev.tools, tool],
    }))
  }

  const handleRemoveTool = (toolToRemove) => {
    if (!isArtist) return
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((tool) => tool !== toolToRemove),
    }))
  }

  const handleAddCustom = () => {
    if (!isArtist) return
    if (newSkill.trim()) {
      if (isAddingSkill) {
        if (!formData.skills.includes(newSkill.trim())) {
          setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, newSkill.trim()],
          }))
        }
      } else {
        if (!formData.tools.includes(newSkill.trim())) {
          setFormData((prev) => ({
            ...prev,
            tools: [...prev.tools, newSkill.trim()],
          }))
        }
      }
      setNewSkill("")
    }
  }

  const handleAvailabilityToggle = () => {
    setFormData((prev) => ({
      ...prev,
      availability: !prev.availability,
    }))
  }

  const validateForm = () => {
    const errors = []

    // Validate responseTime - must be number
    if (formData.responseTime && isNaN(Number(formData.responseTime))) {
      errors.push("Response time must be a number")
    }

    // Validate hourlyRate - must be number
    if (formData.hourlyRate && isNaN(Number(formData.hourlyRate))) {
      errors.push("Hourly rate must be a number")
    }

    // Validate website - must be valid URL format
    if (formData.website && formData.website.trim()) {
      try {
        // Add https:// if no protocol specified
        const urlString = formData.website.startsWith("http") ? formData.website : `https://${formData.website}`
        new URL(urlString) // This will throw if invalid
      } catch {
        errors.push("Website must be a valid URL format (e.g., www.example.com)")
      }
    }

    // Validate phoneNumber - must be numeric or valid phone format
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phonePattern = /^[+]?[1-9][\d]{0,15}$|^[\d\s\-$$$$]{10,}$/
      if (!phonePattern.test(formData.phoneNumber.replace(/\s/g, ""))) {
        errors.push("Phone number must be in a valid format")
      }
    }

    return errors
  }

  const handleSave = async () => {
    setError("")

    // Validate form
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "))
      return
    }

    if (!hasChanges) {
      setError("No changes to save")
      return
    }

    setIsLoading(true)

    try {
      // Helper function to format website URL
      const formatWebsiteUrl = (url) => {
        if (!url) return ""
        if (url.startsWith("http://") || url.startsWith("https://")) return url
        return `https://${url}`
      }

      // Prepare profile update data
      const apiData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        about: formData.about,
        location:
          formData.location.city && formData.location.country
            ? `${formData.location.city}, ${formData.location.country}`
            : formData.location.city || formData.location.country || "",
        phoneNumber: formData.phoneNumber,
        website: formatWebsiteUrl(formData.website),
      }

      // Add artist-specific fields only if user is an artist
      if (isArtist) {
        apiData.skills = formData.skills && formData.skills.length > 0 ? formData.skills.join(",") : ""
        apiData.tools = formData.tools && formData.tools.length > 0 ? formData.tools.join(",") : ""
        apiData.availability = formData.availability ? "Available" : "Not Available"
        apiData.responseTime = formData.responseTime ? Number(formData.responseTime) : ""
        apiData.hourlyRate = formData.hourlyRate ? Number(formData.hourlyRate) : ""
      } else {
        // Add client-specific fields
        apiData.industry = formData.industry || ""
        apiData.companySize = formData.companySize || ""
      }

      console.log("Sending update to API:", apiData)

      // Make API call to update profile using usersAPI service
      const { data: updatedUser } = await usersAPI.update(user.userId, apiData)

      // Update Redux store with new user data
      dispatch(updateProfile(updatedUser))

      console.log("[v0] Profile updated successfully:", updatedUser)

      // Show success message (you can replace with toast notification)
      alert("Profile updated successfully!")

      navigate("/profile")
    } catch (error) {
      console.error("[v0] Profile update error:", error)
      setError(error.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    console.log("[v0] Cancel button clicked - navigating back to profile")
    navigate("/profile")
  }

  console.log("[v0] EditProfile rendering with formData:", formData)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />

      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
            <p className="text-gray-300">Update your profile information</p>
          </div>

          {/* Edit Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Profile Picture Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Picture</h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {previewImage ? (
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#A95BAB] border-2 border-white/20 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">{getInitials()}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="px-4 py-2 bg-[#A95BAB] text-white rounded-lg hover:bg-[#A95BAB]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingImage ? "Uploading..." : "Upload New Photo"}
                  </button>
                  <p className="text-sm text-gray-400">JPG, PNG or GIF. Max size 5MB.</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., +1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="e.g., www.yoursite.com"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    placeholder="e.g., New York"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.location.country}
                    onChange={handleInputChange}
                    placeholder="e.g., United States"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">About</h2>
              <div className="relative">
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows={aboutExpanded ? 8 : 4}
                  maxLength={500}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB] resize-none transition-all"
                  placeholder="Tell us about yourself, your skills, and experience..."
                />
                <button
                  type="button"
                  onClick={() => setAboutExpanded(!aboutExpanded)}
                  className="absolute bottom-2 right-2 text-xs text-[#A95BAB] hover:text-[#A95BAB]/80"
                >
                  {aboutExpanded ? "Collapse" : "Expand"}
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-2">{formData.about.length}/500 characters</p>
            </div>

            {isArtist && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Skills & Tools</h2>

                {/* Service Categories (Skills) */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-300 mb-3">Skills & Expertise</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {serviceCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleSkillToggle(category)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                          formData.skills.includes(category)
                            ? "bg-[#A95BAB] text-white shadow-lg shadow-[#A95BAB]/25"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tools & Software */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-300 mb-3">Tools & Software</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {popularSkills.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => handleToolToggle(tool)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                          formData.tools.includes(tool)
                            ? "bg-[#A95BAB] text-white shadow-lg shadow-[#A95BAB]/25"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white"
                        }`}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Input */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-300 mb-3">Add Custom Skill or Tool</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter a skill or tool..."
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                    />
                    <button
                      type="button"
                      onClick={() => setIsAddingSkill(true)}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        isAddingSkill ? "bg-[#A95BAB] text-white" : "bg-gray-700/50 text-gray-300"
                      }`}
                    >
                      Skill
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingSkill(false)}
                      className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                        !isAddingSkill ? "bg-[#A95BAB] text-white" : "bg-gray-700/50 text-gray-300"
                      }`}
                    >
                      Tool
                    </button>
                    <button
                      type="button"
                      onClick={handleAddCustom}
                      className="px-4 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Selected Skills */}
                {formData.skills.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-300 mb-3">Selected Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center space-x-2 px-3 py-1 bg-[#A95BAB] text-white rounded-full text-sm font-medium"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Tools */}
                {formData.tools.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-300 mb-3">Selected Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tools.map((tool) => (
                        <span
                          key={tool}
                          className="inline-flex items-center space-x-2 px-3 py-1 bg-[#A95BAB]/80 text-white rounded-full text-sm font-medium"
                        >
                          <span>{tool}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTool(tool)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Availability Status</h2>
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {formData.availability ? "Available for new projects" : "Not Available"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formData.availability
                      ? "Clients can see you're accepting new work"
                      : "Your profile will show you're currently not available"}
                  </p>
                </div>
                <button
                  onClick={handleAvailabilityToggle}
                  className="text-[#A95BAB] hover:text-[#A95BAB]/80 transition-colors"
                >
                  {formData.availability ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Professional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Response Time (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="72"
                    name="responseTime"
                    value={formData.responseTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Hourly Rate (USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="e.g., 75"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                  />
                </div>
                {!isArtist && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="e.g., Technology"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Company Size</label>
                      <input
                        type="text"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleInputChange}
                        placeholder="e.g., 50-200 employees"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                className="px-6 py-2 bg-[#A95BAB] text-white rounded-lg hover:bg-[#A95BAB]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuthFooter />
    </div>
  )
}

export default EditProfile
