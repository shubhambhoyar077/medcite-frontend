/**
 * Auth Token Helpers
 *
 * Tokens are now stored in HttpOnly cookies managed entirely by the server.
 * JavaScript cannot read them — that's the security benefit.
 *
 * These helpers exist only to answer the question "is the user likely
 * authenticated?" based on Redux state. Import from authSlice selectors
 * wherever possible; use these only outside of React components.
 */

/**
 * Returns true if the Redux auth state has a user.
 * Import the Redux store and call this outside of React if needed.
 *
 * Inside React components, use:
 *   const isAuthenticated = useSelector(selectIsAuthenticated);
 */
export const isAuthenticated = (store) => {
  return store.getState().auth.isAuthenticated;
};

/**
 * Returns the current user object from Redux state.
 * Inside React components use selectCurrentUser selector directly.
 */
export const getCurrentUser = (store) => {
  return store.getState().auth.user;
};