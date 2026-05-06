import React from 'react';
import PageLayout from '../components/PageLayout';
import ROUTES from '../constants/Routes';
import HomePage from '../pages/chat/HomePage';
import ProfilePage from '../pages/auth/ProfilePage';
/**
 * App Router Configuration
 * These routes require authentication
 * Unauthenticated users will be redirected to login
 */
const AppRouter = [
  {
    route: ROUTES.DASHBOARD,
    element: <HomePage />,
    layout: PageLayout, // Default layout with sidebar, header, etc.
    redirectIfNotAuthenticated: ROUTES.SIGNIN, // Where to send unauthenticated users
  },
];

export default AppRouter;