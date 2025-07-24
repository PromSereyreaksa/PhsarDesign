"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
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
import { X, Plus, DollarSign, Users, Star, ArrowLeft, Upload } from "lucide-react"

export default function PostJobFreelancer() {
  const [serviceTitle, setServiceTitle] = useState("")
  const [serviceDescription, setServiceDescription] = useState("")
  const [category, setCategory] = useState("")
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [pricingType, setPricingType] = useState("fixed")
  const [basePrice, setBasePrice] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [portfolioItems, setPortfolioItems] = useState([])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({
      type: 'freelancer',
      serviceTitle,
      serviceDescription,
      category,
      skills,
      pricingType,
      basePrice,
      deliveryTime,
      experienceLevel,
      portfolioItems
    })
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
            Create Service - Offer Your Skills
          </h1>
          <p className="text-xl text-gray-300">Showcase your creative talents and attract potential clients</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 mb-12">
          {/* Service Details */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Star className="h-5 w-5 mr-2" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="service-title" className="text-gray-300">Service Title *</Label>
                <Input
                  id="service-title"
                  placeholder="e.g. I will create stunning digital art for your brand"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="mt-1"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">Start with "I will" to describe what you offer</p>
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-300">Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your specialty" />
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
                <Label htmlFor="service-description" className="text-gray-300">Service Description *</Label>
                <Textarea
                  id="service-description"
                  placeholder="Describe your service in detail. What makes you unique? What's your creative process? What can clients expect from working with you?"
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="mt-1 min-h-[120px]"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">
                  Minimum 100 characters. Showcase your expertise and creative approach.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills & Expertise */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Add Your Skills</Label>
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
                  <Label className="text-gray-300">Your Skills</Label>
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
                <Label className="text-gray-300">Popular Skills</Label>
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

              <div>
                <Label htmlFor="experience" className="text-gray-300">Your Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - Just starting out</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Some professional experience</SelectItem>
                    <SelectItem value="expert">Expert - Extensive portfolio and experience</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Delivery */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing & Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-gray-300">Pricing Type *</Label>
                <RadioGroup value={pricingType} onValueChange={setPricingType} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed" id="fixed-price" />
                    <Label htmlFor="fixed-price" className="text-gray-300">Fixed Price - Set price per project</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hourly" id="hourly-rate" />
                    <Label htmlFor="hourly-rate" className="text-gray-300">Hourly Rate - Charge by the hour</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="package" id="package" />
                    <Label htmlFor="package" className="text-gray-300">Package Deal - Multiple tiers available</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="base-price" className="text-gray-300">
                  {pricingType === "fixed" ? "Starting Price *" : pricingType === "hourly" ? "Hourly Rate *" : "Basic Package Price *"}
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="base-price"
                    type="number"
                    placeholder={pricingType === "fixed" ? "50" : pricingType === "hourly" ? "25" : "75"}
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  {pricingType === "fixed" 
                    ? "Set your starting price for basic projects"
                    : pricingType === "hourly" 
                    ? "Set your hourly rate" 
                    : "Set your basic package price"
                  }
                </p>
              </div>

              <div>
                <Label htmlFor="delivery" className="text-gray-300">Delivery Time</Label>
                <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select typical delivery time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-day">1 day</SelectItem>
                    <SelectItem value="2-3-days">2-3 days</SelectItem>
                    <SelectItem value="1-week">1 week</SelectItem>
                    <SelectItem value="2-weeks">2 weeks</SelectItem>
                    <SelectItem value="1-month">1 month</SelectItem>
                    <SelectItem value="custom">Custom timeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Upload className="h-5 w-5 mr-2" />
                Portfolio & Samples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Upload Your Best Work</Label>
                <div className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#A95BAB]/50 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-300 mb-2">Drag & drop your portfolio images here</p>
                  <p className="text-sm text-gray-400 mb-4">Or click to browse files</p>
                  <Button type="button" variant="outline">
                    Choose Files
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Upload 3-5 of your best creative works. Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Service Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="express" />
                <Label htmlFor="express" className="text-gray-300">Offer express delivery (additional fee)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="revisions" />
                <Label htmlFor="revisions" className="text-gray-300">Include unlimited revisions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="commercial" />
                <Label htmlFor="commercial" className="text-gray-300">Commercial usage rights included</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="consultation" />
                <Label htmlFor="consultation" className="text-gray-300">Offer free consultation call</Label>
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
                Preview Service
              </Button>
              <Button type="submit" size="lg" className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white">
                Publish Service
              </Button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  )
}