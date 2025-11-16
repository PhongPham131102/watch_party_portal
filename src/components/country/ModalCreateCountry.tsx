import { useEffect } from "react";
import { showToast } from "@/lib/toast";
import { useCountryStore } from "@/store/slices/countrySlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createCountrySchema } from "@/lib/validations/country";
import type { CreateCountryFormValues } from "@/lib/validations/country";
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

interface ModalCreateCountryProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function ModalCreateCountry({
  isOpen,
  onClose,
  onComplete,
}: ModalCreateCountryProps) {
  const { createCountry, isCreating, createError } = useCountryStore();

  const form = useForm<CreateCountryFormValues>({
    resolver: zodResolver(createCountrySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function onSubmit(data: CreateCountryFormValues) {
    const success = await createCountry(data);

    if (success) {
      showToast.success("Thành công", "Tạo quốc gia thành công");
      onComplete();
      onClose();
    } else {
      showToast.error("Lỗi", createError || "Không thể tạo quốc gia");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Tạo quốc gia mới
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
                    Tên quốc gia <span className="text-red-500">*</span>
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
                disabled={isCreating}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Đang tạo..." : "Tạo quốc gia"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
