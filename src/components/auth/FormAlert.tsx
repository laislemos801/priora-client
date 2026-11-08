import type { ReactNode } from "react";
import { FiAlertTriangle, FiCheckCircle, FiInfo } from "react-icons/fi";

type Variant = "error" | "success" | "info";

const STYLES: Record<Variant, string> = {
  error: "border-red-500/40 bg-red-500/10 text-red-200",
  success: "border-[#139C73]/50 bg-[#139C73]/12 text-emerald-100",
  info: "border-[#434343] bg-[#2B2B2B] text-white/80",
};

const ICONS: Record<Variant, ReactNode> = {
  error: <FiAlertTriangle size={16} className="text-red-400" />,
  success: <FiCheckCircle size={16} className="text-emerald-400" />,
  info: <FiInfo size={16} className="text-white/60" />,
};

/** Aviso em bloco no topo do formulário (erro do servidor, sucesso, informação). */
export default function FormAlert({
  variant = "error",
  children,
}: {
  variant?: Variant;
  children: ReactNode;
}) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm ${STYLES[variant]}`}
    >
      <span className="mt-0.5 shrink-0">{ICONS[variant]}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
