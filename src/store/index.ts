import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import roleReducer from './slices/roleSlice';
import userReducer from './slices/userSlice';
import genreReducer from './slices/genreSlice';
import directorReducer from './slices/directorSlice';
import actorReducer from './slices/actorSlice';
import countryReducer from './slices/countrySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: roleReducer,
    users: userReducer,
    genres: genreReducer,
    directors: directorReducer,
    actors: actorReducer,
    countries: countryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
