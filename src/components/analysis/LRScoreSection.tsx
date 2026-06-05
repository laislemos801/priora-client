import type { Evidence } from "./types";

type Props = {
  evidencias: Evidence[];
  pEH: number;
};

export default function LRScoreSection({ evidencias, pEH }: Props) {
  return (
    <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">
      <h3 className="text-white font-semibold mb-4">2. Construção do Score LR (P(E|H))</h3>
      <div className="text-gray-400 text-sm text-center mb-4">
        Multiplicação das contribuições de todas as evidências
      </div>

      <div className="text-center">
        <div className="text-[#139C73] font-semibold break-all text-lg">
          {evidencias.length > 0
            ? evidencias
                .map((ev) => {
                  const competitors = ev.suspectIds?.length || 1;
                  return (1 + ev.pesoFinal * (1 / competitors)).toFixed(2);
                })
                .join(" × ")
            : "1.00"}
        </div>

        <div className="mt-4 text-gray-400">↓</div>

        <div className="mt-4">
          <div className="text-sm text-gray-400">P(E|H)</div>
          <div className="text-xl font-bold text-[#139C73] mt-2">{pEH.toFixed(6)}</div>
        </div>
      </div>
    </div>
  );
}