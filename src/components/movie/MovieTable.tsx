import { MovieTableRow } from "./MovieTableRow";
import { MovieTableHeader, type SortField } from "./MovieTableHeader";
import { EmptyState } from "@/components/common";
import type { Movie } from "@/types/movie.types";

interface MovieTableProps {
  movies: Movie[];
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onView: (movie: Movie) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (movie: Movie) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (movie: Movie) => void;
  // eslint-disable-next-line no-unused-vars
  onSort: (field: SortField) => void;
  sortBy: SortField;
  sortOrder: "asc" | "desc";
}

export function MovieTable({
  movies,
  loading,
  onView,
  onEdit,
  onDelete,
  onSort,
  sortBy,
  sortOrder,
}: MovieTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <MovieTableHeader onSort={onSort} sortBy={sortBy} sortOrder={sortOrder} />
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            <EmptyState
              message="Không có phim nào"
              description="Bắt đầu bằng cách tạo phim mới."
              colSpan={8}
            />
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <MovieTableHeader onSort={onSort} sortBy={sortBy} sortOrder={sortOrder} />
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {movies.map((movie) => (
            <MovieTableRow
              key={movie.id}
              movie={movie}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
