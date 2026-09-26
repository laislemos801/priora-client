import { HelpCircle } from "lucide-react";
import { useState } from "react";

type Props = {
  incerteza: number | null;
};

export default function UncertaintyCard({ incerteza }: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  const value = incerteza ?? 0;

  // 0% = -90°
  // 50% = 0°
  // 100% = 90°
  const angle = (value / 100) * 180 - 90;

  return (
    <section className="rounded-lg border border-[#3d3d3d] bg-[#2B2B2B] p-5">
      <div className="mb-6 flex items-center justify-between relative">
        <h2 className="font-medium text-white">
          Nível de incerteza:{" "}
          {incerteza != null ? `${incerteza.toFixed(1)}%` : "—"}
        </h2>

        <div className="relative">
          <HelpCircle
            size={18}
            className="cursor-pointer text-white/65 hover:text-white"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />

          {showTooltip && (
            <div className="absolute right-0 top-7 z-50 w-72 rounded-md bg-[#1f1f1f] p-3 text-xs text-white shadow-lg border border-[#3a3a3a]">
              A incerteza representa o quanto o sistema ainda possui dúvida
              sobre o principal suspeito do caso.
              <br />
              <br />
              <strong>Fórmula:</strong>
              <br />
              Incerteza = 100 − P(H|E)
              <br />
              <br />
              Quanto maior a probabilidade do suspeito mais bem ranqueado,
              menor será a incerteza do caso.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative h-[170px] w-[280px]">

          {/* Arco colorido */}
          <svg
            viewBox="0 0 200 100"
            className="absolute inset-0 h-full w-full"
          >
            {/* Verde */}
            <path
              d="M20 100 A80 80 0 0 1 70 30"
              fill="none"
              stroke="#10B981"
              strokeWidth="18"
            />

            {/* Amarelo */}
            <path
              d="M70 30 A80 80 0 0 1 130 30"
              fill="none"
              stroke="#FDE68A"
              strokeWidth="18"
            />

            {/* Vermelho */}
            <path
              d="M130 30 A80 80 0 0 1 180 100"
              fill="none"
              stroke="#FF6253"
              strokeWidth="18"
            />
          </svg>

          {/* Ponteiro */}
          <div
            className="absolute bottom-[22px] left-1/2 h-[78px] w-[4px] origin-bottom -translate-x-1/2 rounded-full bg-white shadow-lg transition-transform duration-700"
            style={{
              transform: `translateX(-50%) rotate(${angle}deg)`,
            }}
          />

          {/* Centro do ponteiro */}
          <div className="absolute bottom-[12px] left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-white border border-gray-300" />

          {/* Labels */}
          <div className="absolute bottom-0 left-4 text-xs text-white">
            0
          </div>

          <div className="absolute bottom-0 right-4 text-xs text-white">
            100
          </div>

          {/* Valor */}
          <div className="absolute left-1/2 top-[85px] -translate-x-1/2 text-center">
            <div className="text-3xl font-bold text-white">
              {value.toFixed(1)}%
            </div>

            <div className="mt-1 text-xs text-gray-400">
              Incerteza do Caso
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}