import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenreTableHeaderProps {
  sortBy: 'name' | 'createdAt';
  sortOrder: 'ASC' | 'DESC';
  // eslint-disable-next-line no-unused-vars
  onSort: (column: 'name' | 'createdAt') => void;
}

export function GenreTableHeader({ sortBy, sortOrder, onSort }: GenreTableHeaderProps) {
  const getSortIcon = (column: 'name' | 'createdAt') => {
    if (sortBy === column) {
      return (
        <ArrowUpDown
          className={`ml-2 h-4 w-4 transition-transform ${
            sortOrder === "DESC" ? "rotate-180" : ""
          }`}
        />
      );
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-700">
      <tr>
        <th className="px-6 py-3 text-left">
          <Button
            variant="ghost"
            onClick={() => onSort("name")}
            className="font-semibold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 -ml-4">
            Tên thể loại
            {getSortIcon("name")}
          </Button>
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Mô tả
        </th>
        <th className="px-6 py-3 text-left">
          <Button
            variant="ghost"
            onClick={() => onSort("createdAt")}
            className="font-semibold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 -ml-4">
            Ngày tạo
            {getSortIcon("createdAt")}
          </Button>
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Thao tác
        </th>
      </tr>
    </thead>
  );
}
