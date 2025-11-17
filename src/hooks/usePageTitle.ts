import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { PAGE_TITLES } from "@/constants";

/**
 * Custom hook để quản lý page title động theo route
 * - Trả về title của page hiện tại
 * - Tự động update document title (HTML <title>)
 */
export function usePageTitle() {
  const location = useLocation();

  // Get page title dựa trên pathname
  const pageTitle = useMemo(() => {
    const pathname = location.pathname;
    
    // Exact match
    if (PAGE_TITLES[pathname]) {
      return PAGE_TITLES[pathname];
    }

    // Pattern matching cho dynamic routes (e.g. /movies/123)
    const patterns: Record<string, RegExp> = {
      "Chi tiết phim": /^\/movies\/[^/]+$/,
      "Chi tiết tập phim": /^\/tap-phim\/[^/]+$/,
      "Chi tiết diễn viên": /^\/actors\/[^/]+$/,
      "Chi tiết đạo diễn": /^\/dao-dien\/[^/]+$/,
      "Chi tiết quốc gia": /^\/countries\/[^/]+$/,
      "Chi tiết phòng": /^\/rooms\/[^/]+$/,
      "Chi tiết người dùng": /^\/users\/[^/]+$/,
    };

    for (const [title, pattern] of Object.entries(patterns)) {
      if (pattern.test(pathname)) {
        return title;
      }
    }

    // Default fallback
    return "Hệ thống quản trị";
  }, [location.pathname]);

  // Update document title khi pageTitle thay đổi
  useEffect(() => {
    document.title = `${pageTitle} | Watch Party`;
  }, [pageTitle]);

  return pageTitle;
}

