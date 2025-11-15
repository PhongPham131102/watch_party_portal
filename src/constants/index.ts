export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8888/api/v1";

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
  ACTORS: "/actors",
  DIRECTORS: "/directors",
  COUNTRIES: "/countries",
  ROOMS: "/rooms",
  COMMENTS: "/comments",
  ROLES: "/roles",
} as const;
