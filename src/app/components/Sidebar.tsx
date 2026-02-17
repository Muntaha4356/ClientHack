import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { LayoutDashboard, ArrowLeftRight, TrendingUp, User, LogOut, Shield } from 'lucide-react';
import apiClient from '../../utils/apiClient';
import { useNotifications } from '../context/NotificationContext';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ArrowLeftRight, label: 'Transactions', path: '/transactions' },
    { icon: TrendingUp, label: 'Simulator', path: '/simulator' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
      clearNotifications();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">CashMate</h2>
            <p className="text-xs text-muted-foreground">Smart Finance</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative
                ${isActive 
                  ? 'bg-sidebar-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sidebar-foreground hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}