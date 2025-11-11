/* eslint-disable @next/next/no-img-element */

import { LoginForm } from "@/components/login/loginFom";
import Logo from "@/components/ui/Logo";

export default function Login() {
  // Hàm tạo màu sắc ngẫu nhiên với độ trong suốt
  const getRandomColor = (opacity: number = 0.2) => {
    const colors = [
      `rgba(59, 130, 246, ${opacity})`, // blue
      `rgba(14, 165, 233, ${opacity})`, // sky
      `rgba(79, 70, 229, ${opacity})`, // indigo
      `rgba(168, 85, 247, ${opacity})`, // purple
      `rgba(236, 72, 153, ${opacity})`, // pink
      `rgba(6, 182, 212, ${opacity})`, // cyan
      `rgba(16, 185, 129, ${opacity})`, // emerald
      `rgba(132, 204, 22, ${opacity})`, // lime
      `rgba(245, 158, 11, ${opacity})`, // amber
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Tạo gradient ngẫu nhiên
  const getRandomGradient = () => {
    const color1 = getRandomColor(0.2);
    const color2 = getRandomColor(0.2);
    return `linear-gradient(${Math.random() * 360}deg, ${color1}, ${color2})`;
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 relative">
        {/* Background gradient with animated glow */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-sky-500/5 -z-10 animate-glow" />
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="particles-container">
            {/* Particles with different shapes, colors and animations */}
            {[...Array(20)].map((_, i) => (
              <div
                key={`circle-${i}`}
                className="absolute rounded-full animate-float animate-particle"
                style={{
                  width: `${Math.random() * 30 + 10}px`,
                  height: `${Math.random() * 30 + 10}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: getRandomGradient(),
                  animationDuration: `${Math.random() * 8 + 4}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5 + 0.2,
                  filter: `blur(${Math.random() * 2}px)`,
                }}
              />
            ))}
            {[...Array(15)].map((_, i) => (
              <div
                key={`square-${i}`}
                className="absolute rounded-md animate-float-horizontal"
                style={{
                  width: `${Math.random() * 25 + 8}px`,
                  height: `${Math.random() * 25 + 8}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: getRandomGradient(),
                  transform: `rotate(${Math.random() * 45}deg)`,
                  animationDuration: `${Math.random() * 10 + 6}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.4 + 0.1,
                }}
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <div
                key={`triangle-${i}`}
                className="absolute animate-float-diagonal"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `${Math.random() * 15 + 10}px solid transparent`,
                  borderRight: `${Math.random() * 15 + 10}px solid transparent`,
                  borderBottom: `${
                    Math.random() * 20 + 15
                  }px solid ${getRandomColor(0.15)}`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 12 + 5}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.3 + 0.1,
                }}
              />
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center gap-3 md:justify-start">
          <a href="#" className="flex items-center gap-3 font-medium group">
            <Logo size="md" />
            <span className="text-lg font-semibold bg-linear-to-r from-primary to-sky-500 bg-clip-text text-transparent relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-linear-to-r after:from-primary after:to-sky-500 group-hover:after:w-full after:transition-all after:duration-300">
              Hệ thống quản trị
            </span>
          </a>
        </div>

        {/* Login form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm bg-white/50 dark:bg-black/20 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 dark:border-white/5 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side image */}
      <div className="bg-muted relative hidden lg:block overflow-hidden rounded-l-3xl shadow-2xl">
        <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-sky-500/30 mix-blend-overlay z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
          alt="Anime style background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.7] dark:contrast-[1.2] scale-105 transition-transform duration-10000 animate-slow-zoom"
        />
      </div>
    </div>
  );
}
