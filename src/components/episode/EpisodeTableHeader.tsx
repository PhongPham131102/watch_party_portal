/* eslint-disable no-unused-vars */
import { TableHeader, type TableColumn, type SortConfig } from "@/components/common";

export type EpisodeSortKey = "episodeNumber" | "title" | "createdAt";

interface EpisodeTableHeaderProps {
  sortBy: EpisodeSortKey;
  sortOrder: 'ASC' | 'DESC';
  onSort: (column: EpisodeSortKey) => void;
}

const columns: TableColumn<EpisodeSortKey>[] = [
  {
    key: "title",
    label: "Tập phim",
    sortable: true,
    sortKey: "title",
    align: "left",
  },
  {
    key: "episodeNumber",
    label: "Số tập",
    sortable: true,
    sortKey: "episodeNumber",
    align: "left",
  },
  {
    key: "movie",
    label: "Phim",
    sortable: false,
    align: "left",
  },
  {
    key: "duration",
    label: "Thời lượng",
    sortable: false,
    align: "left",
  },
  {
    key: "statusS3",
    label: "Trạng thái S3",
    sortable: false,
    align: "center",
  },
  {
    key: "statusMinio",
    label: "Trạng thái MinIO",
    sortable: false,
    align: "center",
  },
  {
    key: "processing",
    label: "Trạng thái xử lý",
    sortable: false,
    align: "center",
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    sortable: true,
    sortKey: "createdAt",
    align: "left",
  },
  {
    key: "actions",
    label: "Thao tác",
    sortable: false,
    align: "center",
  },
];

export function EpisodeTableHeader({ sortBy, sortOrder, onSort }: EpisodeTableHeaderProps) {
  const sortConfig: SortConfig<EpisodeSortKey> = {
    sortBy,
    sortOrder,
  };

  return <TableHeader columns={columns} sortConfig={sortConfig} onSort={onSort} />;
}

