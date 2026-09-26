import { PROFILE_TYPE_LABEL } from "./types";
import type { ProfileInsight } from "./types";

type InsightCardProps = {
  insight: ProfileInsight;
  color: string;
};

export default function InsightCard({ insight, color }: InsightCardProps) {
  return (
    <article className="rounded-xl bg-[#2A2A2A] p-5">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-2 w-2 flex-shrink-0 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs text-white/65">
          {PROFILE_TYPE_LABEL[insight.tipo]}
        </span>
      </div>

      <h3 className="mt-2 text-xl font-medium text-white">{insight.titulo}</h3>

      <p className="mt-2 text-justify text-xs leading-relaxed text-white/70">
        {insight.texto}
      </p>
    </article>
  );
}
