"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Users, Target, Award, Heart, CheckCircle, Star, Globe, Shield, Clock } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"

export default function AboutPage() {
  const [email, setEmail] = useState("")

  const stats = [
    { number: "50k+", label: "Creative Artists", icon: Users },
    { number: "100k+", label: "Projects Completed", icon: CheckCircle },
    { number: "99%", label: "Client Satisfaction", icon: Star },
    { number: "24/7", label: "Support Available", icon: Clock },
  ]

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To connect creative talent with opportunities worldwide, fostering innovation and artistic expression in the digital age.",
    },
    {
      icon: Heart,
      title: "Our Vision",
      description:
        "To become the world's most trusted platform where creativity meets opportunity, empowering artists and businesses alike.",
    },
    {
      icon: Award,
      title: "Our Values",
      description:
        "Quality, integrity, innovation, and community. We believe in fair compensation and meaningful creative partnerships.",
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Protected transactions with escrow services and milestone-based payments for peace of mind.",
    },
    {
      icon: Globe,
      title: "Global Network",
      description:
        "Connect with talented creatives from around the world, bringing diverse perspectives to your projects.",
    },
    {
      icon: Star,
      title: "Quality Assurance",
      description: "Verified professionals, portfolio reviews, and client feedback ensure top-quality deliverables.",
    },
  ]

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      image: "/DigitalArt.jpg",
      description: "Former creative director with 15+ years in digital design and marketplace development.",
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO",
      image: "/LogoDesign.jpg",
      description: "Tech visionary specializing in scalable platforms and user experience optimization.",
    },
    {
      name: "Emily Watson",
      role: "Head of Community",
      image: "/CharacterDesign.jpg",
      description: "Community builder passionate about connecting creatives and fostering artistic growth.",
    },
  ]

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      description: "PhsarDesign launched with a vision to revolutionize creative freelancing",
    },
    { year: "2021", title: "10k Users", description: "Reached our first major milestone of 10,000 registered users" },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Expanded to serve creatives in over 50 countries worldwide",
    },
    {
      year: "2023",
      title: "100k Projects",
      description: "Celebrated 100,000 successful projects completed on our platform",
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Launched AI-powered matching system for better project connections",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] via-[#1a1a1a] to-[#000000]">
      {/* Navigation */}
      <nav className="relative z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link
                to="/"
                className="text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent"
              >
                PhsarDesign
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
              >
                Home
              </Link>
              <Link
                to="/browse-jobs"
                className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
              >
                Browse Jobs
              </Link>
              <Link
                to="/post-job-client"
                className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
              >
                Post Job
              </Link>
              <span className="text-[#A95BAB] cursor-pointer">About</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#A95BAB] hover:bg-white/10 rounded-lg px-6 transform hover:scale-105 transition-all duration-500 ease-out"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg px-6 transform hover:scale-105 transition-all duration-500 ease-out">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">About</span>
              <br />
              <span className="text-white">PhsarDesign</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-8">
              We're on a mission to connect the world's most talented creatives with businesses that need exceptional
              design. Our platform bridges the gap between artistic vision and commercial success.
            </p>
            <Link to="/register">
              <Button
                size="lg"
                className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg px-8 py-4 text-lg font-semibold group transform hover:scale-105 transition-all duration-500 ease-out"
              >
                Join Our Community
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card
                  key={index}
                  className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 rounded-2xl cursor-pointer group overflow-hidden relative transform hover:scale-105 transition-all duration-500 ease-out text-center p-6"
                >
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-[#A95BAB]/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#A95BAB]/30 transition-colors duration-500 ease-out">
                      <IconComponent className="h-6 w-6 text-[#A95BAB]" />
                    </div>
                    <div className="text-3xl font-bold text-[#A95BAB] mb-2">{stat.number}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Foundation</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built on strong principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card
                  key={index}
                  className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 rounded-2xl cursor-pointer group overflow-hidden relative transform hover:scale-105 transition-all duration-500 ease-out"
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-[#A95BAB]/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#A95BAB]/30 transition-colors duration-500 ease-out">
                      <IconComponent className="h-8 w-8 text-[#A95BAB]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose PhsarDesign?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We provide the tools and security you need for successful creative collaborations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 rounded-2xl cursor-pointer group overflow-hidden relative transform hover:scale-105 transition-all duration-500 ease-out"
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-[#A95BAB]/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#A95BAB]/30 transition-colors duration-500 ease-out">
                      <IconComponent className="h-8 w-8 text-[#A95BAB]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The passionate individuals behind PhsarDesign's success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl overflow-hidden group cursor-pointer relative transform hover:scale-105 transition-all duration-500 ease-out"
              >
                {/* Background Image on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 ease-out">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <CardContent className="p-6 text-center relative z-10">
                  <h3 className="font-semibold text-white text-lg mb-1">{member.name}</h3>
                  <p className="text-[#A95BAB] mb-3 font-medium">{member.role}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Journey</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Key milestones in our mission to revolutionize creative freelancing
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#A95BAB]/30 rounded-full"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/10 hover:border-[#A95BAB]/30 rounded-2xl cursor-pointer group overflow-hidden relative transform hover:scale-105 transition-all duration-500 ease-out">
                      <CardContent className="p-6">
                        <div className="text-2xl font-bold text-[#A95BAB] mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-semibold text-white mb-3">{milestone.title}</h3>
                        <p className="text-gray-300">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline dot */}
                  <div className="relative z-10 w-4 h-4 bg-[#A95BAB] rounded-full border-4 border-[#202020]"></div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Whether you're a creative looking for opportunities or a business seeking talent, we're here to help you
            succeed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-lg px-6"
            />
            <Link to="/register">
              <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg px-8 whitespace-nowrap transform hover:scale-105 transition-all duration-500 ease-out">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse-jobs">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:text-[#A95BAB] bg-transparent hover:bg-white/10 hover:border-[#A95BAB]/50 rounded-lg px-8 py-4 text-lg font-semibold group transform hover:scale-105 transition-all duration-500 ease-out"
              >
                Browse Talent
              </Button>
            </Link>
            <Link to="/post-job-client">
              <Button
                size="lg"
                className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg px-8 py-4 text-lg font-semibold group transform hover:scale-105 transition-all duration-500 ease-out"
              >
                Post a Project
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-500 ease-out" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent mb-4">
              PhsarDesign
            </h3>
            <p className="text-gray-400 mb-6">Connecting creativity with opportunity</p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-[#A95BAB] transition-colors duration-500 ease-out">
                Contact
              </a>
            </div>
            <p className="text-gray-500 text-sm mt-6">© 2024 PhsarDesign. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
