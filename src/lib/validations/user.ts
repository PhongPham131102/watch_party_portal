import * as z from "zod";

export const createUserSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Tên đăng nhập không được để trống" })
    .min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" })
    .max(50, { message: "Tên đăng nhập không được quá 50 ký tự" })
    .refine((val) => /^[a-zA-Z0-9_]+$/.test(val), {
      message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới",
    }),
  email: z
    .string()
    .min(1, { message: "Email không được để trống" })
    .max(255, { message: "Email không được quá 255 ký tự" })
    .refine((val) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), {
      message: "Email không hợp lệ",
    }),
  password: z
    .string()
    .min(1, { message: "Mật khẩu không được để trống" })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
    .max(100, { message: "Mật khẩu không được quá 100 ký tự" }),
  roleId: z.string().min(1, { message: "Vui lòng chọn vai trò" }),
});

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Tên đăng nhập không được để trống" })
    .min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" })
    .max(50, { message: "Tên đăng nhập không được quá 50 ký tự" })
    .refine((val) => /^[a-zA-Z0-9_]+$/.test(val), {
      message: "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới",
    }),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || val.length <= 255,
      { message: "Email không được quá 255 ký tự" }
    )
    .refine(
      (val) => !val || val.length === 0 || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val),
      { message: "Email không hợp lệ" }
    ),
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length === 0 || val.length >= 6,
      { message: "Mật khẩu phải có ít nhất 6 ký tự" }
    )
    .refine(
      (val) => !val || val.length === 0 || val.length <= 100,
      { message: "Mật khẩu không được quá 100 ký tự" }
    ),
  isActive: z.boolean(),
  roleId: z.string().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
