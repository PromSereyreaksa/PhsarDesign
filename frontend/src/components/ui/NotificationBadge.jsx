import { Bell } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'

/**
 * NotificationBadge Component
 * Shows notification bell icon with unread count badge
 */
export const NotificationBadge = ({ className = "", onClick }) => {
  const { unreadCount } = useNotifications()

  return (
    <div className={`relative cursor-pointer ${className}`} onClick={onClick}>
      <Bell className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  )
}

export default NotificationBadge
