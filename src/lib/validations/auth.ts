import * as z from "zod";

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, { message: "Tài khoản không được để trống" })
        .min(3, { message: "Tài khoản phải có ít nhất 3 ký tự" }),
    password: z
        .string()
        .min(1, { message: "Mật khẩu không được để trống" })
        .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
