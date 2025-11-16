import React, { useState } from "react";
import { showToast } from "@/lib/toast";
import { useDirectorStore } from "@/store/slices/directorSlice";
import type { Director } from "@/types/director.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ModalDeleteDirectorProps {
  isOpen: boolean;
  onClose: () => void;
  director: Partial<Director> | null;
  onComplete: () => void;
}

export function ModalDeleteDirector({
  isOpen,
  onClose,
  director,
  onComplete,
}: ModalDeleteDirectorProps) {
  const { deleteDirector, deleteError } = useDirectorStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!director?.id) {
      showToast.error("Lỗi", "Không tìm thấy thông tin đạo diễn");
      return;
    }

    try {
      setIsLoading(true);
      const success = await deleteDirector(director.id);

      if (success) {
        showToast.success("Thành công", "Xóa đạo diễn thành công");
        onComplete();
        onClose();
      } else {
        showToast.error("Lỗi", deleteError || "Không thể xóa đạo diễn");
      }
    } catch {
      showToast.error("Lỗi", deleteError || "Có lỗi xảy ra khi xóa đạo diễn");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Không có";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Xác nhận xóa
          </DialogTitle>
        </DialogHeader>

        {director && (
          <>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Xóa đạo diễn
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Thông tin đạo diễn:
                </h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Tên đạo diễn:</span> {director.name}
                  </div>
                  <div>
                    <span className="font-medium">Slug:</span> {director.slug || "Không có"}
                  </div>
                  <div>
                    <span className="font-medium">Ngày sinh:</span> {formatDate(director.dateOfBirth)}
                  </div>
                  <div>
                    <span className="font-medium">Tiểu sử:</span>{" "}
                    {director.biography ? (
                      <span className="line-clamp-2">{director.biography}</span>
                    ) : (
                      "Không có"
                    )}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Bạn có chắc chắn muốn xóa đạo diễn{" "}
                <strong>{director.name}</strong>? Tất cả dữ liệu liên quan sẽ bị xóa
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
