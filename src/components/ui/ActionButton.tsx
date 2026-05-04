import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils"; // helper do shadcn

type Variant = "default" | "danger" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: Variant;
}

export default function ActionButton({
  children,
  icon,
  variant = "default",
  className,
  ...props
}: Props) {
  const variants = {
    default:
      "bg-[#2B2B2B] text-white hover:bg-[#313131] border border-[#3a3a3a]",
    
    danger:
      "text-white hover:bg-[#FF6055]/30 bg-[#FF6055]/50",
    
    ghost:
      "bg-transparent text-gray-300 hover:bg-[#2B2B2B]",
  };

  return (
    <button
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all",
        variants[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}