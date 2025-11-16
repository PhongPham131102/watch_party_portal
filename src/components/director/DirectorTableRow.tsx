import { Eye, Pencil, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RBACModule } from "@/types";
import { usePermission } from "@/hooks";
import type { Director } from "@/types/director.types";

interface DirectorTableRowProps {
  director: Director;
  // eslint-disable-next-line no-unused-vars
  onView: (director: Director) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (director: Director) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (director: Director) => void;
}

export function DirectorTableRow({ director, onView, onEdit, onDelete }: DirectorTableRowProps) {
  const { canRead, canUpdate, canDelete } = usePermission();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateOfBirth = (dateString: string | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            {director.profileImageUrl ? (
              <img
                src={director.profileImageUrl}
                alt={director.name}
                className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {director.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {director.slug}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 dark:text-white max-w-md truncate">
          {director.biography || "-"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDateOfBirth(director.dateOfBirth)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDate(director.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex justify-center gap-2">
          {canRead(RBACModule.ACTORS) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(director)}
                  className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 cursor-pointer">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem chi tiết</p>
              </TooltipContent>
            </Tooltip>
          )}
          {canUpdate(RBACModule.ACTORS) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(director)}
                  className="h-9 w-9 p-0 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉnh sửa</p>
              </TooltipContent>
            </Tooltip>
          )}
          {canDelete(RBACModule.ACTORS) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 cursor-pointer"
                  onClick={() => onDelete(director)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xóa đạo diễn</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </td>
    </tr>
  );
}
