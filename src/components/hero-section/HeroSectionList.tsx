import { useState } from "react";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common";
import type { HeroSection } from "@/types/hero-section.types";
import { RBACModule } from "@/types";
import { usePermission } from "@/hooks";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

interface HeroSectionListProps {
  heroSections: HeroSection[];
  // eslint-disable-next-line no-unused-vars
  onDelete: (heroSection: HeroSection) => void;
  // eslint-disable-next-line no-unused-vars
  onReorder?: (draggedId: string, targetId: string) => void;
  emptyMessage?: string;
  emptyDescription?: string;
}

interface SortableItemProps {
  heroSection: HeroSection;
  // eslint-disable-next-line no-unused-vars
  onDelete: (heroSection: HeroSection) => void;
}

function SortableItem({ heroSection, onDelete }: SortableItemProps) {
  const { canDelete } = usePermission();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: heroSection.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className={`flex items-center gap-3 p-3 border rounded-lg bg-white dark:bg-gray-800 transition-all duration-200 ${
          isDragging
            ? "opacity-50 border-blue-400 dark:border-blue-500 shadow-lg scale-[0.98]"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
        }`}>
        {/* Order Badge */}
        <Badge
          variant="secondary"
          className="shrink-0 w-7 h-7 flex items-center justify-center p-0 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0">
          {heroSection.order + 1}
        </Badge>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded shrink-0 transition-colors"
          title="Kéo để sắp xếp">
          <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </div>

        {/* Poster */}
        <div className="shrink-0">
          {heroSection.movie?.posterUrl ? (
            <img
              src={heroSection.movie.posterUrl}
              alt={heroSection.movie.title}
              className="w-12 h-18 bg-gray-100 dark:bg-gray-700 rounded-lg object-cover shadow-sm"
            />
          ) : (
            <div className="w-12 h-18 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-[10px] text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-0.5">
            {heroSection.movie?.title || "N/A"}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            /{heroSection.movie?.slug || "-"}
          </p>
        </div>

        {/* Delete Button */}
        {canDelete(RBACModule.MOVIES) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(heroSection);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 shrink-0 transition-colors"
            title="Xóa khỏi danh sách">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Drag Preview Component
function DragPreview({ heroSection }: { heroSection: HeroSection }) {
  return (
    <div className="flex items-center gap-3 p-3 border-2 border-blue-400 dark:border-blue-500 rounded-lg bg-white dark:bg-gray-800 shadow-2xl rotate-2 scale-105">
      <Badge
        variant="secondary"
        className="shrink-0 w-7 h-7 flex items-center justify-center p-0 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0">
        {heroSection.order + 1}
      </Badge>
      <div className="cursor-grabbing p-1">
        <GripVertical className="w-4 h-4 text-blue-500" />
      </div>
      {heroSection.movie?.posterUrl ? (
        <img
          src={heroSection.movie.posterUrl}
          alt={heroSection.movie.title}
          className="w-12 h-18 bg-gray-100 dark:bg-gray-700 rounded-lg object-cover shadow-sm"
        />
      ) : (
        <div className="w-12 h-18 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-[10px] text-gray-400">No image</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-0.5">
          {heroSection.movie?.title || "N/A"}
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          /{heroSection.movie?.slug || "-"}
        </p>
      </div>
    </div>
  );
}

export function HeroSectionList({
  heroSections,
  onDelete,
  onReorder,
  emptyMessage = "Không tìm thấy hero section",
  emptyDescription = "Hãy thêm hero section đầu tiên để bắt đầu",
}: HeroSectionListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeHeroSection = activeId
    ? heroSections.find((hs) => hs.id === activeId)
    : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // drag after pointer moves 8px to avoid accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || active.id === over.id || !onReorder) {
      return;
    }

    onReorder(active.id as string, over.id as string);
  };

  if (heroSections.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 flex flex-col justify-center items-center rounded-lg border border-gray-200 dark:border-gray-700 p-16">
        <EmptyState message={emptyMessage} description={emptyDescription} />
      </div>
    );
  }

  const items = heroSections.map((hs) => hs.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {heroSections.map((heroSection) => (
            <SortableItem
              key={heroSection.id}
              heroSection={heroSection}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeHeroSection ? (
          <DragPreview heroSection={activeHeroSection} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
