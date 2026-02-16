import { createBrowserRouter } from 'react-router';
import { Landing } from './pages/Landing';
import { Signup } from './pages/Signup';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Simulator } from './pages/Simulator';
import { Profile } from './pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/signup',
    Component: Signup,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
  {
    path: '/transactions',
    Component: Transactions,
  },
  {
    path: '/simulator',
    Component: Simulator,
  },
  {
    path: '/profile',
    Component: Profile,
  },
]);