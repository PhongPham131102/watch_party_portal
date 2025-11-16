import { z } from "zod";

export const uploadEpisodeSchema = z.object({
  movieId: z
    .string()
    .uuid("Movie ID phải là UUID hợp lệ")
    .min(1, "Movie ID không được để trống"),
  episodeNumber: z
    .number()
    .int("Số tập phải là số nguyên")
    .min(1, "Số tập phải lớn hơn 0"),
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(500, "Tiêu đề không được vượt quá 500 ký tự")
    .trim(),
  description: z
    .string()
    .max(5000, "Mô tả không được vượt quá 5000 ký tự")
    .optional(),
  durationMinutes: z
    .number()
    .int("Thời lượng phải là số nguyên")
    .min(1, "Thời lượng phải ít nhất 1 phút")
    .max(1000, "Thời lượng không được vượt quá 1000 phút")
    .optional(),
  publishedAt: z
    .string()
    .datetime("Ngày xuất bản không hợp lệ")
    .optional(),
  // Video file info
  filename: z
    .string()
    .min(1, "Tên file không được để trống"),
  filetype: z
    .string()
    .optional(),
});

export const updateEpisodeSchema = z.object({
  episodeNumber: z
    .number()
    .int("Số tập phải là số nguyên")
    .min(1, "Số tập phải lớn hơn 0")
    .optional(),
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(500, "Tiêu đề không được vượt quá 500 ký tự")
    .trim()
    .optional(),
  description: z
    .string()
    .max(5000, "Mô tả không được vượt quá 5000 ký tự")
    .optional(),
  durationMinutes: z
    .number()
    .int("Thời lượng phải là số nguyên")
    .min(1, "Thời lượng phải ít nhất 1 phút")
    .max(1000, "Thời lượng không được vượt quá 1000 phút")
    .optional(),
  thumbnailUrl: z
    .string()
    .url("URL thumbnail không hợp lệ")
    .max(500, "URL thumbnail không được vượt quá 500 ký tự")
    .optional(),
  removeThumbnail: z
    .boolean()
    .optional(),
  publishedAt: z
    .string()
    .datetime("Ngày xuất bản không hợp lệ")
    .optional(),
});

export type UploadEpisodeFormValues = z.infer<typeof uploadEpisodeSchema>;
export type UpdateEpisodeFormValues = z.infer<typeof updateEpisodeSchema>;

