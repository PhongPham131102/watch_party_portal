"use client";

import { cn, showToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/lib/validations/auth";
import type { LoginFormValues } from "@/lib/validations/auth";
import { useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/store/slices/authSlice";

export function LoginForm({ className }: React.ComponentProps<"div">) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      await dispatch(loginUser(data)).unwrap();
      showToast.success("Đăng nhập thành công", "Chào mừng bạn quay trở lại!");
      navigate("/", { replace: true });
    } catch (err) {
      console.log("Login error:", err);
      showToast.error(
        "Đăng nhập thất bại",
        "Tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại!"
      );
      // Error handled by useEffect
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-sky-500 bg-clip-text text-transparent">
          Đăng nhập tài khoản
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Nhập tài khoản và mật khẩu để đăng nhập
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel className="text-foreground/90">Tài khoản</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tài khoản của bạn"
                    {...field}
                    className="border-primary/20 focus-visible:ring-primary/50 transition-all duration-300"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel className="text-foreground/90">Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu của bạn"
                    {...field}
                    className="border-primary/20 focus-visible:ring-primary/50 transition-all duration-300"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
            <span className="relative z-10">
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </span>
            <span className="absolute inset-0 bg-linear-to-r from-primary to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
