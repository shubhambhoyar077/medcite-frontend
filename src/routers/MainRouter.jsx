import React, { useContext, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router';
import LoadingScreen from '../components/LoadingScreen';
import NotFoundPage from '../components/NotFoundPage';
import AppRouter from './AppRouter';
import AuthRouter from './AuthRouter';
import ROUTES from '../constants/Routes';
import { useAuth } from '../pages/auth/hooks/authHooks';

// ============================================
// PROTECTED ROUTE WRAPPER
// ============================================
const ProtectedRoute = ({ children, isAuthenticated, redirectTo = ROUTES.ROOT_SCREEN }) => {
  const location = useLocation();
  console.log("protected")
  console.log(isAuthenticated)
  if (!isAuthenticated) {
    // Save the attempted URL to redirect back after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
};

// ============================================
// PUBLIC ROUTE WRAPPER (Redirects authenticated users)
// ============================================
const PublicRoute = ({ children, isAuthenticated, redirectTo = ROUTES.DASHBOARD }) => {
  if (isAuthenticated) {
    // Redirect authenticated users away from auth pages
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// ============================================
// MAIN ROUTER COMPONENT
// ============================================
const MainRouter = () => {
  const {isAuthenticated, isFetchingUser} = useAuth()
 
  // Show loading screen while determining auth status
  if (isFetchingUser) {
    return <LoadingScreen />;
  }

  /**
   * Render unauthenticated routes (Login, Register, etc.)
   * These routes are wrapped in PublicRoute to redirect authenticated users
   */
  const renderAuthRoutes = () => {
    return AuthRouter.map((route) => {
      const Layout = route.layout || React.Fragment;
      return (
        <Route
          key={`auth-route-${route.route}`}
          element={
            <PublicRoute 
              isAuthenticated={isAuthenticated}
              redirectTo={route.redirectIfAuthenticated || ROUTES.DASHBOARD}
            >
              <Layout />
            </PublicRoute>
          }
        >
          <Route path={route.route} element={route.element} />
        </Route>
      );
    });
  };

  /**
   * Render authenticated routes (Dashboard, Profile, etc.)
   * These routes are wrapped in ProtectedRoute to redirect unauthenticated users
   */
  const renderAppRoutes = () => {
    return AppRouter.map((route) => {
      const Layout = route.layout || React.Fragment;
      
      return (
        <Route
          key={`app-route-${route.route}`}
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated}
              redirectTo={route.redirectIfNotAuthenticated || ROUTES.SIGNIN}
            >
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path={route.route} element={route.element} />
        </Route>
      );
    });
  };

  return (
    <Routes>
      {/* Auth Routes (Public) */}
      {renderAuthRoutes()}

      {/* App Routes (Protected) */}
      {renderAppRoutes()}

      {/* 404 Not Found - Catch all unmatched routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default MainRouter;