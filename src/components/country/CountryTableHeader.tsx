import { TableHeader } from "@/components/common";

interface CountryTableHeaderProps {
  sortBy: "name" | "createdAt";
  sortOrder: "ASC" | "DESC";
  // eslint-disable-next-line no-unused-vars
  onSort: (column: "name" | "createdAt") => void;
}

export function CountryTableHeader({ sortBy, sortOrder, onSort }: CountryTableHeaderProps) {
  const columns = [
    { key: "name", label: "Tên quốc gia", sortable: true, sortKey: "name" as const },
    { key: "createdAt", label: "Ngày tạo", sortable: true, sortKey: "createdAt" as const },
    { key: "actions", label: "Thao tác", align: "center" as const },
  ];

  return (
    <TableHeader
      columns={columns}
      sortConfig={{ sortBy, sortOrder }}
      onSort={onSort}
    />
  );
}
