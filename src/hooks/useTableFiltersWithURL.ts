import { useState, useEffect } from "react";
import useDebounce from "./useDebounce";
import { useURLParams, type URLParamsConfig } from "./useURLParams";

export interface TableFiltersWithURLConfig extends URLParamsConfig {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface UseTableFiltersWithURLOptions<T = string> {
  defaultSortBy?: T;
  defaultSortOrder?: 'ASC' | 'DESC';
  defaultPage?: number;
  defaultLimit?: number;
  debounceMs?: number;
}

export function useTableFiltersWithURL<T = string>(
  options: UseTableFiltersWithURLOptions<T> = {}
) {
  const {
    defaultSortBy,
    defaultSortOrder = 'DESC',
    defaultPage = 1,
    defaultLimit = 10,
    debounceMs = 500,
  } = options;

  const defaultParams: TableFiltersWithURLConfig = {
    page: defaultPage,
    limit: defaultLimit,
    sortBy: defaultSortBy as unknown as string,
    sortOrder: defaultSortOrder,
  };

  const [urlParams, setURLParams] = useURLParams<TableFiltersWithURLConfig>(defaultParams);
  
  const [searchTerm, setSearchTerm] = useState(urlParams.search || "");
  const [customFilters, setCustomFilters] = useState<Record<string, unknown>>(() => {
    // Initialize custom filters from URL
    const filters: Record<string, unknown> = {};
    Object.entries(urlParams).forEach(([key, value]) => {
      if (!['page', 'limit', 'search', 'sortBy', 'sortOrder'].includes(key)) {
        filters[key] = value;
      }
    });
    return filters;
  });

  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // Update URL when debounced search changes
  useEffect(() => {
    const filters: Partial<TableFiltersWithURLConfig> = {
      page: 1, // Reset to page 1 when search changes
      limit: urlParams.limit,
      sortBy: urlParams.sortBy,
      sortOrder: urlParams.sortOrder,
      ...customFilters,
    };

    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    }

    setURLParams(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const buildFilters = (page: number, limit: number) => {
    const filters: Record<string, unknown> = {
      page,
      limit,
      ...(urlParams.sortBy && { sortBy: urlParams.sortBy }),
      ...(urlParams.sortOrder && { sortOrder: urlParams.sortOrder }),
      ...customFilters,
    };

    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    }

    // Update URL with new page/limit
    setURLParams({ ...urlParams, page, limit });

    return filters;
  };

  const handleSort = (column: T) => {
    const columnStr = String(column);
    const filters: Partial<TableFiltersWithURLConfig> = {
      page: urlParams.page,
      limit: urlParams.limit,
      ...customFilters,
    };

    if (debouncedSearchTerm) {
      filters.search = debouncedSearchTerm;
    }

    if (urlParams.sortBy === columnStr) {
      filters.sortBy = columnStr;
      filters.sortOrder = urlParams.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    } else {
      filters.sortBy = columnStr;
      filters.sortOrder = 'DESC';
    }

    setURLParams(filters);
  };

  const setFilter = (key: string, value: unknown) => {
    const newFilters = {
      ...customFilters,
      [key]: value,
    };
    setCustomFilters(newFilters);
    
    // Immediately update URL
    const urlFilters: Partial<TableFiltersWithURLConfig> = {
      page: 1, // Reset to page 1 when filter changes
      limit: urlParams.limit,
      sortBy: urlParams.sortBy,
      sortOrder: urlParams.sortOrder,
      ...newFilters,
    };

    if (debouncedSearchTerm) {
      urlFilters.search = debouncedSearchTerm;
    }

    setURLParams(urlFilters);
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...customFilters };
    delete newFilters[key];
    setCustomFilters(newFilters);
    
    // Immediately update URL
    const urlFilters: Partial<TableFiltersWithURLConfig> = {
      page: 1, // Reset to page 1 when filter changes
      limit: urlParams.limit,
      sortBy: urlParams.sortBy,
      sortOrder: urlParams.sortOrder,
      ...newFilters,
    };

    if (debouncedSearchTerm) {
      urlFilters.search = debouncedSearchTerm;
    }

    setURLParams(urlFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCustomFilters({});
    setURLParams({
      page: defaultPage,
      limit: urlParams.limit,
      sortBy: defaultSortBy as unknown as string,
      sortOrder: defaultSortOrder,
    });
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
    sortBy: (urlParams.sortBy as T) || defaultSortBy,
    sortOrder: urlParams.sortOrder || defaultSortOrder,
    handleSort,

    // Custom filters
    customFilters,
    setFilter,
    removeFilter,

    // Pagination from URL
    page: urlParams.page || defaultPage,
    limit: urlParams.limit || defaultLimit,

    // Utils
    buildFilters,
    clearFilters,
    hasActiveFilters,
  };
}
