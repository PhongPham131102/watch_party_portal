import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { showToast } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RBACModule } from "@/types";

interface ModalDetailPermissionProps {
  isOpen: boolean;
  onClose: () => void;
  permissionData: any;
  onComplete: () => void;
}

interface RolePermission {
  read: boolean;
  create: boolean;
  delete: boolean;
  update: boolean;
}

type RolesStructure = Record<string, RolePermission>;

const defaultRole: RolesStructure = {
  [RBACModule.USERS]: {
    read: false,
    create: false,
    delete: false,
    update: false,
  },
  [RBACModule.ROLES]: {
    read: false,
    create: false,
    delete: false,
    update: false,
  },
  [RBACModule.MOVIES]: {
    read: false,
    create: false,
    delete: false,
    update: false,
  },
  [RBACModule.ACTORS]: {
    read: false,
    create: false,
    delete: false,
    update: false,
  },
  [RBACModule.ROOMS]: {
    read: false,
    create: false,
    delete: false,
    update: false,
  },
  [RBACModule.COMMENTS]: {
    read: false,
    create: false,
    delete: false,
    update: false,
  },
};

const titleRole: Record<string, string> = {
  [RBACModule.USERS]: "Người dùng",
  [RBACModule.ROLES]: "Quyền hạn",
  [RBACModule.MOVIES]: "Phim",
  [RBACModule.ACTORS]: "Diễn viên",
  [RBACModule.ROOMS]: "Phòng",
  [RBACModule.COMMENTS]: "Bình luận",
};

function ModalDetailPermission({
  isOpen,
  onClose,
  permissionData,
}: ModalDetailPermissionProps) {
  const [roles, setRoles] = useState<RolesStructure>(
    JSON.parse(JSON.stringify(defaultRole))
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleGetDetail = async () => {
    if (!permissionData?.id || !isOpen) return;
    try {
      setIsLoading(true);

      // TODO: Integrate with your API
      // const res = await roleService.getPermissionsByRoleId(permissionData.id);
      // const data = res?.data?.permissions;

      const newRoles = JSON.parse(JSON.stringify(defaultRole));

      if (permissionData?.permissions) {
        Object.entries(permissionData.permissions).forEach(
          ([module, actions]) => {
            if (newRoles[module] && Array.isArray(actions)) {
              actions.forEach((action: string) => {
                if (action === "manage") {
                  // "manage" means all permissions
                  newRoles[module].read = true;
                  newRoles[module].create = true;
                  newRoles[module].update = true;
                  newRoles[module].delete = true;
                } else if (
                  newRoles[module][action as keyof RolePermission] !== undefined
                ) {
                  newRoles[module][action as keyof RolePermission] = true;
                }
              });
            }
          }
        );
      }

      setRoles(newRoles);
    } catch (error) {
      console.log(error);
      showToast.error(
        "Lỗi",
        "Không thể lấy chi tiết quyền hạn, vui lòng thử lại sau!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleGetDetail();
    }
  }, [isOpen]);

  const handleOnComplete = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white uppercase">
            Chi tiết phân quyền
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[80vh] overflow-y-auto">
          <div className="flex-1 overflow-y-auto max-h-[90%] p-6">
            <div className="flex flex-col gap-6">
              <div className="px-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Tên Vai trò
                  </label>
                  <input
                    disabled={true}
                    name="role-name"
                    value={
                      permissionData?.displayName || permissionData?.name || ""
                    }
                    type="text"
                    placeholder="Tên vai trò..."
                    className="w-full rounded-lg px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="w-full flex flex-row justify-between items-center px-2 py-3">
                  <p className="font-bold text-gray-900 dark:text-white truncate w-[40%]">
                    Tên phân quyền
                  </p>
                  <div className="flex flex-row justify-between items-center w-[60%]">
                    <div className="text-sm w-[20%] flex justify-center items-center font-bold text-gray-900 dark:text-white">
                      Xem
                    </div>
                    <div className="text-sm w-[20%] flex justify-center items-center font-bold text-gray-900 dark:text-white">
                      Thêm
                    </div>
                    <div className="text-sm w-[20%] flex justify-center items-center font-bold text-gray-900 dark:text-white">
                      Xóa
                    </div>
                    <div className="text-sm w-[20%] flex justify-center items-center font-bold text-gray-900 dark:text-white">
                      Sửa
                    </div>
                    <div className="text-sm w-[20%] flex justify-center items-center font-bold text-gray-900 dark:text-white">
                      Tất cả
                    </div>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-400">
                    Đang tải...
                  </span>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.keys(roles).map((role, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="w-full flex flex-row justify-between items-center">
                        <p className="font-medium text-gray-900 dark:text-white truncate w-[40%] text-sm">
                          {titleRole[role]}
                        </p>
                        <div className="flex flex-row justify-between items-center w-[60%]">
                          <div className="text-sm w-[20%] flex justify-center items-center">
                            {roles[role].read ? (
                              <Check size={20} className="text-green-600" />
                            ) : (
                              <X size={20} className="text-red-600" />
                            )}
                          </div>
                          <div className="text-sm w-[20%] flex justify-center items-center">
                            {roles[role].create ? (
                              <Check size={20} className="text-green-600" />
                            ) : (
                              <X size={20} className="text-red-600" />
                            )}
                          </div>
                          <div className="text-sm w-[20%] flex justify-center items-center">
                            {roles[role].delete ? (
                              <Check size={20} className="text-green-600" />
                            ) : (
                              <X size={20} className="text-red-600" />
                            )}
                          </div>
                          <div className="text-sm w-[20%] flex justify-center items-center">
                            {roles[role].update ? (
                              <Check size={20} className="text-green-600" />
                            ) : (
                              <X size={20} className="text-red-600" />
                            )}
                          </div>
                          <div className="text-sm w-[20%] flex justify-center items-center">
                            {roles[role].read &&
                            roles[role].create &&
                            roles[role].delete &&
                            roles[role].update ? (
                              <Check size={20} className="text-green-600" />
                            ) : (
                              <X size={20} className="text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleOnComplete}
              disabled={isLoading}>
              Đóng
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalDetailPermission;
