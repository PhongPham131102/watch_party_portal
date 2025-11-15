# Generic Reusable Components Guide

Hướng dẫn sử dụng các generic components và hooks tái sử dụng cho các trang quản lý.

## 📦 Components

### 1. PageHeader
Header component chung với title, description, refresh button và custom actions.

```tsx
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

<PageHeader
  title="Quản lý sản phẩm"
  description="Quản lý thông tin sản phẩm trong hệ thống"
  onRefresh={handleRefresh}
  isLoading={isLoading}
  actions={
    <Button onClick={onCreate}>
      <Plus className="h-4 w-4" />
      <span>Thêm sản phẩm</span>
    </Button>
  }
/>
```

### 2. SearchFilter
Search bar component với filters tùy chỉnh, clear filters, và search button.

```tsx
import { SearchFilter } from "@/components/common";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

<SearchFilter
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Tìm kiếm theo tên sản phẩm..."
  isSearching={isSearching}
  onSearch={handleSearch}
  onClearFilters={clearFilters}
  hasActiveFilters={hasActiveFilters}
  filters={
    <>
      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="w-[180px] h-9">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả danh mục</SelectItem>
          {/* More items */}
        </SelectContent>
      </Select>
    </>
  }
/>
```

### 3. DataTable
Wrapper component xử lý loading, error states cho table.

```tsx
import { DataTable } from "@/components/common";

<DataTable isLoading={isLoading} error={error} onRetry={handleRefresh}>
  <>
    <table className="w-full">
      {/* Table content */}
    </table>
    
    {/* Pagination */}
    <div className="border-t">
      <DataTablePagination {...paginationProps} />
    </div>
  </>
</DataTable>
```

### 4. TableHeader
Generic sortable table header với sort icons.

```tsx
import { TableHeader, type TableColumn, type SortConfig } from "@/components/common";

type ProductSortKey = 'name' | 'price' | 'createdAt';

const columns: TableColumn<ProductSortKey>[] = [
  {
    key: 'name',
    label: 'Tên sản phẩm',
    sortable: true,
    sortKey: 'name',
    align: 'left',
  },
  {
    key: 'price',
    label: 'Giá',
    sortable: true,
    sortKey: 'price',
    align: 'right',
  },
  {
    key: 'category',
    label: 'Danh mục',
    sortable: false,
    align: 'left',
  },
  {
    key: 'actions',
    label: 'Thao tác',
    sortable: false,
    align: 'center',
  },
];

const sortConfig: SortConfig<ProductSortKey> = {
  sortBy,
  sortOrder,
};

<table>
  <TableHeader columns={columns} sortConfig={sortConfig} onSort={handleSort} />
  <tbody>
    {/* Table rows */}
  </tbody>
</table>
```

### 5. EmptyState
Empty state component cho tables.

```tsx
import { EmptyState } from "@/components/common";

<tbody>
  {items.length === 0 ? (
    <EmptyState 
      message="Không tìm thấy sản phẩm" 
      description="Hãy thêm sản phẩm đầu tiên để bắt đầu" 
      colSpan={5} 
    />
  ) : (
    items.map(item => <TableRow key={item.id} item={item} />)
  )}
</tbody>
```

## 🪝 Custom Hooks

### useTableFiltersWithURL ⭐ (RECOMMENDED)
**Generic hook** quản lý filters với URL synchronization - Dùng cho TẤT CẢ trang quản lý.

```tsx
import { useTableFiltersWithURL } from "@/hooks";

type UserSortKey = 'createdAt' | 'username' | 'email';

export default function UsersPage() {
  const {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    isSearching,
    sortBy,
    sortOrder,
    handleSort,
    customFilters,
    setFilter,
    removeFilter,
    page,
    limit,
    buildFilters,
    clearFilters,
    hasActiveFilters,
  } = useTableFiltersWithURL<UserSortKey>({
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'DESC',
    defaultPage: 1,
    defaultLimit: 10,
    debounceMs: 500,
    validSortKeys: ['createdAt', 'username', 'email'], // Validate sort keys
  });

  // Custom filters từ customFilters object
  const selectedRoleFilter = (customFilters.roleId as string) || 'all';
  const selectedStatusFilter = customFilters.isActive !== undefined 
    ? String(customFilters.isActive) 
    : 'all';

  // Wrapper functions cho custom filters
  const setSelectedRoleFilter = (value: string) => {
    setFilter('roleId', value === 'all' ? undefined : value);
  };

  const setSelectedStatusFilter = (value: string) => {
    setFilter('isActive', value === 'all' ? undefined : value === 'true');
  };

  // Fetch data
  useEffect(() => {
    fetchUsers(buildFilters(page, limit));
  }, [debouncedSearchTerm, customFilters, sortBy, sortOrder, page, limit]);

  return (
    {/* UI components */}
  );
}
```

**Features:**
- ✅ **Immediate URL sync** - Mọi thay đổi filter đều update URL ngay lập tức
- ✅ **Bidirectional sync** - URL ↔ State sync hoàn toàn
- ✅ **URL validation** - Tự động validate và sanitize URL params
- ✅ **Generic & Reusable** - Dùng cho tất cả trang quản lý
- ✅ **Auto reset to page 1** khi filter thay đổi
- ✅ **Debounced search** (500ms default)
- ✅ **Type-safe sorting** với generic sort keys
- ✅ **Flexible custom filters** với setFilter/removeFilter

### useURLParams
Low-level hook để quản lý URL params (sử dụng bởi useTableFiltersWithURL).

```tsx
import { useURLParams } from "@/hooks";

interface MyParams {
  page: number;
  category?: string;
  status?: 'active' | 'inactive';
}

const [params, setParams] = useURLParams<MyParams>({
  page: 1,
  category: undefined,
  status: undefined,
});

// Update params
setParams({ ...params, category: 'electronics' });
```

## 📝 Complete Example

Ví dụ đầy đủ cho trang quản lý sản phẩm:

```tsx
import { useEffect, useState } from "react";
import { PageHeader, SearchFilter, DataTable, TableHeader, EmptyState } from "@/components/common";
import { useTableFiltersWithURL, usePermission } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type ProductSortKey = 'name' | 'price' | 'createdAt';

export default function ProductsPage() {
  const {
    searchTerm,
    setSearchTerm,
    isSearching,
    sortBy,
    sortOrder,
    handleSort,
    setFilter,
    page,
    limit,
    buildFilters,
    clearFilters,
    hasActiveFilters,
  } = useTableFiltersWithURL<ProductSortKey>({
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'DESC',
  });

  const [categoryFilter, setCategoryFilter] = useState('all');
  const { canCreate } = usePermission();

  // Fetch data
  useEffect(() => {
    const filters = buildFilters(page, limit);
    fetchProducts(filters);
  }, [/* dependencies */]);

  // Sync custom filters
  useEffect(() => {
    setFilter('categoryId', categoryFilter === 'all' ? undefined : categoryFilter);
  }, [categoryFilter]);

  const columns = [
    { key: 'name', label: 'Tên', sortable: true, sortKey: 'name' as ProductSortKey },
    { key: 'price', label: 'Giá', sortable: true, sortKey: 'price' as ProductSortKey },
    { key: 'actions', label: 'Thao tác', sortable: false, align: 'center' as const },
  ];

  return (
    <div className="p-8">
      <PageHeader
        title="Quản lý sản phẩm"
        description="Quản lý thông tin sản phẩm trong hệ thống"
        onRefresh={handleRefresh}
        isLoading={isLoading}
        actions={
          canCreate && (
            <Button onClick={() => setIsOpenCreate(true)}>
              <Plus className="h-4 w-4" />
              <span>Thêm sản phẩm</span>
            </Button>
          )
        }
      />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Tìm kiếm sản phẩm..."
        isSearching={isSearching}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        filters={
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            {/* Category filter options */}
          </Select>
        }
      />

      <DataTable isLoading={isLoading} error={error} onRetry={handleRefresh}>
        <>
          <table className="w-full">
            <TableHeader 
              columns={columns} 
              sortConfig={{ sortBy, sortOrder }} 
              onSort={handleSort} 
            />
            <tbody>
              {products.length === 0 ? (
                <EmptyState 
                  message="Không tìm thấy sản phẩm" 
                  colSpan={columns.length} 
                />
              ) : (
                products.map(product => (
                  <ProductRow key={product.id} product={product} />
                ))
              )}
            </tbody>
          </table>
          
          <div className="border-t">
            <DataTablePagination {...paginationProps} />
          </div>
        </>
      </DataTable>
    </div>
  );
}
```

## 🔗 URL Params Format

Khi sử dụng `useTableFiltersWithURL`, URL sẽ có format:

```
/products?page=1&limit=10&search=laptop&categoryId=electronics&sortBy=price&sortOrder=DESC
```

**Benefits:**
- ✅ **Immediate sync** - Thay đổi filter → URL update ngay lập tức
- ✅ **Bidirectional** - Paste URL → filters tự động restore
- ✅ Shareable URLs với filters
- ✅ Browser back/forward navigation hoạt động đúng
- ✅ Persist state khi reload page
- ✅ Deep linking support

**Behavior:**
- Thay đổi filter (role, status, category...) → URL update ngay, auto reset về page 1
- Xóa bộ lọc (Clear filters) → URL reset về default state
- Search input → Debounced 500ms rồi mới update URL (tránh spam)
- Sort → URL update ngay lập tức (preserve current filters)
- Pagination → URL update ngay lập tức (preserve current filters)

**Example URL Flow:**
```
1. Initial load:
   /users

2. User changes role filter to "admin":
   /users?page=1&limit=10&roleId=admin&sortBy=createdAt&sortOrder=DESC

3. User types search "john" (after 500ms debounce):
   /users?page=1&limit=10&roleId=admin&search=john&sortBy=createdAt&sortOrder=DESC

4. User clicks sort by username:
   /users?page=1&limit=10&roleId=admin&search=john&sortBy=username&sortOrder=DESC

5. User goes to page 2:
   /users?page=2&limit=10&roleId=admin&search=john&sortBy=username&sortOrder=DESC

6. User clicks "Clear filters":
   /users?page=1&limit=10&sortBy=createdAt&sortOrder=DESC

7. User reloads page → All filters restored from URL!

8. User manually edits URL with invalid data:
   /users?page=abc&limit=999&sortBy=invalid&roleId=<script>
   → Validated to: /users?page=1&limit=100&sortBy=createdAt
```

## 🛡️ URL Validation

Hook tự động validate và sanitize tất cả URL params:

### Validation Rules:

| Param | Validation | Default on Invalid |
|---|---|---|
| **page** | Integer ≥ 1 | defaultPage (1) |
| **limit** | Integer: 1-100 | defaultLimit (10) |
| **sortBy** | Must be in validSortKeys | defaultSortBy |
| **sortOrder** | Must be 'ASC' or 'DESC' | defaultSortOrder ('DESC') |
| **search** | Max 200 characters, trimmed | Empty string |
| **isActive** | Must be 'true' or 'false' | undefined |
| **Custom** | Max 100 characters, trimmed | undefined |

### Examples:

```typescript
// ❌ Invalid URL
/users?page=-1&limit=abc&sortBy=hacker&search=<script>alert('xss')</script>

// ✅ Auto-validated to
/users?page=1&limit=10&sortBy=createdAt

// ❌ Invalid URL
/users?page=999999&limit=1000&sortOrder=RANDOM

// ✅ Auto-validated to
/users?page=999999&limit=100&sortOrder=DESC
```

### Security Features:

- ✅ **XSS Prevention** - Trim and sanitize all string inputs
- ✅ **SQL Injection Prevention** - Validate sortBy against whitelist
- ✅ **Type Coercion** - Ensure correct data types
- ✅ **Length Limits** - Prevent buffer overflow attacks
- ✅ **Range Validation** - Limit numeric values to reasonable ranges
- ✅ **Console Warnings** - Log invalid params for debugging

## 📋 Best Practices

1. ⭐ **Luôn dùng useTableFiltersWithURL** - Generic hook cho tất cả trang quản lý
2. **Custom filters** - Dùng `setFilter()` với key/value, set `undefined` để xóa
3. **Wrapper functions** - Tạo wrapper như `setSelectedRoleFilter` để code sạch hơn
4. **Type-safe sorting** - Define SortKey type cho từng trang
5. **Đặt tên sortKey** match với backend API field names
6. **Customize SearchFilter** thông qua `filters` prop
7. **Reuse TableColumn config** cho consistency
8. **Handle permissions** trong PageHeader actions

## 🎯 Summary

| Component/Hook | Purpose | URL Sync | Status |
|---|---|---|---|
| **PageHeader** | Header với actions | ❌ | ✅ Active |
| **SearchFilter** | Search & filters UI | ❌ | ✅ Active |
| **DataTable** | Loading/error wrapper | ❌ | ✅ Active |
| **TableHeader** | Sortable header | ❌ | ✅ Active |
| **EmptyState** | Empty state UI | ❌ | ✅ Active |
| **useTableFiltersWithURL** ⭐ | Generic filter management | ✅ | ✅ **RECOMMENDED** |
| **useURLParams** | Low-level URL sync | ✅ | ✅ Active |
| **useDebounce** | Debounce utility | ❌ | ✅ Active |
| **useLocalStorage** | LocalStorage utility | ❌ | ✅ Active |
| **usePermission** | RBAC permissions | ❌ | ✅ Active |

### 🗑️ Deprecated Hooks (Đã xóa):
- ~~useUserFilters~~ - Thay bằng useTableFiltersWithURL
- ~~useUserFiltersWithURL~~ - Thay bằng useTableFiltersWithURL
- ~~useTableFilters~~ - Thay bằng useTableFiltersWithURL
