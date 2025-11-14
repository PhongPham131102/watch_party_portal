// API endpoints
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

// Routes
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/dang-nhap",
  REGISTER: "/dang-ky",
  // Add more routes as needed
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
} as const;
