import { TableHeader } from "@/components/common/TableHeader";
import type { SortConfig, TableColumn } from "@/components/common/TableHeader";

type DirectorSortKey = "name" | "dateOfBirth" | "createdAt";

interface DirectorTableHeaderProps {
  sortBy: DirectorSortKey;
  sortOrder: "ASC" | "DESC";
  onSort: (column: DirectorSortKey) => void;
}

const columns: TableColumn<DirectorSortKey>[] = [
  { key: "name", label: "Tên đạo diễn", sortable: true },
  { key: "", label: "Tiểu sử", sortable: false },
  { key: "dateOfBirth", label: "Ngày sinh", sortable: true },
  { key: "createdAt", label: "Ngày tạo", sortable: true },
  { key: "", label: "Thao tác", sortable: false, align: "center" },
];

export function DirectorTableHeader({
  sortBy,
  sortOrder,
  onSort,
}: DirectorTableHeaderProps) {
  const sortConfig: SortConfig<DirectorSortKey> = {
    sortBy,
    sortOrder,
  };

  return (
    <TableHeader columns={columns} sortConfig={sortConfig} onSort={onSort} />
  );
}
