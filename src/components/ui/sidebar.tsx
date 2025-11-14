"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Users,
  Film,
  UserCircle,
  Video,
  Globe,
  MessageSquare,
  Shield
} from "lucide-react";
import { APP_ROUTES } from "@/constants";
import { useAbility } from "@casl/react";
import { AbilityContext } from "@/lib/Can";
import { RBACModule, RBACAction } from "@/types";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
  currentPath: string;
}

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  badge?: string;
  module?: string; // RBAC module
  action?: string; // RBAC action (default: 'read')
}

// Menu items configuration with RBAC permissions
const menuItemsConfig: MenuItem[] = [
  {
    icon: Home,
    label: "Dashboard",
    path: APP_ROUTES.HOME,
    // Dashboard is always visible (no permission required)
  },
  {
    icon: Users,
    label: "Quản lý người dùng",
    path: "/users",
    module: RBACModule.USERS,
    action: RBACAction.READ,
  },
  {
    icon: Film,
    label: "Quản lý phim",
    path: "/movies",
    module: RBACModule.MOVIES,
    action: RBACAction.READ,
  },
  {
    icon: UserCircle,
    label: "Quản lý diễn viên",
    path: "/actors",
    module: RBACModule.ACTORS,
    action: RBACAction.READ,
  },
  {
    icon: Video,
    label: "Quản lý đạo diễn",
    path: "/directors",
    module: RBACModule.DIRECTORS,
    action: RBACAction.READ,
  },
  {
    icon: Globe,
    label: "Quản lý quốc gia",
    path: "/countries",
    module: RBACModule.COUNTRIES,
    action: RBACAction.READ,
  },
  {
    icon: Video,
    label: "Quản lý phòng",
    path: "/rooms",
    module: RBACModule.ROOMS,
    action: RBACAction.READ,
  },
  {
    icon: MessageSquare,
    label: "Quản lý bình luận",
    path: "/comments",
    module: RBACModule.COMMENTS,
    action: RBACAction.READ,
  },
  {
    icon: Shield,
    label: "Quản lý vai trò",
    path: "/roles",
    module: RBACModule.ROLES,
    action: RBACAction.READ,
  },
];

// Filter menu items based on user permissions using CASL ability
const useFilteredMenuItems = (): MenuItem[] => {
  // Sử dụng useAbility từ CASL - cách chuẩn
  const ability = useAbility(AbilityContext);

  return React.useMemo(() => {
    return menuItemsConfig.filter((item) => {
      // Dashboard is always visible
      if (item.path === APP_ROUTES.HOME) {
        return true;
      }

      // If no permission required, show the item
      if (!item.module) {
        return true;
      }

      // Check if user has permission using CASL ability
      const action = item.action || RBACAction.READ;
      return ability.can(action as any, item.module as any);
    });
  }, [ability]);
};

export function Sidebar({
  isCollapsed,
  onToggle,
  onLogout,
  currentPath,
}: SidebarProps) {
  const navigate = useNavigate();
  const filteredMenuItems = useFilteredMenuItems();
  
  return (
    <div
      className={cn(
        "relative flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}>
      {/* Header */}
      <div className="flex h-16! items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 h-[60px]!">
          {!isCollapsed && (
            <>
              <Logo size="sm" />
              <span className="text-lg font-bold text-gray-900 dark:text-white transition-all duration-200 truncate">
                Hệ thống quản trị
              </span>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-hide">
        {filteredMenuItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;

          return (
            <div key={item.path} className="relative group">
              <Button
                variant="ghost"
                onClick={() => {
                  navigate(item.path);
                }}
                className={cn(
                  "w-full justify-start h-11 px-3 text-left transition-all duration-200",
                  "hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm cursor-pointer",
                  isActive
                    ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
                  isCollapsed ? "justify-center px-0" : ""
                )}>
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300",
                    isCollapsed ? "" : "mr-3"
                  )}
                />

                {!isCollapsed && (
                  <>
                    <span className="font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Button>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-linear-to-b from-blue-600 to-blue-700 rounded-r-full animate-pulse" />
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3">
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            "w-full justify-start h-11 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 cursor-pointer",
            isCollapsed ? "justify-center px-0" : ""
          )}>
          <LogOut
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isCollapsed ? "" : "mr-3"
            )}
          />
          {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
        </Button>
      </div>
    </div>
  );
}
