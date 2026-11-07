import type { SuspectAnalysis } from "./types";

type Props = { selected: SuspectAnalysis };

export default function NoEvidenceState({ selected }: Props) {
  return (
    <div className="rounded-xl border border-[#343434] bg-[#222222] p-8 text-center">
      <h3 className="text-white font-semibold mb-3">Nenhuma evidência vinculada</h3>
      <p className="text-gray-400 text-sm max-w-xl mx-auto">
        Este suspeito ainda não possui evidências vinculadas. Por isso o seu score P(E|H) é
        neutro (1,0) e o numerador é igual ao Prior. A probabilidade final, porém, é
        normalizada em relação aos demais suspeitos: ela só fica igual ao Prior quando nenhum
        suspeito do caso tem evidências. Se outros suspeitos recebem evidências, a probabilidade
        deste diminui.
      </p>
      <div className="mt-6 flex flex-wrap items-stretch justify-center gap-4">
        <div className="inline-flex flex-col rounded-lg border border-[#333] bg-[#2A2A2A] px-6 py-4">
          <span className="text-xs text-gray-400">Prior P(H)</span>
          <span className="text-3xl font-bold text-white">
            {(selected.bayes.prior * 100).toFixed(2)}%
          </span>
          <span className="text-xs text-gray-500 mt-1">1 / nº de suspeitos</span>
        </div>
        <div className="inline-flex flex-col rounded-lg border border-[#333] bg-[#2A2A2A] px-6 py-4">
          <span className="text-xs text-gray-400">Probabilidade Atual P(H|E)</span>
          <span className="text-3xl font-bold text-[#139C73]">
            {(selected.bayes.posterior * 100).toFixed(2)}%
          </span>
          <span className="text-xs text-gray-500 mt-1">Após normalizar com os demais suspeitos</span>
        </div>
      </div>
    </div>
  );
}