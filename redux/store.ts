import { configureStore } from '@reduxjs/toolkit';
import toggleSidebar from './slices/toggleSidebar';

export const store = configureStore({
  reducer: {
    counter: toggleSidebar,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;