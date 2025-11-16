import { useEffect } from "react";
import { useDirectorStore } from "@/store/slices/directorSlice";
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
import { Textarea } from "@/components/ui/textarea";

interface ModalViewDirectorProps {
  isOpen: boolean;
  onClose: () => void;
  directorId: string | null;
}

export function ModalViewDirector({
  isOpen,
  onClose,
  directorId,
}: ModalViewDirectorProps) {
  const { currentDirector, isFetchingDetail, fetchDirectorById, clearCurrentDirector } =
    useDirectorStore();

  useEffect(() => {
    if (isOpen && directorId) {
      fetchDirectorById(directorId);
    }
    return () => {
      clearCurrentDirector();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, directorId]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Chưa có thông tin";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết đạo diễn
          </DialogTitle>
        </DialogHeader>

        {isFetchingDetail ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        ) : !currentDirector ? (
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Không tìm thấy đạo diễn
          </div>
        ) : (
          <div className="space-y-4">
            {currentDirector.profileImageUrl && (
              <div className="flex justify-center">
                <img
                  src={currentDirector.profileImageUrl}
                  alt={currentDirector.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Tên đạo diễn</Label>
              <Input
                id="name"
                value={currentDirector.name}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={currentDirector.slug}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input
                id="dateOfBirth"
                value={formatDate(currentDirector.dateOfBirth)}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography">Tiểu sử</Label>
              <Textarea
                id="biography"
                value={currentDirector.biography || ""}
                disabled
                className="bg-gray-50 dark:bg-gray-900 resize-none"
                rows={6}
                placeholder="Chưa có tiểu sử"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdAt">Ngày tạo</Label>
              <Input
                id="createdAt"
                value={formatDateTime(currentDirector.createdAt)}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="updatedAt">Ngày cập nhật</Label>
              <Input
                id="updatedAt"
                value={formatDateTime(currentDirector.updatedAt)}
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
