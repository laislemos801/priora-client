import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils"; // helper do shadcn
import Spinner from "@/components/ui/Spinner";
import { usePendingClick } from "@/hooks/usePendingClick";

type Variant = "default" | "danger" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: Variant;
  loading?: boolean;
}

export default function ActionButton({
  children,
  icon,
  variant = "default",
  className,
  loading = false,
  onClick,
  disabled,
  ...props
}: Props) {
  const { pending, handleClick } = usePendingClick(onClick);
  const busy = loading || pending;

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
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      onClick={handleClick}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      {...props}
    >
      {busy ? <Spinner className="size-3.5" /> : icon}
      {children}
    </button>
  );
}
