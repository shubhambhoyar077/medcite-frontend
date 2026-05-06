import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useSetPasswordMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useValidateResetTokenMutation,
} from '../../../redux/auth/authApi';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthError,
  logoutAction
} from '../../../redux/auth/authSlice';
import { ACCESS_TOKEN, EXPIRES_AT } from '../../../constants/PreferenceKeys';

/**
 * Main auth hook - provides all auth functionality
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const error = useSelector(selectAuthError);
  
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [forgotPassword, { isLoading: isSendingReset }] = useForgotPasswordMutation();
  const [setPassword, { isLoading: isSettingPassword }] = useSetPasswordMutation();
  const [refreshToken] = useRefreshTokenMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [validateToken, { isLoading: isValidatingToken }] = useValidateResetTokenMutation();
  
  // Fetch current user if we have a token
  const { refetch: refetchUser, isLoading: isFetchingUser, } = useGetCurrentUserQuery(undefined, {
    skip: !!user,
  });
  
  // Handle login
  const handleLogin = useCallback(async (credentials) => {
    try {
      const result = await login(credentials).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { 
        success: false, 
        error: err.message || 'Login failed' 
      };
    }
  }, [login]);
  
  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      return { success: true };
    } catch (err) {
      // Still logout locally even if server request fails
      dispatch(logoutAction());
      return { success: true };
    }
  }, [logout, dispatch]);
  
  // Handle registration
  const handleRegister = useCallback(async (userData) => {
    try {
      const result = await register(userData).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { 
        success: false, 
        error: err.message || 'Registration failed' 
      };
    }
  }, [register]);
  
  // Handle forgot password
  const handleForgotPassword = useCallback(async (email) => {
    try {
      const result = await forgotPassword({ email }).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { 
        success: false, 
        error: err.message || 'Failed to send reset email' 
      };
    }
  }, [forgotPassword]);
  
  // Handle set/reset password
  const handleSetPassword = useCallback(async (passwordData) => {
    try {
      const result = await setPassword(passwordData).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { 
        success: false, 
        error: err.message || err.data?.password || 'Failed to set password' 
      };
    }
  }, [setPassword]);
  
  // Handle profile update
  const handleUpdateProfile = useCallback(async (userId, data) => {
    try {
      const result = await updateProfile({ userId, ...data }).unwrap();
      return { success: true, data: result };
    } catch (err) {
      console.log(err) 
      return {
        success: false, 
        error: err.message || 'Failed to update profile' 
      };
    }
  }, [updateProfile]);
  
  // Handle token refresh
  const handleRefreshToken = useCallback(async () => {
    try {
      await refreshToken().unwrap();
      return { success: true };
    } catch (err) {
      dispatch(logoutAction());
      return { success: false };
    }
  }, [refreshToken, dispatch]);

  // Handle token validation
  const handleValidateToken = useCallback(async (uid, token) => {
    try {
      const result = await validateToken({ uid, token }).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { 
        success: false, 
        error: err.message || 'Invalid or expired token' 
      };
    }
  }, [validateToken]);
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  
  // Check if user is super admin
  const isSuperAdmin = user?.role === 'super_admin';
  
  return {
    // State
    user,
    isAuthenticated,
    error,
    isAdmin,
    isSuperAdmin,
    
    // Loading states
    isLoggingIn,
    isLoggingOut,
    isRegistering,
    isSendingReset,
    isSettingPassword,
    isUpdatingProfile,
    isValidatingToken,
    isFetchingUser,
    
    // Actions
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    forgotPassword: handleForgotPassword,
    setPassword: handleSetPassword,
    updateProfile: handleUpdateProfile,
    refreshToken: handleRefreshToken,
    validateToken: handleValidateToken,
    refetchUser,
  };
};

/**
 * Hook to check token expiration and auto-refresh
 */
export const useTokenRefresh = () => {
  const dispatch = useDispatch();
  const [refreshToken] = useRefreshTokenMutation();
  
  useEffect(() => {
    const checkTokenExpiration = async () => {
      const expiresAt = localStorage.getItem(EXPIRES_AT);
      const token = localStorage.getItem(ACCESS_TOKEN);
      
      if (!expiresAt || !token) return;
      
      const expirationTime = new Date(expiresAt).getTime();
      const currentTime = new Date().getTime();
      const timeUntilExpiry = expirationTime - currentTime;
      
      // Refresh token 5 minutes before expiry
      const refreshThreshold = 5 * 60 * 1000; // 5 minutes
      
      if (timeUntilExpiry < refreshThreshold) {
        try {
          await refreshToken().unwrap();
          console.log('Token refreshed automatically');
        } catch (err) {
          console.error('Auto token refresh failed:', err);
          dispatch(logoutAction());
        }
      }
    };
    
    // Check immediately
    checkTokenExpiration();
    
    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    
    return () => clearInterval(interval);
  }, [refreshToken, dispatch]);
};

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export const useRequireAuth = (redirectTo = '/login') => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = localStorage.getItem(ACCESS_TOKEN);
  
  useEffect(() => {
    if (!isAuthenticated && !token) {
      // Redirect to login
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, token, redirectTo]);
  
  return isAuthenticated || !!token;
};

/**
 * Hook to require specific role
 */
export const useRequireRole = (allowedRoles = []) => {
  const user = useSelector(selectCurrentUser);
  const userRole = user?.role;
  
  const hasRole = userRole && allowedRoles.includes(userRole);
  
  useEffect(() => {
    if (user && !hasRole) {
      console.warn(`User role '${userRole}' not in allowed roles:`, allowedRoles);
    }
  }, [user, hasRole, userRole, allowedRoles]);
  
  return hasRole;
};

/**
 * Hook for admin-only access
 */
export const useRequireAdmin = () => {
  return useRequireRole(['admin', 'super_admin']);
};

/**
 * Hook for super admin-only access
 */
export const useRequireSuperAdmin = () => {
  return useRequireRole(['super_admin']);
};