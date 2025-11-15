import { useEffect, useState } from "react";
import { useGenreStore } from "@/store/slices/genreSlice";
import { usePermission, useTableFiltersWithURL } from "@/hooks";
import { RBACModule } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataTable } from "@/components/common";
import {
  ModalCreateGenre,
  ModalDeleteGenre,
  ModalViewGenre,
  ModalEditGenre,
  GenrePageHeader,
  GenreSearchFilter,
  GenreTable,
} from "@/components/genre";
import type { Genre } from "@/types/genre.types";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default function GenresPage() {
  const {
    genres,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    isLoading,
    error,
    fetchGenres,
  } = useGenreStore();

  type GenreSortKey = 'createdAt' | 'name';

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
  } = useTableFiltersWithURL<GenreSortKey>({
    defaultSortBy: 'name',
    defaultSortOrder: 'ASC',
    validSortKeys: ['createdAt', 'name'],
  });

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Partial<Genre> | null>(null);

  const { canRead, canCreate } = usePermission();

  const canAccessPage = canRead(RBACModule.MOVIES);
  const canCreateGenre = canCreate(RBACModule.MOVIES);

  useEffect(() => {
    if (canAccessPage) {
      fetchGenres(buildFilters(urlPage, urlLimit));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage, debouncedSearchTerm, sortBy, sortOrder, urlPage, urlLimit]);

  const handleRefresh = () => {
    fetchGenres(buildFilters(urlPage, urlLimit));
  };

  const handlePageChange = (newPage: number) => {
    fetchGenres(buildFilters(newPage, urlLimit));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    fetchGenres(buildFilters(1, newPageSize));
  };

  const handleViewGenre = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsOpenViewModal(true);
  };

  const handleEditGenre = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsOpenEditModal(true);
  };

  const handleDeleteGenre = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsOpenDeleteModal(true);
  };

  const getEmptyMessage = () => {
    if (searchTerm) {
      return {
        message: "Không tìm thấy thể loại",
        description: "Hãy thử thay đổi bộ lọc",
      };
    }
    return {
      message: "Chưa có thể loại",
      description: "Hãy thêm thể loại đầu tiên để bắt đầu",
    };
  };

  if (!canAccessPage) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">
          Không có quyền truy cập
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          Bạn không có quyền truy cập trang quản lý thể loại
        </div>
      </div>
    );
  }

  const emptyState = getEmptyMessage();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TooltipProvider>
        <GenrePageHeader
          onRefresh={handleRefresh}
          onCreateGenre={() => setIsOpenCreateModal(true)}
          isLoading={isLoading}
          canCreateGenre={canCreateGenre}
        />

        <GenreSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isSearching={isSearching}
          onSearch={handleRefresh}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Genres Table */}
        <DataTable isLoading={isLoading} error={error} onRetry={handleRefresh}>
          <>
            <GenreTable
              genres={genres}
              sortBy={sortBy || 'name'}
              sortOrder={sortOrder || 'ASC'}
              onSort={handleSort}
              onView={handleViewGenre}
              onEdit={handleEditGenre}
              onDelete={handleDeleteGenre}
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
        <ModalCreateGenre
          isOpen={isOpenCreateModal}
          onClose={() => setIsOpenCreateModal(false)}
          onComplete={() => {
            setIsOpenCreateModal(false);
            handleRefresh();
          }}
        />

        <ModalDeleteGenre
          isOpen={isOpenDeleteModal}
          onClose={() => {
            setIsOpenDeleteModal(false);
            setSelectedGenre(null);
          }}
          genre={selectedGenre}
          onComplete={() => {
            setIsOpenDeleteModal(false);
            setSelectedGenre(null);
            handleRefresh();
          }}
        />

        <ModalViewGenre
          isOpen={isOpenViewModal}
          onClose={() => {
            setIsOpenViewModal(false);
            setSelectedGenre(null);
          }}
          genreId={selectedGenre?.id || null}
        />

        <ModalEditGenre
          isOpen={isOpenEditModal}
          onClose={() => {
            setIsOpenEditModal(false);
            setSelectedGenre(null);
          }}
          genreId={selectedGenre?.id || null}
          onComplete={() => {
            setIsOpenEditModal(false);
            setSelectedGenre(null);
            handleRefresh();
          }}
        />
      </TooltipProvider>
    </div>
  );
}
