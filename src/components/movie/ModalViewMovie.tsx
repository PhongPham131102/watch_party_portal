import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Film, Star, Eye, Clock, Calendar } from "lucide-react";
import type { Movie } from "@/types/movie.types";

interface ModalViewMovieProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
}

export function ModalViewMovie({
  isOpen,
  onClose,
  movie,
}: ModalViewMovieProps) {
  if (!movie) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chi tiết phim</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Poster
              </p>
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <Film className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Backdrop
              </p>
              {movie.backdropUrl ? (
                <img
                  src={movie.backdropUrl}
                  alt={`${movie.title} backdrop`}
                  className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <Film className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Title and badges */}
          <div className="space-y-2">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {movie.title}
              </h3>
              {movie.originalTitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  {movie.originalTitle}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {getStatusBadge(movie.status)}
              {getContentTypeBadge(movie.contentType)}
            </div>
          </div>

          {/* Description */}
          {movie.description && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mô tả
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {movie.description}
              </p>
            </div>
          )}

          {/* Relationships */}
          {(movie.genres?.length || movie.countries?.length || movie.directors?.length || movie.actors?.length) ? (
            <div className="grid grid-cols-2 gap-4">
              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Thể loại
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="outline" className="border-blue-400 text-blue-600 dark:border-blue-600 dark:text-blue-400">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {movie.countries && movie.countries.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quốc gia
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {movie.countries.map((country) => (
                      <Badge key={country.id} variant="outline" className="border-green-400 text-green-600 dark:border-green-600 dark:text-green-400">
                        {country.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {movie.directors && movie.directors.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Đạo diễn
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {movie.directors.map((director) => (
                      <Badge key={director.id} variant="outline" className="border-purple-400 text-purple-600 dark:border-purple-600 dark:text-purple-400">
                        {director.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {movie.actors && movie.actors.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Diễn viên
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {movie.actors.map((actor) => (
                      <Badge key={actor.id} variant="outline" className="border-orange-400 text-orange-600 dark:border-orange-600 dark:text-orange-400">
                        {actor.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Năm phát hành
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {movie.releaseYear || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Thời lượng
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {movie.durationMinutes
                    ? `${movie.durationMinutes} phút`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Đánh giá
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {movie.averageRating} ({movie.totalRatings || 0} đánh giá)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Lượt xem
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {movie.totalViews?.toLocaleString("vi-VN") || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Trailer URL */}
          {movie.trailerUrl && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Trailer
              </p>
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                {movie.trailerUrl}
              </a>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Slug: </span>
                <span className="text-gray-900 dark:text-white font-mono">
                  {movie.slug}
                </span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Ngày tạo:{" "}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(movie.createdAt)}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 dark:text-gray-400">
                  Cập nhật lần cuối:{" "}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(movie.updatedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
