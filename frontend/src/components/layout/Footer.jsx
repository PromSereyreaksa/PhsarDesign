import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">FreelanceHub</h3>
            <p className="text-gray-300 mb-4">
              The world's largest freelancing marketplace. Connect with talented professionals and grow your business.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-400">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/post-job" className="text-gray-300 hover:text-green-400">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/browse-freelancers" className="text-gray-300 hover:text-green-400">
                  Browse Freelancers
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Enterprise
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Resources
                </a>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-lg font-semibold mb-4">For Freelancers</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/browse-jobs" className="text-gray-300 hover:text-green-400">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Freelancer Plus
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Skills Tests
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Trust & Safety
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-green-400">
                  Privacy Policy
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <div className="flex items-center text-gray-300 mb-2">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">support@freelancehub.com</span>
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

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 FreelanceHub. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm">
                Accessibility
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 text-sm">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
