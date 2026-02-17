import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Landing } from './pages/Landing';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Simulator } from './pages/Simulator';
import { Profile } from './pages/Profile';
import { Savings } from './pages/Savings';
import { Reminders } from './pages/Reminders';
import { ProtectedRoute } from './components/ProtectedRoutes/ProtectedRoute';
import { PublicRoute } from './components/ProtectedRoutes/PublicRoute';


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PublicRoute>
        <Landing />
      </PublicRoute>
    ),

  },
  {
    path: '/signup',
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/transactions',
    element: (
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    ),
  },
  {
    path: '/simulator',
    element: (
      <ProtectedRoute>
        <Simulator />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/savings',
    element: (
      <ProtectedRoute>
        <Savings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reminders',
    element: (
      <ProtectedRoute>
        <Reminders />
      </ProtectedRoute>
    ),
  },
]);

export default function App() {
  return (
    <NotificationProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="dark">
        <RouterProvider router={router} />
      </div>
    </NotificationProvider>
  );
}
