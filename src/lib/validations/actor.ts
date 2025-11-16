import { z } from "zod";

export const createActorSchema = z.object({
  name: z
    .string()
    .min(1, "Tên diễn viên không được để trống")
    .max(255, "Tên diễn viên không được vượt quá 255 ký tự")
    .trim(),
  biography: z.string().optional(),
  dateOfBirth: z.string().optional(),
  image: z.instanceof(File).optional(),
});

export const updateActorSchema = z.object({
  name: z
    .string()
    .min(1, "Tên diễn viên không được để trống")
    .max(255, "Tên diễn viên không được vượt quá 255 ký tự")
    .trim()
    .optional(),
  biography: z.string().optional(),
  dateOfBirth: z.string().optional(),
  image: z.instanceof(File).optional(),
});

export type CreateActorFormValues = z.infer<typeof createActorSchema>;
export type UpdateActorFormValues = z.infer<typeof updateActorSchema>;
