import { z } from "zod";

export const createDirectorSchema = z.object({
  name: z
    .string()
    .min(1, "Tên đạo diễn không được để trống")
    .max(255, "Tên đạo diễn không được vượt quá 255 ký tự")
    .trim(),
  biography: z.string().optional(),
  dateOfBirth: z.string().optional(),
  image: z.instanceof(File).optional(),
});

export const updateDirectorSchema = z.object({
  name: z
    .string()
    .min(1, "Tên đạo diễn không được để trống")
    .max(255, "Tên đạo diễn không được vượt quá 255 ký tự")
    .trim()
    .optional(),
  biography: z.string().optional(),
  dateOfBirth: z.string().optional(),
  image: z.instanceof(File).optional(),
});

export type CreateDirectorFormValues = z.infer<typeof createDirectorSchema>;
export type UpdateDirectorFormValues = z.infer<typeof updateDirectorSchema>;
