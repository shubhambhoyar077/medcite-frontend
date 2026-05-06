import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: true,
  isSidebarMinimized: false,
  selectedModelId: '1',

  //Modal State
  modals: {
    profile: false,
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    setDarkMode(state, action) {
      state.darkMode = action.payload;
    },
    toggleSidebar(state) {
      state.isSidebarMinimized = !state.isSidebarMinimized;
    },
    setSidebarMinimized(state, action) {
      state.isSidebarMinimized = action.payload;
    },
    setSelectedModel(state, action) {
      state.selectedModelId = action.payload;
    },
     /* ── Modal handlers ── */
    openModal(state, action) {
      const modalName = action.payload;
      if (state.modals[modalName] !== undefined) {
        state.modals[modalName] = true;
      }
    },
    closeModal(state, action) {
      const modalName = action.payload;
      if (state.modals[modalName] !== undefined) {
        state.modals[modalName] = false;
      }
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarMinimized,
  setSelectedModel,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;

/* ── Selectors ── */
export const selectDarkMode          = (state) => state.ui.darkMode;
export const selectSidebarMinimized  = (state) => state.ui.isSidebarMinimized;
export const selectSelectedModelId   = (state) => state.ui.selectedModelId;

// modal selector
export const selectModal = (modalName) => (state) =>
  state.ui.modals[modalName];