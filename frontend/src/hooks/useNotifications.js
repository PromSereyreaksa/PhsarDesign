import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../store/slices/notificationsSlice';

/**
 * Custom hook for managing notifications
 * Provides easy access to notification state and actions with real-time updates
 */
export const useNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications) || [];
  const loading = useSelector((state) => state.notifications.loading) || false;
  const error = useSelector((state) => state.notifications.error);
  const [lastNotificationCount, setLastNotificationCount] = useState(0);
  const [isNewNotification, setIsNewNotification] = useState(false);

  const unreadCount = useMemo(() => {
    const count = notifications.filter(notification => !notification.isRead).length;
    console.log('[useNotifications] Calculating unread count:', { 
      notifications: notifications.length, 
      unread: count,
      notificationsArray: notifications 
    });
    return count;
  }, [notifications]);

  console.log('[useNotifications] Hook state:', { 
    notifications: notifications.length, 
    unreadCount, 
    loading, 
    error,
    lastNotificationCount,
    isNewNotification
  });

  // Detect new notifications
  useEffect(() => {
    if (unreadCount > lastNotificationCount && lastNotificationCount > 0) {
      setIsNewNotification(true);
      const timer = setTimeout(() => setIsNewNotification(false), 3000);
      return () => clearTimeout(timer);
    }
    setLastNotificationCount(unreadCount);
  }, [unreadCount, lastNotificationCount]);

  // Auto-refresh notifications
  useEffect(() => {
    const refreshNotifications = () => {
      dispatch(fetchNotifications());
    };

    refreshNotifications(); // Initial fetch
    const interval = setInterval(refreshNotifications, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const refreshNotifications = () => {
    dispatch(fetchNotifications());
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    isNewNotification,
    refreshNotifications,
    dispatch
  };
};

/**
 * Hook specifically for application-related notifications
 */
export const useApplicationNotifications = () => {
  const { notifications, refreshNotifications, dispatch } = useNotifications();
  
  const applicationNotifications = notifications.filter(
    notification => notification.type === 'application' || notification.type === 'project'
  );
  
  return {
    applicationNotifications,
    refreshNotifications,
    dispatch
  };
};
