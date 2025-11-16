import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { uploadEpisodeSchema } from "@/lib/validations/episode";
import type { UploadEpisodeFormValues } from "@/lib/validations/episode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TusUploadComponent } from "./TusUploadComponent";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Import movie list (you may need to fetch from API)
import { useMovieStore } from "@/store/slices/movieSlice";

interface ModalUploadEpisodeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  preselectedMovieId?: string;
}

export default function ModalUploadEpisode({
  isOpen,
  onClose,
  onComplete,
  preselectedMovieId,
}: ModalUploadEpisodeProps) {
  const { movies, loadMovies } = useMovieStore();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<Omit<UploadEpisodeFormValues, 'filename' | 'filetype'>>({
    resolver: zodResolver(uploadEpisodeSchema.omit({ filename: true, filetype: true })),
    defaultValues: {
      movieId: preselectedMovieId || "",
      episodeNumber: 1,
      title: "",
      description: "",
      durationMinutes: undefined,
      publishedAt: undefined,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        movieId: preselectedMovieId || "",
        episodeNumber: 1,
        title: "",
        description: "",
        durationMinutes: undefined,
        publishedAt: undefined,
      });
      setIsUploading(false);
      
      // Load movies for dropdown
      if (movies.length === 0) {
        loadMovies({ page: 1, limit: 100, sortBy: 'title', sortOrder: 'ASC' });
      }
    }
  }, [isOpen, preselectedMovieId]);

  const handleUploadComplete = (episodeId: string, uploadId: string) => {
    console.log('Episode created:', episodeId, 'Upload ID:', uploadId);
    setIsUploading(false);
    onComplete();
    onClose();
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    setIsUploading(false);
  };

  const handleCancel = () => {
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Upload tập phim mới
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form noValidate className="space-y-4">
            {/* Movie Selection */}
            <FormField
              control={form.control}
              name="movieId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phim <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phim" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {movies.map((movie) => (
                        <SelectItem key={movie.id} value={movie.id}>
                          {movie.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Episode Number */}
            <FormField
              control={form.control}
              name="episodeNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Số tập <span className="text-red-500">*</span>
                  </FormLabel>
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
                  <FormLabel>
                    Tiêu đề <span className="text-red-500">*</span>
                  </FormLabel>
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
                      rows={3}
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

            {/* TUS Upload Component */}
            {form.formState.isValid && form.watch('movieId') && form.watch('title') && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-3">Upload video</h3>
                <TusUploadComponent
                  episodeMetadata={{
                    movieId: form.watch('movieId'),
                    episodeNumber: form.watch('episodeNumber'),
                    title: form.watch('title'),
                    description: form.watch('description'),
                    durationMinutes: form.watch('durationMinutes'),
                  }}
                  onUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  onCancel={handleCancel}
                />
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

