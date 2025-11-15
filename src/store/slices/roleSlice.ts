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
  error: string | null;
}

const initialState: RoleState = {
  roles: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
};

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async (_, { rejectWithValue }) => {
  try {
    const response = await roleService.getRoles();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch roles");
  }
});

export const createRole = createAsyncThunk(
  "roles/createRole",
  async (role: CreateRoleDto, { rejectWithValue }) => {
    try {
      const response = await roleService.createRole(role);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create role");
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ id, role }: { id: string; role: UpdateRoleDto }, { rejectWithValue }) => {
    try {
      const response = await roleService.updateRole(id, role);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update role");
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id: string, { rejectWithValue }) => {
    try {
      await roleService.deleteRole(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete role");
    }
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
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
      .addCase(fetchRoles.rejected, (state) => {
        state.isLoading = false;
        state.error = "Không thể tải danh sách vai trò";
      })
      .addCase(createRole.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action: PayloadAction<Role>) => {
        state.isCreating = false;
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state) => {
        state.isCreating = false;
        state.error = "Không thể tạo vai trò mới";
      })
      .addCase(updateRole.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
        state.isUpdating = false;
        const index = state.roles.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state) => {
        state.isUpdating = false;
        state.error = "Không thể cập nhật vai trò";
      })
      .addCase(deleteRole.fulfilled, (state, action: PayloadAction<string>) => {
        state.roles = state.roles.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state) => {
        state.error = "Không thể xóa vai trò";
      });
  },
});

export default roleSlice.reducer;

// Selectors
export const useRoleStore = () => {
  const roles = useAppSelector((state) => state.roles.roles);
  const isLoading = useAppSelector((state) => state.roles.isLoading);
  const isCreating = useAppSelector((state) => state.roles.isCreating);
  const isUpdating = useAppSelector((state) => state.roles.isUpdating);
  const error = useAppSelector((state) => state.roles.error);
  const dispatch = useAppDispatch();

  return {
    roles,
    isLoading,
    isCreating,
    isUpdating,
    error,
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
  };
};
