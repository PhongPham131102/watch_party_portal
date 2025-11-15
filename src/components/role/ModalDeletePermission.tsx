import React, { useState } from "react";
import { showToast } from "@/lib/toast";
import { useRoleStore } from "@/store/slices/roleSlice";
import type { Role } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ModalDeletePermissionProps {
  isOpen: boolean;
  onClose: () => void;
  permissionData: Partial<Role>;
  onComplete: () => void;
}

function ModalDeletePermission({
  isOpen,
  onClose,
  permissionData,
  onComplete,
}: ModalDeletePermissionProps) {
  const { deleteRole, deleteError } = useRoleStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!permissionData?.id) {
      showToast.error("Lỗi", "Không tìm thấy ID vai trò");
      return;
    }

    try {
      setIsLoading(true);
      const success = await deleteRole(permissionData.id);
      
      if (success) {
        showToast.success("Thành công", "Xóa vai trò thành công");
        onClose();
        onComplete();
      } else {
        showToast.error("Lỗi", deleteError || "Không thể xóa vai trò, vui lòng thử lại sau");
      }
    } catch (error) {
      console.log(error);
      showToast.error("Lỗi", deleteError || "Không thể xóa vai trò, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white uppercase">
            Thông báo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                Xác nhận xóa vai trò{" "}
                <strong>
                  "{permissionData?.displayName || permissionData?.name}"
                </strong>
                ?
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Hành động này không thể hoàn tác.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleOnDelete}
            disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModalDeletePermission;
