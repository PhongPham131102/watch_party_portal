# Hướng Dẫn Thiết Kế Bảng Quản Lý - Table Design Guide

> **Mục đích:** Đảm bảo tất cả các trang quản lý (Users, Genres, Actors, Directors, Countries, Movies, v.v.) có giao diện và cấu trúc code đồng nhất.

## 📋 Mục Lục
1. [Cấu Trúc Thư Mục](#1-cấu-trúc-thư-mục)
2. [Files Cần Tạo](#2-files-cần-tạo)
3. [Components Chi Tiết](#3-components-chi-tiết)
4. [Redux Store](#4-redux-store)
5. [Validation Schema](#5-validation-schema)
6. [Service Layer](#6-service-layer)
7. [Page Component](#7-page-component)
8. [Checklist](#8-checklist)

---

## 1. Cấu Trúc Thư Mục

```
src/
├── components/
│   └── [module-name]/          # VD: user, genre, actor
│       ├── index.ts            # Export tất cả components
│       ├── [Module]Table.tsx
│       ├── [Module]TableHeader.tsx
│       ├── [Module]TableRow.tsx
│       ├── [Module]PageHeader.tsx
│       ├── [Module]SearchFilter.tsx
│       ├── ModalCreate[Module].tsx
│       ├── ModalEdit[Module].tsx
│       ├── ModalView[Module].tsx
│       └── ModalDelete[Module].tsx
├── pages/
│   └── [Modules].tsx           # VD: Users.tsx, Genres.tsx
├── services/
│   └── [module].service.ts     # VD: user.service.ts
├── store/
│   └── slices/
│       └── [module]Slice.ts    # VD: userSlice.ts (bao gồm hook)
├── types/
│   └── [module].types.ts       # VD: user.types.ts
└── lib/
    └── validations/
        └── [module].ts         # VD: user.ts
```

---

## 2. Files Cần Tạo

### 2.1. Types File (`src/types/[module].types.ts`)

```typescript
export interface [Module] {
  id: string;
  name: string;
  // ... các fields khác
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Create[Module]Dto {
  name: string;
  // ... các fields bắt buộc khi tạo mới
}

export interface Update[Module]Dto {
  name?: string;
  // ... các fields có thể update
}

export interface Fetch[Modules]Params {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'createdAt'; // Thêm các field có thể sort
  sortOrder?: 'ASC' | 'DESC';
}
```

**Lưu ý:** Export types trong `src/types/index.ts`:
```typescript
export * from './[module].types';
```

---

### 2.2. Service File (`src/services/[module].service.ts`)

```typescript
import apiClient from "./apiClient";
import { API_BASE_URL } from "@/constants";
import type { [Module], Create[Module]Dto, Update[Module]Dto, Fetch[Modules]Params } from "@/types/[module].types";

export interface Paginated[Modules] {
  data: [Module][];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const [module]Service = {
  get[Modules]: async (params?: Fetch[Modules]Params) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const url = `${API_BASE_URL}/[modules]${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    const response = await apiClient.get<ApiResponse<[Module][] | Paginated[Modules]>>(url);
    return response.data;
  },

  get[Module]ById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<[Module]>>(
      `${API_BASE_URL}/[modules]/${id}`
    );
    return response.data;
  },

  create[Module]: async (data: Create[Module]Dto) => {
    const response = await apiClient.post<ApiResponse<[Module]>>(
      `${API_BASE_URL}/[modules]`,
      data
    );
    return response.data;
  },

  update[Module]: async (id: string, data: Update[Module]Dto) => {
    const response = await apiClient.patch<ApiResponse<[Module]>>(
      `${API_BASE_URL}/[modules]/${id}`,
      data
    );
    return response.data;
  },

  delete[Module]: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `${API_BASE_URL}/[modules]/${id}`
    );
    return response.data;
  },
};

export type { [Module] };
```

---

### 2.3. Validation Schema (`src/lib/validations/[module].ts`)

```typescript
import { z } from "zod";

export const create[Module]Schema = z.object({
  name: z
    .string()
    .min(1, "Tên không được để trống")
    .max(100, "Tên không được vượt quá 100 ký tự")
    .trim(),
  // ... các fields khác
});

export const update[Module]Schema = z.object({
  name: z
    .string()
    .min(1, "Tên không được để trống")
    .max(100, "Tên không được vượt quá 100 ký tự")
    .trim()
    .optional(),
  // ... các fields khác
});

export type Create[Module]FormValues = z.infer<typeof create[Module]Schema>;
export type Update[Module]FormValues = z.infer<typeof update[Module]Schema>;
```

---

## 3. Components Chi Tiết

### 3.1. Table Header (`[Module]TableHeader.tsx`)

**✅ ĐÚNG - Sử dụng TableHeader component chung:**

```typescript
import { TableHeader, type TableColumn, type SortConfig } from "@/components/common";

type [Module]SortKey = 'createdAt' | 'name'; // Thêm các fields có thể sort

interface [Module]TableHeaderProps {
  sortBy: [Module]SortKey;
  sortOrder: 'ASC' | 'DESC';
  onSort: (column: [Module]SortKey) => void;
}

const columns: TableColumn<[Module]SortKey>[] = [
  {
    key: 'name',
    label: 'Tên [Module]', // VD: Tên thể loại, Tên diễn viên
    sortable: true,
    sortKey: 'name',
    align: 'left',
  },
  // ... các columns khác
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true,
    sortKey: 'createdAt',
    align: 'left',
  },
  {
    key: 'actions',
    label: 'Thao tác',
    sortable: false,
    align: 'center',
  },
];

export function [Module]TableHeader({ sortBy, sortOrder, onSort }: [Module]TableHeaderProps) {
  const sortConfig: SortConfig<[Module]SortKey> = {
    sortBy,
    sortOrder,
  };

  return <TableHeader columns={columns} sortConfig={sortConfig} onSort={onSort} />;
}
```

**❌ SAI - Tự code riêng header:**
```typescript
// KHÔNG làm như này - không tự code Button, ArrowUpDown, etc.
```

---

### 3.2. Table Row (`[Module]TableRow.tsx`)

```typescript
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RBACModule } from "@/types";
import { usePermission } from "@/hooks";
import type { [Module] } from "@/types/[module].types";

interface [Module]TableRowProps {
  [module]: [Module];
  onView: (item: [Module]) => void;
  onEdit: (item: [Module]) => void;
  onDelete: (item: [Module]) => void;
}

export function [Module]TableRow({ [module], onView, onEdit, onDelete }: [Module]TableRowProps) {
  const { canRead, canUpdate, canDelete } = usePermission();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {[module].name}
          </div>
          {/* Hiển thị thông tin phụ nếu có (slug, code, v.v.) */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {[module].slug || [module].code}
          </div>
        </div>
      </td>
      
      {/* Các columns khác */}
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDate([module].createdAt)}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex justify-center gap-2">
          {canRead(RBACModule.MOVIES) && ( {/* Thay MOVIES bằng module tương ứng */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView([module])}
                  className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 cursor-pointer">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Xem chi tiết</p></TooltipContent>
            </Tooltip>
          )}
          
          {canUpdate(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit([module])}
                  className="h-9 w-9 p-0 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Chỉnh sửa</p></TooltipContent>
            </Tooltip>
          )}
          
          {canDelete(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 cursor-pointer"
                  onClick={() => onDelete([module])}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Xóa [module]</p></TooltipContent>
            </Tooltip>
          )}
        </div>
      </td>
    </tr>
  );
}
```

**Lưu ý quan trọng:**
- ❌ **KHÔNG dùng avatar/icon tròn** cho các entity như Genre, Actor, Director, Country
- ✅ **CHỈ hiển thị** tên + thông tin phụ (slug, code) nếu có

---

### 3.3. Table Component (`[Module]Table.tsx`)

```typescript
import { [Module]TableHeader } from "./[Module]TableHeader";
import { [Module]TableRow } from "./[Module]TableRow";
import { EmptyState } from "@/components/common";
import type { [Module] } from "@/types/[module].types";

interface [Module]TableProps {
  [modules]: [Module][];
  sortBy: 'name' | 'createdAt';
  sortOrder: 'ASC' | 'DESC';
  onSort: (column: 'name' | 'createdAt') => void;
  onView: (item: [Module]) => void;
  onEdit: (item: [Module]) => void;
  onDelete: (item: [Module]) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function [Module]Table({
  [modules],
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "Không tìm thấy [module]",
  emptyDescription = "Hãy thêm [module] đầu tiên để bắt đầu",
}: [Module]TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <[Module]TableHeader sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {[modules].length === 0 ? (
            <EmptyState message={emptyMessage} description={emptyDescription} colSpan={4} />
          ) : (
            [modules].map((item) => (
              <[Module]TableRow
                key={item.id}
                [module]={item}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
```

---

### 3.4. Page Header (`[Module]PageHeader.tsx`)

```typescript
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

interface [Module]PageHeaderProps {
  onRefresh: () => void;
  onCreate[Module]: () => void;
  isLoading: boolean;
  canCreate[Module]: boolean;
}

export function [Module]PageHeader({
  onRefresh,
  onCreate[Module],
  isLoading,
  canCreate[Module],
}: [Module]PageHeaderProps) {
  return (
    <PageHeader
      title="Quản lý [modules]" // VD: Quản lý thể loại
      description="Quản lý [modules] trong hệ thống"
      onRefresh={onRefresh}
      isLoading={isLoading}
      actions={
        canCreate[Module] && (
          <Button
            onClick={onCreate[Module]}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
            <Plus className="h-4 w-4" />
            <span>Thêm [module]</span>
          </Button>
        )
      }
    />
  );
}
```

---

### 3.5. Search Filter (`[Module]SearchFilter.tsx`)

```typescript
import { SearchFilter } from "@/components/common";

interface [Module]SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isSearching: boolean;
  onSearch: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function [Module]SearchFilter({
  searchTerm,
  onSearchChange,
  isSearching,
  onSearch,
  onClearFilters,
  hasActiveFilters,
}: [Module]SearchFilterProps) {
  return (
    <SearchFilter
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm theo tên [module]..."
      isSearching={isSearching}
      onSearch={onSearch}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );
}
```

---

### 3.6. Modal Components

#### ModalCreate[Module].tsx
```typescript
import { useEffect } from "react";
import { showToast } from "@/lib/toast";
import { use[Module]Store } from "@/store/slices/[module]Slice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { create[Module]Schema } from "@/lib/validations/[module]";
import type { Create[Module]FormValues } from "@/lib/validations/[module]";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ModalCreate[Module]Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function ModalCreate[Module]({
  isOpen,
  onClose,
  onComplete,
}: ModalCreate[Module]Props) {
  const { create[Module], isCreating, createError } = use[Module]Store();

  const form = useForm<Create[Module]FormValues>({
    resolver: zodResolver(create[Module]Schema),
    defaultValues: {
      name: "",
      // ... các fields khác
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
  }, [isOpen]);

  async function onSubmit(data: Create[Module]FormValues) {
    const success = await create[Module](data);

    if (success) {
      showToast.success("Thành công", "Tạo [module] thành công");
      onComplete();
      onClose();
    } else {
      showToast.error("Lỗi", createError || "Không thể tạo [module]");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Tạo [module] mới
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên [module] <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên [module]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Các fields khác */}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
                Hủy
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Đang tạo..." : "Tạo [module]"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

**Lưu ý:** ModalEdit, ModalView, ModalDelete tương tự, tham khảo từ Genre hoặc User components.

---

### 3.7. Index File (`components/[module]/index.ts`)

```typescript
export { [Module]Table } from "./[Module]Table";
export { [Module]TableHeader } from "./[Module]TableHeader";
export { [Module]TableRow } from "./[Module]TableRow";
export { [Module]PageHeader } from "./[Module]PageHeader";
export { [Module]SearchFilter } from "./[Module]SearchFilter";
export { default as ModalCreate[Module] } from "./ModalCreate[Module]";
export { default as ModalEdit[Module] } from "./ModalEdit[Module]";
export { default as ModalView[Module] } from "./ModalView[Module]";
export { default as ModalDelete[Module] } from "./ModalDelete[Module]";
```

---

## 4. Redux Store

### 4.1. Slice File (`store/slices/[module]Slice.ts`)

**❌ SAI - Tạo file .hooks.ts riêng:**
```
[module]Slice.ts
[module]Slice.hooks.ts  // KHÔNG tạo file này
```

**✅ ĐÚNG - Hook nằm trong file slice:**

```typescript
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { [module]Service } from "@/services/[module].service";
import type { [Module], Create[Module]Dto, Update[Module]Dto, Fetch[Modules]Params } from "@/types/[module].types";
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

interface [Module]State {
  [modules]: [Module][];
  current[Module]: [Module] | null;
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

const initialState: [Module]State = {
  [modules]: [],
  current[Module]: null,
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
export const fetch[Modules] = createAsyncThunk(
  "[modules]/fetch[Modules]",
  async (params: Fetch[Modules]Params, { rejectWithValue }) => {
    try {
      const response = await [module]Service.get[Modules](params);
      
      // Xử lý response có pagination
      if (response.data && typeof response.data === 'object' && 'data' in response.data && 'pagination' in response.data) {
        const paginatedResponse = response.data as { 
          data: [Module][]; 
          pagination: { total: number; page: number; limit: number; totalPages: number } 
        };
        return {
          data: paginatedResponse.data,
          total: paginatedResponse.pagination.total,
          page: paginatedResponse.pagination.page,
          limit: paginatedResponse.pagination.limit,
          totalPages: paginatedResponse.pagination.totalPages,
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

export const fetch[Module]ById = createAsyncThunk(
  "[modules]/fetch[Module]ById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await [module]Service.get[Module]ById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const create[Module] = createAsyncThunk(
  "[modules]/create[Module]",
  async (data: Create[Module]Dto, { rejectWithValue }) => {
    try {
      const response = await [module]Service.create[Module](data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const update[Module] = createAsyncThunk(
  "[modules]/update[Module]",
  async ({ id, data }: { id: string; data: Update[Module]Dto }, { rejectWithValue }) => {
    try {
      const response = await [module]Service.update[Module](id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const delete[Module] = createAsyncThunk(
  "[modules]/delete[Module]",
  async (id: string, { rejectWithValue }) => {
    try {
      await [module]Service.delete[Module](id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const [module]Slice = createSlice({
  name: "[modules]",
  initialState,
  reducers: {
    clearCurrent[Module]: (state) => {
      state.current[Module] = null;
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
      // Fetch [modules]
      .addCase(fetch[Modules].pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetch[Modules].fulfilled, (state, action) => {
        state.isLoading = false;
        state.[modules] = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetch[Modules].rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch [module] by ID
      .addCase(fetch[Module]ById.pending, (state) => {
        state.isFetchingDetail = true;
        state.error = null;
      })
      .addCase(fetch[Module]ById.fulfilled, (state, action: PayloadAction<[Module]>) => {
        state.isFetchingDetail = false;
        state.current[Module] = action.payload;
      })
      .addCase(fetch[Module]ById.rejected, (state, action) => {
        state.isFetchingDetail = false;
        state.error = action.payload as string;
      })

      // Create [module]
      .addCase(create[Module].pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(create[Module].fulfilled, (state) => {
        state.isCreating = false;
      })
      .addCase(create[Module].rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })

      // Update [module]
      .addCase(update[Module].pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(update[Module].fulfilled, (state) => {
        state.isUpdating = false;
      })
      .addCase(update[Module].rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.payload as string;
      })

      // Delete [module]
      .addCase(delete[Module].pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
      })
      .addCase(delete[Module].fulfilled, (state) => {
        state.isDeleting = false;
      })
      .addCase(delete[Module].rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearCurrent[Module], clearErrors } = [module]Slice.actions;
export default [module]Slice.reducer;

// Hook - PHẢI nằm trong file slice này, KHÔNG tạo file .hooks.ts riêng
export const use[Module]Store = () => {
  const [modules] = useAppSelector((state) => state.[modules].[modules]);
  const current[Module] = useAppSelector((state) => state.[modules].current[Module]);
  const total = useAppSelector((state) => state.[modules].total);
  const page = useAppSelector((state) => state.[modules].page);
  const limit = useAppSelector((state) => state.[modules].limit);
  const totalPages = useAppSelector((state) => state.[modules].totalPages);
  const isLoading = useAppSelector((state) => state.[modules].isLoading);
  const isFetchingDetail = useAppSelector((state) => state.[modules].isFetchingDetail);
  const isCreating = useAppSelector((state) => state.[modules].isCreating);
  const isUpdating = useAppSelector((state) => state.[modules].isUpdating);
  const isDeleting = useAppSelector((state) => state.[modules].isDeleting);
  const error = useAppSelector((state) => state.[modules].error);
  const createError = useAppSelector((state) => state.[modules].createError);
  const updateError = useAppSelector((state) => state.[modules].updateError);
  const deleteError = useAppSelector((state) => state.[modules].deleteError);
  const dispatch = useAppDispatch();

  return {
    [modules],
    current[Module],
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
    fetch[Modules]: (params?: Fetch[Modules]Params) => dispatch(fetch[Modules](params || {})),
    fetch[Module]ById: (id: string) => dispatch(fetch[Module]ById(id)),
    create[Module]: async (data: Create[Module]Dto) => {
      const result = await dispatch(create[Module](data));
      return result.meta.requestStatus === "fulfilled";
    },
    update[Module]: async (id: string, data: Update[Module]Dto) => {
      const result = await dispatch(update[Module]({ id, data }));
      return result.meta.requestStatus === "fulfilled";
    },
    delete[Module]: async (id: string) => {
      const result = await dispatch(delete[Module](id));
      return result.meta.requestStatus === "fulfilled";
    },
    clearCurrent[Module]: () => dispatch(clearCurrent[Module]()),
    clearErrors: () => dispatch(clearErrors()),
  };
};
```

### 4.2. Cập nhật Store Index (`store/index.ts`)

```typescript
import [module]Reducer from './slices/[module]Slice';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    [modules]: [module]Reducer,
  },
  // ...
});
```

---

## 5. Validation Schema

Đã nêu ở phần 2.3

---

## 6. Service Layer

Đã nêu ở phần 2.2

---

## 7. Page Component

### 7.1. Main Page (`pages/[Modules].tsx`)

```typescript
import { useEffect, useState } from "react";
import { use[Module]Store } from "@/store/slices/[module]Slice";
import { usePermission, useTableFiltersWithURL } from "@/hooks";
import { RBACModule } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataTable } from "@/components/common";
import {
  ModalCreate[Module],
  ModalDelete[Module],
  ModalView[Module],
  ModalEdit[Module],
  [Module]PageHeader,
  [Module]SearchFilter,
  [Module]Table,
} from "@/components/[module]";
import type { [Module] } from "@/types/[module].types";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default function [Modules]Page() {
  const {
    [modules],
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    isLoading,
    error,
    fetch[Modules],
  } = use[Module]Store();

  type [Module]SortKey = 'createdAt' | 'name';

  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    debouncedSearchTerm,
    buildFilters,
    handleSort,
    clearFilters,
    hasActiveFilters,
    isSearching,
    page: urlPage,
    limit: urlLimit,
  } = useTableFiltersWithURL<[Module]SortKey>({
    defaultSortBy: 'name',
    defaultSortOrder: 'ASC',
    validSortKeys: ['createdAt', 'name'],
  });

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Partial<[Module]> | null>(null);

  const { canRead, canCreate } = usePermission();

  const canAccessPage = canRead(RBACModule.MOVIES); // Thay MOVIES bằng module tương ứng
  const canCreateItem = canCreate(RBACModule.MOVIES);

  useEffect(() => {
    if (canAccessPage) {
      fetch[Modules](buildFilters(urlPage, urlLimit));
    }
  }, [canAccessPage, debouncedSearchTerm, sortBy, sortOrder, urlPage, urlLimit]);

  const handleRefresh = () => {
    fetch[Modules](buildFilters(urlPage, urlLimit));
  };

  const handlePageChange = (newPage: number) => {
    fetch[Modules](buildFilters(newPage, urlLimit));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    fetch[Modules](buildFilters(1, newPageSize));
  };

  const handleView = (item: [Module]) => {
    setSelectedItem(item);
    setIsOpenViewModal(true);
  };

  const handleEdit = (item: [Module]) => {
    setSelectedItem(item);
    setIsOpenEditModal(true);
  };

  const handleDelete = (item: [Module]) => {
    setSelectedItem(item);
    setIsOpenDeleteModal(true);
  };

  const getEmptyMessage = () => {
    if (searchTerm) {
      return {
        message: "Không tìm thấy [module]",
        description: "Hãy thử thay đổi bộ lọc",
      };
    }
    return {
      message: "Chưa có [module]",
      description: "Hãy thêm [module] đầu tiên để bắt đầu",
    };
  };

  if (!canAccessPage) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">
          Không có quyền truy cập
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          Bạn không có quyền truy cập trang quản lý [modules]
        </div>
      </div>
    );
  }

  const emptyState = getEmptyMessage();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TooltipProvider>
        <[Module]PageHeader
          onRefresh={handleRefresh}
          onCreate[Module]={() => setIsOpenCreateModal(true)}
          isLoading={isLoading}
          canCreate[Module]={canCreateItem}
        />

        <[Module]SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isSearching={isSearching}
          onSearch={handleRefresh}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <DataTable isLoading={isLoading} error={error} onRetry={handleRefresh}>
          <>
            <[Module]Table
              [modules]={[modules]}
              sortBy={sortBy || 'name'}
              sortOrder={sortOrder || 'ASC'}
              onSort={handleSort}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              emptyMessage={emptyState.message}
              emptyDescription={emptyState.description}
            />

            <div className="border-t border-gray-200 dark:border-gray-700">
              <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={currentLimit}
                totalItems={total}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showPageSizeSelector={true}
              />
            </div>
          </>
        </DataTable>

        <ModalCreate[Module]
          isOpen={isOpenCreateModal}
          onClose={() => setIsOpenCreateModal(false)}
          onComplete={() => {
            setIsOpenCreateModal(false);
            handleRefresh();
          }}
        />

        <ModalDelete[Module]
          isOpen={isOpenDeleteModal}
          onClose={() => {
            setIsOpenDeleteModal(false);
            setSelectedItem(null);
          }}
          [module]={selectedItem}
          onComplete={() => {
            setIsOpenDeleteModal(false);
            setSelectedItem(null);
            handleRefresh();
          }}
        />

        <ModalView[Module]
          isOpen={isOpenViewModal}
          onClose={() => {
            setIsOpenViewModal(false);
            setSelectedItem(null);
          }}
          [module]Id={selectedItem?.id || null}
        />

        <ModalEdit[Module]
          isOpen={isOpenEditModal}
          onClose={() => {
            setIsOpenEditModal(false);
            setSelectedItem(null);
          }}
          [module]Id={selectedItem?.id || null}
          onComplete={() => {
            setIsOpenEditModal(false);
            setSelectedItem(null);
            handleRefresh();
          }}
        />
      </TooltipProvider>
    </div>
  );
}
```

---

## 8. Checklist

Khi tạo module mới, kiểm tra các bước sau:

### 8.1. Types & Constants
- [ ] Tạo `src/types/[module].types.ts`
- [ ] Export types trong `src/types/index.ts`
- [ ] Thêm route vào `src/constants/index.ts` (APP_ROUTES.[MODULES])

### 8.2. Service Layer
- [ ] Tạo `src/services/[module].service.ts`
- [ ] Implement đầy đủ CRUD methods
- [ ] Export type [Module]

### 8.3. Validation
- [ ] Tạo `src/lib/validations/[module].ts`
- [ ] Schema cho create và update

### 8.4. Redux Store
- [ ] Tạo `src/store/slices/[module]Slice.ts`
- [ ] Hook `use[Module]Store()` nằm trong file slice
- [ ] ❌ KHÔNG tạo file `.hooks.ts` riêng
- [ ] Thêm reducer vào `src/store/index.ts`

### 8.5. Components
- [ ] `[Module]Table.tsx`
- [ ] `[Module]TableHeader.tsx` - SỬ DỤNG TableHeader component chung
- [ ] `[Module]TableRow.tsx` - Không dùng avatar cho entities
- [ ] `[Module]PageHeader.tsx`
- [ ] `[Module]SearchFilter.tsx`
- [ ] `ModalCreate[Module].tsx`
- [ ] `ModalEdit[Module].tsx`
- [ ] `ModalView[Module].tsx`
- [ ] `ModalDelete[Module].tsx`
- [ ] `index.ts` - Export tất cả components

### 8.6. Page
- [ ] Tạo `src/pages/[Modules].tsx`
- [ ] Implement logic hoàn chỉnh với hooks

### 8.7. Routes & Sidebar
- [ ] Thêm route vào `src/routes/index.tsx`
- [ ] Thêm menu item vào `src/components/ui/sidebar.tsx`
- [ ] Kiểm tra RBAC permissions

---

## 9. Ví Dụ Tham Khảo

**Module Genre và User** đã được implement đúng chuẩn. Tham khảo các files:
- `src/components/genre/*`
- `src/components/user/*`
- `src/store/slices/genreSlice.ts`
- `src/store/slices/userSlice.ts`
- `src/pages/Genres.tsx`
- `src/pages/Users.tsx`

---

## 10. Lưu Ý Quan Trọng

### ❌ SAI:
1. Tạo file `.hooks.ts` riêng cho slice
2. Tự code TableHeader thay vì dùng component chung
3. Thêm avatar/icon tròn cho các entity không phải User
4. Không sync state với URL params
5. Không kiểm tra RBAC permissions

### ✅ ĐÚNG:
1. Hook nằm trong file slice
2. Sử dụng `<TableHeader>` component chung
3. Chỉ hiển thị text cho các entity
4. Sử dụng `useTableFiltersWithURL` hook
5. Kiểm tra permissions với `usePermission` hook

---

## 11. Template Variables

Khi implement module mới, thay thế:
- `[Module]` → Tên entity viết hoa (VD: Genre, Actor, Director)
- `[module]` → Tên entity viết thường (VD: genre, actor, director)
- `[Modules]` → Tên entity số nhiều viết hoa (VD: Genres, Actors, Directors)
- `[modules]` → Tên entity số nhiều viết thường (VD: genres, actors, directors)

---

**Phiên bản:** 1.0  
**Ngày cập nhật:** 16/11/2025  
**Người tạo:** Development Team
