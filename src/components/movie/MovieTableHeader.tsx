import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SortField = "title" | "releaseYear" | "averageRating" | "totalViews" | "createdAt";

interface MovieTableHeaderProps {
  // eslint-disable-next-line no-unused-vars
  onSort: (field: SortField) => void;
  sortBy: SortField;
  sortOrder: "asc" | "desc";
}

export function MovieTableHeader({ onSort, sortBy, sortOrder }: MovieTableHeaderProps) {
  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th className="px-6 py-3 text-left">
          <Button
            variant="ghost"
            onClick={() => onSort("title")}
            className="h-auto p-0 hover:bg-transparent font-semibold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              Phim
              {getSortIcon("title")}
            </div>
          </Button>
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Trạng thái
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Loại
        </th>
        <th className="px-6 py-3 text-left">
          <Button
            variant="ghost"
            onClick={() => onSort("releaseYear")}
            className="h-auto p-0 hover:bg-transparent font-semibold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              Năm phát hành
              {getSortIcon("releaseYear")}
            </div>
          </Button>
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Thời lượng
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Thể loại
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Quốc gia
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Đạo diễn
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Diễn viên
        </th>
        <th className="px-6 py-3 text-left">
          <Button
            variant="ghost"
            onClick={() => onSort("averageRating")}
            className="h-auto p-0 hover:bg-transparent font-semibold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              Đánh giá
              {getSortIcon("averageRating")}
            </div>
          </Button>
        </th>
        <th className="px-6 py-3 text-left">
          <Button
            variant="ghost"
            onClick={() => onSort("totalViews")}
            className="h-auto p-0 hover:bg-transparent font-semibold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              Lượt xem
              {getSortIcon("totalViews")}
            </div>
          </Button>
        </th>
        <th className="px-6 py-3 text-left">
          <Button
            variant="ghost"
            onClick={() => onSort("createdAt")}
            className="h-auto p-0 hover:bg-transparent font-semibold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              Ngày tạo
              {getSortIcon("createdAt")}
            </div>
          </Button>
        </th>
        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Hành động
        </th>
      </tr>
    </thead>
  );
}
