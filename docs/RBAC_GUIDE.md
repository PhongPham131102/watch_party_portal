# Hệ thống phân quyền RBAC

Hệ thống phân quyền dựa trên **RBAC (Role-Based Access Control)** sử dụng thư viện **CASL**.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Cách sử dụng](#cách-sử-dụng)
- [Modules & Actions](#modules--actions)
- [Examples](#examples)

## 🎯 Tổng quan

### Components

1. **RoleBasedRoute** - Bảo vệ routes dựa trên permissions
2. **PermissionGuard** - Ẩn/hiện UI elements dựa trên permissions
3. **usePermission** - Hook để check permissions
4. **Sidebar** - Tự động lọc menu items theo permissions

### Flow

```
Login → Backend trả permissions → Redux lưu + tạo CASL ability → Components sử dụng ability
```

## 🚀 Cách sử dụng

### 1. Trong Routes

```tsx
import RoleBasedRoute from "@/components/common/RoleBasedRoute";

<Route
  path="/users"
  element={
    <ProtectedRoute>
      <RoleBasedRoute module="users" action="read">
        <UserList />
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>
```

### 2. Trong Components - usePermission Hook

```tsx
import { usePermission } from "@/hooks";

function UserList() {
  const { canCreate, canUpdate, canDelete } = usePermission();

  return (
    <div>
      {canCreate("users") && <Button>Tạo mới</Button>}
      {canUpdate("users") && <Button>Sửa</Button>}
      {canDelete("users") && <Button>Xóa</Button>}
    </div>
  );
}
```

### 3. Trong JSX - PermissionGuard

```tsx
import { PermissionGuard } from "@/components/common/PermissionGuard";

<PermissionGuard module="movies" action="create">
  <Button>Tạo phim mới</Button>
</PermissionGuard>
```

### 4. Sidebar tự động

Sidebar đã tích hợp RBAC, tự động ẩn/hiện menu items:

```tsx
// Không cần làm gì, sidebar tự động hoạt động!
// Menu items sẽ hiển thị dựa trên permissions của user
```

## 📦 Modules & Actions

### Modules (RBACModule)

- `users` - Quản lý người dùng
- `movies` - Quản lý phim
- `actors` - Quản lý diễn viên
- `directors` - Quản lý đạo diễn
- `countries` - Quản lý quốc gia
- `rooms` - Quản lý phòng
- `comments` - Quản lý bình luận
- `roles` - Quản lý vai trò

### Actions (RBACAction)

- `create` - Tạo mới
- `read` - Đọc/Xem
- `update` - Cập nhật
- `delete` - Xóa
- `manage` - Toàn quyền (có tất cả actions)

## 📚 Examples

Xem file `src/examples/RBACUsageExample.tsx` để biết chi tiết.

### Check permission trong logic

```tsx
const { can } = usePermission();

const handleDelete = () => {
  if (!can("delete", "users")) {
    alert("Không có quyền xóa");
    return;
  }
  // Thực hiện xóa
};
```

### Multiple checks

```tsx
const { canCreate, canUpdate, canDelete, canManage } = usePermission();

if (canManage("users")) {
  // User có toàn quyền
}

if (canCreate("movies") && canUpdate("movies")) {
  // User có quyền create và update
}
```

## 🔒 Trang 403 Forbidden

Khi user không có quyền truy cập route, sẽ redirect đến `/403`.

Route tự động được xử lý bởi `RoleBasedRoute` component.

## ⚙️ Cấu hình

### Thêm menu item mới

File: `src/components/ui/sidebar.tsx`

```tsx
{
  icon: YourIcon,
  label: "Menu của bạn",
  path: "/your-path",
  module: RBACModule.YOUR_MODULE,
  action: RBACAction.READ,
}
```

### Thêm module mới

File: `src/types/auth.types.ts`

```tsx
export const RBACModule = {
  // ... existing
  YOUR_MODULE: 'your_module',
} as const;
```

---

**Lưu ý:** Backend cần trả về permissions đúng format:

```json
{
  "permissions": {
    "users": ["create", "read", "update", "delete"],
    "movies": ["read"],
    "roles": ["manage"]
  }
}
```
