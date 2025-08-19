"use client"

import { useState } from "react"
import { Plus, X, Upload, Trash2, DollarSign, Clock, MapPin, Tag } from "lucide-react"
import * as marketplaceAPI from "../../store/api/marketplaceAPI"
import Loader from "../ui/Loader"
const CreatePostForm = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    duration: "",
    expireAt: "",
    availabilityType: "",
    location: "",
    skills: [],
    category: "",
    categoryId: "",
    attachments: [],
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

  // Validate file types and sizes
  const validFiles = files.filter(file => {
    const isValidType = file.type.startsWith('image/');
    const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
    
    if (!isValidType) {
      alert(`${file.name} is not a valid image file`);
      return false;
    }
    if (!isValidSize) {
      alert(`${file.name} is too large (max 10MB)`);
      return false;
    }
    return true;
  });

  if (validFiles.length === 0) return;

  setUploadingImages(true);

  try {
    // Create local URLs for preview while keeping the File objects for upload
    const newAttachments = await Promise.all(
      validFiles.map(async (file) => {
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

// Updated form submission function - integrate HandleUpload approach (multipart w/ 'attachments')
const handleFormSubmit = async (e) => {
  e.preventDefault();

  try {
    setUploadingImages(true);
    
    // Construct multipart payload expected by backend route upload.array('attachments', 5)
    const submitData = new FormData();
    const appendIfPresent = (key, value) => {
      if (value !== undefined && value !== null && `${value}` !== "") {
        submitData.append(key, value);
      }
    };

    appendIfPresent("title", formData.title?.trim());
    appendIfPresent("description", formData.description?.trim());
    appendIfPresent("categoryId", formData.categoryId);
    appendIfPresent("availabilityType", formData.availabilityType);
    appendIfPresent("budget", formData.budget);
    appendIfPresent("skills", Array.isArray(formData.skills) ? formData.skills.join(", ") : formData.skills);
    appendIfPresent("location", formData.location);
    // Convert date to ISO if possible
    appendIfPresent("expireAt", formData.expireAt ? new Date(formData.expireAt).toISOString() : undefined);
    appendIfPresent("isActive", true);

    // Append files
    (formData.attachments || [])
      .map((a) => a?.file)
      .filter(Boolean)
      .forEach((file) => submitData.append("attachments", file));

    // Post directly to create endpoint using API wrapper (axios will set boundary)
    const response = await marketplaceAPI.createAvailabilityPost(submitData);

    console.log("Form submitted successfully:", response.data);
    alert("Availability post created successfully!");

    setFormData({
      title: "",
      description: "",
      budget: "",
      duration: "",
      expireAt: "",
      availabilityType: "",
      location: "",
      skills: [],
      category: "",
      categoryId: "",
      attachments: [],
    });
  } catch (error) {
    console.error("Form submission error:", error);
    alert(
      `Failed to submit form: ${
        error.response?.data?.error || error.message
      }`
    );
  } finally {
    setUploadingImages(false);
  }
};


// Optional: Preview component for selected images
const AttachmentPreview = ({ attachments, onRemove }) => {
  if (attachments.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">
        Selected Images ({attachments.length}/5)
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {attachments.map((attachment, index) => (
          <div key={index} className="relative group">
            <img
              src={attachment.url}
              alt={attachment.name}
              className="w-full h-20 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate rounded-b">
              {attachment.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!formData.title.trim()) {
      alert("Please enter a project title");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter a project description");
      return;
    }

    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    if (!formData.expireAt) {
      alert("Please select an expiry date");
      return;
    }

    // Check if expiry date is in the future
    const expiryDate = new Date(formData.expireAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (expiryDate <= today) {
      alert("Expiry date must be in the future");
      return;
    }

    if (formData.skills.length === 0) {
      alert("Please add at least one skill");
      return;
    }

    // Prepare data for submission
    const postData = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : 0,
      attachments: formData.attachments.map(att => ({
        url: att.url,
        name: att.name,
        uploaded: att.uploaded || false
      }))
    };

    onSubmit(postData);
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
                Budget
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
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="availabilityType" className="block text-sm font-medium text-gray-300">
                Availability Type
              </label>
              <input
                type="text"
                id="availabilityType"
                name="availabilityType"
                value={formData.availabilityType}
                onChange={handleInputChange}
                placeholder="e.g., immediate, flexible, freelance"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
              />
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
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#A95BAB] focus:border-[#A95BAB] transition-all"
            />
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