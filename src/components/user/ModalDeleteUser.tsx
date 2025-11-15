import React, { useState } from "react";
import { showToast } from "@/lib/toast";
import { useUserStore } from "@/store/slices/userSlice";
import type { User } from "@/services/user.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ModalDeleteUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: Partial<User> | null;
  onComplete: () => void;
}

export default function ModalDeleteUser({
  isOpen,
  onClose,
  user,
  onComplete,
}: ModalDeleteUserProps) {
  const { deleteUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      showToast.error("Lỗi", "Không tìm thấy thông tin người dùng");
      return;
    }

    try {
      setIsLoading(true);
      const success = await deleteUser(user.id);

      if (success) {
        showToast.success("Thành công", "Xóa người dùng thành công");
        onComplete();
        onClose();
      } else {
        showToast.error("Lỗi", "Không thể xóa người dùng");
      }
    } catch {
      showToast.error("Lỗi", "Có lỗi xảy ra khi xóa người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Xác nhận xóa
          </DialogTitle>
        </DialogHeader>

        {user && (
          <>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Xóa người dùng
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Thông tin người dùng:
                </h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Tên đăng nhập:</span> {user.username}
                  </div>
                  <div>
                    <span className="font-medium">Email:</span> {user.email || "Không có"}
                  </div>
                  <div>
                    <span className="font-medium">Vai trò:</span>{" "}
                    {user.role?.displayName || user.role?.name || "Không có"}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bạn có chắc chắn muốn xóa người dùng{" "}
                <strong>{user.username}</strong>? Tất cả dữ liệu liên quan sẽ bị xóa
                vĩnh viễn.
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "Đang xóa..." : "Xác nhận xóa"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
