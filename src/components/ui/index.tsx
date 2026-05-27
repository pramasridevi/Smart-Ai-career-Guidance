import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

export const Button = ({ 
  children, 
  className, 
  variant = "primary", 
  size = "md",
  ...props 
}: { 
  children: ReactNode; 
  className?: string; 
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) => {
  const variants = {
    primary: "bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-white/5",
    secondary: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30",
    outline: "bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10",
    ghost: "bg-transparent text-slate-400 hover:text-white"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider",
    md: "px-4 py-2 text-sm font-semibold",
    lg: "px-8 py-4 text-base font-bold"
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("glass-panel rounded-2xl p-6 shadow-xl", className)}>
    {children}
  </div>
);

export const Input = ({ className, ...props }: any) => (
  <input
    className={cn(
      "w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all",
      className
    )}
    {...props}
  />
);

export const Textarea = ({ className, ...props }: any) => (
  <textarea
    className={cn(
      "w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all min-h-[100px]",
      className
    )}
    {...props}
  />
);
