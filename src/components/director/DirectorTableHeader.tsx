import { TableHeader } from "@/components/common/TableHeader";
import type { SortConfig, TableColumn } from "@/components/common/TableHeader";

type DirectorSortKey = 'name' | 'dateOfBirth' | 'createdAt';

interface DirectorTableHeaderProps {
  sortBy: DirectorSortKey;
  sortOrder: 'ASC' | 'DESC';
  // eslint-disable-next-line no-unused-vars
  onSort: (column: DirectorSortKey) => void;
}

const columns: TableColumn<DirectorSortKey>[] = [
  { key: 'name', label: 'Tên đạo diễn', sortable: true },
  { key: null, label: 'Tiểu sử', sortable: false },
  { key: 'dateOfBirth', label: 'Ngày sinh', sortable: true },
  { key: 'createdAt', label: 'Ngày tạo', sortable: true },
  { key: null, label: 'Thao tác', sortable: false, align: 'center' },
];

export function DirectorTableHeader({
  sortBy,
  sortOrder,
  onSort,
}: DirectorTableHeaderProps) {
  const sortConfig: SortConfig<DirectorSortKey> = {
    sortBy,
    sortOrder,
    onSort,
  };

  return <TableHeader columns={columns} sortConfig={sortConfig} />;
}
