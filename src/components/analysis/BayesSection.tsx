type Bayes = {
  prior: number;
  pEH: number;
  numerator: number;
};

type Props = { bayes: Bayes };

export default function BayesSection({ bayes }: Props) {
  return (
    <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">
      <h3 className="text-white font-semibold mb-4">3. Aplicação do Teorema de Bayes</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Prior P(H)", value: bayes.prior.toFixed(6), colored: false },
          { label: "P(E|H)", value: bayes.pEH.toFixed(6), colored: false },
          { label: "Numerador", value: bayes.numerator.toFixed(6), colored: true },
        ].map(({ label, value, colored }) => (
          <div key={label} className="rounded-lg bg-[#2A2A2A] p-4 text-center">
            <div className="text-xs text-gray-400 mb-2">{label}</div>
            <div className={`font-semibold ${colored ? "text-[#139C73]" : "text-white"}`}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-[#333] bg-[#2A2A2A] p-4">
        <div className="text-xs text-gray-400 mb-2">Cálculo do Numerador</div>
        <div className="text-white">
          {bayes.prior.toFixed(6)} × {bayes.pEH.toFixed(6)}
        </div>
        <div className="mt-2 text-[#139C73] font-semibold">= {bayes.numerator.toFixed(6)}</div>
      </div>
    </div>
  );
}