import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Outer frame with metallic effect */}
        <defs>
          <linearGradient
            id="frameGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#E5E7EB", stopOpacity: 1 }}
            />
            <stop
              offset="25%"
              style={{ stopColor: "#F3F4F6", stopOpacity: 1 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#D1D5DB", stopOpacity: 1 }}
            />
            <stop
              offset="75%"
              style={{ stopColor: "#9CA3AF", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#6B7280", stopOpacity: 1 }}
            />
          </linearGradient>

          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#FCD34D", stopOpacity: 1 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#F59E0B", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#D97706", stopOpacity: 1 }}
            />
          </linearGradient>

          <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              style={{ stopColor: "#1E3A8A", stopOpacity: 1 }}
            />
            <stop
              offset="70%"
              style={{ stopColor: "#1E1B4B", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#0F172A", stopOpacity: 1 }}
            />
          </radialGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer metallic frame */}
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="12"
          ry="12"
          fill="url(#frameGradient)"
          stroke="url(#goldGradient)"
          strokeWidth="1"
        />

        {/* Inner background */}
        <rect
          x="6"
          y="6"
          width="52"
          height="52"
          rx="8"
          ry="8"
          fill="url(#backgroundGradient)"
        />

        {/* Light rays effect */}
        <g opacity="0.3">
          <path d="M32 12 L36 16 L28 16 Z" fill="white" />
          <path d="M32 52 L36 48 L28 48 Z" fill="white" />
          <path d="M12 32 L16 28 L16 36 Z" fill="white" />
          <path d="M52 32 L48 28 L48 36 Z" fill="white" />
          <path d="M22 22 L26 26 L18 26 Z" fill="white" />
          <path d="M42 42 L46 38 L38 38 Z" fill="white" />
          <path d="M42 22 L46 26 L38 26 Z" fill="white" />
          <path d="M22 42 L26 38 L18 38 Z" fill="white" />
        </g>

        {/* Film strip */}
        <g transform="rotate(15 32 32)">
          <path
            d="M20 16 C20 16, 24 12, 32 16 C40 20, 44 24, 44 28 C44 32, 40 36, 32 40 C24 44, 20 48, 20 52"
            stroke="url(#goldGradient)"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />

          {/* Film holes */}
          <circle
            cx="24"
            cy="20"
            r="1.5"
            fill="url(#goldGradient)"
            opacity="0.6"
          />
          <circle
            cx="24"
            cy="24"
            r="1.5"
            fill="url(#goldGradient)"
            opacity="0.6"
          />
          <circle
            cx="24"
            cy="28"
            r="1.5"
            fill="url(#goldGradient)"
            opacity="0.6"
          />
          <circle
            cx="40"
            cy="32"
            r="1.5"
            fill="url(#goldGradient)"
            opacity="0.6"
          />
          <circle
            cx="40"
            cy="36"
            r="1.5"
            fill="url(#goldGradient)"
            opacity="0.6"
          />
          <circle
            cx="40"
            cy="40"
            r="1.5"
            fill="url(#goldGradient)"
            opacity="0.6"
          />
        </g>

        {/* Clapperboard */}
        <g transform="translate(32,32)">
          {/* Main board */}
          <rect
            x="-8"
            y="-4"
            width="16"
            height="12"
            rx="2"
            fill="#1E3A8A"
            stroke="url(#goldGradient)"
            strokeWidth="1"
          />

          {/* Top bar */}
          <rect x="-10" y="-8" width="20" height="4" rx="1" fill="black" />
          <rect x="-9" y="-7" width="18" height="2" fill="white" />

          {/* Number 25 */}
          <text
            x="0"
            y="2"
            textAnchor="middle"
            fill="url(#goldGradient)"
            fontFamily="Arial, sans-serif"
            fontSize="8"
            fontWeight="bold"
          >
            25
          </text>

          {/* FILM text */}
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fill="url(#goldGradient)"
            fontFamily="Arial, sans-serif"
            fontSize="3"
            fontWeight="bold"
          >
            FILM
          </text>
        </g>

        {/* Glowing effects */}
        <circle
          cx="32"
          cy="32"
          r="20"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1"
          opacity="0.2"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
};

export default Logo;
