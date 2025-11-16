import { SearchFilter } from "@/components/common";

interface ActorSearchFilterProps {
  searchTerm: string;
  // eslint-disable-next-line no-unused-vars
  onSearchChange: (value: string) => void;
  isSearching: boolean;
  onSearch: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function ActorSearchFilter({
  searchTerm,
  onSearchChange,
  isSearching,
  onSearch,
  onClearFilters,
  hasActiveFilters,
}: ActorSearchFilterProps) {
  return (
    <SearchFilter
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm theo tên diễn viên..."
      isSearching={isSearching}
      onSearch={onSearch}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );
}
