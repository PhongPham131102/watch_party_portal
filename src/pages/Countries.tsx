import { useEffect, useState } from "react";
import { useCountryStore } from "@/store/slices/countrySlice";
import { usePermission, useTableFiltersWithURL } from "@/hooks";
import { RBACModule } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataTable } from "@/components/common";
import {
  ModalCreateCountry,
  ModalDeleteCountry,
  ModalViewCountry,
  ModalEditCountry,
  CountryPageHeader,
  CountrySearchFilter,
  CountryTable,
} from "@/components/country";
import type { Country } from "@/types/country.types";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default function CountriesPage() {
  const {
    countries,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    isLoading,
    error,
    fetchCountries,
  } = useCountryStore();

  type CountrySortKey = 'createdAt' | 'name';

  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    debouncedSearchTerm,
    buildFilters,
    handleSort,
    clearFilters,
    hasActiveFilters,
    isSearching,
    page: urlPage,
    limit: urlLimit,
  } = useTableFiltersWithURL<CountrySortKey>({
    defaultSortBy: 'name',
    defaultSortOrder: 'ASC',
    validSortKeys: ['createdAt', 'name'],
  });

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Partial<Country> | null>(null);

  const { canRead, canCreate } = usePermission();

  const canAccessPage = canRead(RBACModule.MOVIES);
  const canCreateCountry = canCreate(RBACModule.MOVIES);

  useEffect(() => {
    if (canAccessPage) {
      fetchCountries(buildFilters(urlPage, urlLimit));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage, debouncedSearchTerm, sortBy, sortOrder, urlPage, urlLimit]);

  const handleRefresh = () => {
    fetchCountries(buildFilters(urlPage, urlLimit));
  };

  const handlePageChange = (newPage: number) => {
    fetchCountries(buildFilters(newPage, urlLimit));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    fetchCountries(buildFilters(1, newPageSize));
  };

  const handleViewCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsOpenViewModal(true);
  };

  const handleEditCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsOpenEditModal(true);
  };

  const handleDeleteCountry = (country: Country) => {
    setSelectedCountry(country);
    setIsOpenDeleteModal(true);
  };

  const getEmptyMessage = () => {
    if (searchTerm) {
      return {
        message: "Không tìm thấy quốc gia",
        description: "Hãy thử thay đổi bộ lọc",
      };
    }
    return {
      message: "Chưa có quốc gia",
      description: "Hãy thêm quốc gia đầu tiên để bắt đầu",
    };
  };

  if (!canAccessPage) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">
          Không có quyền truy cập
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          Bạn không có quyền truy cập trang quản lý quốc gia
        </div>
      </div>
    );
  }

  const emptyState = getEmptyMessage();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TooltipProvider>
        <CountryPageHeader
          onRefresh={handleRefresh}
          onCreateCountry={() => setIsOpenCreateModal(true)}
          isLoading={isLoading}
          canCreateCountry={canCreateCountry}
        />

        <CountrySearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isSearching={isSearching}
          onSearch={handleRefresh}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Countries Table */}
        <DataTable isLoading={isLoading} error={error} onRetry={handleRefresh}>
          <>
            <CountryTable
              countries={countries}
              sortBy={sortBy || 'name'}
              sortOrder={sortOrder || 'ASC'}
              onSort={handleSort}
              onView={handleViewCountry}
              onEdit={handleEditCountry}
              onDelete={handleDeleteCountry}
              emptyMessage={emptyState.message}
              emptyDescription={emptyState.description}
            />

            {/* Pagination */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={currentLimit}
                totalItems={total}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showPageSizeSelector={true}
              />
            </div>
          </>
        </DataTable>

        {/* Modals */}
        <ModalCreateCountry
          isOpen={isOpenCreateModal}
          onClose={() => setIsOpenCreateModal(false)}
          onComplete={() => {
            setIsOpenCreateModal(false);
            handleRefresh();
          }}
        />

        <ModalDeleteCountry
          isOpen={isOpenDeleteModal}
          onClose={() => {
            setIsOpenDeleteModal(false);
            setSelectedCountry(null);
          }}
          country={selectedCountry}
          onComplete={() => {
            setIsOpenDeleteModal(false);
            setSelectedCountry(null);
            handleRefresh();
          }}
        />

        <ModalViewCountry
          isOpen={isOpenViewModal}
          onClose={() => {
            setIsOpenViewModal(false);
            setSelectedCountry(null);
          }}
          countryId={selectedCountry?.id || null}
        />

        <ModalEditCountry
          isOpen={isOpenEditModal}
          onClose={() => {
            setIsOpenEditModal(false);
            setSelectedCountry(null);
          }}
          countryId={selectedCountry?.id || null}
          onComplete={() => {
            setIsOpenEditModal(false);
            setSelectedCountry(null);
            handleRefresh();
          }}
        />
      </TooltipProvider>
    </div>
  );
}
