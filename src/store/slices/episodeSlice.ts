import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { episodeService } from "@/services/episode.service";
import type {
  Episode,
  UpdateEpisodeDto,
  FetchEpisodesParams,
} from "@/types/episode.types";
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

interface EpisodeState {
  episodes: Episode[];
  currentEpisode: Episode | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isFetchingDetail: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: EpisodeState = {
  episodes: [],
  currentEpisode: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
  isLoading: false,
  isFetchingDetail: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  updateError: null,
  deleteError: null,
};

// Async thunks
export const fetchEpisodes = createAsyncThunk(
  "episodes/fetchEpisodes",
  async (params: FetchEpisodesParams, { rejectWithValue }) => {
    try {
      const response = await episodeService.getEpisodes(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchEpisodeById = createAsyncThunk(
  "episodes/fetchEpisodeById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await episodeService.getEpisodeById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateEpisode = createAsyncThunk(
  "episodes/updateEpisode",
  async ({ id, data }: { id: string; data: UpdateEpisodeDto }, { rejectWithValue }) => {
    try {
      const response = await episodeService.updateEpisode(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteEpisode = createAsyncThunk(
  "episodes/deleteEpisode",
  async (id: string, { rejectWithValue }) => {
    try {
      await episodeService.deleteEpisode(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const episodeSlice = createSlice({
  name: "episodes",
  initialState,
  reducers: {
    clearCurrentEpisode: (state) => {
      state.currentEpisode = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch episodes
      .addCase(fetchEpisodes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.episodes = action.payload.data;
        state.total = action.payload.meta.total;
        state.page = action.payload.meta.page;
        state.limit = action.payload.meta.limit;
        state.totalPages = action.payload.meta.totalPages;
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch episode by ID
      .addCase(fetchEpisodeById.pending, (state) => {
        state.isFetchingDetail = true;
        state.error = null;
      })
      .addCase(fetchEpisodeById.fulfilled, (state, action: PayloadAction<Episode>) => {
        state.isFetchingDetail = false;
        state.currentEpisode = action.payload;
      })
      .addCase(fetchEpisodeById.rejected, (state, action) => {
        state.isFetchingDetail = false;
        state.error = action.payload as string;
      })

      // Update episode
      .addCase(updateEpisode.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateEpisode.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(updateEpisode.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })

      // Delete episode
      .addCase(deleteEpisode.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteEpisode.fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(deleteEpisode.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearCurrentEpisode, clearErrors } = episodeSlice.actions;
export default episodeSlice.reducer;

// Custom hook
export const useEpisodeStore = () => {
  const episodes = useAppSelector((state) => state.episodes.episodes);
  const currentEpisode = useAppSelector((state) => state.episodes.currentEpisode);
  const total = useAppSelector((state) => state.episodes.total);
  const page = useAppSelector((state) => state.episodes.page);
  const limit = useAppSelector((state) => state.episodes.limit);
  const totalPages = useAppSelector((state) => state.episodes.totalPages);
  const isLoading = useAppSelector((state) => state.episodes.isLoading);
  const isFetchingDetail = useAppSelector((state) => state.episodes.isFetchingDetail);
  const isUpdating = useAppSelector((state) => state.episodes.isUpdating);
  const isDeleting = useAppSelector((state) => state.episodes.isDeleting);
  const error = useAppSelector((state) => state.episodes.error);
  const updateError = useAppSelector((state) => state.episodes.updateError);
  const deleteError = useAppSelector((state) => state.episodes.deleteError);
  const dispatch = useAppDispatch();

  return {
    episodes,
    currentEpisode,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    isFetchingDetail,
    isUpdating,
    isDeleting,
    error,
    updateError,
    deleteError,
    fetchEpisodes: (params?: FetchEpisodesParams) => dispatch(fetchEpisodes(params || {})),
    fetchEpisodeById: (id: string) => dispatch(fetchEpisodeById(id)),
    updateEpisode: async (id: string, data: UpdateEpisodeDto) => {
      const result = await dispatch(updateEpisode({ id, data }));
      return result.meta.requestStatus === "fulfilled";
    },
    deleteEpisode: async (id: string) => {
      const result = await dispatch(deleteEpisode(id));
      return result.meta.requestStatus === "fulfilled";
    },
    clearCurrentEpisode: () => dispatch(clearCurrentEpisode()),
    clearErrors: () => dispatch(clearErrors()),
  };
};

