import type { Evidence } from "./types";

type Props = { evidencias: Evidence[] };

export default function EvidenceSection({ evidencias }: Props) {
  return (
    <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">
      <h3 className="text-white font-semibold mb-4">1. Evidências Utilizadas</h3>

      <div className="mb-4 rounded-lg border border-[#333] bg-[#2A2A2A] p-4">
        <div className="text-sm font-medium text-white mb-2">Fórmula de Contribuição</div>
        <div className="text-sm text-[#139C73]">
          1 + (Peso Evidência × Peso Vínculo × Fator de Exclusividade)
        </div>
        <div className="mt-3 text-xs text-gray-400 space-y-1">
          <div>Peso Evidência = confiabilidade da evidência</div>
          <div>Peso Vínculo = força da ligação com o suspeito</div>
          <div>Fator de Exclusividade = 1 / nº de suspeitos ligados à evidência</div>
        </div>
      </div>

      <div className="space-y-3">
        {evidencias.map((ev) => {
          const competitors = ev.suspectIds?.length || 1;
          const contribution = 1 + ev.pesoFinal * (1 / competitors);

          return (
            <div key={ev.id} className="rounded-lg border border-[#333] bg-[#2A2A2A] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{ev.nome}</div>
                  <div className="text-xs text-gray-400">{ev.tipo}</div>
                </div>
                <div className="text-[#139C73] font-semibold">{contribution.toFixed(2)}</div>
              </div>

              <div className="mt-3 text-xs text-gray-400">
                Evidência: {(ev.pesoCondicional * 100).toFixed(0)}%
                {" • "}
                Vínculo: {(ev.pesoVinculo * 100).toFixed(0)}%
                {" • "}
                Peso Final: {(ev.pesoFinal * 100).toFixed(0)}%
              </div>

              <div className="mt-3 text-sm text-white">
                1 + ({ev.pesoCondicional.toFixed(2)} × {ev.pesoVinculo.toFixed(2)} × 1/{competitors})
              </div>
              <div className="mt-1 text-[#139C73] text-sm font-medium">
                = {contribution.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}