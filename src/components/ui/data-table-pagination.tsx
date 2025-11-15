/* eslint-disable no-unused-vars */
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
}

export function DataTablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
}: DataTablePaginationProps) {
  const getVisiblePages = () => {
    const pages: (number | "ellipsis-prev" | "ellipsis-next")[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is less than or equal to 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Determine which pages to show in the middle
      if (currentPage <= 4) {
        // Near start: 1 2 3 4 5 ... last
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("ellipsis-next");
      } else if (currentPage >= totalPages - 3) {
        // Near end: 1 ... last-4 last-3 last-2 last-1 last
        pages.push("ellipsis-prev");
        for (let i = totalPages - 4; i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        // Middle: 1 ... current-1 current current+1 ... last
        pages.push("ellipsis-prev");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("ellipsis-next");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const handleEllipsisClick = (type: "prev" | "next") => {
    if (type === "prev") {
      // Jump backward by 5 pages or to page 2
      const targetPage = Math.max(2, currentPage - 5);
      onPageChange(targetPage);
    } else {
      // Jump forward by 5 pages or to second to last page
      const targetPage = Math.min(totalPages - 1, currentPage + 5);
      onPageChange(targetPage);
    }
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 bg-gray-50/50 dark:bg-gray-900/20">
      {/* Left: Page info and size selector */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
          Hiển thị <span className="font-semibold">{startItem}</span> - <span className="font-semibold">{endItem}</span> trong{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">{totalItems}</span> kết quả
        </div>
        
        {showPageSizeSelector && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Hiển thị:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="h-9 w-[75px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Pagination controls - Right */}
      <div className="flex justify-center lg:justify-end shrink-0">
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      onPageChange(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {visiblePages.map((page, index) => {
                if (page === "ellipsis-prev" || page === "ellipsis-next") {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <div
                        onClick={() =>
                          handleEllipsisClick(
                            page === "ellipsis-prev" ? "prev" : "next"
                          )
                        }
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <PaginationEllipsis />
                      </div>
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(page as number);
                      }}
                      isActive={currentPage === page}
                      className={`cursor-pointer ${
                        currentPage === page
                          ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                          : ""
                      }`}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      onPageChange(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
