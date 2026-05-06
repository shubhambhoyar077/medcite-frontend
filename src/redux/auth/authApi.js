import { createApi } from '@reduxjs/toolkit/query/react';
import { API } from '../../config/APIConfig';
import { ACCESS_TOKEN, EXPIRES_AT } from '../../constants/PreferenceKeys';
import { AUTH } from '../../constants/Endpoints';

/**
 * Custom base query using your APIService
 */
const apiServiceBaseQuery = async ({ url, method, body, queryParams, pathParams, headers }) => {
  try {
    let result;
    const options = { body, queryParams, pathParams, headers };
    const withCredentials = true; // For cookie-based refresh token
    
    switch (method) {
      case 'GET':
        result = await API.get(url, options, withCredentials);
        break;
      case 'POST':
        result = await API.post(url, options, withCredentials);
        break;
      case 'PATCH':
        result = await API.patch(url, options, withCredentials);
        break;
      case 'PUT':
        result = await API.put(url, options, withCredentials);
        break;
      case 'DELETE':
        result = await API.delete(url, options, withCredentials);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    return { data: result };
  } catch (error) {
    return {
      error: {
        status: error.status,
        data: error.cause,
        message: error.message,
      },
    };
  }
};

/**
 * Base query with automatic token refresh
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await apiServiceBaseQuery(args, api, extraOptions);
  
  // If we get a 401, try to refresh the token
  if (result?.error?.status === 401) {
    console.log('Token expired, attempting refresh...');
    
    // Try to refresh the token
    const refreshResult = await apiServiceBaseQuery(
      {
        url: AUTH.REFRESH_ACCESS_TOKEN,
        method: 'POST',
      },
      api,
      extraOptions
    );
    
    if (refreshResult?.data) {
      // Store the new token
      const { access_token, expires_at } = refreshResult.data;
      if (access_token) {
        localStorage.setItem(ACCESS_TOKEN, access_token);
      }
      if (expires_at) {
        localStorage.setItem(EXPIRES_AT, expires_at);
      }
      
      // Retry the original request
      result = await apiServiceBaseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout user
      console.log('Token refresh failed, logging out...');
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(EXPIRES_AT);
      api.dispatch({ type: AUTH.USER_LOGOUT });
    }
  }
  
  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({
    
    // Register new user
    register: builder.mutation({
      query: (credentials) => ({
        url: AUTH.USER_REGISTRATION,
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: AUTH.USER_LOGIN,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    
    // Logout
    logout: builder.mutation({
      query: () => ({
        url: AUTH.USER_LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
    
    // Refresh token
    refreshToken: builder.mutation({
      query: () => ({
        url: AUTH.REFRESH_ACCESS_TOKEN,
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    
    // Get current user
    getCurrentUser: builder.query({
      query: () => ({
        url: AUTH.CURRENT_USER,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    
    // Forgot password
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: AUTH.FORGOT_PASSWORD,
        method: 'POST',
        body: email,
      }),
    }),
    
    // Validate password reset token
    validateResetToken: builder.mutation({
      query: ({ uid, token }) => ({
        url: AUTH.VALIDATE_SET_PASSWORD_TOKEN,
        method: 'POST',
        body: { token },
        pathParams: { uid },
      }),
    }),
    
    // Set/Reset password
    setPassword: builder.mutation({
      query: ({ uid, password, confirm_password, token }) => ({
        url: AUTH.SET_PASSWORD,
        method: 'POST',
        body: { password, confirm_password, token },
        pathParams: { uid },
      }),
    }),
    
    // Update profile
    updateProfile: builder.mutation({
      query: ({ userId, ...data }) => ({
        url: AUTH.UPDATE_USER,
        method: 'PATCH',
        body: data,
        pathParams: { userId },
      }),
      invalidatesTags: ['User'],
    }),
    
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useForgotPasswordMutation,
  useValidateResetTokenMutation,
  useSetPasswordMutation,
  useUpdateProfileMutation,
} = authApi;