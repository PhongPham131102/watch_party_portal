import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

interface CountryPageHeaderProps {
  onRefresh: () => void;
  onCreateCountry: () => void;
  isLoading: boolean;
  canCreateCountry: boolean;
}

export function CountryPageHeader({
  onRefresh,
  onCreateCountry,
  isLoading,
  canCreateCountry,
}: CountryPageHeaderProps) {
  return (
    <PageHeader
      title="Quản lý quốc gia"
      description="Quản lý thông tin quốc gia trong hệ thống"
      onRefresh={onRefresh}
      isLoading={isLoading}
      actions={
        canCreateCountry && (
          <Button
            onClick={onCreateCountry}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
            <Plus className="h-4 w-4" />
            <span>Thêm quốc gia</span>
          </Button>
        )
      }
    />
  );
}
