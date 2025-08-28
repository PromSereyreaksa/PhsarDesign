import { Check, CheckCheck, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthNavbar from '../../components/layout/AuthNavbar'
import Loader from '../../components/ui/Loader'
import { showToast } from '../../components/ui/toast'
import { useNotifications } from '../../hooks/useNotifications'
import { deleteNotification, markAllAsRead, markAsRead } from '../../store/slices/notificationsSlice'

const NotificationsPage = () => {
  const navigate = useNavigate()
  const { notifications, unreadCount, loading, dispatch } = useNotifications()
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'

  const handleNotificationClick = (notification) => {
    console.log('[NotificationsPage] Notification clicked:', notification)
    const notificationId = notification?.id || notification?.notificationId || notification?.notification_id
    
    // Mark as read if unread
    if (!notification.isRead && notificationId) {
      dispatch(markAsRead(notificationId))
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'application_received':
      case 'application_accepted':
      case 'application_rejected':
        navigate('/dashboard/applications')
        break
      case 'project_created':
        navigate('/dashboard/projects')
        break
      case 'message_received':
        navigate('/dashboard/messages')
        break
      default:
        // For general notifications, stay on the page
        break
    }
  }

  const handleMarkAsRead = (notificationId, event) => {
    event.stopPropagation()
    console.log('[NotificationsPage] Marking as read:', notificationId)
    dispatch(markAsRead(notificationId))
    showToast('Notification marked as read', 'success')
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
    showToast('All notifications marked as read', 'success')
  }

  const handleDeleteNotification = (notificationId, event) => {
    event.stopPropagation()
    console.log('[NotificationsPage] Deleting notification:', notificationId)
    dispatch(deleteNotification(notificationId))
    showToast('Notification deleted', 'success')
  }

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead)
      case 'read':
        return notifications.filter(n => n.isRead)
      default:
        return notifications
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_received':
      case 'application_accepted':
      case 'application_rejected':
        return '📝'
      case 'project_created':
        return '🚀'
      case 'message_received':
        return '💬'
      case 'payment_received':
        return '💰'
      default:
        return '🔔'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const filteredNotifications = getFilteredNotifications()
  const filters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'read', label: 'Read', count: notifications.length - unreadCount }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#202020] to-[#000000]">
      <AuthNavbar />
      
      <div className="pt-28 max-w-4xl mx-auto px-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-gray-400">Stay updated with your latest activities</p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-[#A95BAB]/20 hover:bg-[#A95BAB]/30 border border-[#A95BAB]/30 rounded-lg text-[#A95BAB] hover:text-white transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/40 rounded-xl p-1">
          {filters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                filter === tab.id
                  ? 'bg-[#A95BAB] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  filter === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-600/50 text-gray-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader />
            <p className="text-gray-400 mt-4">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No {filter !== 'all' ? filter : ''} notifications
            </h3>
            <p className="text-gray-400">
              {filter === 'unread' && "All caught up! No unread notifications."}
              {filter === 'read' && "No read notifications yet."}
              {filter === 'all' && "You'll see notifications here as they come in."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const notificationId = notification?.id || notification?.notificationId || notification?.notification_id
              return (
                <div
                  key={notificationId}
                  onClick={() => handleNotificationClick(notification)}
                  className={`group cursor-pointer bg-gray-900/60 backdrop-blur-xl border border-gray-700/40 rounded-2xl p-6 transition-all hover:bg-gray-800/60 hover:border-gray-600/40 ${
                    !notification.isRead ? 'border-l-4 border-l-[#A95BAB] bg-[#A95BAB]/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="text-2xl flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${
                          !notification.isRead ? 'text-white' : 'text-gray-300'
                        }`}>
                          {notification.title}
                        </h3>
                        
                        <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => handleMarkAsRead(notificationId, e)}
                              className="p-1 hover:bg-gray-600/50 rounded text-gray-400 hover:text-[#A95BAB] transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={(e) => handleDeleteNotification(notificationId, e)}
                            className="p-1 hover:bg-gray-600/50 rounded text-gray-400 hover:text-red-400 transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 mb-3 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {formatDate(notification.createdAt)}
                        </span>
                        
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-[#A95BAB] rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsPage
