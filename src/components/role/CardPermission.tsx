import { useState } from "react";
import { Eye, Trash2, Shield, Plus, Edit } from "lucide-react";
import ModalDeletePermission from "./ModalDeletePermission";
import ModalDetailPermission from "./ModalDetailPermission";
import ModalEditPermission from "./ModalEditPermission";
import { usePermission } from "@/hooks";
import { RBACModule, type Role } from "@/types";
import { cn } from "@/lib/utils";
import { useRoleStore } from "@/store/slices/roleSlice";

interface CardPermissionProps {
  role: Partial<Role>;
  isAdd: boolean;
}

function CardPermission({ role, isAdd }: CardPermissionProps) {
  const { fetchRoles } = useRoleStore();
  const { canUpdate, canDelete } = usePermission();

  const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
  const [isOpenModalDetail, setIsOpenModalDetail] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [isAddRole, setIsAddRole] = useState(false);

  const canEditRole = canUpdate(RBACModule.ROLES);
  const canDeleteRole = canDelete(RBACModule.ROLES);

  const isAdminRole = role?.name?.toLowerCase()?.includes("admin");

  return (
    <>
      {isAdd ? (
        <div
          onClick={() => {
            setIsAddRole(true);
            setIsOpenModalEdit(true);
          }}
          className="w-full rounded-lg border border-dashed border-gray-300 dark:border-gray-600 min-h-40 py-6 px-6 flex flex-col justify-center items-center gap-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200">
          <div className="w-16 h-16 flex justify-center items-center rounded-full bg-linear-to-r from-blue-500 to-purple-600">
            <Plus size={24} className="text-white" />
          </div>
          <div className="text-center">
            <p className="text-lg text-gray-900 dark:text-white font-medium mb-1">
              Thêm mới vai trò
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tạo vai trò mới cho hệ thống
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-lg min-h-[120px] py-6 px-6 flex flex-col justify-between bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200">
          <div className="flex flex-row justify-between items-start mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400"></div>
            <div className="flex flex-row gap-2">
              <button
                className="cursor-pointer w-8 h-8 p-2 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
                onClick={() => setIsOpenModalDetail(!isOpenModalDetail)}
                title="Xem chi tiết">
                <Eye className="w-3 h-3 text-white" />
              </button>

              {canEditRole && (
                <button
                  className={cn(
                    "cursor-pointer w-8 h-8 p-2 rounded-full flex items-center justify-center transition-colors",
                    isAdminRole
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  )}
                  disabled={isAdminRole}
                  onClick={() => {
                    if (!isAdminRole) {
                      setIsOpenModalEdit(!isOpenModalEdit);
                    }
                  }}
                  title={
                    isAdminRole ? "Không thể chỉnh sửa role Admin" : "Chỉnh sửa"
                  }>
                  <Edit className="w-3 h-3 text-white" />
                </button>
              )}

              {canDeleteRole && (
                <button
                  className={cn(
                    "cursor-pointer w-8 h-8 p-2 rounded-full flex items-center justify-center transition-colors",
                    isAdminRole
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  )}
                  disabled={isAdminRole}
                  onClick={() => {
                    if (!isAdminRole) {
                      setIsOpenModalDelete(!isOpenModalDelete);
                    }
                  }}
                  title={isAdminRole ? "Không thể xóa role Admin" : "Xóa"}>
                  <Trash2 className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-row items-center gap-4">
            <div className="w-16 h-16 flex justify-center items-center rounded-full bg-linear-to-r from-green-500 to-blue-600 shrink-0">
              <Shield size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg text-gray-900 dark:text-white font-semibold truncate">
                {role?.displayName || role?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {role?.description || "Vai trò trong hệ thống"}
              </p>
            </div>
          </div>
        </div>
      )}

      <ModalDeletePermission
        isOpen={isOpenModalDelete}
        onClose={() => setIsOpenModalDelete(!isOpenModalDelete)}
        permissionData={role}
        onComplete={() => fetchRoles()}
      />
      <ModalDetailPermission
        isOpen={isOpenModalDetail}
        onClose={() => setIsOpenModalDetail(!isOpenModalDetail)}
        permissionData={role}
        onComplete={() => {}}
      />
      <ModalEditPermission
        isAdd={isAddRole}
        isOpen={isOpenModalEdit}
        onClose={() => setIsOpenModalEdit(!isOpenModalEdit)}
        permissionData={role}
        onComplete={() => fetchRoles()}
      />
    </>
  );
}

export default CardPermission;
