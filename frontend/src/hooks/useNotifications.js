import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, fetchUnreadCount } from '../store/slices/notificationsSlice'

/**
 * Custom hook for managing notifications
 * Provides easy access to notification state and actions
 */
export const useNotifications = (autoFetch = true) => {
  const dispatch = useDispatch()
  const {
    notifications,
    unreadCount,
    loading,
    error,
    total
  } = useSelector((state) => state.notifications)

  // Auto-fetch notifications on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      console.log('[useNotifications] Auto-fetching notifications...')
      dispatch(fetchNotifications())
      dispatch(fetchUnreadCount())
    }
  }, [dispatch, autoFetch])

  // Helper functions
  const refreshNotifications = () => {
    dispatch(fetchNotifications())
    dispatch(fetchUnreadCount())
  }

  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.isRead)
  }

  const getApplicationNotifications = () => {
    return notifications.filter(notification => 
      notification.type === 'application_received' || 
      notification.type === 'application_accepted' ||
      notification.type === 'application_rejected'
    )
  }

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,
    total,
    
    // Computed values
    unreadNotifications: getUnreadNotifications(),
    applicationNotifications: getApplicationNotifications(),
    
    // Actions
    refreshNotifications,
    
    // Dispatch actions (for more control)
    dispatch
  }
}

/**
 * Hook specifically for application-related notifications
 */
export const useApplicationNotifications = () => {
  const { applicationNotifications, refreshNotifications, dispatch } = useNotifications()
  
  return {
    applicationNotifications,
    refreshNotifications,
    dispatch
  }
}
