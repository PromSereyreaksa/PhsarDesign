"use client"

import { Clock, DollarSign, MapPin, Plus, Tag, Upload, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "../../store/slices/categoriesSlice"
import Loader from "../ui/Loader"

const CreateAvailabilityPostForm = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const dispatch = useDispatch()
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories)
  const { user } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    expireAt: "",
    availabilityType: "freelance",
    location: "",
    skills: [],
    category: "",
    categoryId: "",
    attachments: [],
    isActive: true,
  })

  const [newSkill, setNewSkill] = useState("")
  const [uploadingImages, setUploadingImages] = useState(false)

  // RBAC Check - Only artists can use this form
  useEffect(() => {
    if (user && user.role !== 'artist' && user.role !== 'freelancer') {
      const showToast = async () => {
        const { showToast } = await import("../../components/ui/toast")
        showToast(`Access denied. Only artists can create availability posts. Your role: ${user.role}`, 'error')
      }
      showToast()
    }
  }, [user])

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

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
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    
    // If categoryId is selected, also set category name for display
    if (name === "categoryId") {
      const selectedCategory = categories.find(cat => cat.categoryId === parseInt(value))
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        category: selectedCategory ? selectedCategory.name : "",
      }))
    }
  }

  const handleSkillToggle = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  const handleAddCustomSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      const { showToast } = await import("../../components/ui/toast")
      showToast('Please select only image files (JPEG, PNG, GIF, WebP)', 'error')
      return;
    }

    // Validate file sizes (10MB each)
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      const { showToast } = await import("../../components/ui/toast")
      showToast('Each image must be smaller than 10MB', 'error')
      return;
    }

    // Check total attachments limit
    if (formData.attachments.length + files.length > 5) {
      const { showToast } = await import("../../components/ui/toast")
      showToast('You can upload maximum 5 images', 'error')
      return;
    }

    setUploadingImages(true);

    try {
      // Create local URLs for preview while keeping the File objects for upload
      const newAttachments = await Promise.all(
        files.map(async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              resolve({
                url: e.target.result, // base64 data URL for preview
                file: file, // Keep the actual File object for upload
                name: file.name,
                uploaded: false, // Will be set to true after successful backend upload
                size: file.size,
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
      }));

      console.log('Files prepared for upload:', newAttachments.length);
      const { showToast } = await import("../../components/ui/toast")
      showToast(`${newAttachments.length} image(s) added successfully! Images will be uploaded when you submit the form.`, 'success')

    } catch (error) {
      console.error("Image processing failed:", error);
      const { showToast } = await import("../../components/ui/toast")
      showToast(`Failed to process images: ${error.message}`, 'error')
    } finally {
      setUploadingImages(false);
      // Reset file input
      e.target.value = '';
    }
  };

// Remove attachment function
const removeAttachment = (index) => {
  setFormData(prev => ({
    ...prev,
    attachments: prev.attachments.filter((_, i) => i !== index)
  }));
};

// Updated form submission function - use Redux only
const handleFormSubmit = async (e) => {
  e.preventDefault();

  // RBAC enforcement - Double check user role
  if (!user || (user.role !== 'artist' && user.role !== 'freelancer')) {
    const { showToast } = await import("../../components/ui/toast")
    showToast('Access denied. Only artists can create availability posts.', 'error')
    return;
  }

  try {
    setUploadingImages(true);
    
    // Validate required fields with backend-matching validation
    if (!formData.title || formData.title.trim().length < 5 || formData.title.trim().length > 255) {
      const { showToast } = await import("../../components/ui/toast")
      showToast('Title must be between 5 and 255 characters', 'error')
      setUploadingImages(false);
      return;
    }

    if (!formData.description || formData.description.trim().length < 20 || formData.description.trim().length > 5000) {
      const { showToast } = await import("../../components/ui/toast")
      showToast('Description must be between 20 and 5000 characters', 'error')
      setUploadingImages(false);
      return;
    }

    if (!formData.categoryId) {
      const { showToast } = await import("../../components/ui/toast")
      showToast('Please select a category', 'error')
      setUploadingImages(false);
      return;
    }

    if (!formData.budget || parseFloat(formData.budget) < 0) {
      const { showToast } = await import("../../components/ui/toast")
      showToast("Budget must be a positive number", 'error')
      setUploadingImages(false);
      return;
    }

    // Validate optional field lengths to match backend validation
    if (formData.availabilityType && formData.availabilityType.trim().length > 50) {
      const { showToast } = await import("../../components/ui/toast")
      showToast("Availability type must not exceed 50 characters", 'error')
      setUploadingImages(false);
      return;
    }

    if (formData.duration && formData.duration.trim().length > 100) {
      const { showToast } = await import("../../components/ui/toast")
      showToast("Duration must not exceed 100 characters", 'error')
      setUploadingImages(false);
      return;
    }

    if (formData.location && formData.location.trim().length > 100) {
      const { showToast } = await import("../../components/ui/toast")
      showToast("Location must not exceed 100 characters", 'error')
      setUploadingImages(false);
      return;
    }

    // Validate skills length (will be joined as string)
    const skillsString = Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills;
    if (skillsString && skillsString.length > 1000) {
      const { showToast } = await import("../../components/ui/toast")
      showToast("Skills must not exceed 1000 characters. Please remove some skills.", 'error')
      setUploadingImages(false);
      return;
    }

    if (!formData.expireAt) {
      const { showToast } = await import("../../components/ui/toast")
      showToast("Please select an expiry date", 'error')
      setUploadingImages(false);
      return;
    }

    // Check if expiry date is in the future
    const expiryDate = new Date(formData.expireAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (expiryDate <= today) {
      const { showToast } = await import("../../components/ui/toast")
      showToast("Expiry date must be in the future", 'error')
      setUploadingImages(false);
      return;
    }

    if (formData.skills.length === 0) {
      const { showToast } = await import("../../components/ui/toast")
      showToast("Please add at least one skill", 'error')
      setUploadingImages(false);
      return;
    }

    // Try different possible field names for artistId
    const artistId = user.userId || user.artistId || user.id || user._id;
    console.log("=== ARTIST ID DETECTION ===");
    console.log("Detected artistId:", artistId);
    
    if (!artistId) {
      console.error("=== ARTIST ID ERROR ===");
      console.error("Could not find any valid user ID field");
      console.error("Available user fields:", Object.keys(user || {}));
      const { showToast } = await import("../../components/ui/toast")
      showToast("Unable to identify your user ID. Please try logging out and logging in again.", 'error')
      setUploadingImages(false);
      return;
    }
    
    // Create FormData for multipart/form-data
    const submitData = new FormData();
    
    // Append form fields - match backend model exactly
    submitData.append("artistId", artistId); // Use the detected artistId
    submitData.append("title", formData.title?.trim());
    submitData.append("description", formData.description?.trim());
    submitData.append("categoryId", parseInt(formData.categoryId)); // Ensure it's an integer
    submitData.append("budget", parseFloat(formData.budget).toString()); // Ensure it's a number string, not formatted
    submitData.append("isActive", formData.isActive.toString()); // Convert boolean to string
    
    // Add postType to indicate this is an availability post
    submitData.append("postType", "availability");
    
    // Optional fields
    if (formData.duration) {
      submitData.append("duration", formData.duration);
    }
    if (formData.availabilityType) {
      submitData.append("availabilityType", formData.availabilityType);
    }
    if (formData.skills.length > 0) {
      submitData.append("skills", Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills);
    }
    if (formData.location) {
      submitData.append("location", formData.location);
    }
    if (formData.expireAt) {
      submitData.append("expireAt", new Date(formData.expireAt).toISOString());
    }

    // Append files for backend to process into attachments JSON
    formData.attachments.forEach(attachment => {
      if (attachment.file) {
        submitData.append('attachments', attachment.file);
      }
    });

    console.log("=== AVAILABILITY POST FORM SUBMISSION DEBUG ===");
    console.log("Submitting form data:");
    for (let [key, value] of submitData.entries()) {
      console.log(key, value);
    }

    // Reset form immediately after validation passes
    setFormData({
      title: "",
      description: "",
      budget: "",
      duration: "",
      expireAt: "",
      availabilityType: "freelance",
      location: "",
      skills: [],
      category: "",
      categoryId: "",
      attachments: [],
      isActive: true,
    });
    
    // Call parent onSubmit (which uses Redux) - no direct API call here
    onSubmit(submitData);
  } catch (error) {
    console.error("=== AVAILABILITY POST FORM SUBMISSION ERROR ===");
    console.error("Error object:", error);
    const { showToast } = await import("../../components/ui/toast")
    const errorMessage = error.message || "An unexpected error occurred";
    showToast(`Failed to submit form: ${errorMessage}`, 'error')
  } finally {
    setUploadingImages(false);
  }
};

  const handleRemoveImage = (index) => {
    const imageToRemove = formData.attachments[index];
    
    // If it's a blob URL, revoke it to free memory
    if (imageToRemove.url && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  // Early return for unauthorized users
  if (!user || (user.role !== 'artist' && user.role !== 'freelancer')) {
    return (
      <div className="bg-gray-800/20 backdrop-blur border border-red-500/50 rounded-xl p-8">
        <div className="text-center space-y-4">
          <div className="text-red-400 text-xl">🚫 Access Denied</div>
          <h3 className="text-xl font-semibold text-white">Artists Only</h3>
          <p className="text-gray-300">
            Only artists and freelancers can create availability posts.
            {user ? ` Your current role is: ${user.role}` : ' Please log in as an artist.'}
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
            Basic Information
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                <Tag className="inline w-4 h-4 mr-1" />
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Expert UI/UX Designer Available for Projects"
                maxLength={255}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
                required
              />
              {formData.title && (
                <div className="text-xs text-gray-400 text-right">
                  {formData.title.length}/255 characters
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your skills, experience, and what services you offer..."
                rows={6}
                maxLength={5000}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all resize-none"
                required
              />
              {formData.description && (
                <div className="text-xs text-gray-400 text-right">
                  {formData.description.length}/5000 characters
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category & Pricing */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Category & Pricing
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300">
                Category *
              </label>
              {categoriesLoading ? (
                <div className="flex items-center py-3">
                  <Loader />
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
              <label htmlFor="budget" className="block text-sm font-medium text-gray-300">
                <DollarSign className="inline w-4 h-4 mr-1" />
                Rate/Budget (USD) *
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="availabilityType" className="block text-sm font-medium text-gray-300">
              Availability Type
            </label>
            <select
              id="availabilityType"
              name="availabilityType"
              value={formData.availabilityType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
            >
              <option value="freelance">Freelance</option>
              <option value="part-time">Part-time</option>
              <option value="full-time">Full-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Skills *
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {popularSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    formData.skills.includes(skill)
                      ? "bg-[#A95BAB] text-white"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add custom skill..."
                className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCustomSkill()
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {formData.skills.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Selected skills:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#A95BAB]/20 text-[#A95BAB] border border-[#A95BAB]/30"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 hover:bg-[#A95BAB]/30 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Additional Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300">
                <Clock className="inline w-4 h-4 mr-1" />
                Duration/Availability
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 1 week, 2-3 days, 1 month"
                maxLength={100}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
              />
              {formData.duration && (
                <div className="text-xs text-gray-400 text-right">
                  {formData.duration.length}/100 characters
                </div>
              )}
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
                maxLength={100}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
              />
              {formData.location && (
                <div className="text-xs text-gray-400 text-right">
                  {formData.location.length}/100 characters
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Expiry Date */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Expiry Date
          </h3>
          <div className="space-y-4">
            <label htmlFor="expireAt" className="block text-sm font-medium text-gray-300">
              Select Expiry Date *
            </label>
            <input
              type="date"
              id="expireAt"
              name="expireAt"
              value={formData.expireAt}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
              required
            />
          </div>
        </div>

        {/* Attachments */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Portfolio Images
          </h3>
          <div className="space-y-4">
            <label htmlFor="attachments" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600/50 border-dashed rounded-lg hover:border-[#A95BAB]/50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-400 text-sm">Click to upload portfolio images</p>
                <p className="text-gray-500 text-xs">PNG, JPG, or JPEG up to 10MB each (max 5 images)</p>
              </div>
            </label>
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.attachments.map((photo, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-600 bg-gray-800">
                        <img
                          src={photo.url}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            console.error('Image failed to load:', photo.url);
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEzVjE5QTIgMiAwIDAgMSAxOSAyMUg1QTIgMiAwIDAgMSAzIDE5VjVBMiAyIDAgMCAxIDUgM0gxM00xNSA5TDIxIDNNMjEgM0gxNk0yMSAzVjgiIHN0cm9rZT0iIzk5OTk4OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
                          }}
                        />
                        {/* Overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      {/* File name overlay */}
                      <div className="absolute bottom-2 left-2 right-8 bg-black/70 text-white text-xs px-2 py-1 rounded max-w-full truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {photo.name}
                      </div>
                      
                      {/* Upload status indicator */}
                      {photo.uploaded && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center">
                          <span className="text-xs">✓</span>
                        </div>
                      )}
                      
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-400 flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  {formData.attachments.length} of 5 image{formData.attachments.length !== 1 ? 's' : ''} selected
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
                <span className="ml-2">Creating Availability Post...</span>
              </div>
            ) : uploadingImages ? (
              <div className="flex items-center justify-center">
                <Loader />
                <span className="ml-2">Processing Images...</span>
              </div>
            ) : (
              "Create Availability Post"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateAvailabilityPostForm
