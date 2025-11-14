import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX, Home, ArrowLeft } from "lucide-react";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-20"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-full p-6 shadow-xl">
              <ShieldX className="w-16 h-16 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white">403</h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Truy cập bị từ chối
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Bạn không có quyền truy cập vào trang này.
            Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
