"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { X, Plus, DollarSign, User, Upload, ImageIcon, ArrowLeft, Loader2, Calendar, MapPin } from "lucide-react"
import { availabilityPostsAPI, uploadAPI } from "../../services/api"
import { addItem } from "../../store/slices/apiSlice"
import { showToast } from "../../components/ui/toast"

export default function PostAvailability() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { isLoading, error } = useSelector((state) => state.api)
  
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [availabilityType, setAvailabilityType] = useState("immediate")
  const [duration, setDuration] = useState("")
  const [budget, setBudget] = useState("")
  const [location, setLocation] = useState("")
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [portfolioSamples, setPortfolioSamples] = useState([])
  const [contactPreference, setContactPreference] = useState("platform")
  const [status, setStatus] = useState("active")
  const [expiresAt, setExpiresAt] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const categories = [
    "illustration", 
    "design", 
    "photography", 
    "writing", 
    "video", 
    "music", 
    "animation", 
    "web-development", 
    "other"
  ]

  const suggestedSkills = [
    "Digital Art",
    "Logo Design", 
    "Graphic Design",
    "3D Design",
    "Character Design",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Figma",
    "Blender",
    "Maya",
    "Procreate",
    "Sketch",
    "UI/UX Design",
    "Web Design",
    "Photography",
    "Video Editing",
    "Animation",
    "Creative Writing"
  ]

  const addSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill])
    }
    setNewSkill("")
  }

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('folder', 'artlink/availability-posts')
      
      try {
        const response = await uploadAPI.uploadPortfolio(formData)
        return response.data.secure_url
      } catch (error) {
        console.error('Error uploading image:', error)
        return null
      }
    })
    
    const uploadedUrls = await Promise.all(uploadPromises)
    const successfulUploads = uploadedUrls.filter(url => url !== null)
    setPortfolioSamples([...portfolioSamples, ...successfulUploads])
  }

  const removeImage = (urlToRemove) => {
    setPortfolioSamples(portfolioSamples.filter((url) => url !== urlToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError("")

    console.log('Availability form submission started...')
    console.log('Form data:', {
      title,
      description,
      category,
      availabilityType,
      duration,
      budget,
      location,
      skills,
      portfolioSamples,
      contactPreference,
      status,
      expiresAt
    })

    try {
      // Validate required fields
      if (!title?.trim()) {
        const error = "Title is required"
        setSubmitError(error)
        showToast(error, 'error')
        setLoading(false)
        return
      }

      if (!description?.trim()) {
        const error = "Description is required"
        setSubmitError(error)
        showToast(error, 'error')
        setLoading(false)
        return
      }

      if (!category) {
        const error = "Category is required"
        setSubmitError(error)
        showToast(error, 'error')
        setLoading(false)
        return
      }

      const postData = {
        title: title.trim(),
        description: description.trim(),
        category,
        availabilityType,
        duration: duration || null,
        budget: budget ? parseFloat(budget) : null,
        location: location || null,
        skills: skills.length > 0 ? skills.join(', ') : null,
        portfolioSamples: portfolioSamples || [],
        contactPreference,
        status,
        expiresAt: expiresAt || null
      }

      console.log('Submitting availability post data:', postData)
      console.log('Making API call to:', '/api/availability-posts');

      const response = await availabilityPostsAPI.create(postData)
      
      console.log('Response received:', response)
      console.log('Response status:', response?.status)
      console.log('Response data:', response?.data)
      
      if (response.data) {
        dispatch(addItem({ type: 'availabilityPosts', data: response.data }))
        
        // Show success notification
        showToast('Your availability post has been published successfully!', 'success')
        
        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        throw new Error('No data received from server')
      }
    } catch (error) {
      console.error('Error creating availability post:', error)
      console.error('Error response:', error.response)
      console.error('Error response data:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Error message:', error.message)
      
      let errorMessage
      
      // Check if it's a network error
      if (!error.response) {
        errorMessage = "Network error: Cannot connect to server. Please check if the backend is running on port 3000."
      } else if (error.response?.status === 404) {
        errorMessage = "API endpoint not found. Please check if the backend routes are configured correctly."
      } else if (error.response?.status === 500) {
        errorMessage = "Server error: " + (error.response?.data?.error || "Internal server error")
      } else {
        errorMessage = error.response?.data?.error || error.message || 'Failed to create availability post. Please try again.'
      }
      
      setSubmitError(errorMessage)
      showToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/home" className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent mb-4">
            Post Your Availability
          </h1>
          <p className="text-lg text-gray-300">Let clients know you're available for new projects</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error Display */}
          {submitError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400">{submitError}</p>
            </div>
          )}

          {/* Loading Display */}
          {loading && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin text-blue-400 mr-2" />
                <p className="text-blue-400">Creating your availability post...</p>
              </div>
            </div>
          )}

          {/* Post Details */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="h-5 w-5 mr-2" />
                Availability Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-white">
                  Post Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Experienced Logo Designer Available for Immediate Projects"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-[#A95BAB] focus:ring-[#A95BAB]"
                  required
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white'
                  }}
                />
                <p className="text-sm text-gray-400 mt-1">Write a compelling title to attract clients</p>
              </div>

              <div>
                <Label htmlFor="category" className="text-white">
                  Category *
                </Label>
                <Select value={category} onValueChange={(value) => {
                  console.log('Category selected:', value);
                  setCategory(value);
                }} required>
                  <SelectTrigger className="mt-1 bg-[#202020] border-[#A95BAB]/30 text-white">
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#202020] border-[#A95BAB]/30">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                      >
                        {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {category && (
                  <p className="text-sm text-green-400 mt-1">
                    Selected: {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your availability, expertise, and what types of projects you're looking for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-[#A95BAB] focus:ring-[#A95BAB]"
                  required
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white'
                  }}
                />
                <p className="text-sm text-gray-400 mt-1">Be specific about your expertise and project preferences</p>
              </div>
            </CardContent>
          </Card>

          {/* Availability & Location */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Calendar className="h-5 w-5 mr-2" />
                Availability & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="availability-type" className="text-white">
                  Availability Type *
                </Label>
                <Select value={availabilityType} onValueChange={setAvailabilityType} required>
                  <SelectTrigger className="mt-1 bg-[#202020] border-[#A95BAB]/30 text-white">
                    <SelectValue placeholder="When are you available?" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#202020] border-[#A95BAB]/30">
                    <SelectItem value="immediate" className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white">
                      Immediate
                    </SelectItem>
                    <SelectItem value="within-week" className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white">
                      Within a Week
                    </SelectItem>
                    <SelectItem value="within-month" className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white">
                      Within a Month
                    </SelectItem>
                    <SelectItem value="flexible" className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white">
                      Flexible
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration" className="text-white">
                  Project Duration Preference
                </Label>
                <Input
                  id="duration"
                  placeholder="e.g. 1-2 weeks, Short-term, Long-term"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-[#A95BAB] focus:ring-[#A95BAB]"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white'
                  }}
                />
                <p className="text-sm text-gray-400 mt-1">Optional: Specify your preferred project duration</p>
              </div>

              <div>
                <Label htmlFor="location" className="text-white">
                  Location
                </Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="location"
                    placeholder="e.g. Remote, New York, USA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-[#A95BAB] focus:ring-[#A95BAB]"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">Optional: Specify your location or if you work remotely</p>
              </div>

              <div>
                <Label htmlFor="budget" className="text-white">
                  Budget Range (Per Project)
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder="500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-[#A95BAB] focus:ring-[#A95BAB]"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">Optional: Your typical project budget range</p>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Add Your Skills</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Type a skill and press Enter"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-[#A95BAB] focus:ring-[#A95BAB]"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addSkill(newSkill)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addSkill(newSkill)}
                    disabled={!newSkill}
                    className="bg-[#A95BAB] hover:bg-[#A95BAB]/80"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {skills.length > 0 && (
                <div>
                  <Label className="text-white">Your Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="flex items-center gap-1 bg-[#A95BAB]/20 text-white border-[#A95BAB]/30"
                      >
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-400">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-white">Popular Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedSkills
                    .filter((skill) => !skills.includes(skill))
                    .slice(0, 12)
                    .map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-[#A95BAB]/20 border-white/20 text-gray-300 hover:border-[#A95BAB]/50"
                        onClick={() => addSkill(skill)}
                      >
                        + {skill}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Samples */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <ImageIcon className="h-5 w-5 mr-2" />
                Portfolio Samples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Upload Sample Work</Label>
                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#A95BAB]/30 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-[#A95BAB]/10 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                <p className="text-sm text-gray-400 mt-1">Upload a few samples to showcase your work style</p>
              </div>

              {portfolioSamples.length > 0 && (
                <div>
                  <Label className="text-white">Portfolio Samples ({portfolioSamples.length})</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {portfolioSamples.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Portfolio sample ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-white/20"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact & Expiry */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Contact & Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="contact-preference" className="text-white">
                  Contact Preference
                </Label>
                <Select value={contactPreference} onValueChange={setContactPreference}>
                  <SelectTrigger className="mt-1 bg-[#202020] border-[#A95BAB]/30 text-white">
                    <SelectValue placeholder="How should clients contact you?" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#202020] border-[#A95BAB]/30">
                    <SelectItem value="platform" className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white">
                      Through Platform
                    </SelectItem>
                    <SelectItem value="email" className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white">
                      Direct Email
                    </SelectItem>
                    <SelectItem value="direct" className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white">
                      Direct Contact
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expires-at" className="text-white">
                  Post Expiry Date (Optional)
                </Label>
                <Input
                  id="expires-at"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="mt-1 bg-white/10 border-white/20 text-white focus:bg-white/15 focus:border-[#A95BAB] focus:ring-[#A95BAB]"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    colorScheme: 'dark'
                  }}
                />
                <p className="text-sm text-gray-400 mt-1">Leave empty to keep the post active indefinitely</p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              className="border-[#A95BAB]/30 text-white hover:bg-[#A95BAB]/20 hover:border-[#A95BAB] bg-[#202020]"
              onClick={() => setStatus("draft")}
            >
              Save as Draft
            </Button>
            <div className="space-x-4">
              <Button
                type="button"
                variant="outline"
                className="border-[#A95BAB]/30 text-white hover:bg-[#A95BAB]/20 hover:border-[#A95BAB] bg-[#202020]"
                disabled={loading}
              >
                Preview Post
              </Button>
              <Button 
                type="submit" 
                size="lg" 
                className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Publishing...
                  </>
                ) : (
                  'Publish Availability'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}