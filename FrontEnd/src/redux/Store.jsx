// import { configureStore } from '@reduxjs/toolkit'
// import AuthSlice from './features/AuthSlice.jsx'
// import JobSlice from './features/JobSlice.jsx' 

// export const store = configureStore({
//   reducer: {
//     auth: AuthSlice,
//     jobs: JobSlice, 
//   }
// })

// src/redux/Store.jsx
import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './features/AuthSlice.jsx';
import JobSlice from './features/JobSlice.jsx';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'] // only persist user
};

const persistedAuthReducer = persistReducer(authPersistConfig, AuthSlice);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    jobs: JobSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);
