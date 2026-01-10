import { TableHeader } from "@/components/common/TableHeader";
import type { SortConfig, TableColumn } from "@/components/common/TableHeader";

type ActorSortKey = "name" | "dateOfBirth" | "createdAt";

interface ActorTableHeaderProps {
  sortBy: ActorSortKey;
  sortOrder: "ASC" | "DESC";
  onSort: (column: ActorSortKey) => void;
}

const columns: TableColumn<ActorSortKey>[] = [
  { key: "name", label: "Tên diễn viên", sortable: true },
  { key: "", label: "Tiểu sử", sortable: false },
  { key: "dateOfBirth", label: "Ngày sinh", sortable: true },
  { key: "createdAt", label: "Ngày tạo", sortable: true },
  { key: "", label: "Thao tác", sortable: false, align: "center" },
];

export function ActorTableHeader({
  sortBy,
  sortOrder,
  onSort,
}: ActorTableHeaderProps) {
  const sortConfig: SortConfig<ActorSortKey> = {
    sortBy,
    sortOrder,
  };

  return (
    <TableHeader columns={columns} sortConfig={sortConfig} onSort={onSort} />
  );
}
