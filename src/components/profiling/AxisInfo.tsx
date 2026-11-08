import InfoTip from "@/components/ui/InfoTip";
import type { ProfileAxis } from "./types";

/** Ícone "i" com o que a dimensão significa e o que valores perto de 0 e de 100 indicam. */
export default function AxisInfo({ axis, className = "", size }: { axis: ProfileAxis; className?: string; size?: number }) {
  return (
    <InfoTip label={axis.label} className={className} size={size}>
      <p className="mb-1 font-semibold text-white">{axis.label}</p>
      {axis.info}
      <dl className="mt-2 space-y-1.5 border-t border-[#3a3a3a] pt-2">
        <div>
          <dt className="font-semibold text-white">Perto de 0</dt>
          <dd>{axis.low}</dd>
        </div>
        <div>
          <dt className="font-semibold text-white">Perto de 100</dt>
          <dd>{axis.high}</dd>
        </div>
      </dl>
    </InfoTip>
  );
}
