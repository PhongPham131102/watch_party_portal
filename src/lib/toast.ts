/* eslint-disable no-unused-vars */
import { toast } from "sonner";

export const showToast = {
  success: (message: string, description?: string) => {
    return toast.success(message, {
      description,
      duration: 4000,
    });
  },

  error: (message: string, description?: string) => {
    return toast.error(message, {
      description,
      duration: 5000,
    });
  },

  warning: (message: string, description?: string) => {
    return toast.warning(message, {
      description,
      duration: 4000,
    });
  },

  info: (message: string, description?: string) => {
    return toast.info(message, {
      description,
      duration: 3000,
    });
  },

  loading: (message: string, description?: string) => {
    return toast.loading(message, {
      description,
    });
  },

  // Custom toast với action button
  action: (
    message: string,
    description?: string,
    action?: { label: string; onClick: () => void }
  ) => {
    return toast(message, {
      description,
      action,
      duration: 6000,
    });
  },

  // Dismiss toast
  dismiss: (toastId?: string | number) => {
    return toast.dismiss(toastId);
  },

  // Promise toast - hiển thị loading rồi success/error
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((_data: T) => string);
      error: string | ((_err: unknown) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },
};
