import { TableHeader } from "@/components/common";

interface ActorTableHeaderProps {
  sortBy: "name" | "dateOfBirth" | "createdAt";
  sortOrder: "ASC" | "DESC";
  // eslint-disable-next-line no-unused-vars
  onSort: (column: "name" | "dateOfBirth" | "createdAt") => void;
}

export function ActorTableHeader({ sortBy, sortOrder, onSort }: ActorTableHeaderProps) {
  const columns = [
    { key: "name" as const, label: "Tên diễn viên" },
    { key: null, label: "Tiểu sử" },
    { key: "dateOfBirth" as const, label: "Ngày sinh" },
    { key: "createdAt" as const, label: "Ngày tạo" },
    { key: null, label: "Thao tác" },
  ];

  return <TableHeader columns={columns} sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />;
}
