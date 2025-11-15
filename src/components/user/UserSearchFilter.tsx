import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from "@/services/role.service";

interface UserSearchFilterProps {
  searchTerm: string;
  // eslint-disable-next-line no-unused-vars
  onSearchChange: (value: string) => void;
  selectedRoleFilter: string;
  // eslint-disable-next-line no-unused-vars
  onRoleFilterChange: (value: string) => void;
  selectedStatusFilter: string;
  // eslint-disable-next-line no-unused-vars
  onStatusFilterChange: (value: string) => void;
  roles: Role[];
  isSearching: boolean;
  onSearch: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function UserSearchFilter({
  searchTerm,
  onSearchChange,
  selectedRoleFilter,
  onRoleFilterChange,
  selectedStatusFilter,
  onStatusFilterChange,
  roles,
  isSearching,
  onSearch,
  onClearFilters,
  hasActiveFilters,
}: UserSearchFilterProps) {
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="space-y-3">
        {/* Row 1: Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo username hoặc email..."
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
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <Select value={selectedRoleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.displayName || role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

          {/* Search Button */}
          <Button
            onClick={onSearch}
            disabled={isSearching}
            className="cursor-pointer h-9 px-4 bg-blue-600 hover:bg-blue-700 gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-9 px-3 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Xóa bộ lọc</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
