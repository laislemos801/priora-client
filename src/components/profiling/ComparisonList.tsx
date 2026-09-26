import ComparisonCard from "./ComparisonCard";
import type { ProfileAxis, ProfileType, ProfileValues } from "./types";

type ComparisonListProps = {
  axes: ProfileAxis[];
  estimado: ProfileValues | null;
  suspeito: ProfileValues;
  tipos: ProfileType[];
  colors: Record<ProfileType, string>;
  className?: string;
};

export default function ComparisonList({
  axes,
  estimado,
  suspeito,
  tipos,
  colors,
  className = "",
}: ComparisonListProps) {
  if (axes.length === 0) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#2A2A2A] p-5 text-center text-xs text-white/60 ${className}`}
      >
        Nenhuma variável encontrada para os filtros aplicados.
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#139C73] scrollbar-track-transparent ${className}`}
    >
      {axes.map((axis) => (
        <ComparisonCard
          key={axis.key}
          titulo={axis.label}
          estimado={estimado ? estimado[axis.key] : null}
          suspeito={suspeito[axis.key]}
          tipos={tipos}
          colors={colors}
        />
      ))}
    </div>
  );
}
