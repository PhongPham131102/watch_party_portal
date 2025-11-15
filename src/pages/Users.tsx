import { useEffect, useState } from "react";
import { useUserStore } from "@/store/slices/userSlice";
import { useRoleStore } from "@/store/slices/roleSlice";
import { usePermission, useTableFiltersWithURL } from "@/hooks";
import { RBACModule } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataTable } from "@/components/common";
import {
  ModalCreateUser,
  ModalDeleteUser,
  ModalViewUser,
  ModalEditUser,
  UserPageHeader,
  UserSearchFilter,
  UserTable,
} from "@/components/user";
import type { User } from "@/services/user.service";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

export default function UsersPage() {
  const {
    users,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    isLoading,
    error,
    fetchUsers,
  } = useUserStore();

  type UserSortKey = 'createdAt' | 'username' | 'email';

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
    customFilters,
    setFilter,
  } = useTableFiltersWithURL<UserSortKey>({
    defaultSortBy: 'createdAt',
    defaultSortOrder: 'DESC',
  });

  const selectedRoleFilter = (customFilters.roleId as string) || 'all';
  const selectedStatusFilter = customFilters.isActive !== undefined 
    ? String(customFilters.isActive) 
    : 'all';

  const setSelectedRoleFilter = (value: string) => {
    setFilter('roleId', value === 'all' ? undefined : value);
  };

  const setSelectedStatusFilter = (value: string) => {
    setFilter('isActive', value === 'all' ? undefined : value === 'true');
  };

  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);

  const { roles, fetchRoles: fetchRolesList } = useRoleStore();
  const { canRead, canCreate } = usePermission();

  const canAccessPage = canRead(RBACModule.USERS);
  const canCreateUser = canCreate(RBACModule.USERS);

  useEffect(() => {
    if (canAccessPage) {
      fetchRolesList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage]);

  useEffect(() => {
    if (canAccessPage) {
      fetchUsers(buildFilters(urlPage, urlLimit));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage, debouncedSearchTerm, selectedRoleFilter, selectedStatusFilter, sortBy, sortOrder, urlPage, urlLimit]);

  const handleRefresh = () => {
    fetchUsers(buildFilters(urlPage, urlLimit));
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(buildFilters(newPage, urlLimit));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    fetchUsers(buildFilters(1, newPageSize));
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsOpenViewModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsOpenEditModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsOpenDeleteModal(true);
  };

  const getEmptyMessage = () => {
    if (searchTerm || selectedRoleFilter !== "all" || selectedStatusFilter !== "all") {
      return {
        message: "Không tìm thấy người dùng",
        description: "Hãy thử thay đổi bộ lọc",
      };
    }
    return {
      message: "Chưa có người dùng",
      description: "Hãy thêm người dùng đầu tiên để bắt đầu",
    };
  };

  if (!canAccessPage) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">
          Không có quyền truy cập
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          Bạn không có quyền truy cập trang quản lý người dùng
        </div>
      </div>
    );
  }

  const emptyState = getEmptyMessage();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <TooltipProvider>
        <UserPageHeader
          onRefresh={handleRefresh}
          onCreateUser={() => setIsOpenCreateModal(true)}
          isLoading={isLoading}
          canCreateUser={canCreateUser}
        />

        <UserSearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRoleFilter={selectedRoleFilter}
          onRoleFilterChange={setSelectedRoleFilter}
          selectedStatusFilter={selectedStatusFilter}
          onStatusFilterChange={setSelectedStatusFilter}
          roles={roles}
          isSearching={isSearching}
          onSearch={handleRefresh}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Users Table */}
        <DataTable isLoading={isLoading} error={error} onRetry={handleRefresh}>
          <>
            <UserTable
              users={users}
              sortBy={sortBy || 'createdAt'}
              sortOrder={sortOrder || 'DESC'}
              onSort={handleSort}
              onView={handleViewUser}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
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
        <ModalCreateUser
          isOpen={isOpenCreateModal}
          onClose={() => setIsOpenCreateModal(false)}
          onComplete={() => {
            setIsOpenCreateModal(false);
            handleRefresh();
          }}
        />

        <ModalDeleteUser
          isOpen={isOpenDeleteModal}
          onClose={() => {
            setIsOpenDeleteModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onComplete={() => {
            setIsOpenDeleteModal(false);
            setSelectedUser(null);
            handleRefresh();
          }}
        />

        <ModalViewUser
          isOpen={isOpenViewModal}
          onClose={() => {
            setIsOpenViewModal(false);
            setSelectedUser(null);
          }}
          userId={selectedUser?.id || null}
        />

        <ModalEditUser
          isOpen={isOpenEditModal}
          onClose={() => {
            setIsOpenEditModal(false);
            setSelectedUser(null);
          }}
          userId={selectedUser?.id || null}
          onComplete={() => {
            setIsOpenEditModal(false);
            setSelectedUser(null);
            handleRefresh();
          }}
        />
      </TooltipProvider>
    </div>
  );
}
