import React from "react";

interface NexorLogoProps {
  variant?: "icon" | "full";
  className?: string;
}

export const NexorLogo = ({ variant = "icon", className = "" }: NexorLogoProps) => {
  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Stylized N ribbons */}
        <path
          d="M25 25V75L45 50L25 25Z"
          fill="url(#blue_grad_1)"
        />
        <path
          d="M25 25L65 75V25L45 50L25 25Z"
          fill="url(#blue_grad_2)"
        />
        <path
          d="M65 25V75H80V25H65Z"
          fill="url(#green_grad_1)"
        />
        <path
          d="M65 75L80 50V75H65Z"
          fill="url(#green_grad_2)"
        />
        
        {/* Swoosh */}
        <path
          d="M20 85C35 70 55 50 85 20"
          stroke="url(#star_swoosh_grad)"
          strokeWidth="4"
          strokeLinecap="round"
          className="opacity-80"
        />
        
        {/* Star */}
        <path
          d="M85 20L84 14L88 17L92 14L91 20L92 26L88 23L84 26L85 20Z"
          fill="#FACC15"
          className="drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]"
        />
        
        <defs>
          <linearGradient id="blue_grad_1" x1="25" y1="25" x2="45" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="blue_grad_2" x1="25" y1="25" x2="65" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#1E40AF" />
          </linearGradient>
          <linearGradient id="green_grad_1" x1="65" y1="25" x2="80" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10B981" />
            <stop offset="1" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="green_grad_2" x1="65" y1="75" x2="80" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#059669" />
            <stop offset="1" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="star_swoosh_grad" x1="20" y1="85" x2="85" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FACC15" stopOpacity="0.1" />
            <stop offset="0.5" stopColor="#FACC15" />
            <stop offset="1" stopColor="#FEF3C7" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
        <NexorLogo variant="icon" className="w-24 h-24 mb-4" />
        <div className="flex items-center gap-2">
            <span className="text-4xl font-black tracking-tighter text-white">NEX</span>
            <div className="w-10 h-10 rounded-full border-[6px] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-transparent"></div>
            <span className="text-4xl font-black tracking-tighter text-white">R</span>
            <div className="ml-3 px-2 py-0.5 border border-indigo-400 rounded-md bg-indigo-500/10 flex items-center justify-center">
                <span className="text-[10px] font-black text-indigo-400">AI</span>
            </div>
        </div>
        <div className="mt-4 flex items-center gap-3 w-full opacity-60">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
            <p className="text-[9px] font-black tracking-[0.4em] uppercase text-slate-400">
                Career Guidance
            </p>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
        </div>
    </div>
  );
};
