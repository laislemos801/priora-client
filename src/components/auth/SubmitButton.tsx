import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "@/components/ui/Spinner";
import { usePendingClick } from "@/hooks/usePendingClick";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  /** Texto exibido durante o carregamento */
  loadingText?: string;
  children: ReactNode;
  fullWidth?: boolean;
  /** primary = gradiente verde; secondary = contorno neutro */
  variant?: "primary" | "secondary";
};

const VARIANTS = {
  primary:
    "text-white bg-linear-to-r from-[#139C73] to-[#136D52] shadow-[0_6px_20px_-8px_rgba(19,156,115,0.6)] hover:brightness-110 active:brightness-95 disabled:hover:brightness-100",
  secondary:
    "text-white/85 border border-[#434343] bg-transparent hover:border-[#606060] hover:bg-[#2B2B2B] disabled:hover:bg-transparent disabled:hover:border-[#434343]",
};

export { Spinner };

/** Botão principal (gradiente verde do app) com estado de carregamento. */
export default function SubmitButton({
  loading = false,
  loadingText,
  children,
  fullWidth = true,
  disabled,
  type = "submit",
  variant = "primary",
  className = "",
  onClick,
  ...rest
}: Props) {
  // botão type="button" com onClick assíncrono também mostra o carregamento sozinho
  const { pending, handleClick } = usePendingClick(onClick);
  loading = loading || pending;

  return (
    <button
      type={type}
      onClick={onClick ? handleClick : undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-6 text-sm font-semibold transition",
        VARIANTS[variant],
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#18C18A]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading && <Spinner />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
