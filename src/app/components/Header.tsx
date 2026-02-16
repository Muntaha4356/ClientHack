import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';

interface HeaderProps {
  userName?: string;
}

export function Header({ userName = 'Student' }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = 2; // You can make this dynamic later

  return (
    <>
      <header className="bg-background border-b border-border px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {userName}! 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your finances today</p>
        </div>
        
        <button 
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-3 hover:bg-muted/50 rounded-xl transition-all duration-200"
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </header>

      <NotificationPanel 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </>
  );
}