import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer from './auth/authSlice';
import { authApi } from './auth/authApi';

import uiReducer from './ui/uiSlice';
import chatReducer from './chat/chatSlice';

export const store = configureStore({
  reducer: {
    // Auth
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,

    // UI (darkMode, sidebar, model)
    ui: uiReducer,

    // Chat (messages, history, input)
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);
export default store;