import { configureStore } from '@reduxjs/toolkit';
import { compCodeReducer, loginReducer } from './slices';

export const store = configureStore({
  reducer: {
    compCode: compCodeReducer,
    isLoggedIn: loginReducer
  },
});

// Inferred types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
