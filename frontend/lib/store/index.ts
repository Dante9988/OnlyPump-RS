import { configureStore } from '@reduxjs/toolkit';
import pumpFunReducer from './slices/pumpFunSlice';

export const store = configureStore({
  reducer: {
    pumpFun: pumpFunReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
