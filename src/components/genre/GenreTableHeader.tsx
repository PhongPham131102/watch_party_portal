import { TableHeader, type TableColumn, type SortConfig } from "@/components/common";

type GenreSortKey = 'createdAt' | 'name';

interface GenreTableHeaderProps {
  sortBy: GenreSortKey;
  sortOrder: 'ASC' | 'DESC';
  // eslint-disable-next-line no-unused-vars
  onSort: (column: GenreSortKey) => void;
}

const columns: TableColumn<GenreSortKey>[] = [
  {
    key: 'name',
    label: 'Tên thể loại',
    sortable: true,
    sortKey: 'name',
    align: 'left',
  },
  {
    key: 'description',
    label: 'Mô tả',
    sortable: false,
    align: 'left',
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true,
    sortKey: 'createdAt',
    align: 'left',
  },
  {
    key: 'actions',
    label: 'Thao tác',
    sortable: false,
    align: 'center',
  },
];

export function GenreTableHeader({ sortBy, sortOrder, onSort }: GenreTableHeaderProps) {
  const sortConfig: SortConfig<GenreSortKey> = {
    sortBy,
    sortOrder,
  };

  return <TableHeader columns={columns} sortConfig={sortConfig} onSort={onSort} />;
}
