interface DotsLoadingProps {
  size?: "xs" | "sm" | "md" | "lg";
  color?: string;
  text?: string;
}

export default function DotsLoading({
  size = "md",
  color = "#6b7280",
  text = "Đang tải...",
}: DotsLoadingProps) {
  const sizeClasses = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-3.5 h-3.5",
  };

  const containerClasses = {
    xs: "gap-0.5",
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <>
      <style>
        {`
          @keyframes dots-bounce {
            0%, 80%, 100% {
              transform: scale(0.6);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
          .dots-bounce {
            animation: dots-bounce 1.4s ease-in-out infinite both;
          }
        `}
      </style>
      <div className="flex items-center justify-center gap-3">
        <div className={`flex items-center ${containerClasses[size]}`}>
          <div
            className={`${sizeClasses[size]} rounded-full dots-bounce`}
            style={{
              backgroundColor: color,
              animationDelay: "0ms",
            }}
          />
          <div
            className={`${sizeClasses[size]} rounded-full dots-bounce`}
            style={{
              backgroundColor: color,
              animationDelay: "160ms",
            }}
          />
          <div
            className={`${sizeClasses[size]} rounded-full dots-bounce`}
            style={{
              backgroundColor: color,
              animationDelay: "320ms",
            }}
          />
        </div>
        {text && (
          <span
            className={`${textSizeClasses[size]} text-gray-500 font-medium`}
          >
            {text}
          </span>
        )}
      </div>
    </>
  );
}
