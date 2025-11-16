import { useEffect } from "react";
import { useCountryStore } from "@/store/slices/countrySlice";
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

interface ModalViewCountryProps {
  isOpen: boolean;
  onClose: () => void;
  countryId: string | null;
}

export function ModalViewCountry({
  isOpen,
  onClose,
  countryId,
}: ModalViewCountryProps) {
  const { currentCountry, isFetchingDetail, fetchCountryById, clearCurrentCountry } =
    useCountryStore();

  useEffect(() => {
    if (isOpen && countryId) {
      fetchCountryById(countryId);
    }
    return () => {
      clearCurrentCountry();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, countryId]);

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết quốc gia
          </DialogTitle>
        </DialogHeader>

        {isFetchingDetail ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        ) : !currentCountry ? (
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Không tìm thấy quốc gia
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên quốc gia</Label>
              <Input
                id="name"
                value={currentCountry.name}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={currentCountry.slug}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="createdAt">Ngày tạo</Label>
              <Input
                id="createdAt"
                value={formatDateTime(currentCountry.createdAt)}
                disabled
                className="bg-gray-50 dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="updatedAt">Ngày cập nhật</Label>
              <Input
                id="updatedAt"
                value={formatDateTime(currentCountry.updatedAt)}
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
