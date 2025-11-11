import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SmartPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showLimitSelector?: boolean;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  limitOptions?: number[];
}

export function SmartPagination({
  currentPage,
  totalPages,
  onPageChange,
  showLimitSelector = false,
  limit = 20,
  onLimitChange,
  limitOptions = [10, 20, 50, 100],
}: SmartPaginationProps) {
  // Tính toán các trang hiển thị
  const getVisiblePages = () => {
    if (totalPages <= 7) {
      // Nếu tổng số trang <= 7, hiển thị tất cả
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (currentPage <= 4) {
      // Hiển thị: 1, 2, 3, 4, 5, ..., totalPages
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Hiển thị: 1, ..., totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Hiển thị: 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Limit Selector */}
      {showLimitSelector && onLimitChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Hiển thị:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {limitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">mục/trang</span>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Trước
          </Button>

          {/* Page Numbers */}
          {visiblePages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-gray-500">
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <Button
                key={pageNumber}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className={`min-w-10 ${
                  isActive
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "hover:bg-gray-50"
                }`}>
                {pageNumber}
              </Button>
            );
          })}

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1">
            Sau
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Page Info */}
      <div className="text-sm text-gray-600">
        Trang {currentPage} / {totalPages}
      </div>
    </div>
  );
}

export default SmartPagination;
