/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCcw, Database, Cloud, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/ui/copy-button";
import VideoPlayer from "@/components/episode/VideoPlayer";
import { useEpisodeStore } from "@/store/slices/episodeSlice";
import {
  UploadVideoStatus,
  VideoProcessingStatus,
} from "@/types/episode.types";

const statusConfig = {
  [UploadVideoStatus.PENDING]: {
    label: "Chờ xử lý",
    className: "bg-gray-100 text-gray-700 border border-gray-200",
  },
  [UploadVideoStatus.PROCESSING]: {
    label: "Đang xử lý",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
  },
  [UploadVideoStatus.SUCCESS]: {
    label: "Thành công",
    className: "bg-green-100 text-green-700 border border-green-200",
  },
  [UploadVideoStatus.FAILED]: {
    label: "Thất bại",
    className: "bg-red-100 text-red-600 border border-red-200",
  },
};

const processingConfig = {
  [VideoProcessingStatus.PENDING]: {
    label: "Chờ xử lý",
    className: "bg-gray-100 text-gray-700 border border-gray-200",
  },
  [VideoProcessingStatus.PROCESSING]: {
    label: "Đang chạy",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
  [VideoProcessingStatus.SUCCESS]: {
    label: "Hoàn tất",
    className: "bg-green-100 text-green-700 border border-green-200",
  },
  [VideoProcessingStatus.FAILED]: {
    label: "Thất bại",
    className: "bg-red-100 text-red-600 border border-red-200",
  },
};

const SOURCE_TABS = ["minio", "s3"] as const;
type SourceTab = (typeof SOURCE_TABS)[number];

export default function EpisodeDetailPage() {
  const { episodeId } = useParams();
  const navigate = useNavigate();
  const {
    currentEpisode,
    isFetchingDetail,
    fetchEpisodeById,
    clearCurrentEpisode,
  } = useEpisodeStore();

  const [activeSource, setActiveSource] = useState<SourceTab>("minio");

  const isSourceAvailable = useCallback(
    (source: SourceTab) => {
      if (!currentEpisode) return false;
      if (source === "minio") {
        return (
          currentEpisode.uploadStatusMinio === UploadVideoStatus.SUCCESS &&
          Boolean(currentEpisode.masterM3u8Minio)
        );
      }
      return (
        currentEpisode.uploadStatusS3 === UploadVideoStatus.SUCCESS &&
        Boolean(currentEpisode.masterM3u8S3)
      );
    },
    [currentEpisode]
  );

  useEffect(() => {
    if (episodeId) {
      fetchEpisodeById(episodeId);
    }
    return () => {
      clearCurrentEpisode();
    };
  }, [episodeId, fetchEpisodeById, clearCurrentEpisode]);

  useEffect(() => {
    if (!currentEpisode) return;
    if (!isSourceAvailable(activeSource)) {
      const fallbackSource =
        SOURCE_TABS.find((source) => isSourceAvailable(source)) || "minio";
      setActiveSource(fallbackSource);
    }
  }, [currentEpisode, activeSource, isSourceAvailable]);

  const activeLinks = useMemo(() => {
    if (!currentEpisode) return [];

    const qualities =
      (activeSource === "minio"
        ? currentEpisode.qualitiesMinio
        : currentEpisode.qualitiesS3) || [];

    const masterUrl =
      activeSource === "minio"
        ? currentEpisode.masterM3u8Minio
        : currentEpisode.masterM3u8S3;

    const qualityLinks = qualities.map((quality) => ({
      label: `${quality.quality}P M3U8`,
      url: quality.url,
    }));

    return [
      { label: "MASTER M3U8", url: masterUrl || "" },
      ...qualityLinks,
      { label: "THUMBNAIL", url: currentEpisode.thumbnailUrl || "" },
    ];
  }, [activeSource, currentEpisode]);

  const videoSource = useMemo(() => {
    if (!currentEpisode) return "";
    if (activeSource === "minio") {
      return currentEpisode.masterM3u8Minio || "";
    }
    if (activeSource === "s3") {
      return currentEpisode.masterM3u8S3 || "";
    }
    return "";
  }, [activeSource, currentEpisode]);

  const renderStatusBadge = (
    label: string,
    value?: UploadVideoStatus | VideoProcessingStatus | null,
    type: "upload" | "processing" = "upload"
  ) => {
    if (!value) {
      return (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase">{label}</span>
          <Badge variant="outline" className="bg-gray-100 text-gray-500">
            Chưa có dữ liệu
          </Badge>
        </div>
      );
    }
    const config =
      type === "upload"
        ? (statusConfig as any)[value]
        : (processingConfig as any)[value];

    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 uppercase">{label}</span>
        <Badge variant="outline" className={config?.className}>
          {config?.label || value}
        </Badge>
      </div>
    );
  };

  if (isFetchingDetail && !currentEpisode) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!currentEpisode) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Không tìm thấy thông tin tập phim.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <p className="text-xs text-gray-500 uppercase">Chi tiết tập phim</p>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              {currentEpisode.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => episodeId && fetchEpisodeById(episodeId)}>
            <RefreshCcw className="h-4 w-4" />
            Làm mới
          </Button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-2">
              {SOURCE_TABS.map((tab) => {
                const available = isSourceAvailable(tab);
                const label = tab === "s3" ? "AWS S3" : "Minio";
                const Icon = tab === "s3" ? Cloud : Database;
                return (
                  <Button
                    key={`player-${tab}`}
                    variant={activeSource === tab ? "default" : "outline"}
                    size="sm"
                    disabled={!available}
                    className={`flex items-center gap-2 ${activeSource === tab ? "" : "bg-white dark:bg-gray-900"}`}
                    onClick={() => available && setActiveSource(tab)}
                    title={
                      available
                        ? `Xem nguồn ${label}`
                        : "Nguồn chưa sẵn sàng (chưa SUCCESS)"
                    }>
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-[1fr_0.85fr] gap-6">
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-3">
                {videoSource ? (
                  <VideoPlayer
                    src={videoSource}
                    videoId={currentEpisode.id}
                    className="h-[360px]"
                  />
                ) : (
                  <div className="h-[360px] rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-500 text-sm">
                    Không có nguồn phát cho tab hiện tại
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Button size="sm" variant="default" className="w-fit">
                  Thông tin chung
                </Button>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase">
                      Video ID
                    </label>
                    <Input value={currentEpisode.id} readOnly />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase">
                      Phim
                    </label>
                    <Input
                      value={currentEpisode.movie?.title || "Không xác định"}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-gray-500 uppercase">
                      Tiêu đề
                    </label>
                    <Input value={currentEpisode.title} readOnly />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase">
                      Tập
                    </label>
                    <Input value={currentEpisode.episodeNumber} readOnly />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500 uppercase">
                      Preview Thumbnail
                    </label>
                    {currentEpisode.thumbnailUrl ? (
                      <img
                        src={currentEpisode.thumbnailUrl}
                        alt={currentEpisode.title}
                        className="h-32 rounded-lg object-cover border border-gray-200 dark:border-gray-800"
                      />
                    ) : (
                      <div className="h-32 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm text-gray-500 border border-dashed border-gray-300">
                        Chưa có thumbnail
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-gray-500 uppercase">
                      Mô tả
                    </label>
                    <Textarea
                      value={currentEpisode.description || "Chưa có mô tả"}
                      readOnly
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Thông tin trạng thái
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              {renderStatusBadge(
                "Trạng thái Upload",
                currentEpisode.uploadStatusS3
              )}
              {renderStatusBadge(
                "Trạng thái MinIO",
                currentEpisode.uploadStatusMinio
              )}
              {renderStatusBadge(
                "Trạng thái xử lý",
                currentEpisode.processingStatus,
                "processing"
              )}
            </div>
          </div>
        </section>

        <aside className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-2">
            {SOURCE_TABS.map((tab) => {
              const available = isSourceAvailable(tab);
              const label = tab === "s3" ? "AWS S3" : "Minio";
              const Icon = tab === "s3" ? Cloud : Database;
              return (
                <Button
                  key={`source-${tab}`}
                  variant={activeSource === tab ? "default" : "outline"}
                  size="sm"
                  disabled={!available}
                  className={`flex-1 flex items-center justify-center gap-2 ${activeSource === tab ? "" : "bg-white dark:bg-gray-900"}`}
                  onClick={() => available && setActiveSource(tab)}
                  title={
                    available
                      ? `Xem nguồn ${label}`
                      : "Nguồn chưa sẵn sàng (chưa SUCCESS)"
                  }>
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              );
            })}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Link M3U8, thumbnail
            </h3>
            <div className="space-y-3">
              {activeLinks.map((link, index) => (
                <div
                  key={`${link.label}-${index}`}
                  className="space-y-1 text-sm">
                  <div className="text-xs text-gray-500 uppercase">
                    {link.label}
                  </div>
                  {link.url ? (
                    <div className="flex gap-2">
                      <Input value={link.url} readOnly className="text-xs" />
                      <CopyButton value={link.url} className="h-10" />
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-md p-2">
                      Không có dữ liệu
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
