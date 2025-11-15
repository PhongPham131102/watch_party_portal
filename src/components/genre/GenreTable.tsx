import { GenreTableHeader } from "./GenreTableHeader";
import { GenreTableRow } from "./GenreTableRow";
import { EmptyState } from "@/components/common";
import type { Genre } from "@/types/genre.types";

interface GenreTableProps {
  genres: Genre[];
  sortBy: 'name' | 'createdAt';
  sortOrder: 'ASC' | 'DESC';
  // eslint-disable-next-line no-unused-vars
  onSort: (column: 'name' | 'createdAt') => void;
  // eslint-disable-next-line no-unused-vars
  onView: (genre: Genre) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (genre: Genre) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (genre: Genre) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function GenreTable({
  genres,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "Không tìm thấy thể loại",
  emptyDescription = "Hãy thêm thể loại đầu tiên để bắt đầu",
}: GenreTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <GenreTableHeader sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {genres.length === 0 ? (
            <EmptyState message={emptyMessage} description={emptyDescription} colSpan={4} />
          ) : (
            genres.map((genre) => (
              <GenreTableRow
                key={genre.id}
                genre={genre}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
