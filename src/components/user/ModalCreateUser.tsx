import React, { useState, useEffect } from "react";
import { showToast } from "@/lib/utils";
import { useUserStore } from "@/store/slices/userSlice";
import { useRoleStore } from "@/store/slices/roleSlice";
import type { CreateUserDto } from "@/services/user.service";
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

interface ModalCreateUserProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function ModalCreateUser({
  isOpen,
  onClose,
  onComplete,
}: ModalCreateUserProps) {
  const { createUser, isCreating } = useUserStore();
  const { roles, fetchRoles } = useRoleStore();

  const [formData, setFormData] = useState<CreateUserDto & { roleId?: string }>({
    username: "",
    password: "",
    email: "",
    roleId: "",
  });

  const [errors, setErrors] = useState<Partial<CreateUserDto & { roleId?: string }>>({});

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
      setFormData({
        username: "",
        password: "",
        email: "",
        roleId: "",
      });
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserDto & { roleId?: string }> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.roleId) {
      newErrors.roleId = "Vai trò là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
      };
      const success = await createUser(userData);

      if (success) {
        showToast.success("Thành công", "Tạo người dùng thành công");
        onComplete();
        onClose();
      } else {
        showToast.error("Lỗi", "Không thể tạo người dùng");
      }
    } catch {
      showToast.error("Lỗi", "Có lỗi xảy ra khi tạo người dùng");
    }
  };

  const handleInputChange = (field: keyof (CreateUserDto & { roleId?: string }), value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Tạo người dùng mới
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
            <Label htmlFor="password" className="text-sm font-medium">
              Mật khẩu <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={errors.password ? "border-red-500" : ""}
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
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
            <Label className="text-sm font-medium">
              Vai trò <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.roleId}
              onValueChange={(value) => handleInputChange("roleId", value)}
            >
              <SelectTrigger className={errors.roleId ? "border-red-500" : ""}>
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
            {errors.roleId && (
              <p className="text-red-500 text-sm">{errors.roleId}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Đang tạo..." : "Tạo người dùng"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
