import { SearchFilter } from "@/components/common";
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
    <SearchFilter
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm theo tên, email, số điện thoại..."
      isSearching={isSearching}
      onSearch={onSearch}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
      filters={
        <>
          {/* Role Filter */}
          <Select value={selectedRoleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Lọc theo vai trò" />
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
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="true">Đang hoạt động</SelectItem>
              <SelectItem value="false">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    />
  );
}
