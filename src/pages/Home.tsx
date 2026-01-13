import { useId, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  CloudUpload,
  HardDriveDownload,
  ListChecks,
  Server,
  SignalHigh,
  Users,
  Video,
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
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common/PageHeader";

interface OverviewStat {
  id: string;
  label: string;
  value: string;
  description: string;
  trend: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  trendPositive?: boolean;
}

interface RecentUpload {
  id: string;
  movie: string;
  episode: string;
  size: string;
  uploadedAt: string;
  status: "processing" | "success" | "failed";
  source: "MinIO" | "S3";
}

interface WatchPartySummary {
  activeRooms: number;
  peakViewers: number;
  watchTime: string;
  retention: string;
  trend: number[];
}

const overviewStats: OverviewStat[] = [
  {
    id: "viewers",
    label: "Lượt xem hôm nay",
    value: "284.9K",
    description: "So với cùng khung giờ hôm qua",
    trend: "+14.2%",
    icon: Users,
    trendPositive: true,
  },
  {
    id: "rooms",
    label: "Phòng watch party đang mở",
    value: "38",
    description: "Bao gồm công khai & riêng tư",
    trend: "+6 phòng",
    icon: Activity,
    trendPositive: true,
  },
  {
    id: "movies",
    label: "Phim phát hành tuần này",
    value: "12",
    description: "4 phim gốc, 8 phim bản quyền",
    trend: "+3 phim",
    icon: Video,
    trendPositive: true,
  },
  {
    id: "storage",
    label: "Dung lượng đã dùng",
    value: "72%",
    description: "Đã dùng 54.3 TB / 75 TB",
    trend: "-2.1% so với tuần trước",
    icon: HardDriveDownload,
    trendPositive: true,
  },
];

const watchPartySummary: WatchPartySummary = {
  activeRooms: 38,
  peakViewers: 1243,
  watchTime: "54 phút",
  retention: "68%",
  trend: [42, 56, 51, 74, 68, 80, 76, 92, 88, 95, 90, 97],
};

const recentUploads: RecentUpload[] = [
  {
    id: "UPL-2145",
    movie: "Trạm không gian số 9",
    episode: "Tập 03 - Chu kỳ Delta",
    size: "6.2 GB",
    uploadedAt: "09:24 hôm nay",
    status: "processing",
    source: "S3",
  },
  {
    id: "UPL-2144",
    movie: "Chân mây rực cháy",
    episode: "Tập 06 - Đường chân trời",
    size: "4.9 GB",
    uploadedAt: "07:58 hôm nay",
    status: "success",
    source: "MinIO",
  },
  {
    id: "UPL-2143",
    movie: "Lữ khách thời gian",
    episode: "Tập 10 - Reset",
    size: "5.4 GB",
    uploadedAt: "Đêm qua",
    status: "failed",
    source: "S3",
  },
  {
    id: "UPL-2142",
    movie: "Phố đêm 13°",
    episode: "Tập 01 - Ngày luân phiên",
    size: "7.1 GB",
    uploadedAt: "Đêm qua",
    status: "success",
    source: "MinIO",
  },
];

const systemHealth = [
  {
    label: "Tỷ lệ hoàn tất transcoding",
    value: 82,
    target: "Mục tiêu 90%",
  },
  {
    label: "Job xử lý phụ đề hoàn thành",
    value: 67,
    target: "116 / 172 job hôm nay",
  },
  {
    label: "Thông báo gửi đến người dùng",
    value: 94,
    target: "Đã gửi 18.4K / 19.6K",
  },
];

const topMovies = [
  {
    title: "Trạm không gian số 9",
    viewers: "48.5K",
    growth: "+18% so với hôm qua",
    sessions: 321,
  },
  {
    title: "Lữ khách thời gian",
    viewers: "35.1K",
    growth: "+6%",
    sessions: 214,
  },
  {
    title: "Phố đêm 13°",
    viewers: "29.8K",
    growth: "+12%",
    sessions: 187,
  },
  {
    title: "Chân mây rực cháy",
    viewers: "26.4K",
    growth: "-4%",
    sessions: 166,
  },
];

const ingestionQueue = [
  {
    title: "Batch upload MinIO",
    description: "8 job đang xử lý",
    progress: 64,
    status: "Đang xử lý",
  },
  {
    title: "FFmpeg worker - Cluster A",
    description: "Đợi thêm 2 GPU",
    progress: 35,
    status: "Tạm dừng",
  },
  {
    title: "Tự động backfill phụ đề",
    description: "24 job thành công",
    progress: 92,
    status: "Gần hoàn tất",
  },
];

const pendingTasks = [
  {
    label: "Duyệt yêu cầu phát hành phim mới",
    owner: "Team Nội dung",
    time: "Hạn: 14:00 hôm nay",
  },
  {
    label: "Xử lý tập thất bại trong hàng đợi",
    owner: "Team Encoding",
    time: "Hạn: 16:30 hôm nay",
  },
  {
    label: "Kiểm tra sự cố WebSocket phòng #8391",
    owner: "DevOps",
    time: "Hạn: 18:00 hôm nay",
  },
];

const statusStyles: Record<
  RecentUpload["status"],
  { label: string; className: string }
> = {
  success: {
    label: "Hoàn tất",
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300",
  },
  processing: {
    label: "Đang xử lý",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300",
  },
  failed: {
    label: "Thất bại",
    className:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-300",
  },
};

function Home() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  const lastUpdatedLabel = useMemo(() => {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    }).format(lastUpdated);
  }, [lastUpdated]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const timeout = setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 900);

    return () => clearTimeout(timeout);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50/40 dark:bg-gray-950 min-h-screen">
      <PageHeader
        title="Bảng điều khiển vận hành"
        description={`Lần cập nhật cuối: ${lastUpdatedLabel}`}
        onRefresh={handleRefresh}
        isLoading={isRefreshing}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <CalendarClock className="h-4 w-4" />
              Bộ lọc thời gian
            </Button>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <ArrowUpRight className="h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        }
      />

      {/* KPI */}

      {/* <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card
            key={stat.id}
            className="border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900">
            <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </CardTitle>
              </div>
              <div className="h-11 w-11 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col gap-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.description}
              </div>
              <div
                className={`text-sm font-semibold ${
                  stat.trendPositive ? "text-green-600" : "text-rose-600"
                }`}>
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Tổng quan watch party</CardTitle>
            <CardDescription>
              Theo dõi thời gian thực số phòng, lượt xem và độ gắn bó
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Phòng đang hoạt động
                  </p>
                  <p className="text-3xl font-semibold text-gray-900 dark:text-white">
                    {watchPartySummary.activeRooms}
                  </p>
                </div>
                <Badge variant="outline" className="text-blue-600">
                  Đạt 82% kế hoạch ngày
                </Badge>
              </div>
              <div className="mt-6">
                <Sparkline values={watchPartySummary.trend} />
                <div className="mt-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>2 giờ trước</span>
                  <span>Hiện tại</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Peak viewers</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {watchPartySummary.peakViewers.toLocaleString("vi-VN")}
                  </p>
                </div>
                <Badge className="gap-1 bg-green-500/10 text-green-700 dark:text-green-300">
                  <SignalHigh className="h-3.5 w-3.5" />
                  +9.3%
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase">
                    Thời lượng xem trung bình
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {watchPartySummary.watchTime}
                  </p>
                </div>
                <p className="text-sm text-gray-500">+6 phút</p>
              </div>

              <div>
                <div className="flex items-center justify-between pb-1">
                  <p className="text-xs text-gray-500 uppercase">
                    Tỷ lệ giữ chân
                  </p>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {watchPartySummary.retention}
                  </span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-green-500" />
              92% người xem đánh giá kết nối ổn định
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-blue-500" />
              3 cụm máy đang hoạt động tối đa
            </div>
          </CardFooter>
        </Card>

        <Card className="border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-xl">Hàng đợi xử lý</CardTitle>
            <CardDescription>
              Ưu tiên dọn dẹp các batch upload & job bị pending
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {ingestionQueue.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <Badge variant="outline">{item.status}</Badge>
                </div>
                <Progress value={item.progress} />
              </div>
            ))}
          </CardContent>
          <CardFooter className="text-sm text-gray-500 dark:text-gray-400">
            Trung bình mỗi job hoàn tất sau 7 phút kể từ khi vào hàng đợi.
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-xl">Upload gần đây</CardTitle>
            <CardDescription>
              Theo dõi trạng thái các tập phim vừa đưa lên hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 uppercase text-xs tracking-wide">
                  <th className="py-2">Mã</th>
                  <th className="py-2">Tập phim</th>
                  <th className="py-2">Nguồn</th>
                  <th className="py-2">Dung lượng</th>
                  <th className="py-2">Thời gian</th>
                  <th className="py-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentUploads.map((upload) => (
                  <tr key={upload.id}>
                    <td className="py-3 font-medium text-gray-900 dark:text-white">
                      {upload.id}
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {upload.movie}
                      </p>
                      <p className="text-xs text-gray-500">{upload.episode}</p>
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">
                        {upload.source}
                      </Badge>
                    </td>
                    <td className="py-3">{upload.size}</td>
                    <td className="py-3 text-gray-500">{upload.uploadedAt}</td>
                    <td className="py-3">
                      <Badge
                        variant="outline"
                        className={statusStyles[upload.status].className}>
                        {statusStyles[upload.status].label}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
          <CardFooter className="text-sm text-blue-600 flex items-center gap-2 cursor-pointer">
            <ArrowUpRight className="h-4 w-4" />
            Xem toàn bộ lịch sử upload
          </CardFooter>
        </Card>

        <Card className="border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-xl">Sức khỏe hệ thống</CardTitle>
            <CardDescription>
              Nắm nhanh tiến độ xử lý và chỉ số quan trọng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {systemHealth.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-500">{item.label}</p>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {item.value}%
                  </span>
                </div>
                <Progress value={item.value} />
                <p className="text-xs text-gray-500">{item.target}</p>
              </div>
            ))}
          </CardContent>
          <CardFooter className="text-sm text-gray-500 flex items-center gap-2">
            <CloudUpload className="h-4 w-4 text-blue-500" />
            Đề xuất tăng thêm 2 worker để đạt mục tiêu 90%.
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Top phim nổi bật</CardTitle>
              <CardDescription>Thứ hạng dựa trên lượt xem 24h</CardDescription>
            </div>
            <Badge variant="outline" className="gap-2">
              <Users className="h-3.5 w-3.5" />
              129.4K lượt xem
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {topMovies.map((movie, index) => (
              <div
                key={movie.title}
                className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 p-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center font-semibold text-blue-600">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {movie.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {movie.sessions} phiên watch party
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {movie.viewers}
                  </p>
                  <p
                    className={`text-sm ${
                      movie.growth.includes("-")
                        ? "text-rose-500"
                        : "text-green-600"
                    }`}>
                    {movie.growth}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-xl">Đầu việc cần ưu tiên</CardTitle>
            <CardDescription>
              Những việc nên hoàn tất trước khi kết thúc ngày
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.map((task) => (
              <div
                key={task.label}
                className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 p-4 space-y-2">
                <p className="font-medium text-gray-900 dark:text-white">
                  {task.label}
                </p>
                <p className="text-sm text-gray-500">{task.owner}</p>
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <ListChecks className="h-3.5 w-3.5" />
                  {task.time}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="text-sm text-gray-500 flex items-center gap-2">
            <SignalHigh className="h-4 w-4 text-blue-500" />
            Bạn có thể chuyển thành ticket nếu cần theo dõi sát hơn.
          </CardFooter>
        </Card>
      </div>    */}
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const gradientId = useId();

  if (!values.length) {
    return null;
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full h-24"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="#2563eb"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <polygon
        points={`${points} 100,100 0,100`}
        fill={`url(#${gradientId})`}
        opacity="0.4"
      />
    </svg>
  );
}

export default Home;
