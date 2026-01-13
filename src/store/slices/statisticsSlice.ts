import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { statisticsService } from "@/services/statistics.service";
import type { DashboardStats } from "@/types/statistics.types";
import { useAppDispatch, useAppSelector } from "../hooks";
import { useCallback } from "react";

interface StatisticsState {
  dashboard: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  dashboard: null,
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  "statistics/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const data = await statisticsService.getDashboard();
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể tải số liệu thống kê"
      );
    }
  }
);

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    clearStatisticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Đã có lỗi xảy ra";
      });
  },
});

export const { clearStatisticsError } = statisticsSlice.actions;

export const useStatisticsStore = () => {
  const dispatch = useAppDispatch();
  const statisticsState = useAppSelector((state) => state.statistics);

  const loadDashboardStats = useCallback(() => {
    return dispatch(fetchDashboardStats());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearStatisticsError());
  }, [dispatch]);

  return {
    ...statisticsState,
    loadDashboardStats,
    clearError,
  };
};

export default statisticsSlice.reducer;
