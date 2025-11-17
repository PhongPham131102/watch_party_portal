/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { showToast } from "@/lib/toast";
import { useEpisodeStore } from "@/store/slices/episodeSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateEpisodeSchema } from "@/lib/validations/episode";
import type { UpdateEpisodeFormValues } from "@/lib/validations/episode";
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
import { Loader2 } from "lucide-react";

interface ModalEditEpisodeProps {
  isOpen: boolean;
  onClose: () => void;
  episodeId: string | null;
  onComplete: () => void;
}

export default function ModalEditEpisode({
  isOpen,
  onClose,
  episodeId,
  onComplete,
}: ModalEditEpisodeProps) {
  const {
    currentEpisode,
    isUpdating,
    updateError,
    fetchEpisodeById,
    updateEpisode,
  } = useEpisodeStore();

  const form = useForm<UpdateEpisodeFormValues>({
    resolver: zodResolver(updateEpisodeSchema),
    defaultValues: {
      episodeNumber: 1,
      title: "",
      description: "",
      durationMinutes: undefined,
      thumbnailUrl: "",
      publishedAt: undefined,
    },
  });

  useEffect(() => {
    if (isOpen && episodeId) {
      fetchEpisodeById(episodeId);
    }
  }, [isOpen, episodeId]);

  useEffect(() => {
    if (currentEpisode) {
      form.reset({
        episodeNumber: currentEpisode.episodeNumber,
        title: currentEpisode.title,
        description: currentEpisode.description || "",
        durationMinutes: currentEpisode.durationMinutes,
        thumbnailUrl: currentEpisode.thumbnailUrl || "",
        publishedAt: currentEpisode.publishedAt,
      });
    }
  }, [currentEpisode]);

  async function onSubmit(data: UpdateEpisodeFormValues) {
    if (!episodeId) return;

    const success = await updateEpisode(episodeId, data);

    if (success) {
      showToast.success("Thành công", "Cập nhật tập phim thành công");
      onComplete();
      onClose();
    } else {
      showToast.error("Lỗi", updateError || "Không thể cập nhật tập phim");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chỉnh sửa tập phim
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Episode Number */}
            <FormField
              control={form.control}
              name="episodeNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tập</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập số tập"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      min="1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề tập phim" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả tập phim"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời lượng (phút)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Nhập thời lượng"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      value={field.value || ""}
                      min="1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Thumbnail URL */}
            <FormField
              control={form.control}
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Thumbnail</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập URL thumbnail" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
                Hủy
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

