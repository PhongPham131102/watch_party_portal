import { useEffect, useState } from "react";
import { useUserStore } from "@/store/slices/userSlice";
import { useRoleStore } from "@/store/slices/roleSlice";
import { usePermission, useUserFilters } from "@/hooks";
import { RBACModule } from "@/types";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
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
    page,
    limit,
    totalPages,
    isLoading,
    error,
    fetchUsers,
  } = useUserStore();

  const {
    searchTerm,
    setSearchTerm,
    selectedRoleFilter,
    setSelectedRoleFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    sortBy,
    sortOrder,
    debouncedSearchTerm,
    buildFilters,
    handleSort,
    clearFilters,
    hasActiveFilters,
    isSearching,
  } = useUserFilters();

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
      fetchUsers(buildFilters(1, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage, debouncedSearchTerm, selectedRoleFilter, selectedStatusFilter, sortBy, sortOrder]);

  const handleRefresh = () => {
    fetchUsers(buildFilters(page, limit));
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers(buildFilters(newPage, limit));
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
        <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Đang tải...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-red-600 text-lg font-medium mb-2">
                Lỗi khi tải dữ liệu
              </div>
              <div className="text-gray-500 dark:text-gray-400">{error}</div>
              <Button onClick={handleRefresh} className="mt-4">
                Thử lại
              </Button>
            </div>
          ) : (
            <>
              <UserTable
                users={users}
                sortBy={sortBy}
                sortOrder={sortOrder}
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
                  currentPage={page}
                  totalPages={totalPages}
                  pageSize={limit}
                  totalItems={total}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  showPageSizeSelector={true}
                />
              </div>
            </>
          )}
        </div>

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
