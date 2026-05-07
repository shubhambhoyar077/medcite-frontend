/* eslint-disable array-callback-return */
import axios from 'axios';

/**
 * ============================================
 * API SERVICE - USAGE INSTRUCTIONS
 * ============================================
 *
 * Tokens (access + refresh) are stored in HttpOnly cookies set by the server.
 * The browser sends them automatically — you never read or write them in JS.
 * withCredentials: true is always enabled so cookies are included cross-origin.
 *
 * 1. INITIALIZATION:
 * ------------------
 * import { APIService } from './apiService';
 *
 * const apiService = new APIService(); // No token key needed
 *
 *
 * 2. BASIC USAGE:
 * ---------------
 *
 * // GET Request
 * const users = await apiService.get('/api/users');
 *
 * // POST Request
 * const newUser = await apiService.post('/api/users', {
 *   body: { name: 'John', email: 'john@example.com' }
 * });
 *
 * // PUT Request
 * const updated = await apiService.put('/api/users/123', {
 *   body: { name: 'John Updated' }
 * });
 *
 * // PATCH Request
 * const patched = await apiService.patch('/api/users/123', {
 *   body: { email: 'newemail@example.com' }
 * });
 *
 * // DELETE Request
 * await apiService.delete('/api/users/123');
 *
 *
 * 3. WITH QUERY PARAMETERS:
 * -------------------------
 * const users = await apiService.get('/api/users', {
 *   queryParams: { page: 1, limit: 10, search: 'john' }
 * });
 * // Result: /api/users?page=1&limit=10&search=john
 *
 *
 * 4. WITH PATH PARAMETERS:
 * ------------------------
 * const user = await apiService.get('/api/users/:id/posts/:postId', {
 *   pathParams: { id: '123', postId: '456' }
 * });
 * // Result: /api/users/123/posts/456
 *
 *
 * 5. WITH CUSTOM HEADERS:
 * -----------------------
 * const data = await apiService.post('/api/data', {
 *   body: { data: 'value' },
 *   headers: { 'X-Custom-Header': 'custom-value' }
 * });
 *
 *
 * 6. FILE UPLOAD (FormData):
 * --------------------------
 * const file = document.querySelector('input[type="file"]').files[0];
 * const response = await apiService.post('/api/upload', {
 *   formData: {
 *     file: file,
 *     title: 'My File',
 *     description: 'File description'
 *   }
 * });
 *
 *
 * 7. ERROR HANDLING:
 * ------------------
 * try {
 *   const data = await apiService.get('/api/users');
 *   console.log(data);
 * } catch (error) {
 *   console.error('Error message:', error.message);
 *   console.error('HTTP status:', error.status);
 *   console.error('Full server error:', error.cause);
 *
 *   if (error.status === 401) {
 *     // Token expired / not authenticated — redirect to login
 *   } else if (error.status === 404) {
 *     // Handle not found
 *   }
 * }
 *
 *
 * 8. COMBINED EXAMPLE:
 * --------------------
 * const response = await apiService.post('/api/users/:userId/posts', {
 *   pathParams: { userId: '123' },
 *   queryParams: { notify: true },
 *   body: { title: 'New Post', content: 'Post content' },
 *   headers: { 'X-Request-ID': 'abc-123' }
 * });
 * // Result: POST /api/users/123/posts?notify=true
 *
 */


/**
 * Get CSRF token from cookie.
 * The csrftoken cookie is NOT HttpOnly — Django intentionally allows JS to read it.
 */
const getCsrfToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};


/**
 * @typedef {Object} APIOptions
 * @property {Object} queryParams  - URL query parameters
 * @property {Object} pathParams   - URL path parameters to replace :param
 * @property {Object} body         - Request body
 * @property {Object} headers      - Custom headers
 * @property {Object} formData     - Form data for file uploads
 */

axios.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

const DEFAULT_OPTIONS = {
  queryParams: {},
  pathParams: {},
  body: {},
  headers: {}
};

class APIError extends Error {
  constructor(message, cause, status) {
    super(message, { cause });
    this.name = "API_ERROR";
    this.status = status;
  }
}

const SOMETHING_WENT_WRONG = 'Something went wrong. Please try again later';

/**
 * Recursively extracts error message from nested server error objects.
 * Handles various backend error formats including Django REST Framework.
 */
const _formattedErrorMessage = serverError => {
  if (!serverError) return null;

  if (typeof serverError === 'string') return serverError;

  if (typeof serverError === 'object') {
    if (Object.keys(serverError).length === 0) return null;

    const possibleErrorFields = [
      'message',
      'error',
      'detail',
      'msg',
      'errorMessage',
      'error_description',
      'errors',
      'non_field_errors'
    ];

    for (const field of possibleErrorFields) {
      if (serverError[field]) {
        const error = serverError[field];

        if (Array.isArray(error)) {
          if (error.length > 0) {
            if (typeof error[0] === 'object' && error[0].message) return error[0].message;
            if (typeof error[0] === 'string') return error[0];
          }
          continue;
        }

        if (typeof error === 'object') {
          const nestedMessage = _formattedErrorMessage(error);
          if (nestedMessage) return nestedMessage;
        }

        if (typeof error === 'string') return error;
      }
    }

    // Handle Django serializer field-level errors
    for (const [field, error] of Object.entries(serverError)) {
      if (possibleErrorFields.includes(field)) continue;

      if (Array.isArray(error) && error.length > 0) {
        return typeof error[0] === 'string' ? error[0] : String(error[0]);
      } else if (typeof error === 'string') {
        return error;
      }
    }
  }

  return null;
};

/**
 * Extracts and formats error information from an axios error.
 */
const _getErrorMessage = axiosError => {
  const response = axiosError.response;

  let errorMessage = axiosError?.message ?? SOMETHING_WENT_WRONG;
  let serverError = {};
  let status = null;

  if (!response) {
    if (axiosError.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (axiosError.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection.';
    }
    return { errorMessage, serverError, status };
  }

  serverError = response.data;
  status = response.status;

  const serverErrorMessage = _formattedErrorMessage(serverError);

  if (serverErrorMessage) {
    errorMessage = serverErrorMessage;
  } else {
    switch (status) {
      case 400: errorMessage = 'Bad request. Please check your input.'; break;
      case 401: errorMessage = 'Unauthorized. Please login again.'; break;
      case 403: errorMessage = 'Access denied. You don\'t have permission.'; break;
      case 404: errorMessage = 'Resource not found.'; break;
      case 422: errorMessage = 'Validation error. Please check your input.'; break;
      case 429: errorMessage = 'Too many requests. Please try again later.'; break;
      case 500: errorMessage = 'Server error. Please try again later.'; break;
      case 503: errorMessage = 'Service unavailable. Please try again later.'; break;
      default:  errorMessage = SOMETHING_WENT_WRONG;
    }
  }

  return { errorMessage, serverError, status };
};


class APIService {
  /**
   * No constructor arguments needed.
   * Access token is in an HttpOnly cookie — the browser handles it automatically.
   */
  constructor() {}

  /**
   * GET request
   */
  get = async (url, options = DEFAULT_OPTIONS) => {
    url = this._prepareURL(url, options);
    const headers = this._prepareHeaders(options);

    try {
      const response = await axios.get(url, { headers, withCredentials: true });
      return _formattedResponse(response);
    } catch (e) {
      const { errorMessage, serverError, status } = _getErrorMessage(e);
      throw new APIError(errorMessage, serverError, status);
    }
  };

  /**
   * POST request
   */
  post = async (url, options = DEFAULT_OPTIONS) => {
    url = this._prepareURL(url, options);
    const headers = this._prepareHeaders(options, 'POST');
    const body = this._prepareBody(options);

    try {
      const response = await axios.post(url, body, { headers, withCredentials: true });
      return _formattedResponse(response);
    } catch (e) {
      const { errorMessage, serverError, status } = _getErrorMessage(e);
      throw new APIError(errorMessage, serverError, status);
    }
  };

  /**
   * PUT request
   */
  put = async (url, options = DEFAULT_OPTIONS) => {
    url = this._prepareURL(url, options);
    const headers = this._prepareHeaders(options, 'PUT');
    const body = this._prepareBody(options);

    try {
      const response = await axios.put(url, body, { headers, withCredentials: true });
      return _formattedResponse(response);
    } catch (e) {
      const { errorMessage, serverError, status } = _getErrorMessage(e);
      throw new APIError(errorMessage, serverError, status);
    }
  };

  /**
   * PATCH request
   */
  patch = async (url, options = DEFAULT_OPTIONS) => {
    url = this._prepareURL(url, options);
    const headers = this._prepareHeaders(options, 'PATCH');
    const body = this._prepareBody(options);

    try {
      const response = await axios.patch(url, body, { headers, withCredentials: true });
      return _formattedResponse(response);
    } catch (e) {
      const { errorMessage, serverError, status } = _getErrorMessage(e);
      throw new APIError(errorMessage, serverError, status);
    }
  };

  /**
   * DELETE request
   */
  delete = async (url, options = DEFAULT_OPTIONS) => {
    url = this._prepareURL(url, options);
    const headers = this._prepareHeaders(options, 'DELETE');

    try {
      const response = await axios.delete(url, { headers, withCredentials: true });
      return _formattedResponse(response);
    } catch (e) {
      const { errorMessage, serverError, status } = _getErrorMessage(e);
      throw new APIError(errorMessage, serverError, status);
    }
  };

  // ─── Private helpers ──────────────────────────────────────────────────────

  /**
   * Replaces :param placeholders and appends query string.
   * @private
   */
  _prepareURL = (url, options = DEFAULT_OPTIONS) => {
    const { queryParams = {}, pathParams = {} } = options;

    Object.entries(pathParams).forEach(([k, v]) => {
      url = url.replaceAll(`:${k}`, v);
    });

    const qp = new URLSearchParams(queryParams).toString();
    if (qp) url = `${url}?${qp}`;

    return url;
  };

  /**
   * Builds headers.
   * No Authorization header — the access token travels as an HttpOnly cookie.
   * CSRF token is still read from the csrftoken cookie (which IS JS-readable).
   * @private
   */
  _prepareHeaders = (options = DEFAULT_OPTIONS, method = 'GET') => {
    const headers = { ...(options?.headers || {}) };

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const csrfToken = getCsrfToken();
      if (csrfToken) headers['X-CSRFToken'] = csrfToken;
    }

    return headers;
  };

  /**
   * Converts formData option into a FormData object, or returns plain body.
   * @private
   */
  _prepareBody = (options = DEFAULT_OPTIONS) => {
    if (options.formData && Object.keys(options.formData).length) {
      const fd = new FormData();
      Object.keys(options.formData).forEach(key => fd.append(key, options.formData[key]));
      return fd;
    }
    return options.body;
  };
}

/**
 * Unwraps axios response to just the data payload.
 */
const _formattedResponse = response => response.data;

export { APIService, APIError };