import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginCredentials, AuthResponse } from "@/types";
import { defineAbilityFor } from "@/lib/ability";
import type { AppAbility } from "@/lib/ability";
import { authService } from "@/services/auth.service";

interface AuthStateWithAbility extends AuthState {
  ability: AppAbility;
}

const initialState: AuthStateWithAbility = {
  user: null,
  role: null,
  permissions: {},
  ability: defineAbilityFor({}),
  accessToken: localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem("accessToken", data.accessToken);
      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Failed to get user";
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      console.error("Logout error:", error);
      const message =
        error.response?.data?.message || error.message || "Logout failed";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.permissions = {};
      state.ability = defineAbilityFor({});
      state.accessToken = null;
      localStorage.removeItem("accessToken");
    },

    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.permissions = action.payload.permissions;
      state.ability = defineAbilityFor(action.payload.permissions);
      state.accessToken = action.payload.accessToken;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
        state.ability = defineAbilityFor(action.payload.permissions);
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, _action) => {
        state.loading = false;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
        state.ability = defineAbilityFor(action.payload.permissions);
        state.accessToken = action.payload.accessToken;
      })
      .addCase(getCurrentUser.rejected, (state, _action) => {
        state.loading = false;
        state.user = null;
        state.role = null;
        state.permissions = {};
        state.ability = defineAbilityFor({});
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.permissions = {};
        state.ability = defineAbilityFor({});
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.role = null;
        state.permissions = {};
        state.ability = defineAbilityFor({});
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
