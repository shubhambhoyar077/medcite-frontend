// ============================================
// AuthRouter.js - Public routes (No login required)
// ============================================
import React from 'react';
import SignInPage from '../pages/auth/SignInPage';
import SignUpPage from '../pages/auth/SignUpPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import PasswordSetupPage from '../pages/auth/PasswordSetupPage';
import BlankLayout from '../components/BlankLayout';
import ROUTES from '../constants/Routes';
import ConfirmationPage from '../pages/auth/ConfirmationPage';

/**
 * Auth Router Configuration
 * These routes are accessible WITHOUT authentication
 * Authenticated users will be redirected away from these routes
 */
const AuthRouter = [
  {
    route: ROUTES.ROOT_SCREEN,
    element: <SignInPage />,
    layout: BlankLayout,
    redirectIfAuthenticated: ROUTES.DASHBOARD,
  },
  {
    route: ROUTES.SIGNIN,
    element: <SignInPage />,
    layout: BlankLayout,
    redirectIfAuthenticated: ROUTES.DASHBOARD,
  },
  {
    route: ROUTES.CONFIRMATION,
    element: <ConfirmationPage />,
    layout: BlankLayout,
    redirectIfAuthenticated: ROUTES.DASHBOARD,
  },
  {
    route: ROUTES.SIGNUP,
    element: <SignUpPage />,
    layout: BlankLayout,
    redirectIfAuthenticated: ROUTES.DASHBOARD,
  },
  {
    route: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
    layout: BlankLayout,
    redirectIfAuthenticated: ROUTES.DASHBOARD,
  },
  {
    route: ROUTES.SET_PASSWORD,
    element: <PasswordSetupPage />,
    layout: BlankLayout,
    redirectIfAuthenticated: ROUTES.DASHBOARD,
  },
  // {
  //   route: '/reset-password/:token',
  //   element: <PasswordSetupPage />,
  //   layout: BlankLayout,
  //   redirectIfAuthenticated: '/dashboard',
  // },
];

export default AuthRouter;