type Bayes = {
  numerator: number;
  denominator: number;
  posterior: number;
};

type Props = { bayes: Bayes };

export default function FinalProbabilitySection({ bayes }: Props) {
  return (
    <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">
      <h3 className="text-white font-semibold mb-4">4. Probabilidade Final</h3>

      <div className="max-w-md mx-auto">
        <div className="rounded-lg border border-[#333] bg-[#2A2A2A] p-5">
          <div className="text-center text-sm text-gray-400 mb-4">P(H|E)</div>
          <div className="text-center">
            <div className="border-b border-white pb-2 text-white font-medium">
              {bayes.numerator.toFixed(6)}
            </div>
            <div className="pt-2 text-white font-medium">
              {bayes.denominator.toFixed(6)}
            </div>
          </div>
          <div className="mt-5 text-center text-[#139C73] font-semibold text-xl">
            = {bayes.posterior.toFixed(6)}
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-gray-400 mb-2">Probabilidade Posterior</div>
          <div className="text-2xl font-bold text-[#139C73]">
            {(bayes.posterior * 100).toFixed(2)}%
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-400 max-w-md mx-auto">
          O denominador é a soma das pontuações de todos os suspeitos.
          Ele normaliza o resultado para que as probabilidades finais somem 100% no conjunto.
        </div>
      </div>
    </div>
  );
}