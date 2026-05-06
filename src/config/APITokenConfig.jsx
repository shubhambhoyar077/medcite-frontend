/**
 * API Token Configuration Helper
 * Returns the current authentication token key from localStorage
 */

import { ACCESS_TOKEN, EXPIRES_AT } from "../constants/PreferenceKeys";

/**
 * Get the current authentication token key
 * This function is used by APIService to know which key to use for token storage
 */
export const currentAuthenticationToken = () => {
  return ACCESS_TOKEN;
};

/**
 * Get the current authentication token value
 */
export const getAuthToken = () => {
  return localStorage.getItem(ACCESS_TOKEN);
};

/**
 * Get the token expiration time
 */
export const getTokenExpiry = () => {
  return localStorage.getItem(EXPIRES_AT);
};

/**
 * Check if token is expired
 */
export const isTokenExpired = () => {
  const expiresAt = getTokenExpiry();
  if (!expiresAt) return true;
  
  const expirationTime = new Date(expiresAt).getTime();
  const currentTime = new Date().getTime();
  
  return currentTime >= expirationTime;
};

/**
 * Check if token needs refresh (expires in less than 5 minutes)
 */
export const shouldRefreshToken = () => {
  const expiresAt = getTokenExpiry();
  if (!expiresAt) return false;
  
  const expirationTime = new Date(expiresAt).getTime();
  const currentTime = new Date().getTime();
  const timeUntilExpiry = expirationTime - currentTime;
  
  // Refresh if less than 5 minutes until expiry
  const refreshThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  return timeUntilExpiry < refreshThreshold;
};