export * from "./errorCodes";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8888/api/v1";

// WebSocket URL - không dùng /api/v1 prefix
export const SOCKET_BASE_URL =
  import.meta.env.VITE_SOCKET_BASE_URL || "http://localhost:8888";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
} as const;

export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/dang-nhap",
  REGISTER: "/dang-ky",
  FORBIDDEN: "/403",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  USERS: "/users",
  MOVIES: "/movies",
  EPISODES: "/tap-phim",
  EPISODE_DETAIL: "/tap-phim/:episodeId",
  ACTORS: "/actors",
  DIRECTORS: "/dao-dien",
  COUNTRIES: "/countries",
  ROOMS: "/rooms",
  COMMENTS: "/comments",
  ROLES: "/quyen-han",
  GENRES: "/the-loai",
} as const;

// Page titles mapping
export const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/users": "Quản lý người dùng",
  "/movies": "Quản lý phim",
  "/tap-phim": "Quản lý tập phim",
  "/tap-phim/:episodeId": "Chi tiết tập phim",
  "/actors": "Quản lý diễn viên",
  "/dao-dien": "Quản lý đạo diễn",
  "/countries": "Quản lý quốc gia",
  "/rooms": "Quản lý phòng",
  "/comments": "Quản lý bình luận",
  "/quyen-han": "Quản lý vai trò",
  "/the-loai": "Quản lý thể loại",
  "/profile": "Hồ sơ cá nhân",
  "/settings": "Cài đặt",
  "/403": "Không có quyền truy cập",
} as const;