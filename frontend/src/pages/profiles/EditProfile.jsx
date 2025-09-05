"use client"

import { Plus, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AuthFooter from "../../components/layout/AuthFooter"
import AuthNavbar from "../../components/layout/AuthNavbar"
import Loader from "../../components/ui/Loader"
import { artistsAPI, clientsAPI, uploadAPI, usersAPI } from "../../lib/api"
import { updateProfile } from "../../store/slices/authSlice"

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
  const [isFetchingUserData, setIsFetchingUserData] = useState(true)
  const [freshUserData, setFreshUserData] = useState(null)

  console.log("[v0] EditProfile component loaded, auth state:", { user, token })

  const redirectIfNoUser = () => {
    if (!user) {
      console.log("[v0] No user found in Redux store, redirecting to login")
      navigate("/login")
    }
  }

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
    if (user?.firstName) {
      return user.firstName[0].toUpperCase()
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
    setHasChanges(true)
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
      const allowedTypes = ["image/jpeg", "image/png"]
      if (!allowedTypes.includes(file.type)) {
        throw new Error("File must be an image (JPEG or PNG)")
      }

      console.log("[v0] File validation passed:", {
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        type: file.type,
      })

      // Step 2: Upload image to Cloudinary through our API
      // Create a new FormData instance
      const formDataObj = new FormData()

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
      formDataObj.append("avatar", file, file.name)
      formDataObj.append("userId", user.userId) // Add user ID for association

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
        Array.from(formDataObj.entries())
          .map(
            ([key, value]) =>
              `${key}: ${value instanceof File ? `File(${value.name}, ${value.type}, ${value.size} bytes)` : value}`,
          )
          .join("\n"),
      )

      // Log the FormData contents
      console.log("[v0] FormData entries:")
      for (const pair of formDataObj.entries()) {
        console.log(
          `- ${pair[0]}: ${pair[1] instanceof File ? `File(${pair[1].name}, ${pair[1].type}, ${pair[1].size} bytes)` : pair[1]}`,
        )
      }

      // Make the API call
      // Make the API call and capture the full response
      const response = await uploadAPI.uploadAvatar(formDataObj)

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
        avatarURL: imageUrl,
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
      setPreviewImage(formData.avatarURL)
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
    setHasChanges(true)
  }

  const handleAddCustomSkill = () => {
    if (!isArtist) return
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
      setHasChanges(true)
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    if (!isArtist) return
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
    setHasChanges(true)
  }

  const handleToolToggle = (tool) => {
    if (!isArtist) return
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool) ? prev.tools.filter((t) => t !== tool) : [...prev.tools, tool],
    }))
    setHasChanges(true)
  }

  const handleRemoveTool = (toolToRemove) => {
    if (!isArtist) return
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((tool) => tool !== toolToRemove),
    }))
    setHasChanges(true)
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
      setHasChanges(true)
    }
  }

  const handleAvailabilityToggle = () => {
    setFormData((prev) => ({
      ...prev,
      availability: !prev.availability,
    }))
    setHasChanges(true)
  }

  const validateForm = () => {
    const errors = []

    // Validate responseTime - must be 0-168 integer
    if (isArtist && formData.responseTime !== "" && formData.responseTime !== null) {
      const responseTime = Number(formData.responseTime)
      if (isNaN(responseTime) || responseTime < 0 || responseTime > 168 || !Number.isInteger(responseTime)) {
        errors.push("Response time must be a whole number between 0-168 hours")
      }
    }

    // Validate hourlyRate - must be 0-10000 number
    if (isArtist && formData.hourlyRate !== "" && formData.hourlyRate !== null) {
      const hourlyRate = Number(formData.hourlyRate)
      if (isNaN(hourlyRate) || hourlyRate < 0 || hourlyRate > 10000) {
        errors.push("Hourly rate must be a number between 0-10000")
      }
    }

    // Validate website - must include https:// protocol
    if (formData.website && formData.website.trim()) {
      const websiteValue = formData.website.trim()
      if (!websiteValue.startsWith("https://") && !websiteValue.startsWith("http://")) {
        // This is fine, we'll add https:// in formatWebsiteUrl
      }
      try {
        const urlToTest = websiteValue.startsWith("http") ? websiteValue : `https://${websiteValue}`
        new URL(urlToTest)
      } catch {
        errors.push("Website must be a valid URL (e.g., www.example.com or https://example.com)")
      }
    }

    // Validate phoneNumber - must match backend phone regex
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phonePattern = /^[+]?[\d\s\-()]{10,}$/
      if (!phonePattern.test(formData.phoneNumber.trim())) {
        errors.push("Phone number must be at least 10 digits with optional +, spaces, dashes, or parentheses")
      }
    }

    // Validate bio length
    if (formData.about && formData.about.length > 1000) {
      errors.push("Bio must be 1000 characters or less")
    }

    // Validate location format
    if (formData.location && (formData.location.city || formData.location.country)) {
      if (!formData.location.city && !formData.location.country) {
        errors.push("Please provide either city or country for location")
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

    let apiData = {}

    try {
      const formatWebsiteUrl = (url) => {
        if (!url || !url.trim()) return null
        const trimmedUrl = url.trim()
        if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
          return trimmedUrl
        }
        return `https://${trimmedUrl}`
      }

      console.log("[v0] Raw formData before processing:", JSON.stringify(formData, null, 2))
      console.log("[v0] User role:", user?.role)
      console.log("[v0] isArtist:", isArtist)

      apiData = {
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        bio: formData.about?.trim() || "",
        location:
          formData.location && (formData.location.city || formData.location.country)
            ? `${formData.location.city || ""}, ${formData.location.country || ""}`.replace(/^,\s*|,\s*$/g, "")
            : "",
        phoneNumber: formData.phoneNumber?.trim() || "",
      }

      const websiteUrl = formatWebsiteUrl(formData.website)
      if (websiteUrl) {
        apiData.website = websiteUrl
      }

      if (isArtist) {
        console.log("[v0] Processing artist fields:", {
          rawSkills: formData.skills,
          rawTools: formData.tools,
          rawAvailability: formData.availability,
          skillsType: typeof formData.skills,
          toolsType: typeof formData.tools,
          availabilityType: typeof formData.availability,
        })

        apiData.skills = Array.isArray(formData.skills) && formData.skills.length > 0 ? formData.skills.join(", ") : ""
        apiData.tools = Array.isArray(formData.tools) && formData.tools.length > 0 ? formData.tools.join(", ") : ""

        if (formData.availability === true || formData.availability === "Available") {
          apiData.availability = "Available"
        } else if (formData.availability === false || formData.availability === "Not Available") {
          apiData.availability = "Not Available"
        } else {
          apiData.availability = "Busy" // Default fallback
        }

        if (formData.responseTime && !isNaN(Number(formData.responseTime))) {
          const responseTime = Number(formData.responseTime)
          apiData.responseTime = Math.min(Math.max(responseTime, 0), 168) // Clamp between 0-168
        } else {
          apiData.responseTime = 0 // Send 0 instead of null to avoid length errors
        }

        if (formData.hourlyRate && !isNaN(Number(formData.hourlyRate))) {
          const hourlyRate = Number(formData.hourlyRate)
          apiData.hourlyRate = Math.min(Math.max(hourlyRate, 0), 10000) // Clamp between 0-10000
        } else {
          apiData.hourlyRate = 0 // Send 0 instead of null to avoid length errors
        }

        console.log("[v0] Processed artist fields:", {
          skills: apiData.skills,
          tools: apiData.tools,
          availability: apiData.availability,
          responseTime: apiData.responseTime,
          hourlyRate: apiData.hourlyRate,
        })
      } else {
        apiData.industry = formData.industry || ""
        apiData.companySize = formData.companySize || ""
      }

      if (formData.avatarURL && formData.avatarURL !== initialFormData?.avatarURL) {
        apiData.avatarURL = formData.avatarURL
      }

      console.log("[v0] Final API data being sent:", JSON.stringify(apiData, null, 2))
      console.log(
        "[v0] API data field types:",
        Object.entries(apiData).reduce((acc, [key, value]) => {
          acc[key] = {
            type: typeof value,
            value: value,
            isNull: value === null,
            isUndefined: value === undefined,
            isEmpty: value === "",
            isArray: Array.isArray(value),
            length: Array.isArray(value) ? value.length : typeof value === "string" ? value.length : "N/A",
          }
          return acc
        }, {}),
      )

      console.log("[v0] Making API call to update user:", {
        userId: user.userId,
        endpoint: `/api/users/${user.userId}`,
        method: "PATCH",
        dataSize: JSON.stringify(apiData).length,
        apiData: apiData
      })

      // Make API call to update profile using usersAPI service
      const { data: updatedUser } = await usersAPI.update(user.userId, apiData)
      console.log("[v0] Profile updated successfully:", updatedUser)

      // Update Redux store with new user data
      dispatch(updateProfile(apiData))


      setInitialFormData(formData)
      setHasChanges(false)

      // Show success message (you can replace with toast notification)
      alert("Profile updated successfully!")

      navigate("/profile")
    } catch (error) {
      console.error("[v0] Profile update error:", error)
      console.error("[v0] Error response:", error.response)
      console.error("[v0] Error response data (JSON):", JSON.stringify(error.response?.data, null, 2))
      console.error("[v0] Error response status:", error.response?.status)
      console.error("[v0] Error response headers (JSON):", JSON.stringify(error.response?.headers, null, 2))
      console.error("[v0] Error config (JSON):", JSON.stringify(error.config, null, 2))
      console.error("[v0] Request data that was sent:", JSON.stringify(apiData, null, 2))

      setError(error.response?.data?.message || error.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    console.log("[v0] Cancel button clicked - navigating back to profile")
    navigate("/profile")
  }

  const getInitialFormData = () => {
    const userData = freshUserData || user

    if (!userData) {
      console.log("[v0] Cannot initialize form data - user data is null")
      return null
    }

    console.log("[v0] Initializing form data with fresh backend data:", userData)

    const isArtist = userData?.role === "freelancer" || userData?.role === "artist"

    const data = {
      // Common fields for all users
      about: userData?.about || userData?.bio || "",
      avatarURL: userData?.avatarURL || "",
      bio: userData?.bio || userData?.about || "",
      website: userData?.website || "",
      location: parseLocation(userData?.location),
      phoneNumber: userData?.phoneNumber || "",
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      industry: userData?.industry || "", 
      companySize: userData?.companySize || 0,

      // Artist-specific fields (empty if not artist)
      skills: isArtist
        ? userData?.skills
          ? userData.skills.split(",").filter(Boolean)
          : userData?.specialties
            ? userData.specialties.split(",").filter(Boolean)
            : []
        : [],
      tools: isArtist
        ? userData?.tools
          ? userData.tools.split(",").filter(Boolean)
          : userData?.specialties
            ? userData.specialties.split(",").filter(Boolean)
            : []
        : [],
      availability: isArtist ? (userData?.availability ? parseAvailability(userData.availability) : true) : false,
      responseTime: isArtist ? userData?.responseTime || "" : "",
      hourlyRate: isArtist ? userData?.hourlyRate || "" : "",
    }

    console.log("[v0] Initialized form data with backend data:", data)
    return data
  }

  const fetchFreshUserData = async () => {
    if (!user?.userId) return

    try {
      setIsFetchingUserData(true)
      console.log("[v0] Fetching fresh user data for form initialization")

      // Fetch both user data and artist data if user is an artist
      const [userResponse, artistResponse] = await Promise.all([
        usersAPI.getById(user.userId),
        user.role === "freelancer" || user.role === "artist"
          ? artistsAPI.getByUserId(user.userId).catch(() => null)
          : clientsAPI.getByUserId(user.userId).catch(() => null),
      ])

      const combinedData = {
        ...userResponse.data,
        ...(artistResponse?.data || {}),
      }

      console.log("[v0] Fresh user data fetched:", combinedData)
      setFreshUserData(combinedData)
    } catch (error) {
      console.error("[v0] Error fetching fresh user data:", error)
      // Use API data if available
      setFreshUserData(user)
    } finally {
      setIsFetchingUserData(false)
    }
  }

  useEffect(() => {
    redirectIfNoUser()
  }, [user])

  useEffect(() => {
    if (user?.userId) {
      fetchFreshUserData()
    }
  }, [user?.userId])

  useEffect(() => {
    if (!isFetchingUserData && (freshUserData || user)) {
      const data = getInitialFormData()
      setInitialFormData(data)
      setFormData(data)
    }
  }, [freshUserData, user, isFetchingUserData])

  useEffect(() => {
    console.log("[v0] EditProfile component mounted successfully")
    return () => {
      console.log("[v0] EditProfile component unmounting")
    }
  }, [])

  useEffect(() => {
    if (!initialFormData || !formData) {
      setHasChanges(false)
      return
    }

    // Deep comparison to detect changes
    const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData)
    setHasChanges(hasFormChanges)
  }, [formData, initialFormData])

  const parseLocation = (locationStr) => {
    if (!locationStr) return { city: "", country: "" }
    const parts = locationStr.split(",").map((part) => part.trim())
    return {
      city: parts[0] || "",
      country: parts[1] || "",
    }
  }

  const parseAvailability = (availabilityStr) => {
    return availabilityStr === "Available"
  }

  console.log("[v0] EditProfile rendering with formData:", formData)

  if (isFetchingUserData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="text-gray-600 mt-4">Loading your profile data...</p>
        </div>
      </div>
    )
  }

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
                    <img
                      src={user.avatarURL || "/placeholder.svg"}
                      alt="Profile Preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
                    />
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
                    value={formData?.firstName || ""} // Added null check for formData
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData?.lastName || ""} // Added null check for formData
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData?.phoneNumber || ""} // Added null check for formData
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
                    value={formData?.website || ""} // Added null check for formData
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
                    value={formData?.location?.city || ""} // Added null checks for formData and location
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
                    value={formData?.location?.country || ""} // Added null checks for formData and location
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
                  value={formData?.about || ""} // Added null check for formData
                  onChange={handleInputChange}
                  rows={aboutExpanded ? 8 : 4}
                  maxLength={1000}
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
              <p className="text-sm text-gray-400 mt-2">{(formData?.about || "").length}/1000 characters</p>{" "}
              {/* Added null check for formData.about */}
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
                          (formData?.skills || []).includes(category) // Added null check for formData.skills
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
                          (formData?.tools || []).includes(tool) // Added null check for formData.tools
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
                {(formData?.skills || []).length > 0 && ( // Added null check for formData.skills
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-300 mb-3">Selected Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {(formData?.skills || []).map(
                        (
                          skill, // Added null check for formData.skills
                        ) => (
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
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Selected Tools */}
                {(formData?.tools || []).length > 0 && ( // Added null check for formData.tools
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-300 mb-3">Selected Tools</p>
                    <div className="flex flex-wrap gap-2">
                      {(formData?.tools || []).map(
                        (
                          tool, // Added null check for formData.tools
                        ) => (
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
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Professional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isArtist && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Response Time (hours)</label>
                      <input
                        type="number"
                        min="1"
                        max="72"
                        name="responseTime"
                        value={formData?.responseTime || ""} // Added null check for formData
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
                        value={formData?.hourlyRate || ""} // Added null check for formData
                        onChange={handleInputChange}
                        placeholder="e.g., 75"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#A95BAB] focus:ring-1 focus:ring-[#A95BAB]"
                      />
                    </div>
                  </>
                )}
                {!isArtist && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                      <input
                        type="text"
                        name="industry"
                        value={formData?.industry || ""} // Added null check for formData
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
                        value={formData?.companySize || ""} // Added null check for formData
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
