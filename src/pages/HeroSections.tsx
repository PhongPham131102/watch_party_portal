import { useEffect, useState } from "react";
import { useHeroSectionStore } from "@/store/slices/heroSectionSlice";
import { usePermission } from "@/hooks";
import { RBACModule } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataTable } from "@/components/common";
import {
  ModalCreateHeroSection,
  HeroSectionPageHeader,
  HeroSectionList,
} from "@/components/hero-section";
import type { HeroSection } from "@/types/hero-section.types";
import { showToast } from "@/lib/toast";

export default function HeroSectionsPage() {
  const {
    heroSections,
    isLoading,
    error,
    fetchHeroSections,
    reorderHeroSection,
    deleteHeroSection,
  } = useHeroSectionStore();

  const [localHeroSections, setLocalHeroSections] = useState<HeroSection[]>([]);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  const { canRead, canCreate } = usePermission();

  const canAccessPage = canRead(RBACModule.MOVIES);
  const canCreateHeroSection = canCreate(RBACModule.MOVIES);

  // Sync local state với store
  useEffect(() => {
    setLocalHeroSections(heroSections);
  }, [heroSections]);

  useEffect(() => {
    if (canAccessPage) {
      fetchHeroSections({ page: 1, limit: 10, sortBy: 'order', sortOrder: 'ASC' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAccessPage]);

  const handleRefresh = () => {
    fetchHeroSections({ page: 1, limit: 10, sortBy: 'order', sortOrder: 'ASC' });
  };

  const handleDeleteHeroSection = async (heroSection: HeroSection) => {
    if (!heroSection.id) return;

    // Lưu state cũ để rollback nếu fail
    const previousState = [...localHeroSections];

    // Optimistic update: Xóa item khỏi UI ngay lập tức
    const updatedHeroSections = localHeroSections
      .filter((hs) => hs.id !== heroSection.id)
      .map((hs, index) => ({
        ...hs,
        order: index, // Cập nhật lại order cho các items còn lại
      }));

    setLocalHeroSections(updatedHeroSections);

    // Gọi API xóa
    const success = await deleteHeroSection(heroSection.id);

    if (!success) {
      // Rollback nếu fail
      setLocalHeroSections(previousState);
      showToast.error("Lỗi", "Không thể xóa hero section");
    } else {
      showToast.success("Thành công", "Đã xóa hero section");
    }
  };

  const handleReorder = async (draggedId: string, targetId: string) => {
    const draggedIndex = localHeroSections.findIndex((hs) => hs.id === draggedId);
    const targetIndex = localHeroSections.findIndex((hs) => hs.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    // Lưu state cũ để rollback nếu fail
    const previousState = [...localHeroSections];
    const targetOrder = localHeroSections[targetIndex].order;

    // Optimistic update: Cập nhật UI ngay lập tức
    const newHeroSections = [...localHeroSections];
    const [draggedItem] = newHeroSections.splice(draggedIndex, 1);
    newHeroSections.splice(targetIndex, 0, draggedItem);

    // Cập nhật lại order cho tất cả items sau khi reorder
    const updatedHeroSections = newHeroSections.map((hs, index) => ({
      ...hs,
      order: index,
    }));

    setLocalHeroSections(updatedHeroSections);

    // Gọi API reorder với order của target
    const success = await reorderHeroSection(draggedId, targetOrder);
    
    if (!success) {
      // Rollback nếu fail
      setLocalHeroSections(previousState);
      showToast.error("Lỗi", "Không thể sắp xếp lại hero section");
    }
    // Nếu thành công, không cần refresh vì optimistic update đã đúng
  };

  if (!canAccessPage) {
    return (
      <div className="p-10 text-center">
        <div className="text-red-600 text-lg font-medium mb-2">
          Không có quyền truy cập
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          Bạn không có quyền truy cập trang quản lý hero section
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <TooltipProvider>
        <HeroSectionPageHeader
          onRefresh={handleRefresh}
          onCreateHeroSection={() => setIsOpenCreateModal(true)}
          isLoading={isLoading}
          canCreateHeroSection={canCreateHeroSection}
        />

        {/* Hero Sections List */}
        <div className="mt-6">
          <DataTable isLoading={isLoading} error={error} onRetry={handleRefresh}>
            <HeroSectionList
              heroSections={localHeroSections}
              onDelete={handleDeleteHeroSection}
              onReorder={handleReorder}
              emptyMessage="Chưa có hero section"
              emptyDescription="Hãy thêm hero section đầu tiên để bắt đầu"
            />
          </DataTable>
        </div>

        {/* Modals */}
        <ModalCreateHeroSection
          isOpen={isOpenCreateModal}
          onClose={() => setIsOpenCreateModal(false)}
          onComplete={() => {
            setIsOpenCreateModal(false);
            handleRefresh();
          }}
          existingHeroSections={localHeroSections}
        />
      </TooltipProvider>
    </div>
  );
}
