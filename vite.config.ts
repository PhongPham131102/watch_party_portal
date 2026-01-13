/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@components": path.resolve(import.meta.dirname, "./src/components"),
      "@pages": path.resolve(import.meta.dirname, "./src/pages"),
      "@hooks": path.resolve(import.meta.dirname, "./src/hooks"),
      "@services": path.resolve(import.meta.dirname, "./src/services"),
      "@utils": path.resolve(import.meta.dirname, "./src/utils"),
      "@types": path.resolve(import.meta.dirname, "./src/types"),
      "@constants": path.resolve(import.meta.dirname, "./src/constants"),
      "@store": path.resolve(import.meta.dirname, "./src/store"),
      "@assets": path.resolve(import.meta.dirname, "./src/assets"),
    },
  },
  server: {
    proxy: {
      // Proxy tất cả requests từ /api đến backend
      "/api": {
        target:
          process.env.VITE_API_BASE_URL?.replace("/api/v1", "") ||
          "http://localhost:8888",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path, // Giữ nguyên path /api/...
      },
      // Nếu có endpoint /public hoặc các endpoint khác không có prefix /api
      // Forward đến /api/v1/public (giả sử backend có prefix /api/v1)
      // Nếu backend không có prefix, xóa dòng rewrite để giữ nguyên path
      "/public": {
        target:
          process.env.VITE_API_BASE_URL?.replace("/api/v1", "") ||
          "http://localhost:8888",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => `/api/v1${path}`, // Thêm prefix /api/v1 vào /public
      },
    },
  },
});
