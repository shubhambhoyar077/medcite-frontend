import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';
import { ACCESS_TOKEN, EXPIRES_AT } from '../../constants/PreferenceKeys';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token, expires_at } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.error = null;
      
      // Store in localStorage using your keys
      if (access_token) {
        localStorage.setItem(ACCESS_TOKEN, access_token);
      }
      if (expires_at) {
        localStorage.setItem(EXPIRES_AT, expires_at);
      }
    },
    
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear localStorage using your keys
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(EXPIRES_AT);
    },
    
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    // Login
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        const { access_token, expires_at, ...user } = action.payload;
        state.user = user;
        state.isAuthenticated = true;
        state.error = null;
        
        if (access_token) {
          localStorage.setItem(ACCESS_TOKEN, access_token);
        }
        if (expires_at) {
          localStorage.setItem(EXPIRES_AT, expires_at);
        }
      }
    );
    
    builder.addMatcher(
      authApi.endpoints.login.matchRejected,
      (state, action) => {
        state.error = action.payload?.data?.detail || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
      }
    );
    
    // Token Refresh
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, action) => {
        const { access_token, expires_at, ...user } = action.payload;
        state.user = user;
        state.isAuthenticated = true;
        
        if (access_token) {
          localStorage.setItem(ACCESS_TOKEN, access_token);
        }
        if (expires_at) {
          localStorage.setItem(EXPIRES_AT, expires_at);
        }
      }
    );
    
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchRejected,
      (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(EXPIRES_AT);
      }
    );
    
    // Get Current User
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    );
    
    builder.addMatcher(
      authApi.endpoints.getCurrentUser.matchRejected,
      (state) => {
        state.user = null;
        state.isAuthenticated = false;
      }
    );
    
    // Logout
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(EXPIRES_AT);
      }
    );
    
    // Update Profile
    builder.addMatcher(
      authApi.endpoints.updateProfile.matchFulfilled,
      (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      }
    );
  },
});

export const { 
  setCredentials, 
  logout: logoutAction, 
  updateUser, 
  setError, 
  clearError 
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectUserEmail = (state) => state.auth.user?.email;
export const selectUserFullName = (state) => state.auth.user?.full_name;