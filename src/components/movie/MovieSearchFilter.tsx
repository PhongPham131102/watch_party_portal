import { SearchFilter } from "@/components/common";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface MovieSearchFilterProps {
  search: string;
  // eslint-disable-next-line no-unused-vars
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
  onSearch: () => void;
  status?: string;
  contentType?: string;
  releaseYearFrom?: string;
  releaseYearTo?: string;
  // eslint-disable-next-line no-unused-vars
  onStatusChange: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onContentTypeChange: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onReleaseYearFromChange: (value: string) => void;
  // eslint-disable-next-line no-unused-vars
  onReleaseYearToChange: (value: string) => void;
}

export function MovieSearchFilter({
  search,
  onSearchChange,
  onClearFilters,
  onSearch,
  status,
  contentType,
  releaseYearFrom,
  releaseYearTo,
  onStatusChange,
  onContentTypeChange,
  onReleaseYearFromChange,
  onReleaseYearToChange,
}: MovieSearchFilterProps) {
  const hasActiveFilters = 
    status !== "all" || 
    contentType !== "all" || 
    (releaseYearFrom !== "all" && releaseYearFrom !== "") || 
    (releaseYearTo !== "all" && releaseYearTo !== "") ||
    search.length > 0;

  return (
    <SearchFilter
      searchTerm={search}
      onSearchChange={onSearchChange}
      searchPlaceholder="Tìm kiếm phim..."
      isSearching={false}
      onSearch={onSearch}
      onClearFilters={onClearFilters}
      hasActiveFilters={hasActiveFilters}
      filters={
        <>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
              <SelectItem value="archived">Lưu trữ</SelectItem>
            </SelectContent>
          </Select>

          <Select value={contentType} onValueChange={onContentTypeChange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="movie">Phim lẻ</SelectItem>
              <SelectItem value="series">Phim bộ</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 border border-input rounded-md px-3 h-9 bg-background">
            <Input
              type="number"
              placeholder="Từ năm"
              value={releaseYearFrom === "all" ? "" : releaseYearFrom}
              onChange={(e) => onReleaseYearFromChange(e.target.value || "all")}
              className="w-[70px] h-full border-0 p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              min="1900"
              max={new Date().getFullYear()}
            />
            
            <span className="text-muted-foreground text-sm">-</span>
            
            <Input
              type="number"
              placeholder="Đến năm"
              value={releaseYearTo === "all" ? "" : releaseYearTo}
              onChange={(e) => onReleaseYearToChange(e.target.value || "all")}
              className="w-[70px] h-full border-0 p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
        </>
      }
    />
  );
}
