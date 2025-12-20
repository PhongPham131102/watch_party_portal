import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

interface HeroSectionPageHeaderProps {
  onRefresh: () => void;
  onCreateHeroSection: () => void;
  isLoading: boolean;
  canCreateHeroSection: boolean;
}

export function HeroSectionPageHeader({
  onRefresh,
  onCreateHeroSection,
  isLoading,
  canCreateHeroSection,
}: HeroSectionPageHeaderProps) {
  return (
    <PageHeader
      title="Quản lý Hero Section"
      description="Quản lý các hero section hiển thị trên trang chủ"
      onRefresh={onRefresh}
      isLoading={isLoading}
      actions={
        canCreateHeroSection && (
          <Button
            onClick={onCreateHeroSection}
            size="lg"
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium">
            <Plus className="h-5 w-5" />
            <span>Thêm Hero Section</span>
          </Button>
        )
      }
    />
  );
}

