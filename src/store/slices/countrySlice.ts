import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { countryService } from "@/services/country.service";
import type { Country, CreateCountryDto, UpdateCountryDto, FetchCountriesParams } from "@/types/country.types";
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

interface CountryState {
  countries: Country[];
  currentCountry: Country | null;
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

const initialState: CountryState = {
  countries: [],
  currentCountry: null,
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
export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async (params: FetchCountriesParams, { rejectWithValue }) => {
    try {
      const response = await countryService.getCountries(params);
      
      // Xử lý response có pagination structure: { data: { data: [], meta: {} } }
      if (response.data && typeof response.data === 'object' && 'data' in response.data && 'meta' in response.data) {
        const paginatedResponse = response.data as { 
          data: Country[]; 
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

export const fetchCountryById = createAsyncThunk(
  "countries/fetchCountryById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await countryService.getCountryById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createCountry = createAsyncThunk(
  "countries/createCountry",
  async (data: CreateCountryDto, { rejectWithValue }) => {
    try {
      const response = await countryService.createCountry(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateCountry = createAsyncThunk(
  "countries/updateCountry",
  async ({ id, data }: { id: string; data: UpdateCountryDto }, { rejectWithValue }) => {
    try {
      const response = await countryService.updateCountry(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteCountry = createAsyncThunk(
  "countries/deleteCountry",
  async (id: string, { rejectWithValue }) => {
    try {
      await countryService.deleteCountry(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const countrySlice = createSlice({
  name: "countries",
  initialState,
  reducers: {
    clearCurrentCountry: (state) => {
      state.currentCountry = null;
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
      // Fetch countries
      .addCase(fetchCountries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.countries = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch country by ID
      .addCase(fetchCountryById.pending, (state) => {
        state.isFetchingDetail = true;
        state.error = null;
      })
      .addCase(fetchCountryById.fulfilled, (state, action: PayloadAction<Country>) => {
        state.isFetchingDetail = false;
        state.currentCountry = action.payload;
      })
      .addCase(fetchCountryById.rejected, (state, action) => {
        state.isFetchingDetail = false;
        state.error = action.payload as string;
      })

      // Create country
      .addCase(createCountry.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createCountry.fulfilled, (state) => {
        state.isCreating = false;
      })
      .addCase(createCountry.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })

      // Update country
      .addCase(updateCountry.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateCountry.fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(updateCountry.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })

      // Delete country
      .addCase(deleteCountry.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteCountry.fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(deleteCountry.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearCurrentCountry, clearErrors } = countrySlice.actions;
export default countrySlice.reducer;

// Hook - nằm trong file slice, KHÔNG tạo file .hooks.ts riêng
export const useCountryStore = () => {
  const countries = useAppSelector((state) => state.countries.countries);
  const currentCountry = useAppSelector((state) => state.countries.currentCountry);
  const total = useAppSelector((state) => state.countries.total);
  const page = useAppSelector((state) => state.countries.page);
  const limit = useAppSelector((state) => state.countries.limit);
  const totalPages = useAppSelector((state) => state.countries.totalPages);
  const isLoading = useAppSelector((state) => state.countries.isLoading);
  const isFetchingDetail = useAppSelector((state) => state.countries.isFetchingDetail);
  const isCreating = useAppSelector((state) => state.countries.isCreating);
  const isUpdating = useAppSelector((state) => state.countries.isUpdating);
  const isDeleting = useAppSelector((state) => state.countries.isDeleting);
  const error = useAppSelector((state) => state.countries.error);
  const createError = useAppSelector((state) => state.countries.createError);
  const updateError = useAppSelector((state) => state.countries.updateError);
  const deleteError = useAppSelector((state) => state.countries.deleteError);
  const dispatch = useAppDispatch();

  return {
    countries,
    currentCountry,
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
    fetchCountries: (params?: FetchCountriesParams) => dispatch(fetchCountries(params || {})),
    fetchCountryById: (id: string) => dispatch(fetchCountryById(id)),
    createCountry: async (data: CreateCountryDto) => {
      const result = await dispatch(createCountry(data));
      return result.meta.requestStatus === "fulfilled";
    },
    updateCountry: async (id: string, data: UpdateCountryDto) => {
      const result = await dispatch(updateCountry({ id, data }));
      return result.meta.requestStatus === "fulfilled";
    },
    deleteCountry: async (id: string) => {
      const result = await dispatch(deleteCountry(id));
      return result.meta.requestStatus === "fulfilled";
    },
    clearCurrentCountry: () => dispatch(clearCurrentCountry()),
    clearErrors: () => dispatch(clearErrors()),
  };
};
