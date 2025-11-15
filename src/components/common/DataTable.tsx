import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface DataTableProps {
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: ReactNode;
}

export function DataTable({
  isLoading = false,
  error = null,
  onRetry,
  children,
}: DataTableProps) {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Đang tải...
          </span>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="text-red-600 text-lg font-medium mb-2">
            Lỗi khi tải dữ liệu
          </div>
          <div className="text-gray-500 dark:text-gray-400">{error}</div>
          {onRetry && (
            <Button onClick={onRetry} className="mt-4">
              Thử lại
            </Button>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
