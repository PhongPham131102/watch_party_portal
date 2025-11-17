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
});
