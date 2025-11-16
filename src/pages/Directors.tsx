import { useEffect, useState } from "react";
import { useDirectorStore } from "@/store/slices/directorSlice";
import { usePermission, useTableFiltersWithURL } from "@/hooks";
import { RBACModule } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataTable } from "@/components/common";
import {
  ModalCreateDirector,
  ModalDeleteDirector,
  ModalViewDirector,
  ModalEditDirector,
  DirectorPageHeader,
  DirectorSearchFilter,
  DirectorTable,
} from "@/components/director";
import type { Director } from "@/types/director.types";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default function DirectorsPage() {
  const {
    directors,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    isLoading,
    error,
    fetchDirectors,
  } = useDirectorStore();

  type DirectorSortKey = 'createdAt' | 'name' | 'dateOfBirth';

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
  } = useTableFiltersWithURL<DirectorSortKey>({
    defaultSortBy: 'name',
    defaultSortOrder: 'ASC',
    validSortKeys: ['createdAt', 'name', 'dateOfBirth'],
  });

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedDirector, setSelectedDirector] = useState<Partial<Director> | null>(null);

  const { canRead, canCreate } = usePermission();

  const canAccessPage = canRead(RBACModule.ACTORS);
  const canCreateDirector = canCreate(RBACModule.ACTORS);

  useEffect(() => {
    if (canAccessPage) {
      fetchDirectors(buildFilters(urlPage, urlLimit));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage, debouncedSearchTerm, sortBy, sortOrder, urlPage, urlLimit]);

  const handleRefresh = () => {
    fetchDirectors(buildFilters(urlPage, urlLimit));
  };

  const handlePageChange = (newPage: number) => {
    fetchDirectors(buildFilters(newPage, urlLimit));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    fetchDirectors(buildFilters(1, newPageSize));
  };

  const handleViewDirector = (director: Director) => {
    setSelectedDirector(director);
    setIsOpenViewModal(true);
  };

  const handleEditDirector = (director: Director) => {
    setSelectedDirector(director);
    setIsOpenEditModal(true);
  };

  const handleDeleteDirector = (director: Director) => {
    setSelectedDirector(director);
    setIsOpenDeleteModal(true);
  };

  const getEmptyMessage = () => {
    if (searchTerm) {
      return {
        message: "Không tìm thấy đạo diễn",
        description: "Hãy thử thay đổi bộ lọc",
      };
    }
    return {
      message: "Chưa có đạo diễn",
      description: "Hãy thêm đạo diễn đầu tiên để bắt đầu",
    };
  };

  if (!canAccessPage) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">
          Không có quyền truy cập
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          Bạn không có quyền truy cập trang quản lý đạo diễn
        </div>
      </div>
    );
  }

  const emptyState = getEmptyMessage();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TooltipProvider>
        <DirectorPageHeader
          onRefresh={handleRefresh}
          onCreateDirector={() => setIsOpenCreateModal(true)}
          isLoading={isLoading}
          canCreateDirector={canCreateDirector}
        />

        <DirectorSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isSearching={isSearching}
          onSearch={handleRefresh}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Directors Table */}
        <DataTable isLoading={isLoading} error={error} onRetry={handleRefresh}>
          <>
            <DirectorTable
              directors={directors}
              sortBy={sortBy || 'name'}
              sortOrder={sortOrder || 'ASC'}
              onSort={handleSort}
              onView={handleViewDirector}
              onEdit={handleEditDirector}
              onDelete={handleDeleteDirector}
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
        <ModalCreateDirector
          isOpen={isOpenCreateModal}
          onClose={() => setIsOpenCreateModal(false)}
          onComplete={() => {
            setIsOpenCreateModal(false);
            handleRefresh();
          }}
        />

        <ModalDeleteDirector
          isOpen={isOpenDeleteModal}
          onClose={() => {
            setIsOpenDeleteModal(false);
            setSelectedDirector(null);
          }}
          director={selectedDirector}
          onComplete={() => {
            setIsOpenDeleteModal(false);
            setSelectedDirector(null);
            handleRefresh();
          }}
        />

        <ModalViewDirector
          isOpen={isOpenViewModal}
          onClose={() => {
            setIsOpenViewModal(false);
            setSelectedDirector(null);
          }}
          directorId={selectedDirector?.id || null}
        />

        <ModalEditDirector
          isOpen={isOpenEditModal}
          onClose={() => {
            setIsOpenEditModal(false);
            setSelectedDirector(null);
          }}
          directorId={selectedDirector?.id || null}
          onComplete={() => {
            setIsOpenEditModal(false);
            setSelectedDirector(null);
            handleRefresh();
          }}
        />
      </TooltipProvider>
    </div>
  );
}
