import { z } from "zod";

export const createMovieSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(500, "Tiêu đề không được vượt quá 500 ký tự")
    .trim(),
  description: z.string().optional(),
  originalTitle: z
    .string()
    .max(500, "Tên gốc không được vượt quá 500 ký tự")
    .optional(),
  releaseYear: z
    .number()
    .min(1900, "Năm phát hành phải từ 1900 trở lên")
    .max(2100, "Năm phát hành không được vượt quá 2100")
    .optional(),
  durationMinutes: z
    .number()
    .min(1, "Thời lượng phải ít nhất 1 phút")
    .max(1000, "Thời lượng không được vượt quá 1000 phút")
    .optional(),
  trailerUrl: z
    .string()
    .url("URL trailer không hợp lệ")
    .max(500, "URL trailer không được vượt quá 500 ký tự")
    .optional(),
  status: z
    .string()
    .refine((val) => ["draft", "published", "archived"].includes(val), {
      message: "Trạng thái phải là: draft, published hoặc archived",
    })
    .optional(),
  contentType: z
    .string()
    .refine((val) => ["movie", "series"].includes(val), {
      message: "Loại nội dung phải là: movie hoặc series",
    })
    .optional(),
  poster: z.instanceof(File).optional(),
  backdrop: z.instanceof(File).optional(),
  genreIds: z.array(z.string().uuid("ID thể loại phải là UUID hợp lệ")).optional(),
  directorIds: z.array(z.string().uuid("ID đạo diễn phải là UUID hợp lệ")).optional(),
  actorIds: z.array(z.string().uuid("ID diễn viên phải là UUID hợp lệ")).optional(),
  countryIds: z.array(z.string().uuid("ID quốc gia phải là UUID hợp lệ")).optional(),
});

export const updateMovieSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(500, "Tiêu đề không được vượt quá 500 ký tự")
    .trim()
    .optional(),
  description: z.string().optional(),
  originalTitle: z
    .string()
    .max(500, "Tên gốc không được vượt quá 500 ký tự")
    .optional(),
  releaseYear: z
    .number()
    .min(1900, "Năm phát hành phải từ 1900 trở lên")
    .max(2100, "Năm phát hành không được vượt quá 2100")
    .optional(),
  durationMinutes: z
    .number()
    .min(1, "Thời lượng phải ít nhất 1 phút")
    .max(1000, "Thời lượng không được vượt quá 1000 phút")
    .optional(),
  trailerUrl: z
    .string()
    .url("URL trailer không hợp lệ")
    .max(500, "URL trailer không được vượt quá 500 ký tự")
    .optional(),
  status: z
    .string()
    .refine((val) => ["draft", "published", "archived"].includes(val), {
      message: "Trạng thái phải là: draft, published hoặc archived",
    })
    .optional(),
  contentType: z
    .string()
    .refine((val) => ["movie", "series"].includes(val), {
      message: "Loại nội dung phải là: movie hoặc series",
    })
    .optional(),
  poster: z.instanceof(File).optional(),
  backdrop: z.instanceof(File).optional(),
  genreIds: z.array(z.string().uuid("ID thể loại phải là UUID hợp lệ")).optional(),
  directorIds: z.array(z.string().uuid("ID đạo diễn phải là UUID hợp lệ")).optional(),
  actorIds: z.array(z.string().uuid("ID diễn viên phải là UUID hợp lệ")).optional(),
  countryIds: z.array(z.string().uuid("ID quốc gia phải là UUID hợp lệ")).optional(),
});

export type CreateMovieFormValues = z.infer<typeof createMovieSchema>;
export type UpdateMovieFormValues = z.infer<typeof updateMovieSchema>;
