import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { heroSectionService } from "@/services/hero-section.service";
import type {
  HeroSection,
  CreateHeroSectionDto,
  UpdateHeroSectionDto,
  FetchHeroSectionsParams,
} from "@/types/hero-section.types";
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

interface HeroSectionState {
  heroSections: HeroSection[];
  currentHeroSection: HeroSection | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isFetchingDetail: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isReordering: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  reorderError: string | null;
}

const initialState: HeroSectionState = {
  heroSections: [],
  currentHeroSection: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  isLoading: false,
  isFetchingDetail: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isReordering: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  reorderError: null,
};

// Async thunks
export const fetchHeroSections = createAsyncThunk(
  "heroSections/fetchHeroSections",
  async (params: FetchHeroSectionsParams, { rejectWithValue }) => {
    try {
      const response = await heroSectionService.getHeroSections(params);
      
      // Check if response has pagination structure
      if (response.data && typeof response.data === 'object' && 'data' in response.data && 'meta' in response.data) {
        const paginatedResponse = response.data as { data: HeroSection[]; meta: { total: number; page: number; limit: number; totalPages: number } };
        return {
          data: paginatedResponse.data,
          total: paginatedResponse.meta.total,
          page: paginatedResponse.meta.page,
          limit: paginatedResponse.meta.limit,
          totalPages: paginatedResponse.meta.totalPages,
        };
      }

      // Fallback: if response.data is an array directly
      const heroSections = Array.isArray(response.data) ? response.data : [];
      return {
        data: heroSections,
        total: heroSections.length,
        page: params.page || 1,
        limit: params.limit || 20,
        totalPages: 1,
      };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchHeroSectionById = createAsyncThunk(
  "heroSections/fetchHeroSectionById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await heroSectionService.getHeroSectionById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createHeroSection = createAsyncThunk(
  "heroSections/createHeroSection",
  async (data: CreateHeroSectionDto, { rejectWithValue }) => {
    try {
      const response = await heroSectionService.createHeroSection(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateHeroSection = createAsyncThunk(
  "heroSections/updateHeroSection",
  async ({ id, data }: { id: string; data: UpdateHeroSectionDto }, { rejectWithValue }) => {
    try {
      const response = await heroSectionService.updateHeroSection(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const reorderHeroSection = createAsyncThunk(
  "heroSections/reorderHeroSection",
  async ({ id, order }: { id: string; order: number }, { rejectWithValue }) => {
    try {
      const response = await heroSectionService.reorderHeroSection(id, order);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteHeroSection = createAsyncThunk(
  "heroSections/deleteHeroSection",
  async (id: string, { rejectWithValue }) => {
    try {
      await heroSectionService.deleteHeroSection(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const heroSectionSlice = createSlice({
  name: "heroSections",
  initialState,
  reducers: {
    clearCurrentHeroSection: (state) => {
      state.currentHeroSection = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
      state.reorderError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch hero sections
      .addCase(fetchHeroSections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHeroSections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.heroSections = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchHeroSections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch hero section by ID
      .addCase(fetchHeroSectionById.pending, (state) => {
        state.isFetchingDetail = true;
        state.error = null;
      })
      .addCase(fetchHeroSectionById.fulfilled, (state, action: PayloadAction<HeroSection>) => {
        state.isFetchingDetail = false;
        state.currentHeroSection = action.payload;
      })
      .addCase(fetchHeroSectionById.rejected, (state, action) => {
        state.isFetchingDetail = false;
        state.error = action.payload as string;
      })

      // Create hero section
      .addCase(createHeroSection.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createHeroSection.fulfilled, (state) => {
        state.isCreating = false;
      })
      .addCase(createHeroSection.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })

      // Update hero section
      .addCase(updateHeroSection.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateHeroSection.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(updateHeroSection.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })

      // Reorder hero section
      .addCase(reorderHeroSection.pending, (state) => {
        state.isReordering = true;
        state.reorderError = null;
      })
      .addCase(reorderHeroSection.fulfilled, (state) => {
        state.isReordering = false;
      })
      .addCase(reorderHeroSection.rejected, (state, action) => {
        state.isReordering = false;
        state.reorderError = action.payload as string;
      })

      // Delete hero section
      .addCase(deleteHeroSection.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteHeroSection.fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(deleteHeroSection.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearCurrentHeroSection, clearErrors } = heroSectionSlice.actions;
export default heroSectionSlice.reducer;

// Hook
export const useHeroSectionStore = () => {
  const heroSections = useAppSelector((state) => state.heroSections.heroSections);
  const currentHeroSection = useAppSelector((state) => state.heroSections.currentHeroSection);
  const total = useAppSelector((state) => state.heroSections.total);
  const page = useAppSelector((state) => state.heroSections.page);
  const limit = useAppSelector((state) => state.heroSections.limit);
  const totalPages = useAppSelector((state) => state.heroSections.totalPages);
  const isLoading = useAppSelector((state) => state.heroSections.isLoading);
  const isFetchingDetail = useAppSelector((state) => state.heroSections.isFetchingDetail);
  const isCreating = useAppSelector((state) => state.heroSections.isCreating);
  const isUpdating = useAppSelector((state) => state.heroSections.isUpdating);
  const isDeleting = useAppSelector((state) => state.heroSections.isDeleting);
  const isReordering = useAppSelector((state) => state.heroSections.isReordering);
  const error = useAppSelector((state) => state.heroSections.error);
  const createError = useAppSelector((state) => state.heroSections.createError);
  const updateError = useAppSelector((state) => state.heroSections.updateError);
  const deleteError = useAppSelector((state) => state.heroSections.deleteError);
  const reorderError = useAppSelector((state) => state.heroSections.reorderError);
  const dispatch = useAppDispatch();

  return {
    heroSections,
    currentHeroSection,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    isFetchingDetail,
    isCreating,
    isUpdating,
    isDeleting,
    isReordering,
    error,
    createError,
    updateError,
    deleteError,
    reorderError,
    fetchHeroSections: (params?: FetchHeroSectionsParams) => dispatch(fetchHeroSections(params || {})),
    fetchHeroSectionById: (id: string) => dispatch(fetchHeroSectionById(id)),
    createHeroSection: async (data: CreateHeroSectionDto) => {
      const result = await dispatch(createHeroSection(data));
      return result.meta.requestStatus === "fulfilled";
    },
    updateHeroSection: async (id: string, data: UpdateHeroSectionDto) => {
      const result = await dispatch(updateHeroSection({ id, data }));
      return result.meta.requestStatus === "fulfilled";
    },
    reorderHeroSection: async (id: string, order: number) => {
      const result = await dispatch(reorderHeroSection({ id, order }));
      return result.meta.requestStatus === "fulfilled";
    },
    deleteHeroSection: async (id: string) => {
      const result = await dispatch(deleteHeroSection(id));
      return result.meta.requestStatus === "fulfilled";
    },
    clearCurrentHeroSection: () => dispatch(clearCurrentHeroSection()),
    clearErrors: () => dispatch(clearErrors()),
  };
};

