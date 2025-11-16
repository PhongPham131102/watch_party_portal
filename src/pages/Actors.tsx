import { useEffect, useState } from "react";
import { useActorStore } from "@/store/slices/actorSlice";
import { usePermission, useTableFiltersWithURL } from "@/hooks";
import { RBACModule } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataTable } from "@/components/common";
import {
  ModalCreateActor,
  ModalDeleteActor,
  ModalViewActor,
  ModalEditActor,
  ActorPageHeader,
  ActorSearchFilter,
  ActorTable,
} from "@/components/actor";
import type { Actor } from "@/types/actor.types";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default function ActorsPage() {
  const {
    actors,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    isLoading,
    error,
    fetchActors,
  } = useActorStore();

  type ActorSortKey = 'createdAt' | 'name' | 'dateOfBirth';

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
  } = useTableFiltersWithURL<ActorSortKey>({
    defaultSortBy: 'name',
    defaultSortOrder: 'ASC',
    validSortKeys: ['createdAt', 'name', 'dateOfBirth'],
  });

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedActor, setSelectedActor] = useState<Partial<Actor> | null>(null);

  const { canRead, canCreate } = usePermission();

  const canAccessPage = canRead(RBACModule.ACTORS);
  const canCreateActor = canCreate(RBACModule.ACTORS);

  useEffect(() => {
    if (canAccessPage) {
      fetchActors(buildFilters(urlPage, urlLimit));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage, debouncedSearchTerm, sortBy, sortOrder, urlPage, urlLimit]);

  const handleRefresh = () => {
    fetchActors(buildFilters(urlPage, urlLimit));
  };

  const handlePageChange = (newPage: number) => {
    fetchActors(buildFilters(newPage, urlLimit));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    fetchActors(buildFilters(1, newPageSize));
  };

  const handleViewActor = (actor: Actor) => {
    setSelectedActor(actor);
    setIsOpenViewModal(true);
  };

  const handleEditActor = (actor: Actor) => {
    setSelectedActor(actor);
    setIsOpenEditModal(true);
  };

  const handleDeleteActor = (actor: Actor) => {
    setSelectedActor(actor);
    setIsOpenDeleteModal(true);
  };

  const getEmptyMessage = () => {
    if (searchTerm) {
      return {
        message: "Không tìm thấy diễn viên",
        description: "Hãy thử thay đổi bộ lọc",
      };
    }
    return {
      message: "Chưa có diễn viên",
      description: "Hãy thêm diễn viên đầu tiên để bắt đầu",
    };
  };

  if (!canAccessPage) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">
          Không có quyền truy cập
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          Bạn không có quyền truy cập trang quản lý diễn viên
        </div>
      </div>
    );
  }

  const emptyState = getEmptyMessage();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TooltipProvider>
        <ActorPageHeader
          onRefresh={handleRefresh}
          onCreateActor={() => setIsOpenCreateModal(true)}
          isLoading={isLoading}
          canCreateActor={canCreateActor}
        />

        <ActorSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isSearching={isSearching}
          onSearch={handleRefresh}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Actors Table */}
        <DataTable isLoading={isLoading} error={error} onRetry={handleRefresh}>
          <>
            <ActorTable
              actors={actors}
              sortBy={sortBy || 'name'}
              sortOrder={sortOrder || 'ASC'}
              onSort={handleSort}
              onView={handleViewActor}
              onEdit={handleEditActor}
              onDelete={handleDeleteActor}
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
        <ModalCreateActor
          isOpen={isOpenCreateModal}
          onClose={() => setIsOpenCreateModal(false)}
          onComplete={() => {
            setIsOpenCreateModal(false);
            handleRefresh();
          }}
        />

        <ModalDeleteActor
          isOpen={isOpenDeleteModal}
          onClose={() => {
            setIsOpenDeleteModal(false);
            setSelectedActor(null);
          }}
          actor={selectedActor}
          onComplete={() => {
            setIsOpenDeleteModal(false);
            setSelectedActor(null);
            handleRefresh();
          }}
        />

        <ModalViewActor
          isOpen={isOpenViewModal}
          onClose={() => {
            setIsOpenViewModal(false);
            setSelectedActor(null);
          }}
          actorId={selectedActor?.id || null}
        />

        <ModalEditActor
          isOpen={isOpenEditModal}
          onClose={() => {
            setIsOpenEditModal(false);
            setSelectedActor(null);
          }}
          actorId={selectedActor?.id || null}
          onComplete={() => {
            setIsOpenEditModal(false);
            setSelectedActor(null);
            handleRefresh();
          }}
        />
      </TooltipProvider>
    </div>
  );
}
