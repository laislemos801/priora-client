import AxisInfo from "./AxisInfo";
import { PROFILE_TYPE_LABEL } from "./types";
import type { ProfileAxis, ProfileType } from "./types";

type ComparisonCardProps = {
  axis: ProfileAxis;
  estimado: number | null;
  suspeito: number;
  tipos: ProfileType[];
  colors: Record<ProfileType, string>;
};

function ValueRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="flex items-center gap-2 text-white/65">
        <span
          aria-hidden="true"
          className="h-2 w-2 flex-shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        {label}
      </span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

// Só exibe os valores lado a lado: nenhuma regra além da diferença absoluta.
export default function ComparisonCard({
  axis,
  estimado,
  suspeito,
  tipos,
  colors,
}: ComparisonCardProps) {
  const showEstimado = tipos.includes("estimado");
  const showSuspeito = tipos.includes("suspeito");
  const estimadoRounded = estimado == null ? null : Math.round(estimado);
  const suspeitoRounded = Math.round(suspeito);
  const diferenca =
    showEstimado && showSuspeito && estimadoRounded != null
      ? Math.abs(estimadoRounded - suspeitoRounded)
      : null;

  return (
    <article className="rounded-xl bg-[#2A2A2A] p-5">
      <h3 className="flex items-start justify-between gap-2 text-xl font-medium leading-snug text-white">
        <span>{axis.label}</span>
        <AxisInfo axis={axis} className="mt-1.5" />
      </h3>

      <div className="mt-3 flex flex-col gap-2">
        {showEstimado && (
          <ValueRow
            label={PROFILE_TYPE_LABEL.estimado}
            value={estimadoRounded == null ? "Não definido" : String(estimadoRounded)}
            color={colors.estimado}
          />
        )}
        {showSuspeito && (
          <ValueRow
            label={PROFILE_TYPE_LABEL.suspeito}
            value={String(suspeitoRounded)}
            color={colors.suspeito}
          />
        )}
      </div>

      {diferenca != null && (
        <p className="mt-3 border-t border-[#3a3a3a] pt-3 text-xs text-white/65">
          Diferença:{" "}
          <span className="font-semibold text-white">{diferenca} pts</span>
        </p>
      )}
    </article>
  );
}
