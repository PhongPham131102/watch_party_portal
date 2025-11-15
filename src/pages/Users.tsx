import { useEffect, useState } from "react";
import { useUserStore } from "@/store/slices/userSlice";
import { usePermission } from "@/hooks";
import useDebounce from "@/hooks/useDebounce";
import { RBACModule } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Search, RefreshCw, Eye, Pencil, Trash2 } from "lucide-react";
import {
  ModalCreateUser,
  ModalDeleteUser,
  ModalViewUser,
  ModalEditUser,
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

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { canRead, canCreate, canUpdate, canDelete } = usePermission();

  const canAccessPage = canRead(RBACModule.USERS);
  const canCreateUser = canCreate(RBACModule.USERS);
  const canUpdateUser = canUpdate(RBACModule.USERS);
  const canDeleteUser = canDelete(RBACModule.USERS);

  useEffect(() => {
    if (canAccessPage) {
      fetchUsers({ page: 1, limit: 10, search: debouncedSearchTerm });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage, debouncedSearchTerm]);

  const handleRefresh = () => {
    fetchUsers({ page, limit, search: debouncedSearchTerm });
  };

  const handlePageChange = (newPage: number) => {
    fetchUsers({ page: newPage, limit, search: debouncedSearchTerm });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    fetchUsers({ page: 1, limit: newPageSize, search: debouncedSearchTerm });
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

  return (
    <div className="p-6">
    <TooltipProvider>
      <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-violet-600 to-fuchsia-600">
            Quản lý người dùng
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-gray-500 dark:text-gray-400">
              Quản lý thông tin người dùng trong hệ thống
            </p>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
              {total} người dùng
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>

          {canCreateUser && (
            <Button
              onClick={() => setIsOpenCreateModal(true)}
              className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 flex items-center gap-2"
            >
              <Plus size={20} />
              Thêm người dùng
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo username hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {searchTerm !== debouncedSearchTerm && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="shadow-lg rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden">
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
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Thông tin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16">
                        <div className="flex flex-col items-center justify-center text-center">
                          <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Chưa có người dùng
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Hãy thêm người dùng đầu tiên để bắt đầu
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-linear-to-r from-blue-500 to-violet-600 text-white flex items-center justify-center text-xs font-semibold">
                              {user.username.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.email || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 ring-1 ring-inset ring-blue-200 dark:ring-blue-800">
                            {user.role?.displayName || user.role?.name || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                              user.isActive
                                ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-200 dark:ring-green-800"
                                : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 ring-1 ring-inset ring-red-200 dark:ring-red-800"
                            }`}
                          >
                            {user.isActive ? "Hoạt động" : "Không hoạt động"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            {canRead(RBACModule.USERS) && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsOpenViewModal(true);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Xem chi tiết</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {canUpdateUser && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsOpenEditModal(true);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Chỉnh sửa</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                            {canDeleteUser && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsOpenDeleteModal(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Xóa người dùng</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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
