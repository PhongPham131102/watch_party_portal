import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../hooks";
import { roleService } from "@/services/role.service";
import type { Role, CreateRoleDto, UpdateRoleDto } from "@/services/role.service";

interface RoleState {
  roles: Role[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: RoleState = {
  roles: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async (_, { rejectWithValue }) => {
  try {
    const response = await roleService.getRoles();
    return response.data;
  } catch (error) {
    const err = error as { message?: string };
    return rejectWithValue(err.message || "Đã có lỗi xảy ra khi tải danh sách vai trò");
  }
});

export const createRole = createAsyncThunk(
  "roles/createRole",
  async (role: CreateRoleDto, { rejectWithValue }) => {
    try {
      const response = await roleService.createRole(role);
      return response.data;
    } catch (error) {
      const err = error as { message?: string };
      return rejectWithValue(err.message || "Đã có lỗi xảy ra khi tạo vai trò");
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ id, role }: { id: string; role: UpdateRoleDto }, { rejectWithValue }) => {
    try {
      const response = await roleService.updateRole(id, role);
      return response.data;
    } catch (error) {
      const err = error as { message?: string };
      return rejectWithValue(err.message || "Đã có lỗi xảy ra khi cập nhật vai trò");
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id: string, { rejectWithValue }) => {
    try {
      await roleService.deleteRole(id);
      return id;
    } catch (error) {
      const err = error as { message?: string };
      return rejectWithValue(err.message || "Đã có lỗi xảy ra khi xóa vai trò");
    }
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
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
      .addCase(fetchRoles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
        state.isLoading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createRole.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createRole.fulfilled, (state, action: PayloadAction<Role>) => {
        state.isCreating = false;
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })
      .addCase(updateRole.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
        state.isUpdating = false;
        const index = state.roles.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })
      .addCase(deleteRole.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(deleteRole.fulfilled, (state, action: PayloadAction<string>) => {
        state.isDeleting = false;
        state.roles = state.roles.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearError, clearCreateError, clearUpdateError, clearDeleteError } = roleSlice.actions;
export default roleSlice.reducer;

// Selectors
export const useRoleStore = () => {
  const roles = useAppSelector((state) => state.roles.roles);
  const isLoading = useAppSelector((state) => state.roles.isLoading);
  const isCreating = useAppSelector((state) => state.roles.isCreating);
  const isUpdating = useAppSelector((state) => state.roles.isUpdating);
  const isDeleting = useAppSelector((state) => state.roles.isDeleting);
  const error = useAppSelector((state) => state.roles.error);
  const createError = useAppSelector((state) => state.roles.createError);
  const updateError = useAppSelector((state) => state.roles.updateError);
  const deleteError = useAppSelector((state) => state.roles.deleteError);
  const dispatch = useAppDispatch();

  return {
    roles,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    fetchRoles: () => dispatch(fetchRoles()),
    createRole: async (role: CreateRoleDto) => {
      const result = await dispatch(createRole(role));
      return result.meta.requestStatus === "fulfilled";
    },
    updateRole: async (id: string, role: UpdateRoleDto) => {
      const result = await dispatch(updateRole({ id, role }));
      return result.meta.requestStatus === "fulfilled";
    },
    deleteRole: async (id: string) => {
      const result = await dispatch(deleteRole(id));
      return result.meta.requestStatus === "fulfilled";
    },
    clearError: () => dispatch(clearError()),
    clearCreateError: () => dispatch(clearCreateError()),
    clearUpdateError: () => dispatch(clearUpdateError()),
    clearDeleteError: () => dispatch(clearDeleteError()),
  };
};
