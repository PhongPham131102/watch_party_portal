import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RBACModule } from "@/types";
import { usePermission } from "@/hooks";
import type { User } from "@/services/user.service";

interface UserTableRowProps {
  user: User;
  // eslint-disable-next-line no-unused-vars
  onView: (user: User) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (user: User) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (user: User) => void;
}

export function UserTableRow({ user, onView, onEdit, onDelete }: UserTableRowProps) {
  const { canRead, canUpdate, canDelete } = usePermission();

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                  onClick={() => onView(user)}
                  className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 cursor-pointer">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem chi tiết</p>
              </TooltipContent>
            </Tooltip>
          )}
          {canUpdate(RBACModule.USERS) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(user)}
                  className="h-9 w-9 p-0 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉnh sửa</p>
              </TooltipContent>
            </Tooltip>
          )}
          {canDelete(RBACModule.USERS) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 cursor-pointer"
                  onClick={() => onDelete(user)}>
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
  );
}
