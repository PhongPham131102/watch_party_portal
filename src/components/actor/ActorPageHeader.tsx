import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

interface ActorPageHeaderProps {
  onRefresh: () => void;
  onCreateActor: () => void;
  isLoading: boolean;
  canCreateActor: boolean;
}

export function ActorPageHeader({
  onRefresh,
  onCreateActor,
  isLoading,
  canCreateActor,
}: ActorPageHeaderProps) {
  return (
    <PageHeader
      title="Quản lý diễn viên"
      description="Quản lý thông tin diễn viên trong hệ thống"
      onRefresh={onRefresh}
      isLoading={isLoading}
      actions={
        canCreateActor && (
          <Button
            onClick={onCreateActor}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
            <Plus className="h-4 w-4" />
            <span>Thêm diễn viên</span>
          </Button>
        )
      }
    />
  );
}
