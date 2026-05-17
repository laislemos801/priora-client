import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export default function TrendIcon({
  trend,
}: {
  trend: "Alta" | "Baixa" | "Estável";
}) {
  if (trend === "Alta") {
    return <ArrowUp size={18} className="text-[#139C73]" />;
  }

  if (trend === "Baixa") {
    return <ArrowDown size={18} className="text-[#FF6055]" />;
  }

  return <Minus size={18} className="text-white/40" />;
}