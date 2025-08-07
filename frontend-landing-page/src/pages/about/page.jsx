"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Users, Target, Award, Heart, CheckCircle, Star, Globe, Shield, Clock, Mail, Send, Linkedin, Menu, X } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"

export default function AboutPage() {
  const [email, setEmail] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const smoothScroll = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

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
    name: "Kao Sodavann",
    role: "Founder",
    image: "/Sodavann.jpg",
    description: "Visionary leader focused on bridging creativity and technology to empower digital artists.",
    contacts: [
      { platform: "email", url: "mailto:kaosodavann714@gmail.com" },
      { platform: "telegram", url: "https://t.me/vannnnn001"},
      { platform: "linkedin", url: "https://www.linkedin.com/in/kao-sodavann-b4b173321/" }
    ]
  },
  {
    name: "Prom Sereyreaksa",
    role: "Co-Founder",
    image: "/Sereyreaksa.jpg",
    description: "Creative technologist passionate about intuitive user experience and platform innovation.",
    contacts: [
      { platform: "email", url: "mailto:prumsereyreaksa@gmail.com" },
      { platform: "telegram", url: "https://t.me/souuJ" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/prom-sereyreaksa-2a2298364/" },
    ]
  },
  {
    name: "Chea Ilong",
    role: "Backend Developer",
    image: "/Ilong.jpg",
    description: "Specializes in backend architecture, security, and efficient API development.",
    contacts: [
      { platform: "email", url: "mailto:cheadara133@gmail.com" },
      { platform: "telegram", url: "http://t.me/Chea_Ilong" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/chea-ilong-88bb83333" }
    ]
  },
  {
    name: "Huy Visa",
    role: "Backend Developer",
    image: "/Visa.jpg",
    description: "Focused on scalable backend systems and reliable data operations.",
    contacts: [
      { platform: "email", url: "mailto:Visadekh@gmail.com" },
      { platform: "telegram", url: "https://t.me/visahuy" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/huy-visa-8443b2308" }
    ]
  },
  {
    name: "Kosal Sophanith",
    role: "Frontend Developer",
    image: "/Sophanith.jpg",
    description: "Frontend engineer with an eye for detail and commitment to excellent UX.",
    contacts: [
      { platform: "email", url: "mailto:sophanithkosal9@gmail.com" },
      { platform: "telegram", url: "https://t.me/nithkidd" },
      { platform: "linkedin", url: "" }
    ]
  },
  {
    name: "Chheang Sovanpanha",
    role: "Backend Developer",
    image: "/Sovanpanha.jpg",
    description: "Builds robust server-side logic and contributes to seamless data integration.",
    contacts: [
      { platform: "email", url: "mailto:Panhasovan51@gmail.com" },
      { platform: "telegram", url: "https://t.me/nhaaZzz" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/sovanpanha-chheang-17473b32a/" }
    ]
  },
  {
    name: "Sea Huyty",
    role: "Frontend Developer",
    image: "/Huyty.jpg",
    description: "Crafts responsive and engaging user interfaces with a focus on performance.",
    contacts: [
      { platform: "email", url: "mailto:seehuyty@gmail.com" },
      { platform: "telegram", url: "https://t.me/SeaHuyty" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/sea-huyty-bab014283" }
    ]
  },
  {
    name: "Phay Someth",
    role: "Frontend Developer",
    image: "/Someth.jpg",
    description: "Designs clean, modern UI components and enhances user interactivity.",
    contacts: [
      { platform: "email", url: "mailto:phay.someth70@gmail.com" },
      { platform: "telegram", url: "https://t.me/SomethPhay" },
      { platform: "linkedin", url: "https://www.linkedin.com/in/phay-someth" }
    ]
  },
  
]

    
  

  const milestones = [
    {
      year: "2025",
      title: "Founded",
      description: "PhsarDesign launched with a vision to revolutionize creative freelancing",
    },
    { year: "June", title: "First Hackathon", description: "We participated in turing hackathon, receiving valueable feedbacks, validated our idea and securing top 4" },
    {
      year: "July",
      title: "ACTSmart Hackathon",
      description: "Secured top 8, during the hackathon phase and advancing to the incubation.",
    },
    {
      year: "Present",
      title: "ACTSmart Incubation Program",
      description: "Incubation phase, receiving mentorship and resources to refine our platform.",
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

            <div className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
              >
                Home
              </Link>
              <button
                onClick={() => smoothScroll("foundation")}
                className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
              >
                Foundation
              </button>
              <button
                onClick={() => smoothScroll("team")}
                className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
              >
                Team
              </button>
              <button
                onClick={() => smoothScroll("journey")}
                className="text-white hover:text-[#A95BAB] transition-colors duration-500 ease-out cursor-pointer"
              >
                Journey
              </button>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              <Link to="/login" className="hidden sm:block">
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#A95BAB] hover:bg-white/10 rounded-lg px-4 lg:px-6 text-sm lg:text-base transform hover:scale-105 transition-all duration-500 ease-out"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg px-4 lg:px-6 text-sm lg:text-base transform hover:scale-105 transition-all duration-500 ease-out">
                  Get Started
                </Button>
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-white hover:text-[#A95BAB] transition-colors duration-300"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-[#202020]/95 backdrop-blur-sm border-b border-white/10 z-40">
            <div className="px-4 py-6 space-y-4">
              <Link
                to="/"
                className="block text-white hover:text-[#A95BAB] transition-colors duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <button
                onClick={() => smoothScroll("foundation")}
                className="block text-white hover:text-[#A95BAB] transition-colors duration-300 py-2 w-full text-left"
              >
                Foundation
              </button>
              <button
                onClick={() => smoothScroll("team")}
                className="block text-white hover:text-[#A95BAB] transition-colors duration-300 py-2 w-full text-left"
              >
                Team
              </button>
              <button
                onClick={() => smoothScroll("journey")}
                className="block text-white hover:text-[#A95BAB] transition-colors duration-300 py-2 w-full text-left"
              >
                Journey
              </button>
              <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:text-[#A95BAB] hover:bg-white/10 rounded-lg"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-[#A95BAB] hover:bg-[#A95BAB]/80 rounded-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
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
      <section id="foundation" className="py-20">
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
      <section id="team" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The passionate individuals behind PhsarDesign's success
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Founders Level */}
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-24 mb-16">
              {team.filter(member => member.role === "Founder" || member.role === "Co-Founder").map((member, index) => (
                <div key={index} className="text-center group relative">
                  {/* Decorative background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#A95BAB]/10 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 ease-out"></div>
                  
                  <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 lg:p-8 group-hover:bg-white/10 group-hover:border-[#A95BAB]/30 transition-all duration-500 ease-out h-[450px] lg:h-[500px] flex flex-col">
                    <div className="relative mb-6">
                      <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-500 ease-out border-4 border-[#A95BAB]/50 shadow-2xl shadow-[#A95BAB]/20">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col space-y-3">
                      <h3 className="font-bold text-white text-xl lg:text-2xl">{member.name}</h3>
                      <p className="text-[#A95BAB] font-bold text-base lg:text-lg uppercase tracking-wide">{member.role}</p>
                      <p className="text-gray-300 text-sm leading-relaxed max-w-xs mx-auto flex-1">{member.description}</p>
                      
                      {/* Social Media Contacts */}
                      <div className="flex justify-center gap-3 pt-4 mt-auto">
                        {member.contacts?.map((contact, contactIndex) => {
                          const getIcon = (platform) => {
                            switch(platform.toLowerCase()) {
                              case 'email': return Mail;
                              case 'telegram': return Send;
                              case 'linkedin': return Linkedin;
                              default: return Globe;
                            }
                          };
                          const IconComponent = getIcon(contact.platform);
                          
                          return (
                            <a
                              key={contactIndex}
                              href={contact.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-[#A95BAB]/20 hover:bg-[#A95BAB] rounded-full flex items-center justify-center transition-all duration-300 ease-out group/social"
                            >
                              <IconComponent className="w-5 h-5 text-[#A95BAB] group-hover/social:text-white transition-colors duration-300" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Connection Lines */}
            <div className="relative mb-8 lg:mb-12">
              <div className="flex justify-center">
                <div className="w-64 lg:w-96 h-px bg-gradient-to-r from-transparent via-[#A95BAB]/50 to-transparent relative">
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-12 lg:h-16 bg-gradient-to-b from-[#A95BAB]/50 to-[#A95BAB]/20"></div>
                  {/* Decorative dots */}
                  <div className="absolute left-1/4 top-0 w-2 h-2 bg-[#A95BAB]/40 rounded-full transform -translate-y-1"></div>
                  <div className="absolute right-1/4 top-0 w-2 h-2 bg-[#A95BAB]/40 rounded-full transform -translate-y-1"></div>
                </div>
              </div>
            </div>

            {/* Developers Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {team.filter(member => member.role.includes("Developer")).map((member, index) => (
                <div key={index} className="text-center group relative">
                  {/* Connection lines to top - only show on larger screens */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute -top-12 left-1/2 transform -translate-x-1/2 w-px h-12 bg-gradient-to-b from-[#A95BAB]/30 to-transparent"></div>
                  )}
                  
                  <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 lg:p-6 group-hover:bg-white/10 group-hover:border-[#A95BAB]/20 transition-all duration-500 ease-out h-[350px] lg:h-[400px] flex flex-col">
                    <div className="relative mb-4">
                      <div className="w-28 h-28 lg:w-32 lg:h-32 mx-auto rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-500 ease-out border-3 border-white/30 shadow-xl">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Role badge */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="bg-[#A95BAB]/90 px-3 py-1 rounded-full">
                          <span className="text-white font-medium text-xs">
                            {member.role.includes("Frontend") ? "FE" : "BE"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col space-y-2">
                      <h3 className="font-semibold text-white text-base lg:text-lg">{member.name}</h3>
                      <p className="text-[#A95BAB] font-medium text-xs lg:text-sm">{member.role}</p>
                      <p className="text-gray-300 text-xs leading-relaxed flex-1">{member.description}</p>
                      
                      {/* Social Media Contacts */}
                      <div className="flex justify-center gap-2 pt-3 mt-auto">
                        {member.contacts?.map((contact, contactIndex) => {
                          const getIcon = (platform) => {
                            switch(platform.toLowerCase()) {
                              case 'email': return Mail;
                              case 'telegram': return Send;
                              case 'linkedin': return Linkedin;
                              default: return Globe;
                            }
                          };
                          const IconComponent = getIcon(contact.platform);
                          
                          return (
                            <a
                              key={contactIndex}
                              href={contact.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 bg-[#A95BAB]/20 hover:bg-[#A95BAB] rounded-full flex items-center justify-center transition-all duration-300 ease-out group/social"
                            >
                              <IconComponent className="w-4 h-4 text-[#A95BAB] group-hover/social:text-white transition-colors duration-300" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom decorative line */}
            <div className="relative mt-12">
              <div className="w-full max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-[#A95BAB]/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="journey" className="py-20">
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
