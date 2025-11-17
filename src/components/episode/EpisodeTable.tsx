/* eslint-disable no-unused-vars */
import { EpisodeTableHeader, type EpisodeSortKey } from "./EpisodeTableHeader";
import { EpisodeTableRow } from "./EpisodeTableRow";
import { EmptyState } from "@/components/common";
import type { Episode } from "@/types/episode.types";

interface EpisodeTableProps {
  episodes: Episode[];
  sortBy: EpisodeSortKey;
  sortOrder: "ASC" | "DESC";
  onSort: (column: EpisodeSortKey) => void;
  onView: (item: Episode) => void;
  onEdit: (item: Episode) => void;
  onDelete: (item: Episode) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function EpisodeTable({
  episodes,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "Không tìm thấy tập phim",
  emptyDescription = "Hãy thêm tập phim đầu tiên để bắt đầu",
}: EpisodeTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1200px]">
        <EpisodeTableHeader
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {episodes.length === 0 ? (
            <EmptyState
              message={emptyMessage}
              description={emptyDescription}
              colSpan={9}
            />
          ) : (
            episodes.map((item) => (
              <EpisodeTableRow
                key={item.id}
                episode={item}
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
