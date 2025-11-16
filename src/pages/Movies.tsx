import { useEffect, useState } from "react";
import { useMovieStore } from "@/store/slices/movieSlice";
import { usePermission, useTableFiltersWithURL, useDebounce } from "@/hooks";
import { RBACModule } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTable } from "@/components/common";
import {
  ModalCreateMovie,
  ModalDeleteMovie,
  ModalViewMovie,
  ModalEditMovie,
  MoviePageHeader,
  MovieSearchFilter,
  MovieTable,
} from "@/components/movie";
import type { Movie } from "@/types/movie.types";
import type { SortField } from "@/components/movie/MovieTableHeader";

export default function MoviesPage() {
  const {
    movies,
    totalItems,
    currentPage,
    totalPages,
    loading,
    loadMovies,
  } = useMovieStore();

  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    debouncedSearchTerm,
    buildFilters,
    handleSort,
    clearFilters,
    page: urlPage,
    limit: urlLimit,
  } = useTableFiltersWithURL<SortField>({
    defaultSortBy: "createdAt",
    defaultSortOrder: "DESC",
    validSortKeys: ["title", "releaseYear", "averageRating", "totalViews", "createdAt"],
  });

  const [status, setStatus] = useState<string>("all");
  const [contentType, setContentType] = useState<string>("all");
  const [releaseYearFrom, setReleaseYearFrom] = useState<string>("all");
  const [releaseYearTo, setReleaseYearTo] = useState<string>("all");

  // Debounce year inputs
  const debouncedReleaseYearFrom = useDebounce(releaseYearFrom, 500);
  const debouncedReleaseYearTo = useDebounce(releaseYearTo, 500);

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { canRead, canCreate } = usePermission();

  const canAccessPage = canRead(RBACModule.MOVIES);

  useEffect(() => {
    if (canAccessPage) {
      const filters = buildFilters(urlPage, urlLimit);
      loadMovies({
        ...filters,
        status: status === "all" ? undefined : status,
        contentType: contentType === "all" ? undefined : contentType,
        releaseYearFrom:
          debouncedReleaseYearFrom === "all" ? undefined : parseInt(debouncedReleaseYearFrom),
        releaseYearTo:
          debouncedReleaseYearTo === "all" ? undefined : parseInt(debouncedReleaseYearTo),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    canAccessPage,
    debouncedSearchTerm,
    sortBy,
    sortOrder,
    urlPage,
    urlLimit,
    status,
    contentType,
    debouncedReleaseYearFrom,
    debouncedReleaseYearTo,
  ]);

  const handleRefresh = () => {
    const filters = buildFilters(urlPage, urlLimit);
    loadMovies({
      ...filters,
      status: status === "all" ? undefined : status,
      contentType: contentType === "all" ? undefined : contentType,
      releaseYearFrom:
        releaseYearFrom === "all" ? undefined : parseInt(releaseYearFrom),
      releaseYearTo:
        releaseYearTo === "all" ? undefined : parseInt(releaseYearTo),
    });
  };

  const handlePageChange = (newPage: number) => {
    const filters = buildFilters(newPage, urlLimit);
    loadMovies({
      ...filters,
      status: status === "all" ? undefined : status,
      contentType: contentType === "all" ? undefined : contentType,
      releaseYearFrom:
        releaseYearFrom === "all" ? undefined : parseInt(releaseYearFrom),
      releaseYearTo:
        releaseYearTo === "all" ? undefined : parseInt(releaseYearTo),
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const filters = buildFilters(1, newPageSize);
    loadMovies({
      ...filters,
      status: status === "all" ? undefined : status,
      contentType: contentType === "all" ? undefined : contentType,
      releaseYearFrom:
        releaseYearFrom === "all" ? undefined : parseInt(releaseYearFrom),
      releaseYearTo:
        releaseYearTo === "all" ? undefined : parseInt(releaseYearTo),
    });
  };

  const handleViewMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsOpenViewModal(true);
  };

  const handleEditMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsOpenEditModal(true);
  };

  const handleDeleteMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsOpenDeleteModal(true);
  };

  const handleClearAllFilters = () => {
    clearFilters();
    setStatus("all");
    setContentType("all");
    setReleaseYearFrom("all");
    setReleaseYearTo("all");
  };

  if (!canAccessPage) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Không có quyền truy cập
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Bạn không có quyền xem trang này.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TooltipProvider>
        <MoviePageHeader
          onCreateClick={() => setIsOpenCreateModal(true)}
          onRefresh={handleRefresh}
          canCreate={canCreate(RBACModule.MOVIES)}
        />

        <MovieSearchFilter
          search={searchTerm}
          onSearchChange={setSearchTerm}
          status={status}
          contentType={contentType}
          releaseYearFrom={releaseYearFrom}
          releaseYearTo={releaseYearTo}
          onStatusChange={setStatus}
          onContentTypeChange={setContentType}
          onReleaseYearFromChange={setReleaseYearFrom}
          onReleaseYearToChange={setReleaseYearTo}
          onClearFilters={handleClearAllFilters}
          onSearch={handleRefresh}
        />

        <DataTable isLoading={loading} onRetry={handleRefresh}>
          <>
            <MovieTable
              movies={movies}
              loading={loading}
              onView={handleViewMovie}
              onEdit={handleEditMovie}
              onDelete={handleDeleteMovie}
              onSort={handleSort}
              sortBy={sortBy as SortField}
              sortOrder={sortOrder === "ASC" ? "asc" : "desc"}
            />

            <div className="border-t border-gray-200 dark:border-gray-700">
              <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={urlLimit}
                totalItems={totalItems}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                showPageSizeSelector={true}
              />
            </div>
          </>
        </DataTable>

        {canCreate(RBACModule.MOVIES) && (
          <ModalCreateMovie
            isOpen={isOpenCreateModal}
            onClose={() => setIsOpenCreateModal(false)}
            onComplete={handleRefresh}
          />
        )}

        <ModalViewMovie
          isOpen={isOpenViewModal}
          onClose={() => setIsOpenViewModal(false)}
          movie={selectedMovie}
        />

        <ModalEditMovie
          isOpen={isOpenEditModal}
          onClose={() => setIsOpenEditModal(false)}
          movie={selectedMovie}
          onComplete={handleRefresh}
        />

        <ModalDeleteMovie
          isOpen={isOpenDeleteModal}
          onClose={() => setIsOpenDeleteModal(false)}
          movie={selectedMovie}
          onComplete={handleRefresh}
        />
      </TooltipProvider>
    </div>
  );
}
