import { SearchFilter } from "@/components/common";

interface CountrySearchFilterProps {
  searchTerm: string;
  // eslint-disable-next-line no-unused-vars
  onSearchChange: (value: string) => void;
  isSearching: boolean;
  onSearch: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function CountrySearchFilter({
  searchTerm,
  onSearchChange,
  isSearching,
  onSearch,
  onClearFilters,
  hasActiveFilters,
}: CountrySearchFilterProps) {
  return (
    <SearchFilter
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm theo tên quốc gia..."
      isSearching={isSearching}
      onSearch={onSearch}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );
}
