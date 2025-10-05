import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import pumpFunReducer from './slices/pumpFunSlice';

// Create a noop storage for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Use localStorage for browser, noop storage for SSR
const storage = typeof window !== 'undefined' 
  ? createWebStorage('local')
  : createNoopStorage();

// Persist configuration
const persistConfig = {
  key: 'pumpfun',
  storage,
  whitelist: ['createdTokens', 'deployedTokens'], // Only persist these fields
};

const persistedReducer = persistReducer(persistConfig, pumpFunReducer);

export const store = configureStore({
  reducer: {
    pumpFun: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
