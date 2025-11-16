import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { movieService } from "@/services/movie.service";
import type {
  Movie,
  CreateMovieDto,
  UpdateMovieDto,
  FetchMoviesParams,
} from "@/types/movie.types";
import { showToast } from "@/lib/toast";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";

interface MovieState {
  movies: Movie[];
  currentMovie: Movie | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

const initialState: MovieState = {
  movies: [],
  currentMovie: null,
  loading: false,
  error: null,
  totalPages: 0,
  totalItems: 0,
  currentPage: 1,
};

// Async thunks
export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (params: FetchMoviesParams) => {
    const response = await movieService.getMovies(params);
    return response.data;
  }
);

export const fetchMovieById = createAsyncThunk(
  "movies/fetchMovieById",
  async (id: string) => {
    const response = await movieService.getMovieById(id);
    return response.data;
  }
);

export const createMovie = createAsyncThunk(
  "movies/createMovie",
  async (data: CreateMovieDto, { rejectWithValue }) => {
    try {
      const response = await movieService.createMovie(data);
      showToast.success("Tạo phim thành công");
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast.error(err.response?.data?.message || "Tạo phim thất bại");
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateMovie = createAsyncThunk(
  "movies/updateMovie",
  async (
    { id, data }: { id: string; data: UpdateMovieDto },
    { rejectWithValue }
  ) => {
    try {
      const response = await movieService.updateMovie(id, data);
      showToast.success("Cập nhật phim thành công");
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast.error(err.response?.data?.message || "Cập nhật phim thất bại");
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteMovie = createAsyncThunk(
  "movies/deleteMovie",
  async (id: string, { rejectWithValue }) => {
    try {
      await movieService.deleteMovie(id);
      showToast.success("Xóa phim thành công");
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      showToast.error(err.response?.data?.message || "Xóa phim thất bại");
      return rejectWithValue(err.response?.data);
    }
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.data;
        state.totalPages = action.payload.meta.totalPages;
        state.totalItems = action.payload.meta.total;
        state.currentPage = action.payload.meta.page;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể tải danh sách phim";
      })
      // Fetch movie by id
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể tải thông tin phim";
      })
      // Create movie
      .addCase(createMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies.unshift(action.payload);
      })
      .addCase(createMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể tạo phim";
      })
      // Update movie
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.movies.findIndex(
          (movie) => movie.id === action.payload.id
        );
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
        if (state.currentMovie?.id === action.payload.id) {
          state.currentMovie = action.payload;
        }
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể cập nhật phim";
      })
      // Delete movie
      .addCase(deleteMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = state.movies.filter(
          (movie) => movie.id !== action.payload
        );
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Không thể xóa phim";
      });
  },
});

export const { clearCurrentMovie, clearError } = movieSlice.actions;

// Custom hook for using movie store
export const useMovieStore = () => {
  const dispatch = useAppDispatch();
  const movieState = useAppSelector((state) => state.movies);

  const loadMovies = useCallback(
    (params: FetchMoviesParams) => {
      return dispatch(fetchMovies(params));
    },
    [dispatch]
  );

  const loadMovieById = useCallback(
    (id: string) => {
      return dispatch(fetchMovieById(id));
    },
    [dispatch]
  );

  const addMovie = useCallback(
    (data: CreateMovieDto) => {
      return dispatch(createMovie(data));
    },
    [dispatch]
  );

  const modifyMovie = useCallback(
    (id: string, data: UpdateMovieDto) => {
      return dispatch(updateMovie({ id, data }));
    },
    [dispatch]
  );

  const removeMovie = useCallback(
    (id: string) => {
      return dispatch(deleteMovie(id));
    },
    [dispatch]
  );

  const clearMovie = useCallback(() => {
    dispatch(clearCurrentMovie());
  }, [dispatch]);

  const clearMovieError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...movieState,
    loadMovies,
    loadMovieById,
    addMovie,
    modifyMovie,
    removeMovie,
    clearMovie,
    clearMovieError,
  };
};

export default movieSlice.reducer;
