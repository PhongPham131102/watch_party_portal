import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

interface MoviePageHeaderProps {
  onCreateClick: () => void;
  onRefresh: () => void;
  canCreate: boolean;
}

export function MoviePageHeader({ 
  onCreateClick, 
  onRefresh,
  canCreate 
}: MoviePageHeaderProps) {
  return (
    <PageHeader
      title="Quản lý Phim"
      description="Quản lý danh sách phim và thông tin chi tiết"
      onRefresh={onRefresh}
      actions={
        canCreate && (
          <Button
            onClick={onCreateClick}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
            <Plus className="h-4 w-4" />
            <span>Tạo phim mới</span>
          </Button>
        )
      }
    />
  );
}
