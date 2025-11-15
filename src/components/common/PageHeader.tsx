import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  description: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  onRefresh,
  isLoading = false,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Title & Description */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              size="default"
              className="gap-2"
              disabled={isLoading}>
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Làm mới</span>
            </Button>
          )}

          {actions}
        </div>
      </div>
    </div>
  );
}
