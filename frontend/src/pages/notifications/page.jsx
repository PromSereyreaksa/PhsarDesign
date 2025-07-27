"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { notificationsAPI, applicationsAPI } from "../../services/api"
import Navbar from "../../components/layout/Navbar"
import Footer from "../../components/layout/Footer"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { 
  Bell, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Clock, 
  CheckCircle, 
  XCircle, 
  UserCheck,
  MessageSquare,
  DollarSign,
  Star
} from 'lucide-react'

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [processingApplications, setProcessingApplications] = useState(new Set())
  const [activeTab, setActiveTab] = useState("all")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      fetchNotifications()
      fetchUnreadCount()
    }
  }, [user])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError("") // Clear any previous errors
      const response = await notificationsAPI.getAll()
      if (response.data.success) {
        setNotifications(response.data.data.notifications)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      if (error.response?.status === 401) {
        setError('Authentication expired. Please log in again.')
        // Optionally redirect to login
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setError('Failed to load notifications. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getUnreadCount()
      if (response.data.success) {
        setUnreadCount(response.data.data.total)
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
      if (error.response?.status === 401) {
        // Don't show error for unread count, but user will see it when they try to fetch notifications
        setUnreadCount(0)
      }
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId)
      setNotifications(notifications.map(n => 
        n.notificationId === notificationId 
          ? { ...n, isRead: true, readAt: new Date().toISOString() }
          : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead()
      setNotifications(notifications.map(n => ({ 
        ...n, 
        isRead: true, 
        readAt: new Date().toISOString() 
      })))
      setUnreadCount(0)
      setSuccess('All notifications marked as read')
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      setError('Failed to mark all notifications as read')
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      await notificationsAPI.delete(notificationId)
      setNotifications(notifications.filter(n => n.notificationId !== notificationId))
      setSuccess('Notification deleted')
    } catch (error) {
      console.error('Failed to delete notification:', error)
      setError('Failed to delete notification')
    }
  }

  const handleApplicationAction = async (applicationId, action, clientMessage = '') => {
    if (processingApplications.has(applicationId)) return

    try {
      setProcessingApplications(prev => new Set(prev).add(applicationId))
      
      const response = await applicationsAPI.updateStatus(applicationId, {
        status: action,
        clientMessage
      })

      if (response.data.success) {
        setSuccess(`Application ${action} successfully!`)
        // Refresh notifications to see the updated status
        await fetchNotifications()
        
        // If accepted, this creates a project automatically via backend logic
        if (action === 'accepted') {
          setSuccess('Application accepted! Project has been created and both parties have been notified.')
        }
      }
    } catch (error) {
      console.error(`Failed to ${action} application:`, error)
      setError(`Failed to ${action} application. Please try again.`)
    } finally {
      setProcessingApplications(prev => {
        const newSet = new Set(prev)
        newSet.delete(applicationId)
        return newSet
      })
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_received':
        return <UserCheck className="h-5 w-5 text-blue-400" />
      case 'application_accepted':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'application_rejected':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'message_received':
        return <MessageSquare className="h-5 w-5 text-purple-400" />
      case 'payment_received':
        return <DollarSign className="h-5 w-5 text-yellow-400" />
      case 'review_received':
        return <Star className="h-5 w-5 text-orange-400" />
      default:
        return <Bell className="h-5 w-5 text-gray-400" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'normal':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'low':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'unread':
        return !notification.isRead
      case 'applications':
        return notification.type.includes('application')
      case 'messages':
        return notification.type === 'message_received'
      case 'payments':
        return notification.type === 'payment_received'
      default:
        return true
    }
  })

  const renderNotificationActions = (notification) => {
    // Only show accept/reject for application_received notifications
    if (notification.type === 'application_received' && notification.relatedApplicationId) {
      const isProcessing = processingApplications.has(notification.relatedApplicationId)
      
      return (
        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            onClick={() => handleApplicationAction(notification.relatedApplicationId, 'accepted')}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isProcessing ? 'Processing...' : 'Accept'}
            <CheckCircle className="h-4 w-4 ml-1" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleApplicationAction(notification.relatedApplicationId, 'rejected')}
            disabled={isProcessing}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isProcessing ? 'Processing...' : 'Reject'}
            <XCircle className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )
    }
    return null
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please log in to view notifications</h1>
          <Button onClick={() => navigate('/login')} className="bg-[#A95BAB] hover:bg-[#A95BAB]/80">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#A95BAB] bg-clip-text text-transparent mb-2">
                Notifications
              </h1>
              <p className="text-lg text-gray-300">
                Stay updated with your applications and messages
              </p>
            </div>
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <Button
                  onClick={markAllAsRead}
                  variant="outline"
                  className="border-[#A95BAB]/30 text-white hover:bg-[#A95BAB]/20"
                >
                  Mark All Read
                  <Check className="h-4 w-4 ml-2" />
                </Button>
              )}
              <Badge variant="secondary" className="bg-[#A95BAB]/20 text-white border-[#A95BAB]/30">
                {unreadCount} Unread
              </Badge>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-red-400">{error}</p>
              <Button
                size="sm"
                onClick={() => {
                  setError("")
                  fetchNotifications()
                  fetchUnreadCount()
                }}
                className="bg-red-600 hover:bg-red-700 text-white ml-4"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#A95BAB] data-[state=active]:text-white">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="data-[state=active]:bg-[#A95BAB] data-[state=active]:text-white">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-[#A95BAB] data-[state=active]:text-white">
              Applications
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-[#A95BAB] data-[state=active]:text-white">
              Messages
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-[#A95BAB] data-[state=active]:text-white">
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A95BAB] mx-auto mb-4"></div>
                <p className="text-gray-300">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No notifications found</h3>
                  <p className="text-gray-400">
                    {activeTab === 'unread' 
                      ? "All caught up! No unread notifications."
                      : "You don't have any notifications in this category yet."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.notificationId}
                    className={`bg-white/5 border-white/10 transition-all hover:border-[#A95BAB]/30 ${
                      !notification.isRead ? 'ring-1 ring-[#A95BAB]/20' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-white mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-gray-300 mb-3 leading-relaxed">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                                
                                {notification.priority !== 'normal' && (
                                  <Badge className={getPriorityColor(notification.priority)}>
                                    {notification.priority}
                                  </Badge>
                                )}
                                
                                {notification.relatedProject && (
                                  <span className="text-[#A95BAB]">
                                    Project: {notification.relatedProject.title}
                                  </span>
                                )}
                              </div>

                              {/* Action buttons for applications */}
                              {renderNotificationActions(notification)}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {!notification.isRead && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.notificationId)}
                                  className="text-gray-400 hover:text-white hover:bg-white/10"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.notificationId)}
                                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}
