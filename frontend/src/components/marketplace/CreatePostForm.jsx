"use client"

import { Clock, DollarSign, MapPin, Plus, Tag, Trash2, Upload, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "../../store/slices/categoriesSlice"
import * as marketplaceAPI from "../../store/api/marketplaceAPI"
import Loader from "../ui/Loader"
const CreatePostForm = ({ onSubmit, onCancel, isSubmitting = false }) => {
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
      alert('Please select only image files (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Each file must be less than 5MB');
      return;
    }

    // Limit to 5 files maximum
    if (formData.attachments.length + files.length > 5) {
      alert('You can upload maximum 5 images');
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
                size: file.size
              });
            };
            reader.readAsDataURL(file);
          });
        })
      );

      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
      }));

      console.log('Files prepared for upload:', newAttachments.length);
      alert(`${newAttachments.length} image(s) added successfully! Images will be uploaded when you submit the form.`);

    } catch (error) {
      console.error("Image processing failed:", error);
      alert(`Failed to process images: ${error.message}`);
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

// Updated form submission function - use marketplaceAPI
const handleFormSubmit = async (e) => {
  e.preventDefault();

  try {
    setUploadingImages(true);
    
    // Validate required fields with backend-matching validation
    if (!formData.title || formData.title.trim().length < 5 || formData.title.trim().length > 255) {
      alert('Title must be between 5 and 255 characters');
      setUploadingImages(false);
      return;
    }

    if (!formData.description || formData.description.trim().length < 20 || formData.description.trim().length > 5000) {
      alert('Description must be between 20 and 5000 characters');
      setUploadingImages(false);
      return;
    }

    if (!formData.categoryId) {
      alert('Please select a category');
      setUploadingImages(false);
      return;
    }

    if (!formData.budget || parseFloat(formData.budget) < 0) {
      alert("Budget must be a positive number");
      setUploadingImages(false);
      return;
    }

    // Validate optional field lengths to match backend validation
    if (formData.availabilityType && formData.availabilityType.trim().length > 50) {
      alert("Availability type must not exceed 50 characters");
      setUploadingImages(false);
      return;
    }

    if (formData.duration && formData.duration.trim().length > 100) {
      alert("Duration must not exceed 100 characters");
      setUploadingImages(false);
      return;
    }

    if (formData.location && formData.location.trim().length > 100) {
      alert("Location must not exceed 100 characters");
      setUploadingImages(false);
      return;
    }

    // Validate skills length (will be joined as string)
    const skillsString = Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills;
    if (skillsString && skillsString.length > 1000) {
      alert("Skills must not exceed 1000 characters. Please remove some skills.");
      setUploadingImages(false);
      return;
    }

    if (!formData.expireAt) {
      alert("Please select an expiry date");
      setUploadingImages(false);
      return;
    }

    // Check if expiry date is in the future
    const expiryDate = new Date(formData.expireAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (expiryDate <= today) {
      alert("Expiry date must be in the future");
      setUploadingImages(false);
      return;
    }

    if (formData.skills.length === 0) {
      alert("Please add at least one skill");
      setUploadingImages(false);
      return;
    }

    // Check if user is authenticated and has artistId
    console.log("=== USER AUTHENTICATION DEBUG ===");
    console.log("User object:", user);
    console.log("User keys:", user ? Object.keys(user) : "No user");
    console.log("User.artistId:", user?.artistId);
    console.log("User.id:", user?.id);
    console.log("User._id:", user?._id);
    console.log("User.userId:", user?.userId);
    console.log("User.role:", user?.role);
    console.log("User.firstName:", user?.firstName);
    console.log("User.lastName:", user?.lastName);
    
    if (!user) {
      alert("You must be logged in to create posts");
      setUploadingImages(false);
      return;
    }

    // Check if user is an artist/freelancer
    if (user.role !== 'artist' && user.role !== 'freelancer') {
      alert("Only artists can create availability posts. Your current role is: " + (user.role || "unknown"));
      setUploadingImages(false);
      return;
    }

    // Try different possible field names for artistId
    const artistId = user.userId || user.artistId || user.id || user._id;
    console.log("=== ARTIST ID DETECTION ===");
    console.log("Detected artistId:", artistId);
    console.log("Using user.userId as artistId since it's the standard field in this app");
    
    if (!artistId) {
      console.error("=== ARTIST ID ERROR ===");
      console.error("Could not find any valid user ID field");
      console.error("Available user fields:", Object.keys(user || {}));
      alert("Unable to identify your user ID. Please try logging out and logging in again.");
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

    console.log("=== FORM SUBMISSION DEBUG ===");
    console.log("Submitting form data:");
    for (let [key, value] of submitData.entries()) {
      console.log(key, value);
    }

    console.log("=== API CALL STARTING ===");
    // Use the marketplaceAPI createAvailabilityPost function
    const response = await marketplaceAPI.createAvailabilityPost(submitData);

    console.log("=== API CALL SUCCESS ===");
    console.log("Form submitted successfully:", response.data);
    alert('Availability post created successfully!');
    
    // Reset form
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
    
    // Call parent onSubmit with the response data
    onSubmit(response.data);
  } catch (error) {
    console.error("=== FORM SUBMISSION ERROR ===");
    console.error("Error object:", error);
    console.error("Error response:", error.response);
    console.error("Error response data:", error.response?.data);
    console.error("Error message:", error.message);
    console.error("Full error details:", JSON.stringify(error.response?.data, null, 2));
    
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
    alert(`Failed to submit form: ${errorMessage}`);
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

  return (
    <div className="bg-gray-800/20 backdrop-blur border border-gray-700/50 rounded-xl p-8">
      <form onSubmit={handleFormSubmit} className="space-y-8">
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
              maxLength={255}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
              required
            />
            <div className="text-xs text-gray-400 text-right">
              {formData.title.length}/255 characters
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-300">
              Category *
            </label>
            <select 
              id="categoryId" 
              name="categoryId" 
              value={formData.categoryId} 
              onChange={handleInputChange} 
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
              required
              disabled={categoriesLoading}
            >
              <option value="">{categoriesLoading ? "Loading categories..." : "Select a category"}</option>
              {categories && categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
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
              maxLength={5000}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all resize-none"
              required
            />
            <div className="text-xs text-gray-400 text-right">
              {formData.description.length}/5000 characters (minimum 20)
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Skills *
          </h3>

          {/* Popular Skills */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Popular Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {popularSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.skills.includes(skill)
                      ? "bg-[#A95BAB] text-white"
                      : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Skill Input */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Add Custom Skill
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Type a skill..."
                className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomSkill())}
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-4 py-2 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-colors flex items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Selected Skills */}
          {formData.skills.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                Selected Skills ({formData.skills.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-[#A95BAB]/20 text-[#A95BAB] rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-400 text-right">
                Skills text: {formData.skills.join(", ").length}/1000 characters
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Timeline */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-[#A95BAB] rounded-full mr-3"></span>
            Pricing & Timeline
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
                min="0.01"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
                required
              />
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
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
              >
                <option value="freelance">Freelance</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300">
              <Clock className="inline w-4 h-4 mr-1" />
              Project Duration
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
            Attachments
          </h3>
          <div className="space-y-4">
            <label htmlFor="attachments" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600/50 border-dashed rounded-lg hover:border-[#A95BAB]/50 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-400 text-sm">Click to upload images</p>
                <p className="text-gray-500 text-xs">PNG, JPG, or JPEG up to 10MB each</p>
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
                <span className="ml-2 text-gray-300">Uploading images...</span>
              </div>
            )}
            
            {formData.attachments && formData.attachments.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.attachments.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.url}
                        alt={`Attachment ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-600"
                        onError={(e) => {
                          console.error('Image failed to load:', photo.url);
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEzVjE5QTIgMiAwIDAgMSAxOSAyMUg1QTIgMiAwIDAgMSAzIDE5VjVBMiAyIDAgMCAxIDUgM0gxM00xNSA5TDIxIDNNMjEgM0gxNk0yMSAzVjgiIHN0cm9rZT0iIzk5OTk4OCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';
                        }}
                      />
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded max-w-full truncate">
                        {photo.name}
                      </div>
                      {photo.uploaded && (
                        <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                          ✓
                        </div>
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
                  {formData.attachments.length} attachment{formData.attachments.length !== 1 ? 's' : ''} selected
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
                <span className="ml-2">Creating Post...</span>
              </div>
            ) : uploadingImages ? (
              <div className="flex items-center justify-center">
                <Loader />
                <span className="ml-2">Uploading Images...</span>
              </div>
            ) : (
              "Create Post"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatePostForm