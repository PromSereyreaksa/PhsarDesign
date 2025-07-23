"use client"

import { useState } from "react"
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
import { X, Plus, DollarSign, Users } from "lucide-react"

export default function PostJob() {
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [category, setCategory] = useState("")
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [budgetType, setBudgetType] = useState("fixed")
  const [budgetAmount, setBudgetAmount] = useState("")
  const [projectDuration, setProjectDuration] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")

  const categories = [
    "Web Development",
    "Mobile Development",
    "Graphic Design",
    "Content Writing",
    "Digital Marketing",
    "Data Science",
    "Video Editing",
    "Translation",
  ]

  const suggestedSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "PHP",
    "WordPress",
    "Graphic Design",
    "Adobe Photoshop",
    "Illustrator",
    "Figma",
    "Content Writing",
    "SEO",
    "Social Media",
    "Marketing",
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle job posting logic here
    console.log({
      jobTitle,
      jobDescription,
      category,
      skills,
      budgetType,
      budgetAmount,
      projectDuration,
      experienceLevel,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Post a New Job</h1>
          <p className="text-lg text-gray-600">Tell us about your project and find the perfect freelancer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="job-title">Job Title *</Label>
                <Input
                  id="job-title"
                  placeholder="e.g. Build a responsive website for my business"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="mt-1"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">A good title helps attract the right freelancers</p>
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
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
                <Label htmlFor="job-description">Job Description *</Label>
                <Textarea
                  id="job-description"
                  placeholder="Describe your project in detail. Include what you want to achieve, any specific requirements, and what deliverables you expect."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-1 min-h-[120px]"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 50 characters. Be specific about your requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills Required */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Required</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Add Skills</Label>
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
                  <Label>Selected Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-red-600">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Suggested Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {suggestedSkills
                    .filter((skill) => !skills.includes(skill))
                    .slice(0, 10)
                    .map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Budget & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Budget Type *</Label>
                <RadioGroup value={budgetType} onValueChange={setBudgetType} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fixed Price - Pay a set amount for the entire project</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hourly" id="hourly" />
                    <Label htmlFor="hourly">Hourly Rate - Pay by the hour</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="budget">{budgetType === "fixed" ? "Project Budget *" : "Hourly Rate *"}</Label>
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
                <p className="text-sm text-gray-500 mt-1">
                  {budgetType === "fixed"
                    ? "Set a budget for the entire project"
                    : "Set an hourly rate you're willing to pay"}
                </p>
              </div>

              <div>
                <Label htmlFor="duration">Project Duration</Label>
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
                <Label htmlFor="experience">Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select required experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level - New to this type of work</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                    <SelectItem value="expert">Expert - Extensive experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <Label htmlFor="featured">Make this job featured (+$19.95)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="urgent" />
                <Label htmlFor="urgent">Mark as urgent (+$9.95)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="private" />
                <Label htmlFor="private">Make this job private (only invited freelancers can see it)</Label>
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
              <Button type="submit" size="lg">
                Post Job
              </Button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}
