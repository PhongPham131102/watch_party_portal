import { SearchFilter } from "@/components/common";

interface DirectorSearchFilterProps {
  searchTerm: string;
  // eslint-disable-next-line no-unused-vars
  onSearchChange: (value: string) => void;
  isSearching: boolean;
  onSearch: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function DirectorSearchFilter({
  searchTerm,
  onSearchChange,
  isSearching,
  onSearch,
  onClearFilters,
  hasActiveFilters,
}: DirectorSearchFilterProps) {
  return (
    <SearchFilter
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm theo tên đạo diễn..."
      isSearching={isSearching}
      onSearch={onSearch}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );
}
