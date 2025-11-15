import { useState } from "react";
import useDebounce from "./useDebounce";

export interface TableFilters<T = string> {
  page: number;
  limit: number;
  search?: string;
  sortBy?: T;
  sortOrder?: 'ASC' | 'DESC';
  [key: string]: unknown;
}

export interface UseTableFiltersOptions<T = string> {
  defaultSortBy?: T;
  defaultSortOrder?: 'ASC' | 'DESC';
  debounceMs?: number;
}

export function useTableFilters<T = string>(
  options: UseTableFiltersOptions<T> = {}
) {
  const {
    defaultSortBy,
    defaultSortOrder = 'DESC',
    debounceMs = 500,
  } = options;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<T | undefined>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>(defaultSortOrder);
  const [customFilters, setCustomFilters] = useState<Record<string, unknown>>({});

  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const buildFilters = (page: number, limit: number): TableFilters<T> => {
    const filters: TableFilters<T> = {
      page,
      limit,
      ...(sortBy && { sortBy }),
      ...(sortOrder && { sortOrder }),
      ...customFilters,
    };
    
    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    }
    
    return filters;
  };

  const handleSort = (column: T) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('DESC');
    }
  };

  const setFilter = (key: string, value: unknown) => {
    setCustomFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeFilter = (key: string) => {
    setCustomFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCustomFilters({});
  };

  const hasActiveFilters = searchTerm !== "" || Object.keys(customFilters).length > 0;
  const isSearching = searchTerm !== debouncedSearchTerm;

  return {
    // Search
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
    isSearching,

    // Sort
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleSort,

    // Custom filters
    customFilters,
    setFilter,
    removeFilter,

    // Utils
    buildFilters,
    clearFilters,
    hasActiveFilters,
  };
}
