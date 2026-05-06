export const BASE_URL = import.meta.env.VITE_BASE_URL;

// Auth endpoints
const AUTH_URL = BASE_URL + '/api/accounts';
export const AUTH = {
    USER_REGISTRATION: AUTH_URL + '/register/',
    USER_LOGIN: AUTH_URL + '/login/',
    USER_LOGOUT: AUTH_URL + '/logout/',
    REFRESH_ACCESS_TOKEN: AUTH_URL + '/token/refresh/',
    CURRENT_USER: AUTH_URL + '/me/',
    FORGOT_PASSWORD: AUTH_URL + '/forgot-password/',
    VALIDATE_SET_PASSWORD_TOKEN: AUTH_URL + '/set-password/:uid/validate-token/',
    SET_PASSWORD: AUTH_URL + '/set-password/:uid/',
    UPDATE_USER: AUTH_URL + '/profile/:userId/',
};