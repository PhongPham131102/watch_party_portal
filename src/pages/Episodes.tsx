import { useEffect, useState } from "react";
import { useEpisodeStore } from "@/store/slices/episodeSlice";
import { usePermission, useTableFiltersWithURL, useDebounce } from "@/hooks";
import { RBACModule } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTable } from "@/components/common";
import {
  ModalUploadEpisode,
  ModalViewEpisode,
  ModalEditEpisode,
  ModalDeleteEpisode,
  EpisodePageHeader,
  EpisodeSearchFilter,
  EpisodeTable,
} from "@/components/episode";
import type { Episode } from "@/types/episode.types";
import type { EpisodeSortKey } from "@/components/episode/EpisodeTableHeader";

export default function EpisodesPage() {
  const {
    episodes,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    isLoading,
    error,
    fetchEpisodes,
  } = useEpisodeStore();

  const {
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    debouncedSearchTerm,
    buildFilters,
    handleSort,
    clearFilters,
    isSearching,
    page: urlPage,
    limit: urlLimit,
    customFilters,
    setFilter,
  } = useTableFiltersWithURL<EpisodeSortKey>({
    defaultSortBy: "episodeNumber",
    defaultSortOrder: "ASC",
    validSortKeys: ["episodeNumber", "title", "createdAt", "publishedAt"],
  });

  // Custom filters
  const [movieId, setMovieId] = useState<string>("all");
  const [uploadStatusS3, setUploadStatusS3] = useState<string>("all");
  const [uploadStatusMinio, setUploadStatusMinio] = useState<string>("all");
  const [episodeNumberFrom, setEpisodeNumberFrom] = useState<string>("all");
  const [episodeNumberTo, setEpisodeNumberTo] = useState<string>("all");

  const debouncedEpisodeFrom = useDebounce(episodeNumberFrom, 500);
  const debouncedEpisodeTo = useDebounce(episodeNumberTo, 500);

  const [isOpenUploadModal, setIsOpenUploadModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  const { canRead, canCreate } = usePermission();

  const canAccessPage = canRead(RBACModule.MOVIES);

  useEffect(() => {
    if (canAccessPage) {
      const filters = buildFilters(urlPage, urlLimit);
      fetchEpisodes({
        ...filters,
        movieId: movieId === "all" ? undefined : movieId,
        uploadStatusS3: uploadStatusS3 === "all" ? undefined : uploadStatusS3 as any,
        uploadStatusMinio: uploadStatusMinio === "all" ? undefined : uploadStatusMinio as any,
        episodeNumberFrom: debouncedEpisodeFrom === "all" ? undefined : parseInt(debouncedEpisodeFrom),
        episodeNumberTo: debouncedEpisodeTo === "all" ? undefined : parseInt(debouncedEpisodeTo),
      });
    }
  }, [
    canAccessPage,
    debouncedSearchTerm,
    sortBy,
    sortOrder,
    urlPage,
    urlLimit,
    movieId,
    uploadStatusS3,
    uploadStatusMinio,
    debouncedEpisodeFrom,
    debouncedEpisodeTo,
  ]);

  const handleRefresh = () => {
    const filters = buildFilters(urlPage, urlLimit);
    fetchEpisodes({
      ...filters,
      movieId: movieId === "all" ? undefined : movieId,
      uploadStatusS3: uploadStatusS3 === "all" ? undefined : uploadStatusS3 as any,
      uploadStatusMinio: uploadStatusMinio === "all" ? undefined : uploadStatusMinio as any,
      episodeNumberFrom: episodeNumberFrom === "all" ? undefined : parseInt(episodeNumberFrom),
      episodeNumberTo: episodeNumberTo === "all" ? undefined : parseInt(episodeNumberTo),
    });
  };

  const handlePageChange = (newPage: number) => {
    const filters = buildFilters(newPage, urlLimit);
    fetchEpisodes({
      ...filters,
      movieId: movieId === "all" ? undefined : movieId,
      uploadStatusS3: uploadStatusS3 === "all" ? undefined : uploadStatusS3 as any,
      uploadStatusMinio: uploadStatusMinio === "all" ? undefined : uploadStatusMinio as any,
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const filters = buildFilters(1, newPageSize);
    fetchEpisodes({
      ...filters,
      movieId: movieId === "all" ? undefined : movieId,
      uploadStatusS3: uploadStatusS3 === "all" ? undefined : uploadStatusS3 as any,
      uploadStatusMinio: uploadStatusMinio === "all" ? undefined : uploadStatusMinio as any,
    });
  };

  const handleView = (episode: Episode) => {
    setSelectedEpisode(episode);
    setIsOpenViewModal(true);
  };

  const handleEdit = (episode: Episode) => {
    setSelectedEpisode(episode);
    setIsOpenEditModal(true);
  };

  const handleDelete = (episode: Episode) => {
    setSelectedEpisode(episode);
    setIsOpenDeleteModal(true);
  };

  const handleClearAllFilters = () => {
    clearFilters();
    setMovieId("all");
    setUploadStatusS3("all");
    setUploadStatusMinio("all");
    setEpisodeNumberFrom("all");
    setEpisodeNumberTo("all");
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
        <EpisodePageHeader
          onRefresh={handleRefresh}
          onUploadEpisode={() => setIsOpenUploadModal(true)}
          isLoading={isLoading}
          canUploadEpisode={canCreate(RBACModule.MOVIES)}
        />

        <EpisodeSearchFilter
          search={searchTerm}
          onSearchChange={setSearchTerm}
          movieId={movieId}
          onMovieIdChange={setMovieId}
          uploadStatusS3={uploadStatusS3}
          uploadStatusMinio={uploadStatusMinio}
          onUploadStatusS3Change={setUploadStatusS3}
          onUploadStatusMinioChange={setUploadStatusMinio}
          episodeNumberFrom={episodeNumberFrom}
          episodeNumberTo={episodeNumberTo}
          onEpisodeNumberFromChange={setEpisodeNumberFrom}
          onEpisodeNumberToChange={setEpisodeNumberTo}
          onClearFilters={handleClearAllFilters}
          isSearching={isSearching}
          onSearch={handleRefresh}
        />

        <DataTable isLoading={isLoading} onRetry={handleRefresh}>
          <>
            <EpisodeTable
              episodes={episodes}
              sortBy={sortBy as EpisodeSortKey}
              sortOrder={sortOrder === "ASC" ? "ASC" : "DESC"}
              onSort={handleSort}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

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

        {canCreate(RBACModule.MOVIES) && (
          <ModalUploadEpisode
            isOpen={isOpenUploadModal}
            onClose={() => setIsOpenUploadModal(false)}
            onComplete={handleRefresh}
          />
        )}

        <ModalViewEpisode
          isOpen={isOpenViewModal}
          onClose={() => {
            setIsOpenViewModal(false);
            setSelectedEpisode(null);
          }}
          episodeId={selectedEpisode?.id || null}
        />

        <ModalEditEpisode
          isOpen={isOpenEditModal}
          onClose={() => {
            setIsOpenEditModal(false);
            setSelectedEpisode(null);
          }}
          episodeId={selectedEpisode?.id || null}
          onComplete={handleRefresh}
        />

        <ModalDeleteEpisode
          isOpen={isOpenDeleteModal}
          onClose={() => {
            setIsOpenDeleteModal(false);
            setSelectedEpisode(null);
          }}
          episode={selectedEpisode}
          onComplete={handleRefresh}
        />
      </TooltipProvider>
    </div>
  );
}

