import { useEffect, useState } from "react";
import { useRoleStore } from "@/store/slices/roleSlice";
import { usePermission } from "@/hooks";
import { RBACModule, type Role } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CardPermission from "@/components/role/CardPermission";
import ModalEditPermission from "@/components/role/ModalEditPermission";

export default function RolesPage() {
  const { roles, isLoading, error, fetchRoles } = useRoleStore();
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const { canRead, canCreate } = usePermission();

  const canAccessPage = canRead(RBACModule.ROLES);
  const canCreateRole = canCreate(RBACModule.ROLES);

  useEffect(() => {
    if (canAccessPage) {
      fetchRoles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage]);

  const handleOpenCreateModal = () => {
    setIsOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setIsOpenCreateModal(false);
  };

  if (!canAccessPage) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">
          Không có quyền truy cập
        </div>
        <div className="text-gray-500">
          Bạn không có quyền truy cập trang quản lý vai trò
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-violet-600 to-fuchsia-600">
            Quản lý vai trò
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-gray-500 dark:text-gray-400">
              Quản lý các vai trò và phân quyền trong hệ thống
            </p>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
              {roles.length} vai trò
            </span>
          </div>
        </div>

        {canCreateRole && (
          <Button
            onClick={handleOpenCreateModal}
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 flex items-center gap-2">
            <Plus size={20} />
            Thêm mới vai trò
          </Button>
        )}
      </div>

      <div className="shadow-lg p-6 rounded-lg bg-white dark:bg-gray-800">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Quản lý các vai trò và phân quyền trong hệ thống
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">
              Đang tải...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg font-medium mb-2">
              Lỗi khi tải dữ liệu
            </div>
            <div className="text-gray-500">{error}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {roles.map((role: Role) => (
              <CardPermission key={role.id} role={role} isAdd={false} />
            ))}

            {canCreateRole && <CardPermission role={{}} isAdd={true} />}
          </div>
        )}
      </div>

      <ModalEditPermission
        isAdd={true}
        isOpen={isOpenCreateModal}
        onClose={handleCloseCreateModal}
        permissionData={{}}
        onComplete={() => {
          fetchRoles();
        }}
      />
    </div>
  );
}
