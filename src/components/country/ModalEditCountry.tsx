import { useEffect } from "react";
import { showToast } from "@/lib/toast";
import { useCountryStore } from "@/store/slices/countrySlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateCountrySchema } from "@/lib/validations/country";
import type { UpdateCountryFormValues } from "@/lib/validations/country";
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

interface ModalEditCountryProps {
  isOpen: boolean;
  onClose: () => void;
  countryId: string | null;
  onComplete: () => void;
}

export function ModalEditCountry({
  isOpen,
  onClose,
  countryId,
  onComplete,
}: ModalEditCountryProps) {
  const { currentCountry, isFetchingDetail, isUpdating, updateError, fetchCountryById, updateCountry, clearCurrentCountry } =
    useCountryStore();

  const form = useForm<UpdateCountryFormValues>({
    resolver: zodResolver(updateCountrySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (countryId) fetchCountryById(countryId);
    }
    return () => {
      clearCurrentCountry();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, countryId]);

  useEffect(() => {
    if (currentCountry) {
      form.reset({
        name: currentCountry.name || "",
      });
    }
  }, [currentCountry, form]);

  async function onSubmit(data: UpdateCountryFormValues) {
    if (!countryId) {
      showToast.error("Lỗi", "Không tìm thấy ID quốc gia");
      return;
    }

    const success = await updateCountry(countryId, data);

    if (success) {
      showToast.success("Thành công", "Cập nhật quốc gia thành công");
      onComplete();
      onClose();
    } else {
      showToast.error("Lỗi", updateError || "Không thể cập nhật quốc gia");
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

  if (!currentCountry) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="p-6 text-center text-gray-600 dark:text-gray-400">
            Không tìm thấy quốc gia
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
            Chỉnh sửa quốc gia
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
                    Tên quốc gia
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên quốc gia" {...field} />
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
                {isUpdating ? "Đang cập nhật..." : "Cập nhật quốc gia"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
