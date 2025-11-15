import { useState } from "react";
import useDebounce from "./useDebounce";

export interface UserFilters {
  page: number;
  limit: number;
  search?: string;
  roleId?: string;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'username' | 'email';
  sortOrder?: 'ASC' | 'DESC';
}

export function useUserFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<'createdAt' | 'username' | 'email'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const buildFilters = (page: number, limit: number): UserFilters => {
    const filters: UserFilters = {
      page,
      limit,
      sortBy,
      sortOrder,
    };
    
    if (debouncedSearchTerm) filters.search = debouncedSearchTerm;
    if (selectedRoleFilter !== "all") filters.roleId = selectedRoleFilter;
    if (selectedStatusFilter !== "all") filters.isActive = selectedStatusFilter === "active";
    
    return filters;
  };

  const handleSort = (column: 'createdAt' | 'username' | 'email') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('DESC');
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRoleFilter("all");
    setSelectedStatusFilter("all");
  };

  const hasActiveFilters = 
    selectedRoleFilter !== "all" || 
    selectedStatusFilter !== "all" || 
    searchTerm !== "";

  const isSearching = searchTerm !== debouncedSearchTerm;

  return {
    searchTerm,
    setSearchTerm,
    selectedRoleFilter,
    setSelectedRoleFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    debouncedSearchTerm,
    buildFilters,
    handleSort,
    clearFilters,
    hasActiveFilters,
    isSearching,
  };
}
