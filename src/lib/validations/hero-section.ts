import { z } from "zod";

export const createHeroSectionSchema = z.object({
  movieId: z
    .string()
    .uuid("ID phim phải là UUID hợp lệ")
    .min(1, "Vui lòng chọn phim"),
  order: z
    .number()
    .int("Thứ tự phải là số nguyên")
    .min(0, "Thứ tự phải lớn hơn hoặc bằng 0")
    .optional(),
  title: z
    .string()
    .max(500, "Tiêu đề không được vượt quá 500 ký tự")
    .optional(),
  description: z.string().optional(),
});

export const updateHeroSectionSchema = z.object({
  order: z
    .number()
    .int("Thứ tự phải là số nguyên")
    .min(0, "Thứ tự phải lớn hơn hoặc bằng 0")
    .optional(),
  isActive: z.boolean().optional(),
  title: z
    .string()
    .max(500, "Tiêu đề không được vượt quá 500 ký tự")
    .optional(),
  description: z.string().optional(),
});

export type CreateHeroSectionFormValues = z.infer<typeof createHeroSectionSchema>;
export type UpdateHeroSectionFormValues = z.infer<typeof updateHeroSectionSchema>;

