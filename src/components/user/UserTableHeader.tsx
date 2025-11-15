import { TableHeader, type TableColumn, type SortConfig } from "@/components/common";

type UserSortKey = 'createdAt' | 'username' | 'email';

interface UserTableHeaderProps {
  sortBy: UserSortKey;
  sortOrder: 'ASC' | 'DESC';
  // eslint-disable-next-line no-unused-vars
  onSort: (column: UserSortKey) => void;
}

const columns: TableColumn<UserSortKey>[] = [
  {
    key: 'username',
    label: 'Thông tin',
    sortable: true,
    sortKey: 'username',
    align: 'left',
  },
  {
    key: 'email',
    label: 'Email',
    sortable: true,
    sortKey: 'email',
    align: 'left',
  },
  {
    key: 'role',
    label: 'Vai trò',
    sortable: false,
    align: 'left',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    sortable: false,
    align: 'left',
  },
  {
    key: 'actions',
    label: 'Thao tác',
    sortable: false,
    align: 'center',
  },
];

export function UserTableHeader({ sortBy, sortOrder, onSort }: UserTableHeaderProps) {
  const sortConfig: SortConfig<UserSortKey> = {
    sortBy,
    sortOrder,
  };

  return <TableHeader columns={columns} sortConfig={sortConfig} onSort={onSort} />;
}
