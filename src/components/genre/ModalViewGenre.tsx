import { useEffect } from "react";
import { useGenreStore } from "@/store/slices/genreSlice";
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

interface ModalViewGenreProps {
  isOpen: boolean;
  onClose: () => void;
  genreId: string | null;
}

export default function ModalViewGenre({
  isOpen,
  onClose,
  genreId,
}: ModalViewGenreProps) {
  const { currentGenre, isFetchingDetail, fetchGenreById, clearCurrentGenre } =
    useGenreStore();

  useEffect(() => {
    if (isOpen && genreId) {
      fetchGenreById(genreId);
    }
    return () => {
      clearCurrentGenre();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, genreId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết thể loại
          </DialogTitle>
        </DialogHeader>

        {isFetchingDetail ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        ) : !currentGenre ? (
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Không tìm thấy thể loại
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên thể loại</Label>
              <Input
                id="name"
                value={currentGenre.name}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={currentGenre.slug}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={currentGenre.description || ""}
                disabled
                className="bg-gray-50 dark:bg-gray-900 resize-none"
                rows={4}
                placeholder="Chưa có mô tả"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdAt">Ngày tạo</Label>
              <Input
                id="createdAt"
                value={
                  currentGenre.createdAt
                    ? new Date(currentGenre.createdAt).toLocaleString("vi-VN", {
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

            <div className="space-y-2">
              <Label htmlFor="updatedAt">Ngày cập nhật</Label>
              <Input
                id="updatedAt"
                value={
                  currentGenre.updatedAt
                    ? new Date(currentGenre.updatedAt).toLocaleString("vi-VN", {
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
