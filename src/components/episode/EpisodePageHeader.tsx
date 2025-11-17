import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common";

interface EpisodePageHeaderProps {
  onRefresh: () => void;
  onUploadEpisode: () => void;
  isLoading: boolean;
  canUploadEpisode: boolean;
}

export function EpisodePageHeader({
  onRefresh,
  onUploadEpisode,
  isLoading,
  canUploadEpisode,
}: EpisodePageHeaderProps) {
  return (
    <PageHeader
      title="Quản lý tập phim"
      description="Quản lý và upload tập phim trong hệ thống"
      onRefresh={onRefresh}
      isLoading={isLoading}
      actions={
        canUploadEpisode && (
          <Button
            onClick={onUploadEpisode}
            className="gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200">
            <Upload className="h-4 w-4" />
            <span>Upload tập phim</span>
          </Button>
        )
      }
    />
  );
}
