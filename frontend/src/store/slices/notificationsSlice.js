import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notificationsAPI } from '../../lib/api'

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params = {}, { rejectWithValue }) => {
    try {
      console.log('[Notifications] Fetching notifications with params:', params)
      const response = await notificationsAPI.getAll(params)
      console.log('[Notifications] Successfully fetched notifications:', response.data)
      console.log('[Notifications] First notification structure:', response.data?.notifications?.[0] || response.data?.data?.[0])
      return response.data
    } catch (error) {
      console.error('[Notifications] Error fetching notifications:', error)
      console.error('[Notifications] Error response:', error.response)
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch notifications'
      )
    }
  }
)

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[Notifications] Fetching unread count...')
      const response = await notificationsAPI.getUnreadCount()
      console.log('[Notifications] Successfully fetched unread count:', response.data)
      return response.data
    } catch (error) {
      console.error('[Notifications] Error fetching unread count:', error)
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch unread count'
      )
    }
  }
)

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationsAPI.markAsRead(notificationId)
      return { notificationId, ...response.data }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark notification as read'
      )
    }
  }
)

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsAPI.markAllAsRead()
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to mark all notifications as read'
      )
    }
  }
)

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationsAPI.delete(notificationId)
      return notificationId
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete notification'
      )
    }
  }
)

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetched: null
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    addNotification: (state, action) => {
      // Add new notification to the beginning of the list
      state.notifications.unshift(action.payload)
      state.total += 1
      if (!action.payload.isRead) {
        state.unreadCount += 1
      }
    },
    updateNotificationStatus: (state, action) => {
      const { notificationId, isRead } = action.payload
      const notification = state.notifications.find(n => n.notificationId === notificationId)
      if (notification && !notification.isRead && isRead) {
        notification.isRead = true
        notification.readAt = new Date().toISOString()
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        console.log('[notificationsSlice] Raw API response:', action.payload);
        
        if (action.payload && action.payload.data) {
          state.notifications = action.payload.data.notifications || [];
          state.total = action.payload.data.total || 0;
          state.limit = action.payload.data.limit || 10;
          state.offset = action.payload.data.offset || 0;
          // Update unread count from fetched notifications
          state.unreadCount = state.notifications.filter(n => !n.isRead).length;
        } else {
          // Fallback for different response structure
          state.notifications = action.payload || [];
          state.unreadCount = state.notifications.filter(n => !n.isRead).length;
        }
        
        console.log('[notificationsSlice] State updated:', {
          notificationsCount: state.notifications.length,
          unreadCount: state.unreadCount,
          firstNotification: state.notifications[0]
        });
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.pending, (state) => {
        state.error = null
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.data.unreadCount
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.error = action.payload
      })
      
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const { notificationId } = action.payload
        const notification = state.notifications.find(n => n.notificationId === notificationId)
        if (notification && !notification.isRead) {
          notification.isRead = true
          notification.readAt = new Date().toISOString()
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          if (!notification.isRead) {
            notification.isRead = true
            notification.readAt = new Date().toISOString()
          }
        })
        state.unreadCount = 0
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload
        const notificationIndex = state.notifications.findIndex(n => n.notificationId === notificationId)
        if (notificationIndex !== -1) {
          const notification = state.notifications[notificationIndex]
          if (!notification.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1)
          }
          state.notifications.splice(notificationIndex, 1)
          state.total = Math.max(0, state.total - 1)
        }
      })
  }
})

export const { clearError, addNotification, updateNotificationStatus } = notificationsSlice.actions
export default notificationsSlice.reducer
