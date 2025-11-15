import React, { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/store/slices/authSlice";

import { Menu, User, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      showToast.success(
        "Đăng xuất thành công",
        "Bạn đã đăng xuất khỏi hệ thống"
      );
      navigate("/dang-nhap");
    } catch (error) {
      console.error("Logout error:", error);
      showToast.error("Lỗi đăng xuất", "Có lỗi xảy ra khi đăng xuất");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onLogout={handleLogout}
        currentPath={location.pathname}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16! bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden cursor-pointer">
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.username || "Người dùng"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role?.displayName || "Người dùng"}
                  </p>
                </div>

                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 cursor-pointer">
                    <User className="h-5 w-5 text-white" />
                  </Button>

                  {/* User dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Hồ sơ
                      </button>
                      <button
                        onClick={() => navigate("/settings")}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center cursor-pointer">
                        <SettingsIcon className="h-4 w-4 mr-2" />
                        Cài đặt
                      </button>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900 h-full">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
