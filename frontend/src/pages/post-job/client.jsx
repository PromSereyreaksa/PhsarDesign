"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Badge } from "../../components/ui/badge"
import { X, Plus, DollarSign, Briefcase, ArrowLeft } from "lucide-react"
import { projectsAPI } from "../../services/api"
import { addItem } from "../../store/slices/apiSlice"

export default function PostJobClient() {
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [category, setCategory] = useState("")
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [budgetType, setBudgetType] = useState("fixed")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [projectDuration, setProjectDuration] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const categories = [
    "Digital Art",
    "Logo Design", 
    "Graphic Design",
    "3D Design",
    "Character Design",
    "Web Design",
    "UI/UX Design",
    "Illustration",
    "Animation",
    "Photography"
  ]

  const suggestedSkills = [
    "Digital Art",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Figma",
    "Sketch",
    "3D Modeling",
    "Blender",
    "Character Design",
    "Logo Design",
    "Branding",
    "UI Design",
    "UX Design",
    "Animation",
    "Video Editing"
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const projectData = {
        userId: user.userId, // This will be converted to clientId in the backend
        title: jobTitle,
        description: jobDescription,
        budget: parseFloat(budgetAmount),
        required_skills: skills.join(", "),
        // Optional: we could add deadline calculation based on projectDuration
      }

      const response = await projectsAPI.create(projectData)
      dispatch(addItem({ type: 'projects', data: response.data }))
      
      // Navigate to dashboard or project view
      navigate("/dashboard")
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to create project. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/home" className="inline-flex items-center text-gray-300 hover:text-[#A95BAB] transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent mb-4">
            Post a Job - Hire Talent
          </h1>
          <p className="text-xl text-gray-300">Tell us about your project and find the perfect creative freelancer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 mb-12">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Job Details */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Briefcase className="h-5 w-5 mr-2" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="job-title" className="text-gray-300">Job Title *</Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Create stunning digital art for album cover"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="mt-1"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">A good title helps attract the right freelancers</p>
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-300">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="job-description" className="text-gray-300">Job Description *</Label>
                <Textarea
                  id="job-description"
                  placeholder="Describe your project in detail. Include what you want to achieve, any specific requirements, style preferences, and what deliverables you expect."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-1 min-h-[120px]"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">
                  Minimum 50 characters. Be specific about your creative requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills Required */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Skills Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Add Skills</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Type a skill and press Enter"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addSkill(newSkill)
                      }
                    }}
                  />
                  <Button type="button" onClick={() => addSkill(newSkill)} disabled={!newSkill}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {skills.length > 0 && (
                <div>
                  <Label className="text-gray-300">Selected Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
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
                <Label className="text-gray-300">Suggested Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedSkills
                    .filter((skill) => !skills.includes(skill))
                    .slice(0, 10)
                    .map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-[#A95BAB]/20 hover:border-[#A95BAB]/50"
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
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <DollarSign className="h-5 w-5 mr-2" />
                Budget & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-300">Budget Type *</Label>
                <RadioGroup value={budgetType} onValueChange={setBudgetType} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed" className="text-gray-300">Fixed Price - Pay a set amount for the entire project</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hourly" id="hourly" />
                    <Label htmlFor="hourly" className="text-gray-300">Hourly Rate - Pay by the hour</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="budget" className="text-gray-300">{budgetType === "fixed" ? "Project Budget *" : "Hourly Rate *"}</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="budget"
                    type="number"
                    placeholder={budgetType === "fixed" ? "1000" : "25"}
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {budgetType === "fixed"
                    ? "Set a budget for the entire creative project"
                    : "Set an hourly rate you're willing to pay"}
                </p>
              </div>

              <div>
                <Label htmlFor="duration" className="text-gray-300">Project Duration</Label>
                <Select value={projectDuration} onValueChange={setProjectDuration}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select project duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-1-week">Less than 1 week</SelectItem>
                    <SelectItem value="1-4-weeks">1-4 weeks</SelectItem>
                    <SelectItem value="1-3-months">1-3 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="more-than-6-months">More than 6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience" className="text-gray-300">Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select required experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level - New creative talent</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Some creative experience</SelectItem>
                    <SelectItem value="expert">Expert - Extensive creative portfolio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Additional Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <Label htmlFor="featured" className="text-gray-300">Make this job featured (+$19.95)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="urgent" />
                <Label htmlFor="urgent" className="text-gray-300">Mark as urgent (+$9.95)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="private" />
                <Label htmlFor="private" className="text-gray-300">Make this job private (only invited freelancers can see it)</Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-between items-center">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <div className="space-x-4">
              <Button type="button" variant="outline">
                Preview Job
              </Button>
              <Button 
                type="submit" 
                size="lg" 
                className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white"
                disabled={loading || !jobTitle || !jobDescription || !budgetAmount}
              >
                {loading ? "Posting Job..." : "Post Job"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}