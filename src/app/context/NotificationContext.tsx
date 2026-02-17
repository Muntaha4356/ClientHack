import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import apiClient from '../../utils/apiClient';

interface Notification {
  id: string;
  type: 'alert' | 'success' | 'info' | 'warning' | 'failure';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/notifications');
      
      if (response.data.success && response.data.data) {
        // Sort by most recent first
        const sortedNotifications = response.data.data.sort((a: Notification, b: Notification) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, [notifications]);

  // Delete notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, [notifications]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Create promises for all unread notifications
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => apiClient.put(`/notifications/${n.id}/read`))
      );
      
      // Update local state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, [notifications]);

  // Clear notifications on logout
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Monitor auth state changes (logout detection)
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        clearNotifications();
      }
    };

    // Check on mount and when storage changes
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, [clearNotifications]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Connect to SSE for real-time notifications
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      const API_BASE_URL = 'http://localhost:5000/api';
      const eventSource = new EventSource(
        `${API_BASE_URL}/notifications/subscribe?token=${encodeURIComponent(token)}`
      );

      // Handle incoming notifications
      eventSource.addEventListener('message', (event) => {
        if (event.data === ':connected' || event.data === ':heartbeat') {
          // Ignore connection confirmation and heartbeat messages
          return;
        }

        try {
          const notification = JSON.parse(event.data) as Notification;
          console.log('Received new notification via SSE:', notification);

          // Add new notification to the beginning of the list
          setNotifications((prevNotifications) => [
            notification,
            ...prevNotifications,
          ]);
        } catch (error) {
          console.error('Failed to parse SSE notification:', error);
        }
      });

      // Handle errors
      eventSource.addEventListener('error', () => {
        console.error('SSE connection error');
        eventSource.close();
      });

      eventSourceRef.current = eventSource;

      return () => {
        eventSource.close();
      };
    } catch (error) {
      console.error('Failed to connect to SSE:', error);
    }
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to use notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
