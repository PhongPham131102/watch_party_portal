/* eslint-disable no-unused-vars */
import type { ReactNode } from "react";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";

export interface SortConfig<T = string> {
  sortBy: T;
  sortOrder: "ASC" | "DESC";
}

export interface TableColumn<T = string> {
  key: string;
  label: string;
  sortable?: boolean;
  sortKey?: T;
  align?: "left" | "center" | "right";
  className?: string;
}

interface TableHeaderProps<T = string> {
  columns: TableColumn<T>[];
  sortConfig?: SortConfig<T>;
  onSort?: (sortKey: T) => void;
}

export function TableHeader<T = string>({
  columns,
  sortConfig,
  onSort,
}: TableHeaderProps<T>) {
  const getSortIcon = (column: TableColumn<T>): ReactNode => {
    if (!column.sortable || !sortConfig || !column.sortKey) return null;

    if (sortConfig.sortBy !== column.sortKey) {
      return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />;
    }

    return sortConfig.sortOrder === "ASC" ? (
      <ArrowUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
    );
  };

  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
      <tr>
        {columns.map((column) => {
          const isSortable = column.sortable && column.sortKey && onSort;

          return (
            <th
              key={column.key}
              onClick={() => isSortable && onSort(column.sortKey as T)}
              className={`px-6 py-3 ${getAlignClass(column.align)} text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${
                isSortable
                  ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none"
                  : ""
              } ${column.className || ""}`}>
              {isSortable ? (
                <div
                  className={`flex items-center gap-1.5 ${column.align === "center" ? "justify-center" : column.align === "right" ? "justify-end" : ""}`}>
                  <span>{column.label}</span>
                  {getSortIcon(column)}
                </div>
              ) : (
                column.label
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
