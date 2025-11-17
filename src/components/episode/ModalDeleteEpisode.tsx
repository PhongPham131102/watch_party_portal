import { showToast } from "@/lib/toast";
import { useEpisodeStore } from "@/store/slices/episodeSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { Episode } from "@/types/episode.types";

interface ModalDeleteEpisodeProps {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode | null;
  onComplete: () => void;
}

export default function ModalDeleteEpisode({
  isOpen,
  onClose,
  episode,
  onComplete,
}: ModalDeleteEpisodeProps) {
  const { isDeleting, deleteError, deleteEpisode } = useEpisodeStore();

  const handleDelete = async () => {
    if (!episode) return;

    const success = await deleteEpisode(episode.id);

    if (success) {
      showToast.success("Thành công", "Xóa tập phim thành công");
      onComplete();
      onClose();
    } else {
      showToast.error("Lỗi", deleteError || "Không thể xóa tập phim");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Xác nhận xóa tập phim
          </DialogTitle>
          <DialogDescription className="text-base pt-4">
            Bạn có chắc chắn muốn xóa tập phim này không? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        {episode && (
          <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 text-white font-bold">
                {episode.episodeNumber}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {episode.title}
                </h3>
                {episode.movie && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {episode.movie.title}
                  </p>
                )}
              </div>
            </div>
            {episode.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {episode.description}
              </p>
            )}
          </div>
        )}

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-medium mb-1">Cảnh báo:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Video đã upload sẽ bị xóa khỏi storage (S3/MinIO)</li>
                <li>Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn</li>
                <li>Hành động này không thể hoàn tác</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Xóa tập phim
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

