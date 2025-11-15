import { useEffect } from "react";
import { showToast } from "@/lib/toast";
import { useGenreStore } from "@/store/slices/genreSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateGenreSchema } from "@/lib/validations/genre";
import type { UpdateGenreFormValues } from "@/lib/validations/genre";
import type { UpdateGenreDto } from "@/types/genre.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ModalEditGenreProps {
  isOpen: boolean;
  onClose: () => void;
  genreId: string | null;
  onComplete: () => void;
}

export default function ModalEditGenre({
  isOpen,
  onClose,
  genreId,
  onComplete,
}: ModalEditGenreProps) {
  const { currentGenre, isFetchingDetail, isUpdating, updateError, fetchGenreById, updateGenre, clearCurrentGenre } =
    useGenreStore();

  const form = useForm<UpdateGenreFormValues>({
    resolver: zodResolver(updateGenreSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (genreId) fetchGenreById(genreId);
    }
    return () => {
      clearCurrentGenre();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, genreId]);

  useEffect(() => {
    if (currentGenre) {
      form.reset({
        name: currentGenre.name || "",
        description: currentGenre.description || "",
      });
    }
  }, [currentGenre, form]);

  async function onSubmit(data: UpdateGenreFormValues) {
    if (!genreId) {
      showToast.error("Lỗi", "Không tìm thấy ID thể loại");
      return;
    }

    try {
      const updateData: UpdateGenreDto = {
        name: data.name,
        description: data.description || undefined,
      };

      const success = await updateGenre(genreId, updateData);

      if (success) {
        showToast.success("Thành công", "Cập nhật thể loại thành công");
        onComplete();
        onClose();
      } else {
        showToast.error("Lỗi", updateError || "Không thể cập nhật thể loại");
      }
    } catch {
      showToast.error("Lỗi", updateError || "Có lỗi xảy ra khi cập nhật thể loại");
    }
  }

  if (isFetchingDetail) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentGenre) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Không tìm thấy thể loại
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chỉnh sửa thể loại
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tên thể loại <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên thể loại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả thể loại"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdating}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Đang cập nhật..." : "Cập nhật thể loại"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
