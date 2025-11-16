import { ActorTableHeader } from "./ActorTableHeader";
import { ActorTableRow } from "./ActorTableRow";
import { EmptyState } from "@/components/common";
import type { Actor } from "@/types/actor.types";

interface ActorTableProps {
  actors: Actor[];
  sortBy: "name" | "dateOfBirth" | "createdAt";
  sortOrder: "ASC" | "DESC";
  // eslint-disable-next-line no-unused-vars
  onSort: (column: "name" | "dateOfBirth" | "createdAt") => void;
  // eslint-disable-next-line no-unused-vars
  onView: (actor: Actor) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (actor: Actor) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (actor: Actor) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function ActorTable({
  actors,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "Không tìm thấy diễn viên",
  emptyDescription = "Hãy thêm diễn viên đầu tiên để bắt đầu",
}: ActorTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <ActorTableHeader
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {actors.length === 0 ? (
            <EmptyState
              message={emptyMessage}
              description={emptyDescription}
              colSpan={5}
            />
          ) : (
            actors.map((actor) => (
              <ActorTableRow
                key={actor.id}
                actor={actor}
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
