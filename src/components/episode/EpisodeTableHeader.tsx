/* eslint-disable no-unused-vars */
import { TableHeader, type TableColumn, type SortConfig } from "@/components/common";

export type EpisodeSortKey = 'episodeNumber' | 'title' | 'createdAt' | 'publishedAt';

interface EpisodeTableHeaderProps {
  sortBy: EpisodeSortKey;
  sortOrder: 'ASC' | 'DESC';
  onSort: (column: EpisodeSortKey) => void;
}

const columns: TableColumn<EpisodeSortKey>[] = [
  {
    key: 'episodeNumber',
    label: 'Số tập',
    sortable: true,
    sortKey: 'episodeNumber',
    align: 'left',
  },
  {
    key: 'title',
    label: 'Tiêu đề',
    sortable: true,
    sortKey: 'title',
    align: 'left',
  },
  {
    key: 'movie',
    label: 'Phim',
    sortable: false,
    align: 'left',
  },
  {
    key: 'duration',
    label: 'Thời lượng',
    sortable: false,
    align: 'left',
  },
  {
    key: 'uploadStatus',
    label: 'Trạng thái upload',
    sortable: false,
    align: 'center',
  },
  {
    key: 'publishedAt',
    label: 'Ngày xuất bản',
    sortable: true,
    sortKey: 'publishedAt',
    align: 'left',
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true,
    sortKey: 'createdAt',
    align: 'left',
  },
  {
    key: 'actions',
    label: 'Thao tác',
    sortable: false,
    align: 'center',
  },
];

export function EpisodeTableHeader({ sortBy, sortOrder, onSort }: EpisodeTableHeaderProps) {
  const sortConfig: SortConfig<EpisodeSortKey> = {
    sortBy,
    sortOrder,
  };

  return <TableHeader columns={columns} sortConfig={sortConfig} onSort={onSort} />;
}

