import { Link } from "react-router-dom";
import { X, Info } from "lucide-react";
import type { Suspect } from "./types";

const LABEL = "text-[11px] font-medium text-[#888] uppercase tracking-widest block mb-1.5";

const STATUS_STYLES: Record<string, string> = {
  Coletada: "bg-[#455A64]/34 text-[#4584A3] border border-[#4584A3]",
  "Em análise": "bg-[#FFA648]/34 text-[#FFA648] border border-[#FFA648]",
  Custodiada: "bg-[#139C73]/34 text-[#139C73] border border-[#139C73]",
  Descartada: "bg-[#e05555]/20 text-[#e05555] border border-[#e05555]",
  "Enviada a perícia": "bg-[#9b59b6]/20 text-[#9b59b6] border border-[#9b59b6]",
};

const ANSWER_TONE: Record<string, string> = {
  Sim: "text-[#FFC067]",
  Não: "text-[#e8e8e8]",
  "Não sei": "text-[#888]",
};

type Props = { suspect: Suspect; casoId: string; onClose: () => void };

/** Dados cadastrados do suspeito (somente leitura): idade, antecedentes e evidências vinculadas. */
export default function ViewSuspectModal({ suspect, casoId, onClose }: Props) {
  const evidencias = suspect.evidencias ?? [];
  const crime = suspect.crimeSimilarAntes || "Não sei";
  const medida = suspect.histDescumprimento || "Não sei";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[10px] border border-[#2e2e2e] bg-[#282828]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Dados do suspeito"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#2e2e2e] px-5 py-4">
          <h2 className="text-[15px] font-medium text-[#e8e8e8]">Dados do suspeito</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#ccc] transition-colors hover:bg-[#ccc]/10"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
          <div className="flex items-center gap-3 sm:col-span-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3A3A3A] text-sm font-semibold text-white">
              {suspect.fotoUrl ? (
                <img src={suspect.fotoUrl} alt={suspect.nome} className="h-full w-full object-cover" />
              ) : (
                suspect.nome.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-medium text-[#e8e8e8]">{suspect.nome}</p>
              <p className="text-xs text-[#a6a6a6]">
                Posição #{suspect.posicaoRanking ?? "—"} · {(suspect.probabilidadeAtual ?? 0).toFixed(1)}% de probabilidade
              </p>
            </div>
          </div>

          <div>
            <span className={LABEL}>Idade</span>
            <p className="text-[14px] text-[#e8e8e8]">
              {suspect.idade != null ? `${suspect.idade} anos` : "Não informada"}
            </p>
          </div>

          <div>
            <span className={LABEL}>Evidências vinculadas</span>
            <p className="text-[14px] text-[#e8e8e8]">{suspect.qtdEvidencias ?? evidencias.length}</p>
          </div>

          <div className="sm:col-span-2">
            <span className={LABEL}>Antecedentes</span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[#3a3a3a] px-3 py-2.5">
                <p className="text-xs text-[#a6a6a6]">Já cometeu crime semelhante a este?</p>
                <p className={`mt-0.5 text-[14px] font-medium ${ANSWER_TONE[crime] ?? "text-[#e8e8e8]"}`}>{crime}</p>
              </div>
              <div className="rounded-lg border border-[#3a3a3a] px-3 py-2.5">
                <p className="text-xs text-[#a6a6a6]">Já descumpriu medida judicial ou restritiva?</p>
                <p className={`mt-0.5 text-[14px] font-medium ${ANSWER_TONE[medida] ?? "text-[#e8e8e8]"}`}>{medida}</p>
              </div>
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-xs text-[#888]">
              <Info size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
              Informação de apoio ao investigador: não entra no cálculo de probabilidade.
            </p>
          </div>

          <div className="sm:col-span-2">
            <span className={LABEL}>Evidências do suspeito</span>
            {evidencias.length === 0 ? (
              <p className="text-[14px] text-[#a6a6a6]">Nenhuma evidência vinculada.</p>
            ) : (
              <ul className="space-y-2">
                {evidencias.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-[#2B2B2B] px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[14px] text-[#e8e8e8]" title={e.nome}>{e.nome}</p>
                      <p className="text-xs text-[#a6a6a6]">{e.tipo}</p>
                    </div>
                    <span
                      className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs ${
                        STATUS_STYLES[e.status] ?? "border border-gray-500 bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {e.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <Link
              to={`/case/${casoId}/analysis?suspect=${suspect.id}`}
              className="rounded-md border border-[#525252] px-3.5 py-1.5 text-xs text-white transition hover:border-green-500 hover:bg-green-500/10"
            >
              Ver análise probabilística
            </Link>
            <Link
              to={`/case/${casoId}/profiling?suspect=${suspect.id}`}
              className="rounded-md border border-[#525252] px-3.5 py-1.5 text-xs text-white transition hover:border-green-500 hover:bg-green-500/10"
            >
              Ver perfilamento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
