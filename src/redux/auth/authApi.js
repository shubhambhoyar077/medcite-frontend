import { createApi } from '@reduxjs/toolkit/query/react';
import { API } from '../../config/APIConfig';
import { AUTH } from '../../constants/Endpoints';

/**
 * Custom base query using APIService.
 * withCredentials is always true inside APIService now, so no need to pass it here.
 */
const apiServiceBaseQuery = async ({ url, method, body, queryParams, pathParams, headers }) => {
  try {
    const options = { body, queryParams, pathParams, headers };

    let result;
    switch (method) {
      case 'GET':    result = await API.get(url, options);    break;
      case 'POST':   result = await API.post(url, options);   break;
      case 'PATCH':  result = await API.patch(url, options);  break;
      case 'PUT':    result = await API.put(url, options);    break;
      case 'DELETE': result = await API.delete(url, options); break;
      default: throw new Error(`Unsupported method: ${method}`);
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
 * Base query with automatic token refresh.
 * On 401 the access cookie has expired — silently call the refresh endpoint
 * (which uses the refresh cookie) to get a new access cookie, then retry.
 * No localStorage involvement at any point.
 */
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await apiServiceBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log('Access token expired, attempting refresh...');

    const refreshResult = await apiServiceBaseQuery(
      { url: AUTH.REFRESH_ACCESS_TOKEN, method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      // Server has set a new access cookie — retry original request
      result = await apiServiceBaseQuery(args, api, extraOptions);
    } else {
      // Refresh cookie also expired — force logout
      console.log('Token refresh failed, logging out...');
      api.dispatch({ type: 'auth/logout' });
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth'],
  endpoints: (builder) => ({

    register: builder.mutation({
      query: (credentials) => ({
        url: AUTH.USER_REGISTRATION,
        method: 'POST',
        body: credentials,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: AUTH.USER_LOGIN,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    logout: builder.mutation({
      query: () => ({
        url: AUTH.USER_LOGOUT,
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: AUTH.REFRESH_ACCESS_TOKEN,
        method: 'POST',
      }),
    }),

    getCurrentUser: builder.query({
      query: () => ({
        url: AUTH.CURRENT_USER,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: AUTH.FORGOT_PASSWORD,
        method: 'POST',
        body: email,
      }),
    }),

    validateResetToken: builder.mutation({
      query: ({ uid, token }) => ({
        url: AUTH.VALIDATE_SET_PASSWORD_TOKEN,
        method: 'POST',
        body: { token },
        pathParams: { uid },
      }),
    }),

    setPassword: builder.mutation({
      query: ({ uid, password, confirm_password, token }) => ({
        url: AUTH.SET_PASSWORD,
        method: 'POST',
        body: { password, confirm_password, token },
        pathParams: { uid },
      }),
    }),

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