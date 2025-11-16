import { z } from "zod";

export const createCountrySchema = z.object({
  name: z
    .string()
    .min(1, "Tên quốc gia không được để trống")
    .max(100, "Tên quốc gia không được vượt quá 100 ký tự")
    .trim(),
});

export const updateCountrySchema = z.object({
  name: z
    .string()
    .min(1, "Tên quốc gia không được để trống")
    .max(100, "Tên quốc gia không được vượt quá 100 ký tự")
    .trim()
    .optional(),
});

export type CreateCountryFormValues = z.infer<typeof createCountrySchema>;
export type UpdateCountryFormValues = z.infer<typeof updateCountrySchema>;
