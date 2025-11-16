import { DirectorTableHeader } from "./DirectorTableHeader";
import { DirectorTableRow } from "./DirectorTableRow";
import { EmptyState } from "@/components/common";
import type { Director } from "@/types/director.types";

interface DirectorTableProps {
  directors: Director[];
  sortBy: "name" | "dateOfBirth" | "createdAt";
  sortOrder: "ASC" | "DESC";
  // eslint-disable-next-line no-unused-vars
  onSort: (column: "name" | "dateOfBirth" | "createdAt") => void;
  // eslint-disable-next-line no-unused-vars
  onView: (director: Director) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (director: Director) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (director: Director) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function DirectorTable({
  directors,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "Không tìm thấy đạo diễn",
  emptyDescription = "Hãy thêm đạo diễn đầu tiên để bắt đầu",
}: DirectorTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <DirectorTableHeader
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {directors.length === 0 ? (
            <EmptyState
              message={emptyMessage}
              description={emptyDescription}
              colSpan={5}
            />
          ) : (
            directors.map((director) => (
              <DirectorTableRow
                key={director.id}
                director={director}
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
