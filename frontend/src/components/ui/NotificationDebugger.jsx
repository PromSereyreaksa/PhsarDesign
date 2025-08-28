import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, fetchUnreadCount } from '../../store/slices/notificationsSlice'
import { Button } from './button'

/**
 * NotificationDebugger Component
 * Use this component to debug notification fetching issues
 * Add this to any page temporarily to test notifications
 */
export const NotificationDebugger = () => {
  const dispatch = useDispatch()
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    total 
  } = useSelector((state) => state.notifications)
  
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    console.log('[NotificationDebugger] Component mounted')
    console.log('[NotificationDebugger] Current user:', user)
    console.log('[NotificationDebugger] Current notification state:', {
      notifications,
      unreadCount,
      loading,
      error,
      total
    })
  }, [user, notifications, unreadCount, loading, error, total])

  const handleFetchNotifications = async () => {
    console.log('[NotificationDebugger] Manual fetch triggered')
    try {
      const result = await dispatch(fetchNotifications()).unwrap()
      console.log('[NotificationDebugger] Manual fetch success:', result)
    } catch (error) {
      console.error('[NotificationDebugger] Manual fetch error:', error)
    }
  }

  const handleFetchUnreadCount = async () => {
    console.log('[NotificationDebugger] Manual unread count fetch triggered')
    try {
      const result = await dispatch(fetchUnreadCount()).unwrap()
      console.log('[NotificationDebugger] Manual unread count success:', result)
    } catch (error) {
      console.error('[NotificationDebugger] Manual unread count error:', error)
    }
  }

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 m-4">
      <h3 className="text-white font-bold mb-4">🔧 Notification Debugger</h3>
      
      {/* User Info */}
      <div className="mb-4 p-3 bg-gray-700 rounded">
        <h4 className="text-white font-semibold mb-2">Current User:</h4>
        <pre className="text-green-400 text-xs overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      {/* Notification State */}
      <div className="mb-4 p-3 bg-gray-700 rounded">
        <h4 className="text-white font-semibold mb-2">Notification State:</h4>
        <div className="text-sm text-gray-300 space-y-1">
          <p>Loading: <span className={loading ? 'text-yellow-400' : 'text-green-400'}>{loading.toString()}</span></p>
          <p>Unread Count: <span className="text-blue-400">{unreadCount}</span></p>
          <p>Total: <span className="text-blue-400">{total}</span></p>
          <p>Notifications Count: <span className="text-blue-400">{notifications.length}</span></p>
          {error && <p>Error: <span className="text-red-400">{error}</span></p>}
        </div>
      </div>

      {/* Manual Actions */}
      <div className="mb-4 space-x-2">
        <Button 
          onClick={handleFetchNotifications}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Loading...' : 'Fetch Notifications'}
        </Button>
        <Button 
          onClick={handleFetchUnreadCount}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          Fetch Unread Count
        </Button>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 && (
        <div className="p-3 bg-gray-700 rounded">
          <h4 className="text-white font-semibold mb-2">Notifications ({notifications.length}):</h4>
          <div className="max-h-60 overflow-auto space-y-2">
            {notifications.map((notification, index) => (
              <div key={notification.notificationId || index} className="bg-gray-600 p-2 rounded text-xs">
                <div className="text-white font-medium">{notification.title}</div>
                <div className="text-gray-300">{notification.message}</div>
                <div className="text-gray-400 mt-1">
                  ID: {notification.notificationId} | 
                  Read: {notification.isRead.toString()} | 
                  Type: {notification.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Raw State (for debugging) */}
      <details className="mt-4">
        <summary className="text-white cursor-pointer">🔍 Raw Redux State</summary>
        <pre className="text-green-400 text-xs mt-2 bg-gray-900 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify({ notifications, unreadCount, loading, error, total }, null, 2)}
        </pre>
      </details>
    </div>
  )
}

export default NotificationDebugger
