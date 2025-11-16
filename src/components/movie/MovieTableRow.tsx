import { Eye, Pencil, Trash2, Film, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RBACModule } from "@/types";
import { usePermission } from "@/hooks";
import type { Movie } from "@/types/movie.types";

interface MovieTableRowProps {
  movie: Movie;
  // eslint-disable-next-line no-unused-vars
  onView: (movie: Movie) => void;
  // eslint-disable-next-line no-unused-vars
  onEdit: (movie: Movie) => void;
  // eslint-disable-next-line no-unused-vars
  onDelete: (movie: Movie) => void;
}

export function MovieTableRow({
  movie,
  onView,
  onEdit,
  onDelete,
}: MovieTableRowProps) {
  const { canRead, canUpdate, canDelete } = usePermission();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Đã xuất bản</Badge>
        );
      case "draft":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">Bản nháp</Badge>
        );
      case "archived":
        return <Badge className="bg-red-500 hover:bg-red-600">Lưu trữ</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getContentTypeBadge = (contentType: string) => {
    switch (contentType) {
      case "movie":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            Phim lẻ
          </Badge>
        );
      case "series":
        return (
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-600">
            Phim bộ
          </Badge>
        );
      default:
        return <Badge variant="outline">{contentType}</Badge>;
    }
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-14 w-10 rounded object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="h-14 w-10 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                <Film className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
              {movie.title}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {movie.slug}
            </div>
            {movie.originalTitle && (
              <div className="text-xs text-gray-400 dark:text-gray-500 italic max-w-xs truncate">
                {movie.originalTitle}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(movie.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getContentTypeBadge(movie.contentType)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {movie.releaseYear || "-"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {movie.durationMinutes ? `${movie.durationMinutes} phút` : "-"}
        </div>
      </td>
      <td className="px-6 py-4">
        {movie.genres && movie.genres.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 max-w-xs">
            {movie.genres.slice(0, 3).map((genre) => (
              <Badge
                key={genre.id}
                variant="outline"
                className="border-blue-500 text-blue-700 bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:bg-blue-950/30 font-medium whitespace-nowrap">
                {genre.name}
              </Badge>
            ))}
            {movie.genres.length > 3 && (
              <Badge
                variant="outline"
                className="border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400 whitespace-nowrap">
                +{movie.genres.length - 3}
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4">
        {movie.countries && movie.countries.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 max-w-xs">
            {movie.countries.slice(0, 2).map((country) => (
              <Badge
                key={country.id}
                variant="outline"
                className="border-green-500 text-green-700 bg-green-50 dark:border-green-600 dark:text-green-400 dark:bg-green-950/30 font-medium whitespace-nowrap">
                {country.name}
              </Badge>
            ))}
            {movie.countries.length > 2 && (
              <Badge
                variant="outline"
                className="border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400 whitespace-nowrap">
                +{movie.countries.length - 2}
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4">
        {movie.directors && movie.directors.length > 0 ? (
          <div className="text-sm text-gray-900 dark:text-white">
            {movie.directors
              .slice(0, 2)
              .map((d) => d.name)
              .join(", ")}
            {movie.directors.length > 2 && (
              <span className="text-gray-500 dark:text-gray-400">
                {" "}
                +{movie.directors.length - 2}
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4">
        {movie.actors && movie.actors.length > 0 ? (
          <div className="text-sm text-gray-900 dark:text-white">
            {movie.actors
              .slice(0, 2)
              .map((a) => a.name)
              .join(", ")}
            {movie.actors.length > 2 && (
              <span className="text-gray-500 dark:text-gray-400">
                {" "}
                +{movie.actors.length - 2}
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {movie.averageRating}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({movie.totalRatings || 0})
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {movie.totalViews?.toLocaleString("vi-VN") || 0}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(movie.createdAt)}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex justify-center gap-2">
          {canRead(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(movie)}
                  className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 cursor-pointer">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem chi tiết</p>
              </TooltipContent>
            </Tooltip>
          )}
          {canUpdate(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(movie)}
                  className="h-9 w-9 p-0 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉnh sửa</p>
              </TooltipContent>
            </Tooltip>
          )}
          {canDelete(RBACModule.MOVIES) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 cursor-pointer"
                  onClick={() => onDelete(movie)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xóa phim</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </td>
    </tr>
  );
}
