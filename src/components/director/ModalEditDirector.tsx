import React, { useEffect, useState, useRef } from "react";
import { showToast } from "@/lib/toast";
import { useDirectorStore } from "@/store/slices/directorSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateDirectorSchema } from "@/lib/validations/director";
import type { UpdateDirectorFormValues } from "@/lib/validations/director";
import type { UpdateDirectorDto } from "@/types/director.types";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Upload, X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ModalEditDirectorProps {
  isOpen: boolean;
  onClose: () => void;
  directorId: string | null;
  onComplete: () => void;
}

export function ModalEditDirector({
  isOpen,
  onClose,
  directorId,
  onComplete,
}: ModalEditDirectorProps) {
  const { currentDirector, isFetchingDetail, isUpdating, updateError, fetchDirectorById, updateDirector, clearCurrentDirector } =
    useDirectorStore();
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [hasOriginalImage, setHasOriginalImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UpdateDirectorFormValues>({
    resolver: zodResolver(updateDirectorSchema),
    defaultValues: {
      name: "",
      biography: "",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (directorId) fetchDirectorById(directorId);
    }
    return () => {
      clearCurrentDirector();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, directorId]);

  useEffect(() => {
    if (currentDirector) {
      form.reset({
        name: currentDirector.name || "",
        biography: currentDirector.biography || "",
        dateOfBirth: currentDirector.dateOfBirth || "",
      });
      const hasImage = !!currentDirector.profileImageUrl;
      setHasOriginalImage(hasImage);
      setPreview(currentDirector.profileImageUrl || null);
      setIsImageRemoved(false);
    }
  }, [currentDirector, form]);

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast.error("Lỗi", "Vui lòng chọn file ảnh");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        showToast.error("Lỗi", "Kích thước ảnh không được vượt quá 10MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('image', file);
      setIsImageRemoved(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    form.setValue('image', undefined);
    if (hasOriginalImage) {
      setIsImageRemoved(true);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function onSubmit(data: UpdateDirectorFormValues) {
    if (!directorId) {
      showToast.error("Lỗi", "Không tìm thấy ID đạo diễn");
      return;
    }

    try {
      const updateData: UpdateDirectorDto = {
        name: data.name,
        biography: data.biography || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
      };

      // Trường hợp 1: Gửi ảnh mới
      if (data.image) {
        updateData.image = data.image;
      }
      // Trường hợp 2: Xóa ảnh (có ảnh cũ và user đã xóa, không có ảnh mới)
      else if (isImageRemoved && hasOriginalImage) {
        updateData.removeImage = true;
      }
      // Trường hợp 3: Giữ nguyên ảnh cũ - không cần làm gì

      const success = await updateDirector(directorId, updateData);

      if (success) {
        showToast.success("Thành công", "Cập nhật đạo diễn thành công");
        onComplete();
        onClose();
      } else {
        showToast.error("Lỗi", updateError || "Không thể cập nhật đạo diễn");
      }
    } catch {
      showToast.error("Lỗi", updateError || "Có lỗi xảy ra khi cập nhật đạo diễn");
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

  if (!currentDirector) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Không tìm thấy đạo diễn
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chỉnh sửa đạo diễn
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
                    Tên đạo diễn
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên đạo diễn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiểu sử</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập tiểu sử đạo diễn"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày sinh</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "dd/MM/yyyy", { locale: vi })
                          ) : (
                            <span>Chọn ngày sinh</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => {
                          field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                        }}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={vi}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Ảnh đại diện</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {preview ? (
                        <div className="relative group">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-64 object-contain rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                          />
                          <Button
                            type="button"
                            size="icon"
                            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg opacity-90 hover:opacity-100 transition-all"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                            isDragging
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e.target.files?.[0])}
                          />
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                              <Upload className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Kéo thả ảnh vào đây hoặc nhấn để chọn file
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Hỗ trợ: JPG, PNG, GIF (tối đa 10MB)
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
                {isUpdating ? "Đang cập nhật..." : "Cập nhật đạo diễn"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
