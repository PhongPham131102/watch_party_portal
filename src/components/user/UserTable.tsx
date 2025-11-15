import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";
import { EmptyState } from "@/components/common";
import type { User } from "@/services/user.service";

interface UserTableProps {
  users: User[];
  sortBy: 'createdAt' | 'username' | 'email';
  sortOrder: 'ASC' | 'DESC';
  // eslint-disable-next-line no-unused-vars
  onSort: (column: 'createdAt' | 'username' | 'email') => void;
  // eslint-disable-next-line no-unused-vars
  onView: (user: User) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (user: User) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (user: User) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

export function UserTable({
  users,
  sortBy,
  sortOrder,
  onSort,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "Không tìm thấy người dùng",
  emptyDescription = "Hãy thêm người dùng đầu tiên để bắt đầu",
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <UserTableHeader sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {users.length === 0 ? (
            <EmptyState message={emptyMessage} description={emptyDescription} colSpan={5} />
          ) : (
            users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
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
