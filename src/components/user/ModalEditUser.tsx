import { useEffect } from "react";
import { showToast } from "@/lib/toast";
import { useUserStore } from "@/store/slices/userSlice";
import { useRoleStore } from "@/store/slices/roleSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateUserSchema } from "@/lib/validations/user";
import type { UpdateUserFormValues } from "@/lib/validations/user";
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
  const { currentUser, isFetchingDetail, isUpdating, updateError, fetchUserById, updateUser, clearCurrentUser } =
    useUserStore();
  const { roles, fetchRoles } = useRoleStore();

  const form = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      isActive: true,
      roleId: "",
    },
  });

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
      form.reset({
        username: currentUser.username || "",
        email: currentUser.email || "",
        password: "",
        isActive: currentUser.isActive,
        roleId: currentUser.role?.id || "",
      });
    }
  }, [currentUser, form]);

  async function onSubmit(data: UpdateUserFormValues) {
    if (!userId) {
      showToast.error("Lỗi", "Không tìm thấy ID người dùng");
      return;
    }

    try {
      const updateData: UpdateUserDto = {
        username: data.username,
        email: data.email || undefined,
        isActive: data.isActive,
        roleId: data.roleId || undefined,
        ...(data.password && { password: data.password }),
      };

      const success = await updateUser(userId, updateData);

      if (success) {
        showToast.success("Thành công", "Cập nhật người dùng thành công");
        onComplete();
        onClose();
      } else {
        showToast.error("Lỗi", updateError || "Không thể cập nhật người dùng");
      }
    } catch {
      showToast.error("Lỗi", updateError || "Có lỗi xảy ra khi cập nhật người dùng");
    }
  }

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
          <DialogTitle className="text-xl font-bold">
            Chỉnh sửa người dùng
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên đăng nhập <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên đăng nhập" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Nhập email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Để trống nếu không thay đổi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.displayName || role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-x-2 py-2">
                  <div className="space-y-0.5">
                    <FormLabel>Trạng thái hoạt động</FormLabel>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {field.value ? "Tài khoản đang hoạt động" : "Tài khoản bị vô hiệu hóa"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
