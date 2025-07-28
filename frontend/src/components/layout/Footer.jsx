import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent mb-4">
              PhsarDesign
            </h3>
            <p className="text-gray-300 mb-4">
              The world's largest freelancing marketplace. Connect with talented professionals and grow your business.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#A95BAB] transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#A95BAB] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#A95BAB] transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#A95BAB] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#A95BAB]">For Clients</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/post-job-client" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/browse-freelancers" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Browse Freelancers
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Enterprise
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#A95BAB]">For Freelancers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/browse-jobs" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Freelancer Plus
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Skills Tests
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#A95BAB]">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Trust & Safety
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#A95BAB] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <div className="flex items-center text-gray-300 mb-2">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">support@phsardesign.com</span>
              </div>
              <div className="flex items-center text-gray-300 mb-2">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 PhsarDesign. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-[#A95BAB] text-sm transition-colors">
                Accessibility
              </a>
              <a href="#" className="text-gray-400 hover:text-[#A95BAB] text-sm transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#A95BAB] text-sm transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
