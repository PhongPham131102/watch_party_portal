import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import roleReducer from "./slices/roleSlice";
import userReducer from "./slices/userSlice";
import genreReducer from "./slices/genreSlice";
import directorReducer from "./slices/directorSlice";
import actorReducer from "./slices/actorSlice";
import countryReducer from "./slices/countrySlice";
import movieReducer from "./slices/movieSlice";
import episodeReducer from "./slices/episodeSlice";
import uploadReducer from "./slices/uploadSlice";
import heroSectionReducer from "./slices/heroSectionSlice";
import statisticsReducer from "./slices/statisticsSlice";
import { uploadPersistenceMiddleware } from "./middleware/uploadPersistence";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    roles: roleReducer,
    users: userReducer,
    genres: genreReducer,
    directors: directorReducer,
    actors: actorReducer,
    countries: countryReducer,
    movies: movieReducer,
    episodes: episodeReducer,
    upload: uploadReducer,
    heroSections: heroSectionReducer,
    statistics: statisticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(uploadPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
