import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Loader2, Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { movieService } from "@/services/movie.service";
import type { Movie } from "@/types/movie.types";
import { useDebounce } from "@/hooks";

interface ModalSelectMoviesProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (movieIds: string[]) => void;
  excludeMovieIds?: string[]; // IDs của phim đã có trong hero section
}

export function ModalSelectMovies({
  isOpen,
  onClose,
  onConfirm,
  excludeMovieIds = [],
}: ModalSelectMoviesProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieIds, setSelectedMovieIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  const hasMore = useMemo(() => page < totalPages, [page, totalPages]);

  const fetchMovies = useCallback(
    async ({
      page: targetPage = 1,
      append = false,
      searchValue,
    }: {
      page?: number;
      append?: boolean;
      searchValue?: string;
    } = {}) => {
      const query = searchValue ?? debouncedSearch;
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      try {
        const response = await movieService.getMovies({
          page: targetPage,
          limit: 20,
          search: query ? query.trim() : undefined,
        });
        const { data, meta } = response.data;

        setMovies((prev) => {
          if (append) {
            const combined = [...prev, ...data];
            const uniqueMap = new Map<string, Movie>();
            combined.forEach((movie) => uniqueMap.set(movie.id, movie));
            return Array.from(uniqueMap.values());
          }
          return data;
        });

        setPage(meta.page);
        setTotalPages(meta.totalPages);
        setTotal(meta.total);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [debouncedSearch]
  );

  // Load initial movies when modal opens or search term changes
  useEffect(() => {
    if (!isOpen) return;
    setPage(1);
    fetchMovies({ page: 1, append: false, searchValue: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, debouncedSearch]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || isLoading || isLoadingMore) {
      return;
    }
    const target = event.currentTarget;
    const threshold = 40;
    if (
      target.scrollHeight - target.scrollTop - target.clientHeight <=
      threshold
    ) {
      fetchMovies({ page: page + 1, append: true });
    }
  };

  const toggleMovieSelection = (movieId: string) => {
    setSelectedMovieIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selectedMovieIds));
    setSelectedMovieIds(new Set());
    setSearchTerm("");
    onClose();
  };

  const handleClose = () => {
    setSelectedMovieIds(new Set());
    setSearchTerm("");
    onClose();
  };

  // Filter out excluded movies
  const availableMovies = movies.filter(
    (movie) => !excludeMovieIds.includes(movie.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Thêm phim vào Hero Section
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Chọn một hoặc nhiều phim để thêm vào danh sách hero section
          </p>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Search bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm phim theo tiêu đề hoặc slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Movie list */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
            onScroll={handleScroll}>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 mb-3" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Đang tải phim...
                </span>
              </div>
            ) : availableMovies.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                  Không tìm thấy phim
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {debouncedSearch
                    ? `Không có kết quả cho "${debouncedSearch}"`
                    : "Chưa có phim nào trong hệ thống"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {availableMovies.map((movie) => {
                  const isSelected = selectedMovieIds.has(movie.id);
                  return (
                    <div
                      key={movie.id}
                      onClick={() => toggleMovieSelection(movie.id)}
                      className={`p-4 flex items-center gap-4 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-600 dark:border-l-blue-400"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-l-transparent"
                      }`}>
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleMovieSelection(movie.id)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-14 h-20 object-cover rounded-lg flex-shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="w-14 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm">
                          <span className="text-xs text-gray-400">No image</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
                          {movie.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          /{movie.slug}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {isLoadingMore && (
              <div className="flex items-center justify-center py-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Đang tải thêm phim...
                </span>
              </div>
            )}

            {!hasMore && availableMovies.length > 0 && (
              <div className="py-4 text-center text-xs text-gray-400 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <span className="inline-flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-green-500"></span>
                  Đã tải tất cả {availableMovies.length} phim
                </span>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900 dark:text-white">
                  Đã chọn:{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    {selectedMovieIds.size}
                  </span>{" "}
                  phim
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400">
                  Đã tải: {availableMovies.length}/{total} phim
                </span>
              </div>
              {hasMore && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Cuộn để tải thêm →
                </span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedMovieIds.size === 0}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4" />
            Thêm {selectedMovieIds.size > 0 && `${selectedMovieIds.size} `}phim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

