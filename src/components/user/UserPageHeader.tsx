import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserPageHeaderProps {
  onRefresh: () => void;
  onCreateUser: () => void;
  isLoading: boolean;
  canCreateUser: boolean;
}

export function UserPageHeader({
  onRefresh,
  onCreateUser,
  isLoading,
  canCreateUser,
}: UserPageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Title & Description */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quản lý người dùng
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quản lý thông tin người dùng trong hệ thống
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="default"
            className="gap-2"
            disabled={isLoading}>
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>

          {canCreateUser && (
            <Button
              onClick={onCreateUser}
              className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Thêm người dùng</span>
              <span className="sm:hidden">Thêm</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
