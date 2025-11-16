import React, { useEffect, useState, useRef } from "react";
import { showToast } from "@/lib/toast";
import { useMovieStore } from "@/store/slices/movieSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateMovieSchema } from "@/lib/validations/movie";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect, type MultiSelectOption } from "@/components/ui/multi-select";
import { X, Film, Image as ImageIcon } from "lucide-react";
import { genreService } from "@/services/genre.service";
import { directorService } from "@/services/director.service";
import { actorService } from "@/services/actor.service";
import { countryService } from "@/services/country.service";
import type { Movie } from "@/types/movie.types";
import type { Genre } from "@/types/genre.types";
import type { Director } from "@/types/director.types";
import type { Actor } from "@/types/actor.types";
import type { Country } from "@/types/country.types";

type UpdateMovieFormValues = z.infer<typeof updateMovieSchema>;

interface ModalEditMovieProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
  onComplete: () => void;
}

export function ModalEditMovie({
  isOpen,
  onClose,
  movie,
  onComplete,
}: ModalEditMovieProps) {
  const { modifyMovie, loading } = useMovieStore();
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [backdropPreview, setBackdropPreview] = useState<string | null>(null);
  const [isPosterDragging, setIsPosterDragging] = useState(false);
  const [isBackdropDragging, setIsBackdropDragging] = useState(false);
  const [isPosterRemoved, setIsPosterRemoved] = useState(false);
  const [isBackdropRemoved, setIsBackdropRemoved] = useState(false);
  const [hasOriginalPoster, setHasOriginalPoster] = useState(false);
  const [hasOriginalBackdrop, setHasOriginalBackdrop] = useState(false);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const backdropInputRef = useRef<HTMLInputElement>(null);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDirectors, setSelectedDirectors] = useState<string[]>([]);
  const [selectedActors, setSelectedActors] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const form = useForm<UpdateMovieFormValues>({
    resolver: zodResolver(updateMovieSchema),
    defaultValues: {
      title: "",
      description: "",
      originalTitle: "",
      trailerUrl: "",
    },
  });

  useEffect(() => {
    if (isOpen && movie) {
      form.reset({
        title: movie.title,
        description: movie.description || "",
        originalTitle: movie.originalTitle || "",
        releaseYear: movie.releaseYear || undefined,
        durationMinutes: movie.durationMinutes || undefined,
        trailerUrl: movie.trailerUrl || "",
        status: movie.status,
        contentType: movie.contentType,
      });

      // Set original images
      if (movie.posterUrl) {
        setPosterPreview(movie.posterUrl);
        setHasOriginalPoster(true);
      } else {
        setPosterPreview(null);
        setHasOriginalPoster(false);
      }

      if (movie.backdropUrl) {
        setBackdropPreview(movie.backdropUrl);
        setHasOriginalBackdrop(true);
      } else {
        setBackdropPreview(null);
        setHasOriginalBackdrop(false);
      }

      setIsPosterRemoved(false);
      setIsBackdropRemoved(false);
      
      loadOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, movie]);

  const loadOptions = async () => {
    try {
      const [genresRes, directorsRes, actorsRes, countriesRes] = await Promise.all([
        genreService.getGenres({ limit: 1000 }),
        directorService.getDirectors({ limit: 1000 }),
        actorService.getActors({ limit: 1000 }),
        countryService.getCountries({ limit: 1000 }),
      ]);
      
      setGenres(Array.isArray(genresRes.data) ? genresRes.data : genresRes.data.data || []);
      setDirectors(Array.isArray(directorsRes.data) ? directorsRes.data : directorsRes.data.data || []);
      setActors(Array.isArray(actorsRes.data) ? actorsRes.data : actorsRes.data.data || []);
      setCountries(Array.isArray(countriesRes.data) ? countriesRes.data : countriesRes.data.data || []);

      // Load existing relationships from movie
      if (movie) {
        setSelectedGenres(movie.genres?.map(g => g.id) || []);
        setSelectedDirectors(movie.directors?.map(d => d.id) || []);
        setSelectedActors(movie.actors?.map(a => a.id) || []);
        setSelectedCountries(movie.countries?.map(c => c.id) || []);
      }
    } catch (error) {
      console.error("Error loading options:", error);
      showToast.error("Không thể tải danh sách thể loại, đạo diễn, diễn viên, quốc gia");
    }
  };

  const handleFileChange = (
    file: File | undefined,
    type: "poster" | "backdrop"
  ) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        showToast.error("Vui lòng chọn file ảnh");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast.error("Kích thước ảnh không được vượt quá 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "poster") {
          setPosterPreview(reader.result as string);
          setIsPosterRemoved(false);
        } else {
          setBackdropPreview(reader.result as string);
          setIsBackdropRemoved(false);
        }
      };
      reader.readAsDataURL(file);
      form.setValue(type, file);
    }
  };

  const handleDragOver = (
    e: React.DragEvent,
    type: "poster" | "backdrop"
  ) => {
    e.preventDefault();
    if (type === "poster") {
      setIsPosterDragging(true);
    } else {
      setIsBackdropDragging(true);
    }
  };

  const handleDragLeave = (
    e: React.DragEvent,
    type: "poster" | "backdrop"
  ) => {
    e.preventDefault();
    if (type === "poster") {
      setIsPosterDragging(false);
    } else {
      setIsBackdropDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "poster" | "backdrop") => {
    e.preventDefault();
    if (type === "poster") {
      setIsPosterDragging(false);
    } else {
      setIsBackdropDragging(false);
    }
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file, type);
    }
  };

  const handleRemoveImage = (type: "poster" | "backdrop") => {
    if (type === "poster") {
      setPosterPreview(null);
      setIsPosterRemoved(true);
      form.setValue("poster", undefined);
      if (posterInputRef.current) {
        posterInputRef.current.value = "";
      }
    } else {
      setBackdropPreview(null);
      setIsBackdropRemoved(true);
      form.setValue("backdrop", undefined);
      if (backdropInputRef.current) {
        backdropInputRef.current.value = "";
      }
    }
  };

  async function onSubmit(data: UpdateMovieFormValues) {
    if (!movie) return;

    const movieData: Record<string, unknown> = {
      title: data.title,
      description: data.description || undefined,
      originalTitle: data.originalTitle || undefined,
      releaseYear: data.releaseYear,
      durationMinutes: data.durationMinutes,
      trailerUrl: data.trailerUrl || undefined,
      status: data.status,
      contentType: data.contentType,
      genreIds: selectedGenres,
      directorIds: selectedDirectors,
      actorIds: selectedActors,
      countryIds: selectedCountries,
    };

    // Handle poster: upload new OR remove OR keep original
    if (data.poster) {
      movieData.poster = data.poster;
    } else if (isPosterRemoved && hasOriginalPoster) {
      movieData.removePoster = true;
    }

    // Handle backdrop: upload new OR remove OR keep original
    if (data.backdrop) {
      movieData.backdrop = data.backdrop;
    } else if (isBackdropRemoved && hasOriginalBackdrop) {
      movieData.removeBackdrop = true;
    }

    const result = await modifyMovie(movie.id, movieData);

    if (result.type === "movies/updateMovie/fulfilled") {
      onComplete();
      onClose();
    }
  }

  const renderImageUpload = (
    type: "poster" | "backdrop",
    label: string,
    icon: React.ReactNode,
    currentUrl: string | null | undefined
  ) => {
    const preview = type === "poster" ? posterPreview : backdropPreview;
    const isDragging =
      type === "poster" ? isPosterDragging : isBackdropDragging;
    const inputRef = type === "poster" ? posterInputRef : backdropInputRef;

    return (
      <FormField
        control={form.control}
        name={type}
        render={() => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {preview ? (
                  <div className="relative group">
                    <img
                      src={preview}
                      alt={`${type} preview`}
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    />
                    <Button
                      type="button"
                      size="icon"
                      className="absolute top-3 right-3 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg opacity-90 hover:opacity-100 transition-all"
                      onClick={() => handleRemoveImage(type)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragging
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                    onDragOver={(e) => handleDragOver(e, type)}
                    onDragLeave={(e) => handleDragLeave(e, type)}
                    onDrop={(e) => handleDrop(e, type)}
                    onClick={() => inputRef.current?.click()}>
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange(e.target.files?.[0], type)
                      }
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        {icon}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {currentUrl ? "Thay đổi ảnh" : "Tải ảnh lên"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          JPG, PNG, GIF (tối đa 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chỉnh sửa phim
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tiêu đề <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tiêu đề phim" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên gốc</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên gốc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả phim"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="releaseYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Năm phát hành</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="VD: 2024"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời lượng (phút)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="VD: 120"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="trailerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Trailer</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Bản nháp</SelectItem>
                        <SelectItem value="published">Đã xuất bản</SelectItem>
                        <SelectItem value="archived">Lưu trữ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại nội dung</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="movie">Phim lẻ</SelectItem>
                        <SelectItem value="series">Phim bộ</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel>Thể loại</FormLabel>
                <MultiSelect
                  options={genres.map((g): MultiSelectOption => ({ label: g.name, value: g.id }))}
                  value={selectedGenres}
                  onChange={setSelectedGenres}
                  placeholder="Chọn thể loại..."
                  noResultsText="Không tìm thấy thể loại"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Quốc gia</FormLabel>
                <MultiSelect
                  options={countries.map((c): MultiSelectOption => ({ label: c.name, value: c.id }))}
                  value={selectedCountries}
                  onChange={setSelectedCountries}
                  placeholder="Chọn quốc gia..."
                  noResultsText="Không tìm thấy quốc gia"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel>Đạo diễn</FormLabel>
                <MultiSelect
                  options={directors.map((d): MultiSelectOption => ({ label: d.name, value: d.id }))}
                  value={selectedDirectors}
                  onChange={setSelectedDirectors}
                  placeholder="Chọn đạo diễn..."
                  noResultsText="Không tìm thấy đạo diễn"
                />
              </div>

              <div className="space-y-2">
                <FormLabel>Diễn viên</FormLabel>
                <MultiSelect
                  options={actors.map((a): MultiSelectOption => ({ label: a.name, value: a.id }))}
                  value={selectedActors}
                  onChange={setSelectedActors}
                  placeholder="Chọn diễn viên..."
                  noResultsText="Không tìm thấy diễn viên"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {renderImageUpload(
                "poster",
                "Poster",
                <Film className="h-6 w-6 text-gray-400" />,
                movie.posterUrl
              )}
              {renderImageUpload(
                "backdrop",
                "Backdrop",
                <ImageIcon className="h-6 w-6 text-gray-400" />,
                movie.backdropUrl
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}>
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang cập nhật..." : "Cập nhật phim"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
