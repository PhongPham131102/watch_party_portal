import { CountryTableHeader } from "./CountryTableHeader";
import { CountryTableRow } from "./CountryTableRow";
import { EmptyState } from "@/components/common";
import type { Country } from "@/types/country.types";

interface CountryTableProps {
  countries: Country[];
  sortBy: "name" | "createdAt";
  sortOrder: "ASC" | "DESC";
  // eslint-disable-next-line no-unused-vars
  onSort: (column: "name" | "createdAt") => void;
  // eslint-disable-next-line no-unused-vars
  onView: (country: Country) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (country: Country) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (country: Country) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function CountryTable({
  countries,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "Không tìm thấy quốc gia",
  emptyDescription = "Hãy thêm quốc gia đầu tiên để bắt đầu",
}: CountryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <CountryTableHeader
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {countries.length === 0 ? (
            <EmptyState
              message={emptyMessage}
              description={emptyDescription}
              colSpan={3}
            />
          ) : (
            countries.map((country) => (
              <CountryTableRow
                key={country.id}
                country={country}
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
