import { useState } from "react";
import { showToast } from "@/lib/toast";
import { useHeroSectionStore } from "@/store/slices/heroSectionSlice";
import { ModalSelectMovies } from "./ModalSelectMovies";
import type { HeroSection } from "@/types/hero-section.types";

interface ModalCreateHeroSectionProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  existingHeroSections?: HeroSection[]; // Để exclude các phim đã có
}

export function ModalCreateHeroSection({
  isOpen,
  onClose,
  onComplete,
  existingHeroSections = [],
}: ModalCreateHeroSectionProps) {
  const { createHeroSection, isCreating, createError } = useHeroSectionStore();

  const handleConfirm = async (movieIds: string[]) => {
    if (movieIds.length === 0) {
      showToast.error("Lỗi", "Vui lòng chọn ít nhất một phim");
      return;
    }

    // Tính order tiếp theo
    const maxOrder = existingHeroSections.reduce(
      (max, hs) => Math.max(max, hs.order),
      -1
    );
    let nextOrder = maxOrder + 1;

    // Tạo hero sections cho từng phim
    const promises = movieIds.map((movieId) =>
      createHeroSection({
        movieId,
        order: nextOrder++,
      })
    );

    try {
      const results = await Promise.all(promises);
      const successCount = results.filter((r) => r).length;

      if (successCount === movieIds.length) {
        showToast.success(
          "Thành công",
          `Đã thêm ${successCount} phim vào hero section`
        );
        onComplete();
        onClose();
      } else if (successCount > 0) {
        showToast.warning(
          "Một phần thành công",
          `Đã thêm ${successCount}/${movieIds.length} phim`
        );
        onComplete();
        onClose();
      } else {
        showToast.error("Lỗi", createError || "Không thể thêm phim vào hero section");
      }
    } catch (error) {
      showToast.error("Lỗi", createError || "Có lỗi xảy ra khi thêm phim");
    }
  };

  const excludeMovieIds = existingHeroSections.map((hs) => hs.movieId);

  return (
    <ModalSelectMovies
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      excludeMovieIds={excludeMovieIds}
    />
  );
}

