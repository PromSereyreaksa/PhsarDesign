import { FileText, Home, Plus, Search, Sparkles } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAppSelector } from "../../hook/useRedux"

const MarketplaceNav = () => {
  const location = useLocation()
  const { user } = useAppSelector((state) => state.auth)

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { path: "/marketplace", label: "Browse", icon: Search },
      { path: "/dashboard/my-posts", label: "My Posts", icon: FileText },
    ]

    // Add role-specific create buttons
    if (user?.role === 'client') {
      baseItems.splice(1, 0, { path: "/marketplace/create?type=jobs", label: "Post Job", icon: Plus })
    } else if (user?.role === 'artist' || user?.role === 'freelancer') {
      baseItems.splice(1, 0, { path: "/marketplace/create?type=availability", label: "Create Service", icon: Plus })
    }
    // If not logged in or unknown role, don't show create button

    return baseItems
  }

  const navItems = getNavItems()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#202020]/98 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/marketplace"
              className="flex items-center space-x-3 text-white hover:text-[#A95BAB] transition-colors group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#A95BAB] to-[#A95BAB]/80 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent">
                Marketplace
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    location.pathname === item.path
                      ? "bg-[#A95BAB] text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Back to Dashboard */}
          <div className="flex items-center">
            <Link
              to="/home"
              className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-colors group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default MarketplaceNav
