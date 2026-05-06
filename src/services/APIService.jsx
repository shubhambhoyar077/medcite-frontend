/* eslint-disable array-callback-return */
import axios from 'axios';

/**
 * ============================================
 * API SERVICE - USAGE INSTRUCTIONS
 * ============================================
 * 
 * 1. INITIALIZATION:
 * ------------------
 * import { APIService } from './apiService';
 * 
 * const apiService = new APIService({ 
 *   accessTokenPreferenceKey: 'auth_token' // localStorage key for your token
 * });
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
 * 6. WITH CREDENTIALS (for CORS):
 * -------------------------------
 * const data = await apiService.get('/api/data', {}, true);
 * 
 * 
 * 7. FILE UPLOAD (FormData):
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
 * 8. ERROR HANDLING:
 * ------------------
 * try {
 *   const data = await apiService.get('/api/users');
 *   console.log(data);
 * } catch (error) {
 *   console.error('Error message:', error.message);
 *   console.error('HTTP status:', error.status);
 *   console.error('Full server error:', error.cause);
 *   
 *   // Handle specific status codes
 *   if (error.status === 401) {
 *     // Handle unauthorized
 *   } else if (error.status === 404) {
 *     // Handle not found
 *   }
 * }
 * 
 * 
 * 9. COMBINED EXAMPLE:
 * --------------------
 * const response = await apiService.post('/api/users/:userId/posts', {
 *   pathParams: { userId: '123' },
 *   queryParams: { notify: true },
 *   body: { title: 'New Post', content: 'Post content' },
 *   headers: { 'X-Request-ID': 'abc-123' }
 * }, true);
 * // Result: POST /api/users/123/posts?notify=true
 * 
 */


/**
 * Get CSRF token from cookie
 */
const getCsrfToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Check if this cookie is the CSRF token
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
 * @property {Object} queryParams - URL query parameters
 * @property {Object} pathParams - URL path parameters to replace :param
 * @property {Object} body - Request body
 * @property {Object} headers - Custom headers
 * @property {Object} formData - Form data for file uploads
 * @property {string} accessTokenPreferenceKey - localStorage key for auth token
 */

axios.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
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
 * Recursively extracts error message from nested server error objects
 * Handles various backend error formats including Django REST Framework
 */
const _formattedErrorMessage = serverError => {
  if (!serverError) return null;
  
  if (typeof serverError === 'string') return serverError;
  
  if (typeof serverError === 'object') {
    if (Object.keys(serverError).length === 0) return null;
    
    // Common error patterns from different backends
    const possibleErrorFields = [
      'message',
      'error',
      'detail',
      'msg',
      'errorMessage',
      'error_description',
      'errors',
      'non_field_errors'  // Django REST Framework general errors
    ];
    
    // Try each possible error field
    for (const field of possibleErrorFields) {
      if (serverError[field]) {
        const error = serverError[field];
        
        // Handle array of errors (like validation errors)
        if (Array.isArray(error)) {
          if (error.length > 0) {
            // If array items are objects with message property
            if (typeof error[0] === 'object' && error[0].message) {
              return error[0].message;
            }
            // If array items are strings
            if (typeof error[0] === 'string') {
              return error[0];
            }
          }
          continue;
        }
        
        // Recursively process nested objects
        if (typeof error === 'object') {
          const nestedMessage = _formattedErrorMessage(error);
          if (nestedMessage) return nestedMessage;
        }
        
        // Direct string message
        if (typeof error === 'string') {
          return error;
        }
      }
    }
    
    // Handle Django serializer field-level errors
    // Format: {"field_name": ["error message"], "another_field": ["another error"]}
    for (const [field, error] of Object.entries(serverError)) {
      // Skip if this is a known error structure field
      if (possibleErrorFields.includes(field)) continue;
      
      if (Array.isArray(error) && error.length > 0) {
        const errorMessage = typeof error[0] === 'string' ? error[0] : String(error[0]);
        return errorMessage;  // Return just the error message
      } else if (typeof error === 'string') {
        return error;
      }
    }
  }
  
  return null;
};

/**
 * Extracts and formats error information from axios error
 */
const _getErrorMessage = axiosError => {
  const response = axiosError.response;

  // Default error message
  let errorMessage = axiosError?.message ?? SOMETHING_WENT_WRONG;
  let serverError = {};
  let status = null;

  // Network error (no response from server)
  if (!response) {
    if (axiosError.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (axiosError.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection.';
    }
    return { errorMessage, serverError, status };
  }

  // Extract server error and status
  serverError = response.data;
  status = response.status;

  // Try to get formatted error message from server response
  const serverErrorMessage = _formattedErrorMessage(serverError);

  if (serverErrorMessage) {
    errorMessage = serverErrorMessage;
  } else {
    // Fallback to status-based messages
    switch (status) {
      case 400:
        errorMessage = 'Bad request. Please check your input.';
        break;
      case 401:
        errorMessage = 'Unauthorized. Please login again.';
        break;
      case 403:
        errorMessage = 'Access denied. You don\'t have permission.';
        break;
      case 404:
        errorMessage = 'Resource not found.';
        break;
      case 422:
        errorMessage = 'Validation error. Please check your input.';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
      case 503:
        errorMessage = 'Service unavailable. Please try again later.';
        break;
      default:
        errorMessage = SOMETHING_WENT_WRONG;
    }
  }

  return { errorMessage, serverError, status };
};

class APIService {
  constructor({ accessTokenPreferenceKey }) {
    this.accessTokenPreferenceKey = accessTokenPreferenceKey;
  }

  /**
   * GET request
   * @param {string} url - API endpoint
   * @param {APIOptions} options - Request options
   * @param {boolean} withCredentials - Include credentials for CORS
   */
  get = async (url, options = DEFAULT_OPTIONS, withCredentials = false) => {
    url = this._prepareURL(url, options);
    const _headers = this._prepareHeaders(options);

    try {
      const response = await axios.get(url, { 
        headers: _headers,
        withCredentials: withCredentials
      });
      const data = await _formattedResponse(response);

      return data;
    } catch (e) {
      const { errorMessage, serverError, status } = _getErrorMessage(e);
      throw new APIError(errorMessage, serverError, status);
    }
  };

  /**
   * POST request
   * @param {string} url - API endpoint
   * @param {APIOptions} options - Request options
   * @param {boolean} withCredentials - Include credentials for CORS
   */
  post = async (url, options = DEFAULT_OPTIONS, withCredentials = false) => {
    url = this._prepareURL(url, options);
    const _headers = this._prepareHeaders(options, 'POST');
    
    if (options.formData && Object.keys(options.formData).length) {
      const data = new FormData();
      Object.keys(options.formData).forEach(item => {
        data.append(item, options.formData[item]);
      });
      options.body = data;
    }
    
    try {
      const response = await axios.post(url, options.body, {
        headers: _headers,
        withCredentials: withCredentials
      });
      const data = await _formattedResponse(response);

      return data;
    } catch (e) {
      const { errorMessage, serverError, status } = _getErrorMessage(e);
      throw new APIError(errorMessage, serverError, status);
    }
  };

  /**
   * PUT request
   * @param {string} url - API endpoint
   * @param {APIOptions} options - Request options
   * @param {boolean} withCredentials - Include credentials for CORS
   */
  put = async (url, options = DEFAULT_OPTIONS, withCredentials = false) => {
    url = this._prepareURL(url, options);
    const _headers = this._prepareHeaders(options, 'PUT');

    if (options.formData && Object.keys(options.formData).length) {
      const data = new FormData();
      Object.keys(options.formData).forEach(item => {
        data.append(item, options.formData[item]);
      });
      options.body = data;
    }

    try {
      const response = await axios.put(url, options.body, {
        headers: _headers,
        withCredentials: withCredentials
      });
      const data = await _formattedResponse(response);

      return data;
    } catch (e) {
      const { errorMessage, serverError, status } = _getErrorMessage(e);
      throw new APIError(errorMessage, serverError, status);
    }
  };

  /**
   * PATCH request
   * @param {string} url - API endpoint
   * @param {APIOptions} options - Request options
   * @param {boolean} withCredentials - Include credentials for CORS
   */
  patch = async (url, options = DEFAULT_OPTIONS, withCredentials = false) => {
    url = this._prepareURL(url, options);
    const _headers = this._prepareHeaders(options, 'PATCH');

    if (options.formData && Object.keys(options.formData).length) {
      const data = new FormData();
      Object.keys(options.formData).forEach(item => {
        data.append(item, options.formData[item]);
      });
      options.body = data;
    }

    try {
      const response = await axios.patch(url, options.body, {
        headers: _headers,
        withCredentials: withCredentials
      });
      const data = await _formattedResponse(response);

      return data;
    } catch (e) {
      const { errorMessage, serverError, status } = _getErrorMessage(e);
      throw new APIError(errorMessage, serverError, status);
    }
  };

  /**
   * DELETE request
   * @param {string} url - API endpoint
   * @param {APIOptions} options - Request options
   * @param {boolean} withCredentials - Include credentials for CORS
   */
  delete = async (url, options = DEFAULT_OPTIONS, withCredentials = false) => {
    url = this._prepareURL(url, options);
    const _headers = this._prepareHeaders(options, 'DELETE');

    try {
      const response = await axios.delete(url, { 
        headers: _headers,
        withCredentials: withCredentials 
      });
      const data = await _formattedResponse(response);

      return data;
    } catch (e) {
      const { errorMessage, serverError, status } = _getErrorMessage(e);
      throw new APIError(errorMessage, serverError, status);
    }
  };

  /**
   * Prepares URL with path and query parameters
   * @private
   */
  _prepareURL = (url, options = DEFAULT_OPTIONS) => {
    const { queryParams = {}, pathParams = {} } = options;

    // Replace path parameters
    Object.entries(pathParams).forEach(([k, v]) => {
      url = url.replaceAll(`:${k}`, v);
    });

    // Add query parameters
    const params = new URLSearchParams(queryParams);
    const qp = params.toString();

    if (qp) {
      url = url + `?${qp}`;
    }

    return url;
  };

  /**
   * Prepares request headers with authorization token
   * @private
   */
  _prepareHeaders = (options = DEFAULT_OPTIONS, method = 'GET') => {
    const token = localStorage.getItem(this.accessTokenPreferenceKey);
    const headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options?.headers || {})
    };
    
    // 🆕 NEW: Add CSRF token for unsafe methods
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }
    }
    
    return headers;
  };
}

/**
 * Formats axios response to return data
 * @private
 */
const _formattedResponse = async response => {
  return response.data;
};

export { APIService, APIError };