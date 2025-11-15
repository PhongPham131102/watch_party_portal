import { useEffect } from "react";
import { useUserStore } from "@/store/slices/userSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ModalViewUserProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function ModalViewUser({
  isOpen,
  onClose,
  userId,
}: ModalViewUserProps) {
  const { currentUser, isFetchingDetail, fetchUserById, clearCurrentUser } =
    useUserStore();

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserById(userId);
    }
    return () => {
      clearCurrentUser();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết người dùng
          </DialogTitle>
        </DialogHeader>

        {isFetchingDetail ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        ) : !currentUser ? (
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Không tìm thấy người dùng
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                value={currentUser.username}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={currentUser.email || ""}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
                placeholder="Chưa cập nhật"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Input
                id="role"
                value={currentUser.role?.displayName || currentUser.role?.name || ""}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
                placeholder="Chưa có vai trò"
              />
            </div>

            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <div>
                <Badge
                  variant={currentUser.isActive ? "default" : "destructive"}
                >
                  {currentUser.isActive ? "Hoạt động" : "Không hoạt động"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdAt">Ngày tạo</Label>
              <Input
                id="createdAt"
                value={
                  currentUser.createdAt
                    ? new Date(currentUser.createdAt).toLocaleString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""
                }
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
