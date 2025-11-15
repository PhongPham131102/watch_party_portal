import { z } from "zod";

export const createGenreSchema = z.object({
  name: z
    .string()
    .min(1, "Tên thể loại không được để trống")
    .max(100, "Tên thể loại không được vượt quá 100 ký tự")
    .trim(),
  description: z.string().optional(),
});

export const updateGenreSchema = z.object({
  name: z
    .string()
    .min(1, "Tên thể loại không được để trống")
    .max(100, "Tên thể loại không được vượt quá 100 ký tự")
    .trim()
    .optional(),
  description: z.string().optional(),
});

export type CreateGenreFormValues = z.infer<typeof createGenreSchema>;
export type UpdateGenreFormValues = z.infer<typeof updateGenreSchema>;
