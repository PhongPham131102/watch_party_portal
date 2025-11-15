import { useEffect, useState } from "react";
import { useUserStore } from "@/store/slices/userSlice";
import { useRoleStore } from "@/store/slices/roleSlice";
import { usePermission } from "@/hooks";
import useDebounce from "@/hooks/useDebounce";
import { RBACModule } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Search, RefreshCw, Eye, Pencil, Trash2, ArrowUp, ArrowDown, ChevronsUpDown, X } from "lucide-react";
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
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<'createdAt' | 'username' | 'email'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { roles, fetchRoles: fetchRolesList } = useRoleStore();
  const { canRead, canCreate, canUpdate, canDelete } = usePermission();

  const canAccessPage = canRead(RBACModule.USERS);
  const canCreateUser = canCreate(RBACModule.USERS);
  const canUpdateUser = canUpdate(RBACModule.USERS);
  const canDeleteUser = canDelete(RBACModule.USERS);

  useEffect(() => {
    if (canAccessPage) {
      fetchRolesList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage]);

  useEffect(() => {
    if (canAccessPage) {
      const filters: {
        page: number;
        limit: number;
        search?: string;
        roleId?: string;
        isActive?: boolean;
        sortBy?: 'createdAt' | 'username' | 'email';
        sortOrder?: 'ASC' | 'DESC';
      } = {
        page: 1,
        limit: 10,
        sortBy,
        sortOrder,
      };
      
      if (debouncedSearchTerm) filters.search = debouncedSearchTerm;
      if (selectedRoleFilter !== "all") filters.roleId = selectedRoleFilter;
      if (selectedStatusFilter !== "all") filters.isActive = selectedStatusFilter === "active";
      
      fetchUsers(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage, debouncedSearchTerm, selectedRoleFilter, selectedStatusFilter, sortBy, sortOrder]);

  const handleRefresh = () => {
    const filters: {
      page: number;
      limit: number;
      search?: string;
      roleId?: string;
      isActive?: boolean;
      sortBy?: 'createdAt' | 'username' | 'email';
      sortOrder?: 'ASC' | 'DESC';
    } = {
      page,
      limit,
      sortBy,
      sortOrder,
    };
    
    if (debouncedSearchTerm) filters.search = debouncedSearchTerm;
    if (selectedRoleFilter !== "all") filters.roleId = selectedRoleFilter;
    if (selectedStatusFilter !== "all") filters.isActive = selectedStatusFilter === "active";
    
    fetchUsers(filters);
  };

  const handlePageChange = (newPage: number) => {
    const filters: {
      page: number;
      limit: number;
      search?: string;
      roleId?: string;
      isActive?: boolean;
      sortBy?: 'createdAt' | 'username' | 'email';
      sortOrder?: 'ASC' | 'DESC';
    } = {
      page: newPage,
      limit,
      sortBy,
      sortOrder,
    };
    
    if (debouncedSearchTerm) filters.search = debouncedSearchTerm;
    if (selectedRoleFilter !== "all") filters.roleId = selectedRoleFilter;
    if (selectedStatusFilter !== "all") filters.isActive = selectedStatusFilter === "active";
    
    fetchUsers(filters);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    const filters: {
      page: number;
      limit: number;
      search?: string;
      roleId?: string;
      isActive?: boolean;
      sortBy?: 'createdAt' | 'username' | 'email';
      sortOrder?: 'ASC' | 'DESC';
    } = {
      page: 1,
      limit: newPageSize,
      sortBy,
      sortOrder,
    };
    
    if (debouncedSearchTerm) filters.search = debouncedSearchTerm;
    if (selectedRoleFilter !== "all") filters.roleId = selectedRoleFilter;
    if (selectedStatusFilter !== "all") filters.isActive = selectedStatusFilter === "active";
    
    fetchUsers(filters);
  };

  const handleSort = (column: 'createdAt' | 'username' | 'email') => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // Set new column with DESC as default
      setSortBy(column);
      setSortOrder('DESC');
    }
  };

  const getSortIcon = (column: 'createdAt' | 'username' | 'email') => {
    if (sortBy !== column) {
      return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />;
    }
    return sortOrder === 'ASC' 
      ? <ArrowUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> 
      : <ArrowDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />;
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
    <div className="p-4 sm:p-6 lg:p-8">
      <TooltipProvider>
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Title & Description */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Quản lý người dùng
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quản lý thông tin người dùng trong hệ thống
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="default"
                className="gap-2"
                disabled={isLoading}>
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Làm mới</span>
              </Button>

              {canCreateUser && (
                <Button
                  onClick={() => setIsOpenCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Thêm người dùng</span>
                  <span className="sm:hidden">Thêm</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="space-y-3">
            {/* Row 1: Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo username hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-10 h-10"
              />
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                </div>
              )}
            </div>

            {/* Row 2: Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Role Filter */}
              <Select
                value={selectedRoleFilter}
                onValueChange={setSelectedRoleFilter}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.displayName || role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={selectedStatusFilter}
                onValueChange={setSelectedStatusFilter}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>

              {/* Divider */}
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

              {/* Search Button */}
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                className="cursor-pointer h-9 px-4 bg-blue-600 hover:bg-blue-700 gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Tìm kiếm</span>
              </Button>

              {/* Clear Filters */}
              {(selectedRoleFilter !== "all" || selectedStatusFilter !== "all" || searchTerm) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRoleFilter("all");
                    setSelectedStatusFilter("all");
                  }}
                  className="h-9 px-3 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Xóa bộ lọc</span>
                </Button>
              )}
            </div>
          </div>
        </div>

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
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th
                        onClick={() => handleSort('username')}
                        className="px-6 py-3 text-left text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none">
                        <div className="flex items-center gap-1.5">
                          <span>Thông tin</span>
                          {getSortIcon('username')}
                        </div>
                      </th>
                      <th
                        onClick={() => handleSort('email')}
                        className="px-6 py-3 text-left text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none">
                        <div className="flex items-center gap-1.5">
                          <span>Email</span>
                          {getSortIcon('email')}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Vai trò
                      </th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-center text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16">
                          <div className="flex flex-col items-center justify-center text-center">
                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                              Không tìm thấy người dùng
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              {searchTerm || selectedRoleFilter !== "all" || selectedStatusFilter !== "all"
                                ? "Hãy thử thay đổi bộ lọc"
                                : "Hãy thêm người dùng đầu tiên để bắt đầu"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-violet-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                                {user.username.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.username}
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
                              }`}>
                              {user.isActive ? "Hoạt động" : "Không hoạt động"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center gap-2">
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
                                      className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 cursor-pointer">
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
                                      className="h-9 w-9 p-0 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 cursor-pointer">
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
                                      className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 cursor-pointer"
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setIsOpenDeleteModal(true);
                                      }}>
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
