type InfoRowProps = {
  label: string;
  value: string;
  highlight?: boolean;
  warning?: boolean;
  strong?: boolean;
};

export default function InfoRow({
  label,
  value,
  highlight,
  warning,
  strong,
}: InfoRowProps) {

  function getValueColor() {
    // PRIORIDADE
    if (value === "Baixa") return "text-[#139C73]";
    if (value === "Média") return "text-[#FFE38D]";
    if (value === "Alta") return "text-[#FFC067]";
    if (value === "Crítica") return "text-[#FF6055]";

    // STATUS
    if (value === "Ativo") return "text-[#139C73]";
    if (value === "Concluído") return "text-[#FFE38D]";
    if (value === "Arquivado") return "text-[#FFC067]";

    // FALLBACKS
    if (highlight) return "font-medium text-emerald-400";
    if (warning) return "font-medium text-yellow-300";
    if (strong) return "font-semibold text-slate-100";

    return "text-slate-100";
  }

  return (
    <p>
      <span className="text-white/65">
        {label}{" "}
      </span>

      <span className={getValueColor()}>
        {value}
      </span>
    </p>
  );
}