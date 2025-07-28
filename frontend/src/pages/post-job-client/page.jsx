"use client"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { jobPostsAPI, clientsAPI } from "../../services/api"
import { addItem } from "../../store/slices/apiSlice"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { showToast } from "../../components/ui/toast"
import { X, Plus, DollarSign, Users, Upload, ImageIcon } from 'lucide-react'

export default function PostJobClient() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [category, setCategory] = useState("")

  // Debug category state changes
  useEffect(() => {
    console.log('Category state changed to:', category)
  }, [category])

  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [budgetType, setBudgetType] = useState("fixed")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [projectDuration, setProjectDuration] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [referenceImages, setReferenceImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // Test backend connection on component mount
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        // Test with a simple API call
        const response = await jobPostsAPI.getAll()
        console.log('Backend connection successful')
      } catch (error) {
        console.error('Backend connection failed:', error)
      }
    }
    
    testBackendConnection()
  }, [])

  const categories = [
    { value: "illustration", label: "Illustration" },
    { value: "design", label: "Design" }, 
    { value: "photography", label: "Photography" },
    { value: "writing", label: "Writing" },
    { value: "video", label: "Video" },
    { value: "music", label: "Music" },
    { value: "animation", label: "Animation" },
    { value: "web-development", label: "Web Development" },
    { value: "other", label: "Other" }
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    // In a real app, you'd upload these to a server
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
    }))
    setReferenceImages([...referenceImages, ...newImages])
  }

  const removeImage = (imageId) => {
    setReferenceImages(referenceImages.filter((img) => img.id !== imageId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    console.log('Form submission started...')
    console.log('Form data:', {
      jobTitle,
      jobDescription,
      category,
      budgetType,
      budgetAmount,
      projectDuration,
      experienceLevel,
      skills
    })

    try {
      // Validate frontend data before sending
      if (!jobTitle?.trim() || jobTitle.trim().length < 3) {
        setError("Project title must be at least 3 characters long")
        setIsSubmitting(false)
        return
      }

      if (!jobDescription?.trim() || jobDescription.trim().length < 10) {
        setError("Project description must be at least 10 characters long")
        setIsSubmitting(false)
        return
      }

      if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
        setError("Budget must be a positive number")
        setIsSubmitting(false)
        return
      }

      if (!category || category.trim() === "") {
        setError("Please select a category from the dropdown")
        setIsSubmitting(false)
        return
      }

      // Get effective user ID
      const effectiveUserId = user?.id || user?.userId || 1

      // First, ensure client profile exists
      let clientProfile
      try {
        // Try to get existing client profile
        const existingClient = await clientsAPI.getByUserId(effectiveUserId)
        clientProfile = existingClient.data
        console.log('Found existing client profile:', clientProfile)
      } catch (error) {
        if (error.response?.status === 404) {
          // Client doesn't exist, create one
          console.log('Client not found, creating new client profile...')
          const clientData = {
            userId: effectiveUserId,
            name: user?.name || "Demo Client",
            email: user?.email || "client@demo.com",
            company: "Demo Company"
          }
          const newClient = await clientsAPI.create(clientData)
          clientProfile = newClient.data
          console.log('Created new client profile:', clientProfile)
        } else {
          throw error
        }
      }

      // Convert project duration to deadline date
      let deadline = null;
      if (projectDuration) {
        const now = new Date();
        switch (projectDuration) {
          case "1-week":
            deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
          case "2-weeks":
            deadline = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
            break;
          case "1-month":
            deadline = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            break;
          case "2-months":
            deadline = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
            break;
          case "3-months":
            deadline = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
            break;
          default:
            deadline = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Default 1 month
        }
      }

      const jobPostData = {
        title: jobTitle.trim(),
        description: jobDescription.trim(),
        budget: parseFloat(budgetAmount),
        budgetType: budgetType,
        category: category.trim(),
        deadline: deadline,
        experienceLevel: experienceLevel || null,
        skillsRequired: skills.length > 0 ? skills.join(', ') : null
      }

      console.log('Submitting job post data:', jobPostData);
      console.log('Client ID:', clientProfile.clientId || clientProfile.id);
      console.log('Making API call to:', `/api/job-posts/client/${clientProfile.clientId || clientProfile.id}`);

      const response = await jobPostsAPI.create(clientProfile.clientId || clientProfile.id, jobPostData)
      console.log('API Response:', response);

      // Backend returns the job post directly, not wrapped in success/data
      if (response.data) {
        dispatch(addItem({ type: 'jobPosts', data: response.data }))
        setSuccess("Job posted successfully! Redirecting to dashboard...")
        setError("")
        
        // Show enhanced success notification
        showToast(
          `🎯 Your job "${jobTitle}" has been posted successfully! Talented freelancers can now submit proposals. You'll be redirected to your dashboard shortly.`, 
          'success', 
          8000
        )
        
        setTimeout(() => {
          navigate("/dashboard", { state: { message: 'Job posted successfully!' } })
        }, 3000)
      } else {
        throw new Error('Failed to create job post')
      }
    } catch (error) {
      console.error('Job post creation error:', error)
      console.error('Error response:', error.response)
      console.error('Error response data:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Error message:', error.message)

      setSuccess("")
      
      // Check if it's a network error
      if (!error.response) {
        setError("Network error: Cannot connect to server. Please check if the backend is running on port 3000.")
      } else if (error.response?.status === 400 && error.response.data.errors) {
        const validationErrors = error.response.data.errors
          .map(err => `${err.field}: ${err.message}`)
          .join('. ')
        console.error('Validation errors:', validationErrors)
        setError(validationErrors)
      } else if (error.response?.status === 404) {
        setError("API endpoint not found. Please check if the backend routes are configured correctly.")
      } else if (error.response?.status === 500) {
        setError("Server error: " + (error.response?.data?.error || "Internal server error"))
      } else {
        setError(error.response?.data?.error || error.response?.data?.message || `Request failed with status ${error.response?.status}: ${error.message}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/home" className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] transition-colors">
            <X className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent mb-4">
            Post a Creative Project
          </h1>
          <p className="text-lg text-gray-300">Find the perfect artist for your creative project</p>
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Details */}
          <Card className="bg-white/5 border-white/10 relative">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="h-5 w-5 mr-2" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="job-title" className="text-white">
                  Project Title *
                </Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Create a modern logo for my startup"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">A clear title helps attract the right artists</p>
              </div>

              <div>
                <Label htmlFor="category" className="text-white">
                  Category *
                </Label>
                <Select value={category} onValueChange={(value) => {
                  console.log('Category selected:', value);
                  setCategory(value);
                }} required>
                  <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white hover:bg-white/20 focus:border-[#A95BAB] focus:ring-[#A95BAB]">
                    <SelectValue 
                      placeholder="Select a category" 
                      value={categories.find(cat => cat.value === category)?.label || category}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#A95BAB]/30 max-h-60 overflow-y-auto">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.value}
                        value={cat.value}
                        className="text-white hover:bg-[#A95BAB]/30 focus:bg-[#A95BAB]/30 focus:text-white cursor-pointer data-[highlighted]:bg-[#A95BAB]/30 data-[highlighted]:text-white"
                      >
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!category && (
                  <p className="text-sm text-gray-400 mt-1">
                    Please select a category from the dropdown
                  </p>
                )}
                {category && (
                  <p className="text-sm text-green-400 mt-1">
                    Selected: {category}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="job-description" className="text-white">
                  Project Description *
                </Label>
                <Textarea
                  id="job-description"
                  placeholder="Describe your project in detail. Include what you want to achieve, style preferences, and any specific requirements."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-1 min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">Be specific about your vision and requirements</p>
              </div>
            </CardContent>
          </Card>

          {/* Reference Images */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <ImageIcon className="h-5 w-5 mr-2" />
                Reference Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Upload Reference Images (Optional)</Label>
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
                <p className="text-sm text-gray-400 mt-1">
                  Upload images that show your style preferences or examples of what you're looking for
                </p>
              </div>

              {referenceImages.length > 0 && (
                <div>
                  <Label className="text-white">Uploaded Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {referenceImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.name}
                          className="w-full h-24 object-cover rounded-lg border border-white/20"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <p className="text-xs text-gray-400 mt-1 truncate">{image.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Required */}
          <Card className="bg-white/5 border-white/10 relative">
            <CardHeader>
              <CardTitle className="text-white">Skills Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Add Skills</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Type a skill and press Enter"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
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
                  <Label className="text-white">Selected Skills</Label>
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
                <Label className="text-white">Suggested Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedSkills
                    .filter((skill) => !skills.includes(skill))
                    .slice(0, 10)
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

          {/* Budget & Timeline */}
          <Card className="bg-white/5 border-white/10 relative">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <DollarSign className="h-5 w-5 mr-2" />
                Budget & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-white">Budget Type *</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="fixed" 
                      name="budgetType"
                      value="fixed"
                      checked={budgetType === "fixed"}
                      onChange={(e) => setBudgetType(e.target.value)}
                      className="w-4 h-4 text-[#A95BAB] bg-transparent border-white/20 focus:ring-[#A95BAB] focus:ring-2"
                    />
                    <Label htmlFor="fixed" className="text-white cursor-pointer">
                      Fixed Price - Pay a set amount for the entire project
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="hourly" 
                      name="budgetType"
                      value="hourly"
                      checked={budgetType === "hourly"}
                      onChange={(e) => setBudgetType(e.target.value)}
                      className="w-4 h-4 text-[#A95BAB] bg-transparent border-white/20 focus:ring-[#A95BAB] focus:ring-2"
                    />
                    <Label htmlFor="hourly" className="text-white cursor-pointer">
                      Hourly Rate - Pay by the hour
                    </Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="budget" className="text-white">
                  {budgetType === "fixed" ? "Project Budget *" : "Hourly Rate *"}
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder={budgetType === "fixed" ? "1000" : "25"}
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {budgetType === "fixed"
                    ? "Set a budget for the entire project"
                    : "Set an hourly rate you're willing to pay"}
                </p>
              </div>

              <div>
                <Label htmlFor="duration" className="text-white">
                  Project Duration
                </Label>
                <Select value={projectDuration} onValueChange={setProjectDuration}>
                  <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white hover:bg-white/20 focus:border-[#A95BAB] focus:ring-[#A95BAB]">
                    <SelectValue placeholder="Select project duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#A95BAB]/30">
                    <SelectItem value="less-than-1-week" className="text-white hover:bg-[#A95BAB]/30 focus:bg-[#A95BAB]/30">
                      Less than 1 week
                    </SelectItem>
                    <SelectItem value="1-4-weeks" className="text-white hover:bg-[#A95BAB]/30 focus:bg-[#A95BAB]/30">
                      1-4 weeks
                    </SelectItem>
                    <SelectItem value="1-3-months" className="text-white hover:bg-[#A95BAB]/30 focus:bg-[#A95BAB]/30">
                      1-3 months
                    </SelectItem>
                    <SelectItem value="3-6-months" className="text-white hover:bg-[#A95BAB]/30 focus:bg-[#A95BAB]/30">
                      3-6 months
                    </SelectItem>
                    <SelectItem value="more-than-6-months" className="text-white hover:bg-[#A95BAB]/30 focus:bg-[#A95BAB]/30">
                      More than 6 months
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience" className="text-white">
                  Experience Level
                </Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger className="mt-1 bg-white/10 border-white/20 text-white hover:bg-white/20 focus:border-[#A95BAB] focus:ring-[#A95BAB]">
                    <SelectValue placeholder="Select required experience level" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#A95BAB]/30">
                    <SelectItem value="entry" className="text-white hover:bg-[#A95BAB]/30 focus:bg-[#A95BAB]/30">
                      Entry Level - New to this type of work
                    </SelectItem>
                    <SelectItem value="intermediate" className="text-white hover:bg-[#A95BAB]/30 focus:bg-[#A95BAB]/30">
                      Intermediate - Some experience
                    </SelectItem>
                    <SelectItem value="expert" className="text-white hover:bg-[#A95BAB]/30 focus:bg-[#A95BAB]/30">
                      Expert - Extensive experience
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Additional Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <Label htmlFor="featured" className="text-white">
                  Make this project featured (+$19.95)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="urgent" />
                <Label htmlFor="urgent" className="text-white">
                  Mark as urgent (+$9.95)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="private" />
                <Label htmlFor="private" className="text-white">
                  Make this project private (only invited artists can see it)
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              className="border-[#A95BAB]/30 text-white hover:bg-[#A95BAB]/20 hover:border-[#A95BAB] bg-[#202020]"
            >
              Save as Draft
            </Button>
            <div className="space-x-4">
              <Button
                type="button"
                variant="outline"
                className="border-[#A95BAB]/30 text-white hover:bg-[#A95BAB]/20 hover:border-[#A95BAB] bg-[#202020]"
              >
                Preview Project
              </Button>
              <Button 
                type="submit" 
                size="lg" 
                className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting Project..." : "Post Project"}
              </Button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}