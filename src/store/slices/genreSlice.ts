import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { genreService } from "@/services/genre.service";
import type { Genre, CreateGenreDto, UpdateGenreDto, FetchGenresParams } from "@/types/genre.types";
import { getErrorMessage } from "@/constants/errorCodes";
import { useAppDispatch, useAppSelector } from "../hooks";

// Helper function to handle API errors
function handleApiError(error: unknown): string {
  if (error && typeof error === 'object' && 'errorCode' in error) {
    return getErrorMessage((error as { errorCode: string }).errorCode);
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'Có lỗi xảy ra';
}

interface GenreState {
  genres: Genre[];
  currentGenre: Genre | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isFetchingDetail: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: GenreState = {
  genres: [],
  currentGenre: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  isLoading: false,
  isFetchingDetail: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

// Async thunks
export const fetchGenres = createAsyncThunk(
  "genres/fetchGenres",
  async (params: FetchGenresParams, { rejectWithValue }) => {
    try {
      const response = await genreService.getGenres(params);
      
      // Check if response has pagination structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data && 'pagination' in response.data) {
        const paginatedResponse = response.data as { data: Genre[]; pagination: { total: number; page: number; limit: number; totalPages: number } };
        return {
          data: paginatedResponse.data,
          total: paginatedResponse.pagination.total,
          page: paginatedResponse.pagination.page,
          limit: paginatedResponse.pagination.limit,
          totalPages: paginatedResponse.pagination.totalPages,
        };
      }

      // Fallback: if response.data is an array directly
      const genres = Array.isArray(response.data) ? response.data : [];
      return {
        data: genres,
        total: genres.length,
        page: params.page || 1,
        limit: params.limit || 20,
        totalPages: 1,
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchGenreById = createAsyncThunk(
  "genres/fetchGenreById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await genreService.getGenreById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createGenre = createAsyncThunk(
  "genres/createGenre",
  async (data: CreateGenreDto, { rejectWithValue }) => {
    try {
      const response = await genreService.createGenre(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateGenre = createAsyncThunk(
  "genres/updateGenre",
  async ({ id, data }: { id: string; data: UpdateGenreDto }, { rejectWithValue }) => {
    try {
      const response = await genreService.updateGenre(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteGenre = createAsyncThunk(
  "genres/deleteGenre",
  async (id: string, { rejectWithValue }) => {
    try {
      await genreService.deleteGenre(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const genreSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {
    clearCurrentGenre: (state) => {
      state.currentGenre = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch genres
      .addCase(fetchGenres.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.isLoading = false;
        state.genres = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch genre by ID
      .addCase(fetchGenreById.pending, (state) => {
        state.isFetchingDetail = true;
        state.error = null;
      })
      .addCase(fetchGenreById.fulfilled, (state, action: PayloadAction<Genre>) => {
        state.isFetchingDetail = false;
        state.currentGenre = action.payload;
      })
      .addCase(fetchGenreById.rejected, (state, action) => {
        state.isFetchingDetail = false;
        state.error = action.payload as string;
      })

      // Create genre
      .addCase(createGenre.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createGenre.fulfilled, (state) => {
        state.isCreating = false;
      })
      .addCase(createGenre.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })

      // Update genre
      .addCase(updateGenre.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateGenre.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(updateGenre.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })

      // Delete genre
      .addCase(deleteGenre.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteGenre.fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(deleteGenre.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearCurrentGenre, clearErrors } = genreSlice.actions;
export default genreSlice.reducer;

// Hook
export const useGenreStore = () => {
  const genres = useAppSelector((state) => state.genres.genres);
  const currentGenre = useAppSelector((state) => state.genres.currentGenre);
  const total = useAppSelector((state) => state.genres.total);
  const page = useAppSelector((state) => state.genres.page);
  const limit = useAppSelector((state) => state.genres.limit);
  const totalPages = useAppSelector((state) => state.genres.totalPages);
  const isLoading = useAppSelector((state) => state.genres.isLoading);
  const isFetchingDetail = useAppSelector((state) => state.genres.isFetchingDetail);
  const isCreating = useAppSelector((state) => state.genres.isCreating);
  const isUpdating = useAppSelector((state) => state.genres.isUpdating);
  const isDeleting = useAppSelector((state) => state.genres.isDeleting);
  const error = useAppSelector((state) => state.genres.error);
  const createError = useAppSelector((state) => state.genres.createError);
  const updateError = useAppSelector((state) => state.genres.updateError);
  const deleteError = useAppSelector((state) => state.genres.deleteError);
  const dispatch = useAppDispatch();

  return {
    genres,
    currentGenre,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    isFetchingDetail,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    fetchGenres: (params?: FetchGenresParams) => dispatch(fetchGenres(params || {})),
    fetchGenreById: (id: string) => dispatch(fetchGenreById(id)),
    createGenre: async (data: CreateGenreDto) => {
      const result = await dispatch(createGenre(data));
      return result.meta.requestStatus === "fulfilled";
    },
    updateGenre: async (id: string, data: UpdateGenreDto) => {
      const result = await dispatch(updateGenre({ id, data }));
      return result.meta.requestStatus === "fulfilled";
    },
    deleteGenre: async (id: string) => {
      const result = await dispatch(deleteGenre(id));
      return result.meta.requestStatus === "fulfilled";
    },
    clearCurrentGenre: () => dispatch(clearCurrentGenre()),
    clearErrors: () => dispatch(clearErrors()),
  };
};
