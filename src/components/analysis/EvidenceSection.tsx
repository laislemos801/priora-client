import type { Evidence } from "./types";
import { contributionOf, isExculpatory, linkedSuspects } from "./contribution";

type Props = { evidencias: Evidence[] };

export default function EvidenceSection({ evidencias }: Props) {
  return (
    <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">
      <h3 className="text-white font-semibold mb-4">1. Evidências Utilizadas</h3>

      <div className="mb-4 rounded-lg border border-[#333] bg-[#2A2A2A] p-4">
        <div className="text-sm font-medium text-white mb-2">Fórmula de Contribuição</div>
        <div className="text-sm text-[#139C73]">
          Incrimina: 1 + (Peso Evidência × Peso Vínculo × Fator de Exclusividade)
        </div>
        <div className="mt-1 text-sm text-red-300">
          Inocenta: 1 ÷ (1 + Peso Evidência × Peso Vínculo)
        </div>
        <div className="mt-3 text-xs text-gray-400 space-y-1">
          <div>Peso Evidência = confiabilidade da evidência</div>
          <div>Peso Vínculo = força da ligação com o suspeito</div>
          <div>Fator de Exclusividade = 1 / nº de suspeitos que a evidência incrimina</div>
          <div>Evidência que inocenta (álibi, contradição) tem contribuição menor que 1 e reduz a probabilidade do suspeito</div>
        </div>
      </div>

      <div className="space-y-3">
        {evidencias.map((ev) => {
          const competitors = linkedSuspects(ev);
          const contribution = contributionOf(ev);
          const exculpatory = isExculpatory(ev);

          return (
            <div key={ev.id} className="rounded-lg border border-[#333] bg-[#2A2A2A] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{ev.nome}</div>
                  <div className="text-xs text-gray-400">
                    {ev.tipo}
                    {exculpatory && (
                      <span className="ml-2 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-medium text-red-300">
                        Inocenta
                      </span>
                    )}
                  </div>
                </div>
                <div className={`font-semibold ${exculpatory ? "text-red-300" : "text-[#139C73]"}`}>{contribution.toFixed(2)}</div>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                Evidência: {(ev.pesoCondicional * 100).toFixed(0)}%
                {" • "}
                Vínculo: {(ev.pesoVinculo * 100).toFixed(0)}%
                {" • "}
                Peso Final: {(ev.pesoFinal * 100).toFixed(0)}%
              </div>

              <div className="mt-3 text-sm text-white">
                {exculpatory
                  ? `1 ÷ (1 + ${ev.pesoCondicional.toFixed(2)} × ${ev.pesoVinculo.toFixed(2)})`
                  : `1 + (${ev.pesoCondicional.toFixed(2)} × ${ev.pesoVinculo.toFixed(2)} × 1/${competitors})`}
              </div>
              <div className={`mt-1 text-sm font-medium ${exculpatory ? "text-red-300" : "text-[#139C73]"}`}>
                = {contribution.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}