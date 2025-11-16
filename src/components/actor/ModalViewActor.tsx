import { useEffect } from "react";
import { useActorStore } from "@/store/slices/actorSlice";
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

interface ModalViewActorProps {
  isOpen: boolean;
  onClose: () => void;
  actorId: string | null;
}

export function ModalViewActor({
  isOpen,
  onClose,
  actorId,
}: ModalViewActorProps) {
  const { currentActor, isFetchingDetail, fetchActorById, clearCurrentActor } =
    useActorStore();

  useEffect(() => {
    if (isOpen && actorId) {
      fetchActorById(actorId);
    }
    return () => {
      clearCurrentActor();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, actorId]);

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
            Chi tiết diễn viên
          </DialogTitle>
        </DialogHeader>

        {isFetchingDetail ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        ) : !currentActor ? (
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Không tìm thấy diễn viên
          </div>
        ) : (
          <div className="space-y-4">
            {currentActor.profileImageUrl && (
              <div className="flex justify-center">
                <img
                  src={currentActor.profileImageUrl}
                  alt={currentActor.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Tên diễn viên</Label>
              <Input
                id="name"
                value={currentActor.name}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={currentActor.slug}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Ngày sinh</Label>
              <Input
                id="dateOfBirth"
                value={formatDate(currentActor.dateOfBirth)}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biography">Tiểu sử</Label>
              <Textarea
                id="biography"
                value={currentActor.biography || ""}
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
                value={formatDateTime(currentActor.createdAt)}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="updatedAt">Ngày cập nhật</Label>
              <Input
                id="updatedAt"
                value={formatDateTime(currentActor.updatedAt)}
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
