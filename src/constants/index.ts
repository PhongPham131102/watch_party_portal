// API endpoints
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8888/api";

// Routes
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
} as const;
