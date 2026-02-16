import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';
import apiClient from '../../utils/apiClient';

interface HeaderProps {
  userName?: string;
}

export function Header({ userName = 'Student' }: HeaderProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = 2; // You can make this dynamic later
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    monthlyIncome: ''
  });
  useEffect (() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get("/user/profile");
        const data = response.data.data;

        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          monthlyIncome: data.monthlyIncome || "",
        });

      } catch (error: unknown) {
        console.error("Failed to fetch profile:", error);
        alert("Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <header className="bg-background border-b border-border px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {profile.fullName || userName}! 👋</h1>
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