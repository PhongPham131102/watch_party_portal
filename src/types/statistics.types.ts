export interface OverviewStats {
  views: {
    current: number;
    diff: string;
    isUp: boolean;
  };
  rooms: {
    total: number;
    public: number;
    private: number;
  };
  movies: {
    total: number;
  };
}

export interface RealtimeStats {
  activeRooms: {
    current: number;
  };
}

export interface ProcessingPipelineStats {
  recentUploads: Array<{
    id: string;
    movieTitle: string;
    episodeTitle: string;
    source: string;
    time: string; // Date string from backend
    status: string;
  }>;
  stats: {
    pendingJobs: number;
    failedJobs: number;
    successJobsToday: number;
  };
}

export interface TopContentStats {
  rank: number;
  title: string;
  views: number;
}

export interface ServerStats {
  os: {
    platform: string;
    distro: string;
    release: string;
    uptime: number; // seconds
  };
  cpu: {
    manufacturer: string;
    brand: string;
    speed: number;
    cores: number;
    loadPercent: number;
  };
  memory: {
    total: number; // bytes
    used: number; // bytes
    active: number; // bytes
    free: number; // bytes
    usedPercent: number;
  };
  storage: Array<{
    size: number; // bytes
    used: number; // bytes
    available: number; // bytes
    usedPercent: number;
  }>;
}

export interface DashboardStats {
  overview: OverviewStats;
  realtime: RealtimeStats;
  processing: ProcessingPipelineStats;
  topContent: TopContentStats[];
  serverStats: ServerStats;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}
