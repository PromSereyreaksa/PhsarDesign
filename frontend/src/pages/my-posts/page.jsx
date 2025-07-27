"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Search, Filter, Plus, Edit, Trash2, Eye, Users, Clock, DollarSign } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { availabilityPostsAPI, jobPostsAPI, clientsAPI, artistsAPI } from "../../services/api"

export default function MyPosts() {
  const { user } = useSelector(state => state.auth)
  const [availabilityPosts, setAvailabilityPosts] = useState([])
  const [jobPosts, setJobPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Load user's posts
  useEffect(() => {
    if (user) {
      loadUserPosts()
    }
  }, [user])

  const loadUserPosts = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (user.role === 'artist') {
        // Load artist's availability posts
        const artistResponse = await artistsAPI.getByUserId(user.userId)
        const artistId = artistResponse.data.artistId
        
        const postsResponse = await availabilityPostsAPI.getByArtist(artistId)
        setAvailabilityPosts(postsResponse.data || [])
      } else if (user.role === 'client') {
        // Load client's job posts
        const clientResponse = await clientsAPI.getByUserId(user.userId)
        const clientId = clientResponse.data.clientId
        
        const postsResponse = await jobPostsAPI.getAll({ clientId })
        setJobPosts(postsResponse.data.jobPosts || [])
      }
    } catch (error) {
      console.error('Error loading user posts:', error)
      setError('Failed to load your posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePost = async (postId, postType) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      if (postType === 'availability') {
        await availabilityPostsAPI.delete(postId)
        setAvailabilityPosts(prev => prev.filter(post => post.postId !== postId))
      } else if (postType === 'job') {
        await jobPostsAPI.delete(postId)
        setJobPosts(prev => prev.filter(post => post.jobId !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      setError('Failed to delete post')
    }
  }

  const filteredAvailabilityPosts = availabilityPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const filteredJobPosts = jobPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const AvailabilityPostCard = ({ post }) => (
    <Card className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/5 hover:border-[#A95BAB]/30 transition-all">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-white mb-2">{post.title}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {post.viewCount || 0} views
              </span>
              <Badge variant={post.status === 'active' ? 'default' : 'secondary'}>
                {post.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-[#A95BAB]">${post.budget}</div>
            <div className="text-sm text-gray-400">{post.availabilityType}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4 line-clamp-2">{post.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {post.skills && post.skills.split(',').slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="border-white/20 text-gray-300 text-xs">
                {skill.trim()}
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              onClick={() => handleDeletePost(post.postId, 'availability')}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const JobPostCard = ({ post }) => (
    <Card className="bg-white/5 border-white/10 hover:bg-[#A95BAB]/5 hover:border-[#A95BAB]/30 transition-all">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg text-white mb-2">{post.title}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {post.applicationsCount || 0} applications
              </span>
              <Badge variant={post.status === 'open' ? 'default' : 'secondary'}>
                {post.status}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-[#A95BAB]">${post.budget}</div>
            <div className="text-sm text-gray-400">{post.budgetType}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4 line-clamp-2">{post.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {post.skillsRequired && post.skillsRequired.split(',').slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="border-white/20 text-gray-300 text-xs">
                {skill.trim()}
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" className="border-[#A95BAB]/50 text-white hover:bg-[#A95BAB]/30">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              onClick={() => handleDeletePost(post.jobId, 'job')}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent mb-4">
            My Posts
          </h1>
          <p className="text-xl text-gray-300">Manage your {user?.role === 'artist' ? 'availability' : 'job'} posts</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white/5 border-white/10 backdrop-blur-sm rounded-lg border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search your posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-800 border-[#A95BAB]/50 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-[#A95BAB]/50">
                <SelectItem value="all" className="text-white hover:bg-[#A95BAB]/20">All Status</SelectItem>
                <SelectItem value="active" className="text-white hover:bg-[#A95BAB]/20">Active</SelectItem>
                <SelectItem value="open" className="text-white hover:bg-[#A95BAB]/20">Open</SelectItem>
                <SelectItem value="closed" className="text-white hover:bg-[#A95BAB]/20">Closed</SelectItem>
                <SelectItem value="paused" className="text-white hover:bg-[#A95BAB]/20">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-300">
              {user?.role === 'artist' 
                ? `${filteredAvailabilityPosts.length} availability posts` 
                : `${filteredJobPosts.length} job posts`
              }
            </div>
            <Link to={user?.role === 'artist' ? '/post-availability' : '/post-job-client'}>
              <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80">
                <Plus className="h-4 w-4 mr-2" />
                Create New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Loading your posts...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {user?.role === 'artist' ? (
              filteredAvailabilityPosts.length > 0 ? (
                filteredAvailabilityPosts.map(post => (
                  <AvailabilityPostCard key={post.postId} post={post} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">No availability posts found</div>
                  <Link to="/post-availability">
                    <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Post
                    </Button>
                  </Link>
                </div>
              )
            ) : (
              filteredJobPosts.length > 0 ? (
                filteredJobPosts.map(post => (
                  <JobPostCard key={post.jobId} post={post} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">No job posts found</div>
                  <Link to="/post-job-client">
                    <Button className="bg-[#A95BAB] hover:bg-[#A95BAB]/80">
                      <Plus className="h-4 w-4 mr-2" />
                      Post Your First Job
                    </Button>
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}