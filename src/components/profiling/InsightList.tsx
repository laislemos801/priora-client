import InsightCard from "./InsightCard";
import type { ProfileInsight, ProfileType } from "./types";

type InsightListProps = {
  insights: ProfileInsight[];
  colors: Record<ProfileType, string>;
  className?: string;
};

export default function InsightList({
  insights,
  colors,
  className = "",
}: InsightListProps) {
  if (insights.length === 0) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-[#2A2A2A] p-5 text-center text-xs text-white/60 ${className}`}
      >
        Nenhuma análise encontrada para os filtros aplicados.
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#139C73] scrollbar-track-transparent ${className}`}
    >
      {insights.map((insight) => (
        <InsightCard
          key={insight.id}
          insight={insight}
          color={colors[insight.tipo]}
        />
      ))}
    </div>
  );
}
