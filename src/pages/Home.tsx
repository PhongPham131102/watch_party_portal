import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  CloudUpload,
  Cpu,
  Database,
  HardDrive,
  ListChecks,
  Monitor,
  Server,
  SignalHigh,
  Users,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@/constants";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common/PageHeader";
import { useStatisticsStore } from "@/store/slices/statisticsSlice";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface OverviewStat {
  id: string;
  label: string;
  value: string;
  description: string;
  trend: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trendPositive?: boolean;
}

const statusStyles: Record<string, { label: string; className: string }> = {
  SUCCESS: {
    label: "Hoàn tất",
    className:
      "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:border-teal-500/20",
  },
  PROCESSING: {
    label: "Đang xử lý",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20 animate-pulse",
  },
  FAILED: {
    label: "Thất bại",
    className:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20",
  },
  PENDING: {
    label: "Chờ xử lý",
    className:
      "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-300 dark:border-gray-500/20",
  },
};

const formatBytes = (bytes: number, decimals = 1) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const UptimeDisplay = ({ seconds }: { seconds: number }) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return (
    <div className="flex items-center gap-2 bg-background/60 backdrop-blur-sm border rounded-full px-4 py-1.5 shadow-sm group hover:bg-background/80 transition-all cursor-default">
      <div className="flex items-center gap-2 pr-3 border-r border-border/50">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Online
        </span>
      </div>

      <div className="flex items-baseline gap-1.5 font-mono text-sm">
        {days > 0 && (
          <div className="flex items-baseline gap-0.5">
            <span className="font-bold text-foreground">{days}</span>
            <span className="text-[10px] text-muted-foreground font-medium">
              d
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-foreground">
            {hours.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            h
          </span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-foreground">
            {minutes.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">
            m
          </span>
        </div>
      </div>
    </div>
  );
};

const getProgressColorClass = (value: number) => {
  if (value >= 90) return "[&>div]:bg-rose-500";
  if (value >= 75) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-emerald-500";
};

const getProgressTextColorClass = (value: number) => {
  if (value >= 90) return "text-rose-600 dark:text-rose-400";
  if (value >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
};

function Home() {
  const { dashboard, loading, loadDashboardStats } = useStatisticsStore();
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardStats();
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      loadDashboardStats();
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [loadDashboardStats]);

  const lastUpdatedLabel = useMemo(() => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    }).format(lastUpdated);
  }, [lastUpdated]);

  const handleRefresh = async () => {
    await loadDashboardStats();
    setLastUpdated(new Date());
  };

  const overviewStats = useMemo((): OverviewStat[] => {
    if (!dashboard) return [];

    return [
      {
        id: "viewers",
        label: "Lượt xem hôm nay",
        value: dashboard.overview.views.current.toLocaleString("vi-VN"),
        description: "So với hôm qua",
        trend: `${dashboard.overview.views.isUp ? "+" : ""}${dashboard.overview.views.diff}%`,
        icon: Users,
        trendPositive: dashboard.overview.views.isUp,
      },
      {
        id: "active_rooms",
        label: "Phòng đang hoạt động",
        value: dashboard.realtime.activeRooms.current.toString(),
        description: `Trong tổng số ${dashboard.overview.rooms.total} phòng`,
        trend: "Thời gian thực",
        icon: SignalHigh,
        trendPositive: true,
      },
      {
        id: "storage",
        label: "Dung lượng lưu trữ",
        value: dashboard.serverStats?.storage?.[0]
          ? formatBytes(dashboard.serverStats.storage[0].used)
          : "N/A",
        description: `Trên tổng ${formatBytes(dashboard.serverStats?.storage?.[0]?.size || 0)}`,
        trend: `${dashboard.serverStats?.storage?.[0]?.usedPercent.toFixed(1)}%`,
        icon: HardDrive,
        trendPositive:
          (dashboard.serverStats?.storage?.[0]?.usedPercent || 0) < 80,
      },
      {
        id: "performance",
        label: "Hiệu năng hệ thống",
        value: `${dashboard.serverStats?.cpu?.loadPercent.toFixed(1)}%`,
        description: "CPU Load",
        trend: `RAM ${dashboard.serverStats?.memory?.usedPercent.toFixed(1)}%`,
        icon: Activity,
        trendPositive:
          (dashboard.serverStats?.cpu?.loadPercent || 0) < 80 &&
          (dashboard.serverStats?.memory?.usedPercent || 0) < 80,
      },
    ];
  }, [dashboard]);

  if (loading && !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">
          Đang tải dữ liệu hệ thống...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      <PageHeader
        title="Dashboard Vận Hành"
        description={`Cập nhật lần cuối: ${lastUpdatedLabel}`}
        onRefresh={handleRefresh}
        isLoading={loading}
        actions={
          <div className="flex items-center gap-3">
            {dashboard?.serverStats && (
              <UptimeDisplay seconds={dashboard.serverStats.os.uptime} />
            )}
          </div>
        }
      />

      {/* Overview Cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card
            key={stat.id}
            className="border shadow-sm hover:shadow-md transition-all duration-200 bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  stat.trendPositive
                    ? "bg-primary/10 text-primary"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="flex items-center text-xs">
                <span
                  className={`font-medium ${
                    stat.trendPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {stat.trend}
                </span>
                <span className="text-muted-foreground ml-2">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left Column: Server Monitor & Realtime */}
        <div className="xl:col-span-2 space-y-6">
          {/* Server Specifications */}
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="h-5 w-5 text-primary" />
                    Giám sát máy chủ
                  </CardTitle>
                  <CardDescription>
                    {dashboard?.serverStats?.os.distro}{" "}
                    {dashboard?.serverStats?.os.release} (
                    {dashboard?.serverStats?.os.platform})
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="font-mono">
                  {dashboard?.serverStats?.cpu.cores} Cores -{" "}
                  {dashboard?.serverStats?.cpu.brand}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              {/* CPU Widget */}
              <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">CPU Usage</span>
                  </div>
                  <span
                    className={`text-sm font-bold ${getProgressTextColorClass(dashboard?.serverStats?.cpu.loadPercent || 0)}`}
                  >
                    {dashboard?.serverStats?.cpu.loadPercent.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={dashboard?.serverStats?.cpu.loadPercent}
                  className={`h-2 ${getProgressColorClass(dashboard?.serverStats?.cpu.loadPercent || 0)}`}
                />
                <p className="text-xs text-muted-foreground w-full text-right">
                  Speed: {dashboard?.serverStats?.cpu.speed} GHz
                </p>
              </div>

              {/* RAM Widget */}
              <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-sm">Memory</span>
                  </div>
                  <span
                    className={`text-sm font-bold ${getProgressTextColorClass(dashboard?.serverStats?.memory.usedPercent || 0)}`}
                  >
                    {dashboard?.serverStats?.memory.usedPercent.toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={dashboard?.serverStats?.memory.usedPercent}
                  className={`h-2 ${getProgressColorClass(dashboard?.serverStats?.memory.usedPercent || 0)}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Used:{" "}
                    {formatBytes(dashboard?.serverStats?.memory.used || 0)}
                  </span>
                  <span>
                    Total:{" "}
                    {formatBytes(dashboard?.serverStats?.memory.total || 0)}
                  </span>
                </div>
              </div>

              {/* Storage Widget */}
              <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-sm">Storage</span>
                  </div>
                  <span
                    className={`text-sm font-bold ${getProgressTextColorClass(dashboard?.serverStats?.storage[0]?.usedPercent || 0)}`}
                  >
                    {dashboard?.serverStats?.storage[0]?.usedPercent.toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={dashboard?.serverStats?.storage[0]?.usedPercent || 0}
                  className={`h-2 ${getProgressColorClass(dashboard?.serverStats?.storage[0]?.usedPercent || 0)}`}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Used:{" "}
                    {formatBytes(dashboard?.serverStats?.storage[0]?.used || 0)}
                  </span>
                  <span>
                    Size:{" "}
                    {formatBytes(dashboard?.serverStats?.storage[0]?.size || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Uploads Table */}
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CloudUpload className="h-5 w-5 text-blue-500" />
                    Tiến độ Upload gần đây
                  </CardTitle>
                  <CardDescription>
                    Theo dõi trạng thái xử lý video từ người dùng
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(APP_ROUTES.EPISODES)}
                >
                  Xem tất cả
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">
                        Mã ID
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                        Phim / Tập
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">
                        Nguồn
                      </th>
                      <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground w-[150px]">
                        Thời gian
                      </th>
                      <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground w-[120px]">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard?.processing.recentUploads.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-4 text-center text-muted-foreground"
                        >
                          Chưa có dữ liệu upload gần đây
                        </td>
                      </tr>
                    ) : (
                      dashboard?.processing.recentUploads.map((upload) => (
                        <tr
                          key={upload.id}
                          className="border-b last:border-0 hover:bg-muted/40 transition-colors"
                        >
                          <td className="p-4 font-mono text-xs">{upload.id}</td>
                          <td className="p-4">
                            <div className="font-medium text-foreground">
                              {upload.movieTitle}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {upload.episodeTitle}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              variant="secondary"
                              className="font-normal text-xs"
                            >
                              {upload.source}
                            </Badge>
                          </td>
                          <td className="p-4 text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(upload.time), {
                              addSuffix: true,
                              locale: vi,
                            })}
                          </td>
                          <td className="p-4 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusStyles[upload.status]?.className || ""}`}
                            >
                              {statusStyles[upload.status]?.label ||
                                upload.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Processing Stats & Top Content */}
        <div className="space-y-6">
          {/* Pipeline Summary */}
          <Card className="shadow-sm border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-indigo-500" />
                Pipeline Hôm Nay
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Thành công</p>
                    <p className="text-xs text-muted-foreground">
                      Đã xử lý xong
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold">
                  {dashboard?.processing.stats.successJobsToday}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <Activity className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Đang xử lý</p>
                    <p className="text-xs text-muted-foreground">
                      Hàng đợi hiện tại
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold">
                  {dashboard?.processing.stats.pendingJobs}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Thất bại</p>
                    <p className="text-xs text-muted-foreground">
                      Cần kiểm tra
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold text-rose-600">
                  {dashboard?.processing.stats.failedJobs}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Top Content */}
          <Card className="shadow-sm border-border/60 flex flex-col h-auto">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                Top Nội Dung
              </CardTitle>
              <CardDescription>Phim được xem nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-5">
                {dashboard?.topContent.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Chưa có dữ liệu thống kê
                  </div>
                )}
                {dashboard?.topContent.map((movie, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div
                      className={`
                                flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm
                                ${
                                  index === 0
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                                    : index === 1
                                      ? "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400"
                                      : index === 2
                                        ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400"
                                        : "bg-muted text-muted-foreground"
                                }
                            `}
                    >
                      #{movie.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="truncate font-medium text-sm group-hover:text-primary transition-colors cursor-pointer"
                        title={movie.title}
                      >
                        {movie.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full bg-primary/60 rounded-full"
                            style={{
                              width: `${Math.min((movie.views / (dashboard?.topContent[0]?.views || 1)) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block font-bold text-sm">
                        {movie.views.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        Views
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                variant="ghost"
                className="w-full text-xs text-muted-foreground hover:text-foreground"
                onClick={() => navigate(APP_ROUTES.MOVIES)}
              >
                Xem tất cả phim <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
