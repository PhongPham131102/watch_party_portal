import React, { useEffect, useState } from "react";
import { showToast } from "@/lib/toast";
import { useRoleStore } from "@/store/slices/roleSlice";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RBACModule, type Role } from "@/types";
import { createSlug } from "@/utils/stringUtils";

interface ModalEditPermissionProps {
  isOpen: boolean;
  onClose: () => void;
  isAdd: boolean;
  onComplete: () => void;
  permissionData: Partial<Role>;
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

const convertRolesObjectToPermissions = (rolesObject: RolesStructure) => {
  const permissions: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(rolesObject)) {
    const enabledPermissions = Object.keys(value).filter(
      (permission) => value[permission as keyof RolePermission]
    );

    // If all permissions are enabled, send "manage" instead
    if (
      enabledPermissions.length === 4 &&
      value.read &&
      value.create &&
      value.update &&
      value.delete
    ) {
      permissions[key] = ["manage"];
    } else if (enabledPermissions.length > 0) {
      permissions[key] = enabledPermissions;
    }
  }

  return permissions;
};

function ModalEditPermission({
  isOpen,
  onClose,
  isAdd,
  permissionData,
  onComplete,
}: ModalEditPermissionProps) {
  const { isCreating, isUpdating, createError, updateError, createRole, updateRole } = useRoleStore();
  const [roles, setRoles] = useState<RolesStructure>(
    JSON.parse(JSON.stringify(defaultRole))
  );
  const [roleName, setRoleName] = useState("");
  const [roleDisplayName, setRoleDisplayName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [roleNameError, setRoleNameError] = useState("");

  const isLoading = isCreating || isUpdating;

  const handleOnComplete = () => {
    if (isLoading) return;
    onClose();
    clearForm();
  };

  const clearForm = () => {
    setRoleName("");
    setRoleDisplayName("");
    setRoleDescription("");
    setRoleNameError("");
    setRoles(JSON.parse(JSON.stringify(defaultRole)));
  };

  useEffect(() => {
    if (!isAdd && isOpen && permissionData?.id) {
      handleGetDetail();
    } else if (isAdd && isOpen) {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isAdd, permissionData?.id]);

  const handleGetDetail = async () => {
    if (!permissionData?.id || !isOpen) return;
    try {
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
      setRoleName(permissionData?.name || "");
      setRoleDisplayName(permissionData?.displayName || "");
      setRoleDescription(permissionData?.description || "");
    } catch (error) {
      console.log(error);
      showToast.error(
        "Lỗi",
        "Không thể lấy chi tiết quyền hạn, vui lòng thử lại sau!"
      );
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleDisplayName.trim()) {
      setRoleNameError("Tên hiển thị không được để trống");
      return;
    }
    if (!roleName.trim()) {
      setRoleNameError("Tên vai trò không được để trống");
      return;
    } else {
      setRoleNameError("");
    }

    const permissionPayload = {
      name: roleName,
      displayName: roleDisplayName,
      description: roleDescription,
      permissions: convertRolesObjectToPermissions(roles),
    };

    try {
      if (isAdd) {
        const success = await createRole(permissionPayload);
        if (success) {
          showToast.success("Thành công", "Thêm mới vai trò thành công");
          onComplete();
          onClose();
          clearForm();
        } else {
          showToast.error("Lỗi", createError || "Không thể tạo vai trò mới");
        }
      } else {
        if (!permissionData.id) {
          showToast.error("Lỗi", "Không tìm thấy ID vai trò");
          return;
        }
        const success = await updateRole(permissionData.id, permissionPayload);
        if (success) {
          showToast.success("Thành công", "Cập nhật vai trò thành công");
          onComplete();
          onClose();
        } else {
          showToast.error("Lỗi", updateError || "Không thể cập nhật vai trò");
        }
      }
    } catch (error) {
      console.log(error);
      const errorMsg = isAdd ? createError : updateError;
      showToast.error(
        "Lỗi",
        errorMsg || `${isAdd ? "Thêm mới" : "Cập nhật"} vai trò thất bại, vui lòng thử lại sau`
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white uppercase">
            {isAdd ? "Thêm mới" : "Chỉnh sửa"} vai trò
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmitForm} className="flex flex-col h-[80vh]">
          <div className="flex-1 h-[80vh] p-6 overflow-y-auto scrollbar-hide">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Tên hiển thị
                    </Label>
                    <span className="text-sm text-red-600">(*)</span>
                  </div>
                  <Input
                    name="role-display-name"
                    value={roleDisplayName}
                    onChange={(e) => {
                      const newDisplayName = e.target.value;
                      setRoleDisplayName(newDisplayName);
                      // Auto-generate slug from display name
                      setRoleName(createSlug(newDisplayName));
                    }}
                    type="text"
                    placeholder="Nhập tên hiển thị..."
                    className={roleNameError ? "border-red-500" : ""}
                  />
                  {roleNameError && (
                    <p className="text-sm text-red-600">{roleNameError}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                    Mô tả
                  </Label>
                  <Input
                    name="role-description"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    type="text"
                    placeholder="Nhập mô tả vai trò..."
                  />
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-1 rounded-lg">
                <div className="w-full flex flex-row justify-between items-center px-2 py-1">
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

              {isLoading && !isAdd ? (
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
                          <div className="w-[20%] flex justify-center items-center">
                            <Checkbox
                              checked={roles[role].read}
                              onCheckedChange={(checked) => {
                                setRoles((prevRoles: RolesStructure) => ({
                                  ...prevRoles,
                                  [role]: {
                                    ...prevRoles[role],
                                    read: checked as boolean,
                                  },
                                }));
                              }}
                              className="w-5 h-5"
                            />
                          </div>
                          <div className="w-[20%] flex justify-center items-center">
                            <Checkbox
                              checked={roles[role].create}
                              onCheckedChange={(checked) => {
                                setRoles((prevRoles: RolesStructure) => ({
                                  ...prevRoles,
                                  [role]: {
                                    ...prevRoles[role],
                                    create: checked as boolean,
                                  },
                                }));
                              }}
                              className="w-5 h-5"
                            />
                          </div>
                          <div className="w-[20%] flex justify-center items-center">
                            <Checkbox
                              checked={roles[role].delete}
                              onCheckedChange={(checked) => {
                                setRoles((prevRoles: RolesStructure) => ({
                                  ...prevRoles,
                                  [role]: {
                                    ...prevRoles[role],
                                    delete: checked as boolean,
                                  },
                                }));
                              }}
                              className="w-5 h-5"
                            />
                          </div>
                          <div className="w-[20%] flex justify-center items-center">
                            <Checkbox
                              checked={roles[role].update}
                              onCheckedChange={(checked) => {
                                setRoles((prevRoles: RolesStructure) => ({
                                  ...prevRoles,
                                  [role]: {
                                    ...prevRoles[role],
                                    update: checked as boolean,
                                  },
                                }));
                              }}
                              className="w-5 h-5"
                            />
                          </div>
                          <div className="w-[20%] flex justify-center items-center">
                            <Checkbox
                              checked={
                                roles[role].create &&
                                roles[role].read &&
                                roles[role].update &&
                                roles[role].delete
                              }
                              onCheckedChange={(checked) => {
                                const newValue = checked as boolean;
                                setRoles((prevRoles: RolesStructure) => ({
                                  ...prevRoles,
                                  [role]: {
                                    create: newValue,
                                    read: newValue,
                                    update: newValue,
                                    delete: newValue,
                                  },
                                }));
                              }}
                              className="w-5 h-5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleOnComplete}
              disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ModalEditPermission;
