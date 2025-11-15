import { SearchFilter } from "@/components/common";

interface GenreSearchFilterProps {
  searchTerm: string;
  // eslint-disable-next-line no-unused-vars
  onSearchChange: (value: string) => void;
  isSearching: boolean;
  onSearch: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function GenreSearchFilter({
  searchTerm,
  onSearchChange,
  isSearching,
  onSearch,
  onClearFilters,
  hasActiveFilters,
}: GenreSearchFilterProps) {
  return (
    <SearchFilter
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm theo tên thể loại..."
      isSearching={isSearching}
      onSearch={onSearch}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );
}
