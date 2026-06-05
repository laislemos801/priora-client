import type { SuspectAnalysis } from "./types";

type Props = { selected: SuspectAnalysis };

export default function NoEvidenceState({ selected }: Props) {
  return (
    <div className="rounded-xl border border-[#343434] bg-[#222222] p-8 text-center">
      <h3 className="text-white font-semibold mb-3">Nenhuma evidência vinculada</h3>
      <p className="text-gray-400 text-sm max-w-xl mx-auto">
        Este suspeito ainda não possui evidências associadas. Portanto, o modelo
        bayesiano utiliza apenas a probabilidade inicial (Prior), sem qualquer
        atualização baseada em evidências.
      </p>
      <div className="mt-6 inline-flex flex-col rounded-lg border border-[#333] bg-[#2A2A2A] px-6 py-4">
        <span className="text-xs text-gray-400">Probabilidade Atual</span>
        <span className="text-3xl font-bold text-[#139C73]">
          {(selected.bayes.posterior * 100).toFixed(2)}%
        </span>
        <span className="text-xs text-gray-500 mt-1">Igual ao Prior P(H)</span>
      </div>
    </div>
  );
}