import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, CheckCircle, Info, Shield, Trash2, Check } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

interface Notification {
  id: string;
  type: 'alert' | 'success' | 'info' | 'warning' | 'failure' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, loading, markAsRead, deleteNotification, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return <Shield className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failure':
        return <X className="w-4 h-4 text-orange-400" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'reminder':
        return <Info className="w-4 h-4 text-purple-400" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return 'bg-red-500/10';
      case 'warning':
        return 'bg-yellow-500/10';
      case 'success':
        return 'bg-green-500/10';
      case 'failure':
        return 'bg-orange-500/10';
      case 'info':
        return 'bg-blue-500/10';
      case 'reminder':
        return 'bg-purple-500/10';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full md:w-[480px] bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Notifications</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                >
                  <X className="w-6 h-6 text-muted-foreground group-hover:text-red-400" />
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1 bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{notifications.length}</p>
                </div>
                <div className="flex-1 bg-red-500/10 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Unread</p>
                  <p className="text-xl font-bold text-red-400">{unreadCount}</p>
                </div>
              </div>

              {/* Filter & Actions */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1 bg-muted/30 rounded-lg p-1 flex-1">
                  <button
                    onClick={() => setFilter('all')}
                    className={`flex-1 px-3 py-2 rounded-md text-sm transition-colors ${
                      filter === 'all' 
                        ? 'bg-primary text-white' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`flex-1 px-3 py-2 rounded-md text-sm transition-colors ${
                      filter === 'unread' 
                        ? 'bg-primary text-white' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Unread
                  </button>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    title="Mark all as read"
                  >
                    <Check className="w-5 h-5 text-primary" />
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground mt-4">Loading notifications...</p>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">All caught up!</h3>
                  <p className="text-muted-foreground text-sm">
                    {filter === 'unread' 
                      ? "No unread notifications"
                      : "No notifications yet"}
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border transition-all ${
                      !notification.read 
                        ? 'bg-primary/5 border-primary/30' 
                        : 'bg-muted/30 border-transparent'
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        getTypeColor(notification.type)
                      }`}>
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-bold text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </p>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-primary hover:text-blue-400 transition-colors px-2 py-1"
                              >
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-red-500/10 rounded transition-colors group"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
