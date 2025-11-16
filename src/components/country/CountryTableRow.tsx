import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RBACModule } from "@/types";
import { usePermission } from "@/hooks";
import type { Country } from "@/types/country.types";

interface CountryTableRowProps {
  country: Country;
  // eslint-disable-next-line no-unused-vars
  onView: (country: Country) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (country: Country) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (country: Country) => void;
}

export function CountryTableRow({ country, onView, onEdit, onDelete }: CountryTableRowProps) {
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

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {country.name}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {country.slug}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {formatDate(country.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex justify-center gap-2">
          {canRead(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(country)}
                  className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 cursor-pointer">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem chi tiết</p>
              </TooltipContent>
            </Tooltip>
          )}
          {canUpdate(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(country)}
                  className="h-9 w-9 p-0 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉnh sửa</p>
              </TooltipContent>
            </Tooltip>
          )}
          {canDelete(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 cursor-pointer"
                  onClick={() => onDelete(country)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xóa quốc gia</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </td>
    </tr>
  );
}
