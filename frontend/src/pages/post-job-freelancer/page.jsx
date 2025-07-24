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
import { Badge } from "../../components/ui/badge"
import { X, Plus, DollarSign, User, Upload, ImageIcon, ArrowLeft, Star } from "lucide-react"

export default function PostJobFreelancer() {
  const [serviceTitle, setServiceTitle] = useState("")
  const [serviceDescription, setServiceDescription] = useState("")
  const [category, setCategory] = useState("")
  const [skills, setSkills] = useState([])
  const [newSkill, setNewSkill] = useState("")
  const [hourlyRate, setHourlyRate] = useState("")
  const [availability, setAvailability] = useState("")
  const [portfolioImages, setPortfolioImages] = useState([])
  const [packages, setPackages] = useState([
    { name: "Basic", price: "", description: "", deliveryTime: "" },
    { name: "Standard", price: "", description: "", deliveryTime: "" },
    { name: "Premium", price: "", description: "", deliveryTime: "" },
  ])

  const categories = ["Digital Art", "Logo Design", "Graphic Design", "3D Design", "Character Design"]

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
    setPortfolioImages([...portfolioImages, ...newImages])
  }

  const removeImage = (imageId) => {
    setPortfolioImages(portfolioImages.filter((img) => img.id !== imageId))
  }

  const updatePackage = (index, field, value) => {
    const updatedPackages = [...packages]
    updatedPackages[index][field] = value
    setPackages(updatedPackages)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle service posting logic here
    console.log({
      serviceTitle,
      serviceDescription,
      category,
      skills,
      hourlyRate,
      availability,
      portfolioImages,
      packages,
    })
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
            Create Your Service
          </h1>
          <p className="text-lg text-gray-300">Showcase your creative skills and attract clients</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Service Details */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <User className="h-5 w-5 mr-2" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="service-title" className="text-white">
                  Service Title *
                </Label>
                <Input
                  id="service-title"
                  placeholder="e.g. I will create a stunning logo design for your brand"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">Start with "I will..." to describe what you offer</p>
              </div>

              <div>
                <Label htmlFor="category" className="text-white">
                  Category *
                </Label>
                <Select value={category} onValueChange={setCategory} required>
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
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="service-description" className="text-white">
                  Service Description *
                </Label>
                <Textarea
                  id="service-description"
                  placeholder="Describe your service in detail. What makes you unique? What can clients expect from working with you?"
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="mt-1 min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
                <p className="text-sm text-gray-400 mt-1">Highlight your experience and what sets you apart</p>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Images */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <ImageIcon className="h-5 w-5 mr-2" />
                Portfolio Gallery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Upload Your Best Work *</Label>
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
                <p className="text-sm text-gray-400 mt-1">Upload 3-10 images showcasing your best work and style</p>
              </div>

              {portfolioImages.length > 0 && (
                <div>
                  <Label className="text-white">Portfolio Images ({portfolioImages.length})</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {portfolioImages.map((image) => (
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

          {/* Skills & Expertise */}
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

          {/* Pricing & Availability */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing & Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="hourly-rate" className="text-white">
                  Hourly Rate *
                </Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="hourly-rate"
                    type="number"
                    placeholder="25"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
                <p className="text-sm text-gray-400 mt-1">Set your hourly rate in USD</p>
              </div>

              <div>
                <Label htmlFor="availability" className="text-white">
                  Availability
                </Label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger className="mt-1 bg-[#202020] border-[#A95BAB]/30 text-white">
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#202020] border-[#A95BAB]/30">
                    <SelectItem
                      value="full-time"
                      className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                    >
                      Full-time (40+ hours/week)
                    </SelectItem>
                    <SelectItem
                      value="part-time"
                      className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                    >
                      Part-time (20-40 hours/week)
                    </SelectItem>
                    <SelectItem
                      value="project-based"
                      className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                    >
                      Project-based
                    </SelectItem>
                    <SelectItem
                      value="weekends"
                      className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                    >
                      Weekends only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Service Packages */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Service Packages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-300">Create different packages to offer clients various options</p>

              <div className="grid md:grid-cols-3 gap-6">
                {packages.map((pkg, index) => (
                  <Card key={index} className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg flex items-center">
                        {pkg.name === "Basic" && <Star className="h-4 w-4 mr-2 text-gray-400" />}
                        {pkg.name === "Standard" && <Star className="h-4 w-4 mr-2 text-yellow-400" />}
                        {pkg.name === "Premium" && <Star className="h-4 w-4 mr-2 text-[#A95BAB]" />}
                        {pkg.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-white">Price *</Label>
                        <div className="relative mt-1">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type="number"
                            placeholder="50"
                            value={pkg.price}
                            onChange={(e) => updatePackage(index, "price", e.target.value)}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-white">Description</Label>
                        <Textarea
                          placeholder="What's included in this package?"
                          value={pkg.description}
                          onChange={(e) => updatePackage(index, "description", e.target.value)}
                          className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label className="text-white">Delivery Time</Label>
                        <Select
                          value={pkg.deliveryTime}
                          onValueChange={(value) => updatePackage(index, "deliveryTime", value)}
                        >
                          <SelectTrigger className="mt-1 bg-[#202020] border-[#A95BAB]/30 text-white">
                            <SelectValue placeholder="Select delivery time" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#202020] border-[#A95BAB]/30">
                            <SelectItem
                              value="1-day"
                              className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                            >
                              1 day
                            </SelectItem>
                            <SelectItem
                              value="3-days"
                              className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                            >
                              3 days
                            </SelectItem>
                            <SelectItem
                              value="1-week"
                              className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                            >
                              1 week
                            </SelectItem>
                            <SelectItem
                              value="2-weeks"
                              className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                            >
                              2 weeks
                            </SelectItem>
                            <SelectItem
                              value="1-month"
                              className="text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 focus:text-white"
                            >
                              1 month
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
