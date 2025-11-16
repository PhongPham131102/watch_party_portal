import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { directorService } from "@/services/director.service";
import type { Director, CreateDirectorDto, UpdateDirectorDto, FetchDirectorsParams } from "@/types/director.types";
import { getErrorMessage } from "@/constants/errorCodes";
import { useAppDispatch, useAppSelector } from "../hooks";

// Helper function
function handleApiError(error: unknown): string {
  if (error && typeof error === 'object' && 'errorCode' in error) {
    return getErrorMessage((error as { errorCode: string }).errorCode);
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'Có lỗi xảy ra';
}

interface DirectorState {
  directors: Director[];
  currentDirector: Director | null;
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

const initialState: DirectorState = {
  directors: [],
  currentDirector: null,
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
export const fetchDirectors = createAsyncThunk(
  "directors/fetchDirectors",
  async (params: FetchDirectorsParams, { rejectWithValue }) => {
    try {
      const response = await directorService.getDirectors(params);
      
      // Xử lý response có pagination structure: { data: { data: [], meta: {} } }
      if (response.data && typeof response.data === 'object' && 'data' in response.data && 'meta' in response.data) {
        const paginatedResponse = response.data as { 
          data: Director[]; 
          meta: { total: number; page: number; limit: number; totalPages: number } 
        };
        return {
          data: paginatedResponse.data,
          total: paginatedResponse.meta.total,
          page: paginatedResponse.meta.page,
          limit: paginatedResponse.meta.limit,
          totalPages: paginatedResponse.meta.totalPages,
        };
      }

      // Fallback: nếu response.data là array
      const items = Array.isArray(response.data) ? response.data : [];
      return {
        data: items,
        total: items.length,
        page: params.page || 1,
        limit: params.limit || 20,
        totalPages: 1,
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchDirectorById = createAsyncThunk(
  "directors/fetchDirectorById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await directorService.getDirectorById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createDirector = createAsyncThunk(
  "directors/createDirector",
  async (data: CreateDirectorDto, { rejectWithValue }) => {
    try {
      const response = await directorService.createDirector(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateDirector = createAsyncThunk(
  "directors/updateDirector",
  async ({ id, data }: { id: string; data: UpdateDirectorDto }, { rejectWithValue }) => {
    try {
      const response = await directorService.updateDirector(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteDirector = createAsyncThunk(
  "directors/deleteDirector",
  async (id: string, { rejectWithValue }) => {
    try {
      await directorService.deleteDirector(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const directorSlice = createSlice({
  name: "directors",
  initialState,
  reducers: {
    clearCurrentDirector: (state) => {
      state.currentDirector = null;
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
      // Fetch directors
      .addCase(fetchDirectors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDirectors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.directors = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchDirectors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch director by ID
      .addCase(fetchDirectorById.pending, (state) => {
        state.isFetchingDetail = true;
        state.error = null;
      })
      .addCase(fetchDirectorById.fulfilled, (state, action: PayloadAction<Director>) => {
        state.isFetchingDetail = false;
        state.currentDirector = action.payload;
      })
      .addCase(fetchDirectorById.rejected, (state, action) => {
        state.isFetchingDetail = false;
        state.error = action.payload as string;
      })

      // Create director
      .addCase(createDirector.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createDirector.fulfilled, (state) => {
        state.isCreating = false;
      })
      .addCase(createDirector.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })

      // Update director
      .addCase(updateDirector.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateDirector.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(updateDirector.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })

      // Delete director
      .addCase(deleteDirector.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteDirector.fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(deleteDirector.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearCurrentDirector, clearErrors } = directorSlice.actions;
export default directorSlice.reducer;

// Hook - nằm trong file slice, KHÔNG tạo file .hooks.ts riêng
export const useDirectorStore = () => {
  const directors = useAppSelector((state) => state.directors.directors);
  const currentDirector = useAppSelector((state) => state.directors.currentDirector);
  const total = useAppSelector((state) => state.directors.total);
  const page = useAppSelector((state) => state.directors.page);
  const limit = useAppSelector((state) => state.directors.limit);
  const totalPages = useAppSelector((state) => state.directors.totalPages);
  const isLoading = useAppSelector((state) => state.directors.isLoading);
  const isFetchingDetail = useAppSelector((state) => state.directors.isFetchingDetail);
  const isCreating = useAppSelector((state) => state.directors.isCreating);
  const isUpdating = useAppSelector((state) => state.directors.isUpdating);
  const isDeleting = useAppSelector((state) => state.directors.isDeleting);
  const error = useAppSelector((state) => state.directors.error);
  const createError = useAppSelector((state) => state.directors.createError);
  const updateError = useAppSelector((state) => state.directors.updateError);
  const deleteError = useAppSelector((state) => state.directors.deleteError);
  const dispatch = useAppDispatch();

  return {
    directors,
    currentDirector,
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
    fetchDirectors: (params?: FetchDirectorsParams) => dispatch(fetchDirectors(params || {})),
    fetchDirectorById: (id: string) => dispatch(fetchDirectorById(id)),
    createDirector: async (data: CreateDirectorDto) => {
      const result = await dispatch(createDirector(data));
      return result.meta.requestStatus === "fulfilled";
    },
    updateDirector: async (id: string, data: UpdateDirectorDto) => {
      const result = await dispatch(updateDirector({ id, data }));
      return result.meta.requestStatus === "fulfilled";
    },
    deleteDirector: async (id: string) => {
      const result = await dispatch(deleteDirector(id));
      return result.meta.requestStatus === "fulfilled";
    },
    clearCurrentDirector: () => dispatch(clearCurrentDirector()),
    clearErrors: () => dispatch(clearErrors()),
  };
};
