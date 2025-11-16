import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

interface DirectorPageHeaderProps {
  onRefresh: () => void;
  onCreateDirector: () => void;
  isLoading: boolean;
  canCreateDirector: boolean;
}

export function DirectorPageHeader({
  onRefresh,
  onCreateDirector,
  isLoading,
  canCreateDirector,
}: DirectorPageHeaderProps) {
  return (
    <PageHeader
      title="Quản lý đạo diễn"
      description="Quản lý thông tin đạo diễn trong hệ thống"
      onRefresh={onRefresh}
      isLoading={isLoading}
      actions={
        canCreateDirector && (
          <Button
            onClick={onCreateDirector}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
            <Plus className="h-4 w-4" />
            <span>Thêm đạo diễn</span>
          </Button>
        )
      }
    />
  );
}
