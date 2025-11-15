/* eslint-disable no-unused-vars */
import type { ReactNode } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  isSearching?: boolean;
  onSearch?: () => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  filters?: ReactNode;
  showSearchButton?: boolean;
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  isSearching = false,
  onSearch,
  onClearFilters,
  hasActiveFilters = false,
  filters,
  showSearchButton = true,
}: SearchFilterProps) {
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="space-y-3">
        {/* Row 1: Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-10 h-10"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          )}
        </div>

        {/* Row 2: Filters */}
        {(filters || showSearchButton || hasActiveFilters) && (
          <div className="flex flex-wrap items-center gap-3">
            {filters}

            {(showSearchButton || hasActiveFilters) && (
              <>
                {/* Divider */}
                {filters && (
                  <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                )}

                {/* Search Button */}
                {showSearchButton && onSearch && (
                  <Button
                    onClick={onSearch}
                    disabled={isSearching}
                    className="cursor-pointer h-9 px-4 bg-blue-600 hover:bg-blue-700 gap-2">
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Tìm kiếm</span>
                  </Button>
                )}

                {/* Clear Filters */}
                {hasActiveFilters && onClearFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-9 px-3 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Xóa bộ lọc</span>
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
