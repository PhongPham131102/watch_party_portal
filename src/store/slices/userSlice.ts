import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../hooks";
import { userService } from "@/services/user.service";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  PaginatedUsers,
} from "@/services/user.service";

interface UserState {
  users: User[];
  currentUser: User | null;
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
  fetchDetailError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  isLoading: false,
  isFetchingDetail: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  fetchDetailError: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    params: { page?: number; limit?: number; search?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.getUsers(params?.page, params?.limit, params?.search);
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (user: CreateUserDto, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(user);
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to create user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { id, user }: { id: string; user: UpdateUserDto },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.updateUser(id, user);
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const toggleUserActive = createAsyncThunk(
  "users/toggleUserActive",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userService.toggleUserActive(id);
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle user status"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFetchDetailError: (state) => {
      state.fetchDetailError = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
          state.users = action.payload;
          state.total = action.payload.length;
        } else {
          const paginatedData = action.payload as PaginatedUsers;
          state.users = paginatedData.data;
          state.total = paginatedData.total;
          state.page = paginatedData.page;
          state.limit = paginatedData.limit;
          state.totalPages = paginatedData.totalPages;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.isFetchingDetail = true;
        state.fetchDetailError = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.isFetchingDetail = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isFetchingDetail = false;
        state.fetchDetailError = action.payload as string;
      })
      // Create user
      .addCase(createUser.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isCreating = false;
        state.users.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isUpdating = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })
      // Toggle user active
      .addCase(toggleUserActive.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(
        toggleUserActive.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isUpdating = false;
          const index = state.users.findIndex(
            (u) => u.id === action.payload.id
          );
          if (index !== -1) {
            state.users[index] = action.payload;
          }
        }
      )
      .addCase(toggleUserActive.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.isDeleting = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearCurrentUser, clearError, clearFetchDetailError, clearCreateError, clearUpdateError, clearDeleteError } = userSlice.actions;
export default userSlice.reducer;

// Selectors
export const useUserStore = () => {
  const users = useAppSelector((state) => state.users.users);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const total = useAppSelector((state) => state.users.total);
  const page = useAppSelector((state) => state.users.page);
  const limit = useAppSelector((state) => state.users.limit);
  const totalPages = useAppSelector((state) => state.users.totalPages);
  const isLoading = useAppSelector((state) => state.users.isLoading);
  const isFetchingDetail = useAppSelector((state) => state.users.isFetchingDetail);
  const isCreating = useAppSelector((state) => state.users.isCreating);
  const isUpdating = useAppSelector((state) => state.users.isUpdating);
  const isDeleting = useAppSelector((state) => state.users.isDeleting);
  const error = useAppSelector((state) => state.users.error);
  const fetchDetailError = useAppSelector((state) => state.users.fetchDetailError);
  const createError = useAppSelector((state) => state.users.createError);
  const updateError = useAppSelector((state) => state.users.updateError);
  const deleteError = useAppSelector((state) => state.users.deleteError);
  const dispatch = useAppDispatch();

  return {
    users,
    currentUser,
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
    fetchDetailError,
    createError,
    updateError,
    deleteError,
    fetchUsers: (params?: { page?: number; limit?: number; search?: string }) =>
      dispatch(fetchUsers(params)),
    fetchUserById: (id: string) => dispatch(fetchUserById(id)),
    createUser: async (user: CreateUserDto) => {
      const result = await dispatch(createUser(user));
      return result.meta.requestStatus === "fulfilled";
    },
    updateUser: async (id: string, user: UpdateUserDto) => {
      const result = await dispatch(updateUser({ id, user }));
      return result.meta.requestStatus === "fulfilled";
    },
    toggleUserActive: async (id: string) => {
      const result = await dispatch(toggleUserActive(id));
      return result.meta.requestStatus === "fulfilled";
    },
    deleteUser: async (id: string) => {
      const result = await dispatch(deleteUser(id));
      return result.meta.requestStatus === "fulfilled";
    },
    clearCurrentUser: () => dispatch(clearCurrentUser()),
    clearError: () => dispatch(clearError()),
    clearFetchDetailError: () => dispatch(clearFetchDetailError()),
    clearCreateError: () => dispatch(clearCreateError()),
    clearUpdateError: () => dispatch(clearUpdateError()),
    clearDeleteError: () => dispatch(clearDeleteError()),
  };
};
