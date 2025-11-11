"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-gray-600",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white group-[.toast]:hover:bg-blue-700",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-200",
          closeButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500 group-[.toast]:hover:bg-gray-200",
          // Success toast
          success:
            "group-[.toast]:bg-green-50 group-[.toast]:border-green-200 group-[.toast]:text-green-900",
          // Error toast
          error:
            "group-[.toast]:bg-red-50 group-[.toast]:border-red-200 group-[.toast]:text-red-900",
          // Warning toast
          warning:
            "group-[.toast]:bg-yellow-50 group-[.toast]:border-yellow-200 group-[.toast]:text-yellow-900",
          // Info toast
          info: "group-[.toast]:bg-blue-50 group-[.toast]:border-blue-200 group-[.toast]:text-blue-900",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
