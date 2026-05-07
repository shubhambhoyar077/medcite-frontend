import { useCallback } from 'react';
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
  logoutAction,
} from '../../../redux/auth/authSlice';

/**
 * Main auth hook — provides all auth functionality.
 * Token storage is handled entirely by HttpOnly cookies set by the server.
 * No localStorage reads or writes anywhere in this file.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const error = useSelector(selectAuthError);

  const [login,          { isLoading: isLoggingIn }]       = useLoginMutation();
  const [logout,         { isLoading: isLoggingOut }]       = useLogoutMutation();
  const [register,       { isLoading: isRegistering }]      = useRegisterMutation();
  const [forgotPassword, { isLoading: isSendingReset }]     = useForgotPasswordMutation();
  const [setPassword,    { isLoading: isSettingPassword }]  = useSetPasswordMutation();
  const [refreshToken]                                       = useRefreshTokenMutation();
  const [updateProfile,  { isLoading: isUpdatingProfile }]  = useUpdateProfileMutation();
  const [validateToken,  { isLoading: isValidatingToken }]  = useValidateResetTokenMutation();

  // Fetch current user from the server when not yet in Redux state
  const { refetch: refetchUser, isLoading: isFetchingUser } = useGetCurrentUserQuery(undefined, {
    skip: !!user,
  });

  const handleLogin = useCallback(async (credentials) => {
    try {
      const result = await login(credentials).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }, [login]);

  const handleLogout = useCallback(async () => {
    try {
      await logout().unwrap();
    } catch {
      // Still clear local state even if server call fails
    } finally {
      dispatch(logoutAction());
    }
    return { success: true };
  }, [logout, dispatch]);

  const handleRegister = useCallback(async (userData) => {
    try {
      const result = await register(userData).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  }, [register]);

  const handleForgotPassword = useCallback(async (email) => {
    try {
      const result = await forgotPassword({ email }).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to send reset email' };
    }
  }, [forgotPassword]);

  const handleSetPassword = useCallback(async (passwordData) => {
    try {
      const result = await setPassword(passwordData).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message || err.data?.password || 'Failed to set password' };
    }
  }, [setPassword]);

  const handleUpdateProfile = useCallback(async (userId, data) => {
    try {
      const result = await updateProfile({ userId, ...data }).unwrap();
      return { success: true, data: result };
    } catch (err) {
      console.log(err);
      return { success: false, error: err.message || 'Failed to update profile' };
    }
  }, [updateProfile]);

  const handleRefreshToken = useCallback(async () => {
    try {
      await refreshToken().unwrap();
      return { success: true };
    } catch (err) {
      dispatch(logoutAction());
      return { success: false };
    }
  }, [refreshToken, dispatch]);

  const handleValidateToken = useCallback(async (uid, token) => {
    try {
      const result = await validateToken({ uid, token }).unwrap();
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid or expired token' };
    }
  }, [validateToken]);

  const isAdmin      = user?.role === 'admin' || user?.role === 'super_admin';
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
 * Hook to require authentication.
 * Relies purely on Redux state — no localStorage token check.
 * The server will reject requests with expired/missing cookies automatically.
 */
export const useRequireAuth = (redirectTo = '/login') => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    window.location.href = redirectTo;
  }

  return isAuthenticated;
};

/**
 * Hook to require a specific role.
 */
export const useRequireRole = (allowedRoles = []) => {
  const user = useSelector(selectCurrentUser);
  const userRole = user?.role;
  const hasRole = !!userRole && allowedRoles.includes(userRole);

  if (user && !hasRole) {
    console.warn(`User role '${userRole}' not in allowed roles:`, allowedRoles);
  }

  return hasRole;
};

/** Hook for admin-only access */
export const useRequireAdmin = () => useRequireRole(['admin', 'super_admin']);

/** Hook for super admin-only access */
export const useRequireSuperAdmin = () => useRequireRole(['super_admin']);