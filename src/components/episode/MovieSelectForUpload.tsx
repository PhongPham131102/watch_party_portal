/* eslint-disable no-unused-vars */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { movieService } from "@/services/movie.service";
import type { Movie } from "@/types/movie.types";
import { useDebounce } from "@/hooks";

interface MovieSelectForUploadProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MovieSelectForUpload({
  value,
  onChange,
  placeholder = "Chọn phim",
  className,
}: MovieSelectForUploadProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

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
          limit: 10,
          search: query ? query.trim() : undefined,
        });
        const { data, meta } = response.data;

        setMovies((prev) => {
          const combined = append ? [...prev, ...data] : data;
          const uniqueMap = new Map<string, Movie>();
          combined.forEach((movie) => uniqueMap.set(movie.id, movie));
          return Array.from(uniqueMap.values());
        });

        setPage(meta.page);
        setTotalPages(meta.totalPages);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [debouncedSearch]
  );

  // Load initial movies when popover opens or search term changes
  useEffect(() => {
    if (!open) return;
    fetchMovies({ page: 1, append: false, searchValue: debouncedSearch });
  }, [open, debouncedSearch, fetchMovies]);

  // Keep selected movie label in sync
  useEffect(() => {
    if (!value) {
      setSelectedMovie(null);
      return;
    }

    const existing = movies.find((movie) => movie.id === value);
    if (existing) {
      setSelectedMovie(existing);
      return;
    }

    let isMounted = true;
    movieService
      .getMovieById(value)
      .then((res) => {
        if (isMounted) {
          setSelectedMovie(res.data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch movie detail:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [value, movies]);

  const handleSelect = (movie: Movie) => {
    onChange(movie.id);
    setSelectedMovie(movie);
    setOpen(false);
  };

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className={`justify-between ${className || "w-[220px]"}`}
        >
          <span className="truncate text-sm">
            {selectedMovie ? selectedMovie.title : placeholder}
          </span>
          <Search className="h-4 w-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <div className="p-3 border-b border-gray-200">
          <Input
            autoFocus
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
        </div>

        <div
          ref={listRef}
          className="max-h-72 overflow-y-auto"
          onScroll={handleScroll}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Đang tải phim...
            </div>
          ) : movies.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">
              Không tìm thấy phim phù hợp.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {movies.map((movie) => {
                const isSelected = value === movie.id;
                return (
                  <button
                    key={movie.id}
                    type="button"
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex flex-col ${
                      isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    }`}
                    onClick={() => handleSelect(movie)}
                  >
                    <span className="font-medium truncate">{movie.title}</span>
                    {movie.releaseYear && (
                      <span className="text-xs text-gray-500">
                        Năm phát hành: {movie.releaseYear}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {isLoadingMore && (
            <div className="flex items-center justify-center py-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Đang tải thêm...
            </div>
          )}
          {!hasMore && movies.length > 0 && (
            <div className="py-2 text-center text-xs text-gray-400">
              Đã tải tất cả phim.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
