"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  DollarSign,
  Briefcase,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import AuthNavbar from "../../components/layout/AuthNavbar"

const ArtistDashboard = () => {
  const [activeTab, setActiveTab] = useState("current")
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  // Access control - only artist can view their dashboard
  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    // Check if user is an artist (you may need to adjust this based on your user model)
    if (user.role !== "artist" && user.userType !== "artist") {
      navigate("/") // Redirect non-artists
      return
    }
  }, [user, navigate])

  // Mock data - replace with real API calls
  const currentMonthData = {
    projectsCompleted: 12,
    earnings: 3450,
    postReach: 15420,
    likes: 892,
    comments: 156,
    shares: 89,
    saves: 234,
  }

  const totalData = {
    projectsCompleted: 147,
    earnings: 28750,
    postReach: 125680,
    likes: 7234,
    comments: 1456,
    shares: 678,
    saves: 2134,
  }

  const marketplacePosts = [
    {
      id: 1,
      title: "Logo Design Services",
      status: "active",
      views: 234,
      likes: 45,
      responses: 8,
      price: "$150-300",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Brand Identity Package",
      status: "active",
      views: 189,
      likes: 32,
      responses: 12,
      price: "$500-800",
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      title: "Website Design",
      status: "paused",
      views: 156,
      likes: 28,
      responses: 5,
      price: "$800-1200",
      createdAt: "2024-01-05",
    },
  ]

  const StatCard = ({ icon: Icon, title, value, change, color = "#A95BAB" }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400">+{change}%</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  )

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        isActive ? "bg-[#A95BAB] text-white shadow-lg" : "text-gray-300 hover:text-white hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50"
      case "paused":
        return "text-orange-600 bg-orange-50"
      case "completed":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A95BAB]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Artist Dashboard
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Welcome back, {user.firstName}! Here's your performance overview.</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4 mb-8 bg-white/5 backdrop-blur-sm rounded-xl p-2 border border-white/10">
            <TabButton
              id="current"
              label="Current Month Insights"
              isActive={activeTab === "current"}
              onClick={setActiveTab}
            />
            <TabButton id="total" label="Total Insights" isActive={activeTab === "total"} onClick={setActiveTab} />
            <TabButton
              id="marketplace"
              label="Marketplace"
              isActive={activeTab === "marketplace"}
              onClick={setActiveTab}
            />
          </div>

          {/* Current Month Insights */}
          {activeTab === "current" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Briefcase}
                  title="Projects Completed"
                  value={currentMonthData.projectsCompleted}
                  change={15}
                  color="#A95BAB"
                />
                <StatCard
                  icon={DollarSign}
                  title="Earnings This Month"
                  value={`$${currentMonthData.earnings.toLocaleString()}`}
                  change={22}
                  color="#10B981"
                />
                <StatCard
                  icon={Eye}
                  title="Post Reach"
                  value={currentMonthData.postReach.toLocaleString()}
                  change={8}
                  color="#3B82F6"
                />
                <StatCard
                  icon={Heart}
                  title="Likes Gathered"
                  value={currentMonthData.likes}
                  change={12}
                  color="#EF4444"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  icon={MessageCircle}
                  title="Comments"
                  value={currentMonthData.comments}
                  change={18}
                  color="#8B5CF6"
                />
                <StatCard icon={Share2} title="Shares" value={currentMonthData.shares} change={25} color="#F59E0B" />
                <StatCard icon={Bookmark} title="Saves" value={currentMonthData.saves} change={10} color="#06B6D4" />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 text-[#A95BAB] mr-2" />
                    Monthly Earnings Trend
                  </h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Activity className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                      <p>Chart visualization would go here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <PieChart className="w-5 h-5 text-[#A95BAB] mr-2" />
                    Engagement Breakdown
                  </h3>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                      <p>Pie chart visualization would go here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Total Insights */}
          {activeTab === "total" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Briefcase} title="Total Projects" value={totalData.projectsCompleted} color="#A95BAB" />
                <StatCard
                  icon={DollarSign}
                  title="Total Earnings"
                  value={`$${totalData.earnings.toLocaleString()}`}
                  color="#10B981"
                />
                <StatCard
                  icon={Eye}
                  title="Overall Reach"
                  value={totalData.postReach.toLocaleString()}
                  color="#3B82F6"
                />
                <StatCard icon={Heart} title="Total Likes" value={totalData.likes.toLocaleString()} color="#EF4444" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  icon={MessageCircle}
                  title="Total Comments"
                  value={totalData.comments.toLocaleString()}
                  color="#8B5CF6"
                />
                <StatCard icon={Share2} title="Total Shares" value={totalData.shares} color="#F59E0B" />
                <StatCard
                  icon={Bookmark}
                  title="Total Saves"
                  value={totalData.saves.toLocaleString()}
                  color="#06B6D4"
                />
              </div>

              {/* All-time Performance Chart */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-[#A95BAB] mr-2" />
                  All-Time Performance Overview
                </h3>
                <div className="h-80 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <p className="text-lg">Comprehensive analytics chart would display here</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Showing growth trends, earnings, and engagement over time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Marketplace */}
          {activeTab === "marketplace" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Your Marketplace Posts</h2>
                <button
                  onClick={() => navigate("/marketplace/create")}
                  className="px-6 py-3 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  + Create New Post
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {marketplacePosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                        <div className="flex items-center space-x-3">
                          <span className="text-[#A95BAB] font-medium">{post.price}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                            {post.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/marketplace/${post.id}`)}
                        className="text-gray-400 hover:text-[#A95BAB] transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Eye className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-white">{post.views}</span>
                        </div>
                        <p className="text-xs text-gray-400">Views</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Heart className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-white">{post.likes}</span>
                        </div>
                        <p className="text-xs text-gray-400">Likes</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-white">{post.responses}</span>
                        </div>
                        <p className="text-xs text-gray-400">Responses</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/marketplace/edit/${post.id}`)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button className="text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {marketplacePosts.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold mb-2 text-white">No marketplace posts yet</h3>
                  <p className="text-gray-400 mb-6">Create your first post to start connecting with clients.</p>
                  <button
                    onClick={() => navigate("/marketplace/create")}
                    className="px-8 py-3 bg-[#A95BAB] hover:bg-[#A95BAB]/80 text-white rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    Create Your First Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtistDashboard
