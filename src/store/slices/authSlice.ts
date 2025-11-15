import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginCredentials, AuthResponse } from "@/types";
import { defineAbilityFor } from "@/lib/ability";
import type { AppAbility } from "@/lib/ability";
import { authService } from "@/services/auth.service";

interface AuthStateWithAbility extends AuthState {
  ability: AppAbility;
  loginError: string | null;
  getCurrentUserError: string | null;
  logoutError: string | null;
}

const initialState: AuthStateWithAbility = {
  user: null,
  role: null,
  permissions: {},
  ability: defineAbilityFor({}),
  accessToken: localStorage.getItem("accessToken"),
  loading: false,
  error: null,
  loginError: null,
  getCurrentUserError: null,
  logoutError: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem("accessToken", data.accessToken);
      return data;
    } catch (error) {
      console.error("Login error:", error);
      const err = error as { message?: string };
      const message = err.message || "Đăng nhập thất bại";
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      const err = error as { message?: string };
      const message = err.message || "Không thể lấy thông tin người dùng";
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
      const err = error as { message?: string };
      const message = err.message || "Đăng xuất thất bại";
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

    clearLoginError: (state) => {
      state.loginError = null;
    },

    clearGetCurrentUserError: (state) => {
      state.getCurrentUserError = null;
    },

    clearLogoutError: (state) => {
      state.logoutError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.loginError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
        state.ability = defineAbilityFor(action.payload.permissions);
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload as string;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.getCurrentUserError = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.permissions = action.payload.permissions;
        state.ability = defineAbilityFor(action.payload.permissions);
        state.accessToken = action.payload.accessToken;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.getCurrentUserError = action.payload as string;
        state.user = null;
        state.role = null;
        state.permissions = {};
        state.ability = defineAbilityFor({});
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.permissions = {};
        state.ability = defineAbilityFor({});
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutError = action.payload as string;
        state.user = null;
        state.role = null;
        state.permissions = {};
        state.ability = defineAbilityFor({});
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      });
  },
});

export const { logout, setCredentials, clearLoginError, clearGetCurrentUserError, clearLogoutError } = authSlice.actions;
export default authSlice.reducer;
