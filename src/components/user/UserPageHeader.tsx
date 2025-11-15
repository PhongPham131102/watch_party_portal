import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

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
    <PageHeader
      title="Quản lý người dùng"
      description="Quản lý thông tin và quyền truy cập của người dùng trong hệ thống"
      onRefresh={onRefresh}
      isLoading={isLoading}
      actions={
        canCreateUser && (
          <Button
            onClick={onCreateUser}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
            <Plus className="h-4 w-4" />
            <span>Thêm người dùng</span>
          </Button>
        )
      }
    />
  );
}
