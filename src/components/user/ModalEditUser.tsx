import React, { useEffect, useState } from "react";
import { showToast } from "@/lib/toast";
import { useUserStore } from "@/store/slices/userSlice";
import { useRoleStore } from "@/store/slices/roleSlice";
import type { UpdateUserDto } from "@/services/user.service";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ModalEditUserProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onComplete: () => void;
}

export default function ModalEditUser({
  isOpen,
  onClose,
  userId,
  onComplete,
}: ModalEditUserProps) {
  const { currentUser, isFetchingDetail, isUpdating, fetchUserById, updateUser, clearCurrentUser } =
    useUserStore();
  const { roles, fetchRoles } = useRoleStore();

  const [formData, setFormData] = useState<UpdateUserDto & { roleId?: string }>({
    username: "",
    email: "",
    password: "",
    isActive: true,
    roleId: "",
  });

  const [errors, setErrors] = useState<Partial<UpdateUserDto & { roleId?: string }>>({});

  useEffect(() => {
    if (isOpen) {
      if (userId) fetchUserById(userId);
      fetchRoles();
    }
    return () => {
      clearCurrentUser();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        password: "",
        isActive: currentUser.isActive,
        roleId: currentUser.role?.id || "",
      });
      setErrors({});
    }
  }, [currentUser]);

  const validateForm = (): boolean => {
    const newErrors: Partial<UpdateUserDto & { roleId?: string }> = {};

    if (!formData.username?.trim()) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !userId) {
      return;
    }

    try {
      const updateData: UpdateUserDto = {
        username: formData.username,
        email: formData.email,
        isActive: formData.isActive,
        ...(formData.password && { password: formData.password }),
      };

      const success = await updateUser(userId, updateData);

      if (success) {
        showToast.success("Thành công", "Cập nhật người dùng thành công");
        onComplete();
        onClose();
      } else {
        showToast.error("Lỗi", "Không thể cập nhật người dùng");
      }
    } catch {
      showToast.error("Lỗi", "Có lỗi xảy ra khi cập nhật người dùng");
    }
  };

  const handleInputChange = (
    field: keyof (UpdateUserDto & { roleId?: string }),
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isFetchingDetail) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentUser) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Không tìm thấy người dùng
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Chỉnh sửa người dùng
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Tên đăng nhập <span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              className={errors.username ? "border-red-500" : ""}
              placeholder="Nhập tên đăng nhập"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
              placeholder="Nhập email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Mật khẩu mới
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={errors.password ? "border-red-500" : ""}
              placeholder="Để trống nếu không thay đổi"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Vai trò</Label>
            <Select
              value={formData.roleId}
              onValueChange={(value) => handleInputChange("roleId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.displayName || role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2 py-2">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-sm font-medium">
                Trạng thái hoạt động
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formData.isActive ? "Tài khoản đang hoạt động" : "Tài khoản bị vô hiệu hóa"}
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Đang cập nhật..." : "Cập nhật người dùng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
