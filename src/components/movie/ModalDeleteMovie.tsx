import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMovieStore } from "@/store/slices/movieSlice";
import type { Movie } from "@/types/movie.types";

interface ModalDeleteMovieProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
  onComplete: () => void;
}

export function ModalDeleteMovie({
  isOpen,
  onClose,
  movie,
  onComplete,
}: ModalDeleteMovieProps) {
  const { removeMovie, loading } = useMovieStore();

  const handleDelete = async () => {
    if (!movie) return;

    const result = await removeMovie(movie.id);
    
    if (result.type === "movies/deleteMovie/fulfilled") {
      onComplete();
      onClose();
    }
  };

  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận xóa phim</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa phim <span className="font-semibold text-gray-900 dark:text-white">"{movie.title}"</span>? 
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}>
            Hủy
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}>
            {loading ? "Đang xóa..." : "Xóa phim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
