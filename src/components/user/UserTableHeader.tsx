import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";

interface UserTableHeaderProps {
  sortBy: 'createdAt' | 'username' | 'email';
  sortOrder: 'ASC' | 'DESC';
  // eslint-disable-next-line no-unused-vars
  onSort: (column: 'createdAt' | 'username' | 'email') => void;
}

export function UserTableHeader({ sortBy, sortOrder, onSort }: UserTableHeaderProps) {
  const getSortIcon = (column: 'createdAt' | 'username' | 'email') => {
    if (sortBy !== column) {
      return <ChevronsUpDown className="h-3.5 w-3.5 text-gray-400" />;
    }
    return sortOrder === 'ASC' 
      ? <ArrowUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> 
      : <ArrowDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />;
  };

  return (
    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
      <tr>
        <th
          onClick={() => onSort('username')}
          className="px-6 py-3 text-left text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none">
          <div className="flex items-center gap-1.5">
            <span>Thông tin</span>
            {getSortIcon('username')}
          </div>
        </th>
        <th
          onClick={() => onSort('email')}
          className="px-6 py-3 text-left text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors select-none">
          <div className="flex items-center gap-1.5">
            <span>Email</span>
            {getSortIcon('email')}
          </div>
        </th>
        <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Vai trò
        </th>
        <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Trạng thái
        </th>
        <th className="px-6 py-3 text-center text-[11px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          Thao tác
        </th>
      </tr>
    </thead>
  );
}
