# Quick Guide: Can Component vs usePermission Hook

## TL;DR - Dùng cái nào?

### 1. Can Component (CASL) - Recommend! ⭐

```tsx
import { Can } from "@/lib/Can";

<Can I="create" a="users">
  <Button>Tạo người dùng</Button>
</Can>
```

**Ưu điểm:**
- ✅ Ngắn gọn, dễ đọc nhất
- ✅ Chuẩn CASL, được tối ưu
- ✅ Tự động re-render khi permissions thay đổi

**Dùng khi:** Chỉ cần ẩn/hiện UI

---

### 2. usePermission Hook

```tsx
import { usePermission } from "@/hooks";

const { canCreate, canDelete } = usePermission();

{canCreate("users") && <Button>Tạo</Button>}
```

**Ưu điểm:**
- ✅ Type-safe với TypeScript
- ✅ Shorthand methods (canCreate, canDelete...)
- ✅ Linh hoạt cho logic phức tạp

**Dùng khi:** Cần check trong logic (onClick, conditions...)

---

### 3. PermissionGuard Component

```tsx
import { PermissionGuard } from "@/components/common/PermissionGuard";

<PermissionGuard module="users" action="create" fallback={<span>No access</span>}>
  <Button>Tạo</Button>
</PermissionGuard>
```

**Ưu điểm:**
- ✅ Type-safe props
- ✅ Support fallback UI
- ✅ Rõ ràng cho code phức tạp

**Dùng khi:** Cần fallback hoặc type-safe strict

---

## So sánh cụ thể

### Ẩn/hiện button đơn giản

```tsx
// ⭐ BEST: Can component
<Can I="create" a="users">
  <Button>Tạo</Button>
</Can>

// ✅ OK: usePermission
{canCreate("users") && <Button>Tạo</Button>}

// ✅ OK: PermissionGuard (nếu cần type-safe)
<PermissionGuard module="users" action="create">
  <Button>Tạo</Button>
</PermissionGuard>
```

### Check trong logic

```tsx
// ⭐ BEST: usePermission hook
const { canDelete } = usePermission();

const handleDelete = () => {
  if (!canDelete("users")) {
    alert("Không có quyền");
    return;
  }
  deleteUser();
};
```

### Với fallback UI

```tsx
// ⭐ BEST: PermissionGuard
<PermissionGuard 
  module="users" 
  action="delete"
  fallback={<span>Không có quyền xóa</span>}
>
  <Button>Xóa</Button>
</PermissionGuard>

// ✅ OK: Can với condition
<Can I="delete" a="users">
  <Button>Xóa</Button>
</Can>
<Can not I="delete" a="users">
  <span>Không có quyền</span>
</Can>
```

### Multiple checks

```tsx
// ⭐ BEST: usePermission hook
const { canCreate, canUpdate, canDelete } = usePermission();

if (canCreate("users") && canUpdate("users") && canDelete("users")) {
  // Full access
}

// ⚠️ VERBOSE: Nested Can
<Can I="create" a="users">
  <Can I="update" a="users">
    <Can I="delete" a="users">
      <div>Full access</div>
    </Can>
  </Can>
</Can>
```

---

## Recommendation

### UI Elements (JSX)
👉 **Dùng Can component** - Ngắn gọn, dễ đọc, chuẩn CASL

```tsx
<Can I="create" a="users"><Button>Tạo</Button></Can>
<Can I="update" a="users"><Button>Sửa</Button></Can>
<Can I="delete" a="users"><Button>Xóa</Button></Can>
```

### Logic & Handlers
👉 **Dùng usePermission hook** - Type-safe, linh hoạt

```tsx
const { canCreate, canDelete } = usePermission();

const handleSubmit = () => {
  if (!canCreate("users")) return;
  // Submit
};
```

### Complex UI với Fallback
👉 **Dùng PermissionGuard** - Rõ ràng, có fallback

```tsx
<PermissionGuard module="users" action="delete" fallback={<NoAccess />}>
  <DeleteButton />
</PermissionGuard>
```

---

## Setup (Đã làm sẵn)

✅ App đã wrap với `AbilityContext.Provider`  
✅ `usePermission` đã dùng `useAbility` từ CASL  
✅ Sidebar đã dùng `useAbility` để filter menu  
✅ All components ready to use!

---

**Kết luận:** Dùng **Can component** cho UI, **usePermission** cho logic! 🎯
