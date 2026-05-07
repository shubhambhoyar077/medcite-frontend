import { createSlice } from '@reduxjs/toolkit';
import { authApi } from './authApi';

/**
 * Auth state lives entirely in Redux.
 * Tokens live entirely in HttpOnly cookies — the browser manages them.
 * No localStorage reads or writes anywhere in this file.
 */

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
    // Use when you need to manually set user data (e.g. after SSO)
    setCredentials: (state, action) => {
      state.user = action.payload.user ?? action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    // Clears Redux state — cookies are cleared server-side on logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
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

    // ── Login ──────────────────────────────────────────────────────────────
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        // Response body contains only safe user data — no tokens
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
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

    // ── Token refresh ──────────────────────────────────────────────────────
    // The server rotates the access cookie; we just stay authenticated.
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state) => {
        state.isAuthenticated = true;
      }
    );
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchRejected,
      (state) => {
        state.user = null;
        state.isAuthenticated = false;
      }
    );

    // ── Get current user ───────────────────────────────────────────────────
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

    // ── Logout ─────────────────────────────────────────────────────────────
    // Server has already cleared both cookies in its response.
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      }
    );

    // ── Update profile ─────────────────────────────────────────────────────
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
  clearError,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser      = (state) => state.auth.user;
export const selectIsAuthenticated  = (state) => state.auth.isAuthenticated;
export const selectAuthError        = (state) => state.auth.error;
export const selectUserRole         = (state) => state.auth.user?.role;
export const selectUserEmail        = (state) => state.auth.user?.email;
export const selectUserFullName     = (state) => state.auth.user?.full_name;