import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { actorService } from "@/services/actor.service";
import type { Actor, CreateActorDto, UpdateActorDto, FetchActorsParams } from "@/types/actor.types";
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

interface ActorState {
  actors: Actor[];
  currentActor: Actor | null;
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

const initialState: ActorState = {
  actors: [],
  currentActor: null,
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
export const fetchActors = createAsyncThunk(
  "actors/fetchActors",
  async (params: FetchActorsParams, { rejectWithValue }) => {
    try {
      const response = await actorService.getActors(params);
      
      // Xử lý response có pagination structure: { data: { data: [], meta: {} } }
      if (response.data && typeof response.data === 'object' && 'data' in response.data && 'meta' in response.data) {
        const paginatedResponse = response.data as { 
          data: Actor[]; 
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

export const fetchActorById = createAsyncThunk(
  "actors/fetchActorById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await actorService.getActorById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createActor = createAsyncThunk(
  "actors/createActor",
  async (data: CreateActorDto, { rejectWithValue }) => {
    try {
      const response = await actorService.createActor(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateActor = createAsyncThunk(
  "actors/updateActor",
  async ({ id, data }: { id: string; data: UpdateActorDto }, { rejectWithValue }) => {
    try {
      const response = await actorService.updateActor(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteActor = createAsyncThunk(
  "actors/deleteActor",
  async (id: string, { rejectWithValue }) => {
    try {
      await actorService.deleteActor(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const actorSlice = createSlice({
  name: "actors",
  initialState,
  reducers: {
    clearCurrentActor: (state) => {
      state.currentActor = null;
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
      // Fetch actors
      .addCase(fetchActors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchActors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.actors = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchActors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch actor by ID
      .addCase(fetchActorById.pending, (state) => {
        state.isFetchingDetail = true;
        state.error = null;
      })
      .addCase(fetchActorById.fulfilled, (state, action: PayloadAction<Actor>) => {
        state.isFetchingDetail = false;
        state.currentActor = action.payload;
      })
      .addCase(fetchActorById.rejected, (state, action) => {
        state.isFetchingDetail = false;
        state.error = action.payload as string;
      })

      // Create actor
      .addCase(createActor.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createActor.fulfilled, (state) => {
        state.isCreating = false;
      })
      .addCase(createActor.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })

      // Update actor
      .addCase(updateActor.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateActor.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(updateActor.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })

      // Delete actor
      .addCase(deleteActor.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteActor.fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(deleteActor.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearCurrentActor, clearErrors } = actorSlice.actions;
export default actorSlice.reducer;

// Hook - nằm trong file slice, KHÔNG tạo file .hooks.ts riêng
export const useActorStore = () => {
  const actors = useAppSelector((state) => state.actors.actors);
  const currentActor = useAppSelector((state) => state.actors.currentActor);
  const total = useAppSelector((state) => state.actors.total);
  const page = useAppSelector((state) => state.actors.page);
  const limit = useAppSelector((state) => state.actors.limit);
  const totalPages = useAppSelector((state) => state.actors.totalPages);
  const isLoading = useAppSelector((state) => state.actors.isLoading);
  const isFetchingDetail = useAppSelector((state) => state.actors.isFetchingDetail);
  const isCreating = useAppSelector((state) => state.actors.isCreating);
  const isUpdating = useAppSelector((state) => state.actors.isUpdating);
  const isDeleting = useAppSelector((state) => state.actors.isDeleting);
  const error = useAppSelector((state) => state.actors.error);
  const createError = useAppSelector((state) => state.actors.createError);
  const updateError = useAppSelector((state) => state.actors.updateError);
  const deleteError = useAppSelector((state) => state.actors.deleteError);
  const dispatch = useAppDispatch();

  return {
    actors,
    currentActor,
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
    fetchActors: (params?: FetchActorsParams) => dispatch(fetchActors(params || {})),
    fetchActorById: (id: string) => dispatch(fetchActorById(id)),
    createActor: async (data: CreateActorDto) => {
      const result = await dispatch(createActor(data));
      return result.meta.requestStatus === "fulfilled";
    },
    updateActor: async (id: string, data: UpdateActorDto) => {
      const result = await dispatch(updateActor({ id, data }));
      return result.meta.requestStatus === "fulfilled";
    },
    deleteActor: async (id: string) => {
      const result = await dispatch(deleteActor(id));
      return result.meta.requestStatus === "fulfilled";
    },
    clearCurrentActor: () => dispatch(clearCurrentActor()),
    clearErrors: () => dispatch(clearErrors()),
  };
};
