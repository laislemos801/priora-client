import { FiAlertCircle, FiPaperclip, FiUser } from "react-icons/fi";
import type { Suspect } from "./types";

type Answer = "Sim" | "Não" | "Não sei" | string | undefined;

const TONE: Record<string, string> = {
  Sim: "text-[#FFC067]",
  Não: "text-white/55",
  "Não sei": "text-white/35",
};

function Answer({ label, value }: { label: string; value: Answer }) {
  const v = value || "Não sei";
  return (
    <span className="whitespace-nowrap">
      {label}: <span className={`font-medium ${TONE[v] ?? "text-white/55"}`}>{v}</span>
    </span>
  );
}

/**
 * Dados cadastrados do suspeito em até três linhas: idade, antecedentes e
 * evidências vinculadas. Os antecedentes são informação de apoio e não entram
 * no cálculo de probabilidade.
 */
export default function SuspectData({ suspect }: { suspect: Suspect }) {
  const evidencias = suspect.evidencias ?? [];
  const names = evidencias.map((e) => e.nome);
  const shown = names.slice(0, 2).join(", ");
  const extra = names.length > 2 ? ` +${names.length - 2}` : "";
  const full = evidencias.map((e) => `${e.nome} (${e.tipo})`).join("\n");

  return (
    <div className="min-w-0 space-y-0.5 text-xs leading-4 text-white/65">
      <p className="flex items-center gap-1.5 truncate">
        <FiUser className="shrink-0 text-white/40" aria-hidden="true" />
        {suspect.idade != null ? `${suspect.idade} anos` : "Idade não informada"}
      </p>

      <p
        className="flex items-center gap-1.5 truncate"
        title="Antecedentes: informação de apoio, não entra no cálculo de probabilidade"
      >
        <FiAlertCircle className="shrink-0 text-white/40" aria-hidden="true" />
        <span className="flex min-w-0 flex-wrap gap-x-3">
          <Answer label="Crime semelhante" value={suspect.crimeSimilarAntes} />
          <Answer label="Descumpriu medida" value={suspect.histDescumprimento} />
        </span>
      </p>

      <p className="flex items-center gap-1.5 truncate" title={full || undefined}>
        <FiPaperclip className="shrink-0 text-white/40" aria-hidden="true" />
        <span className="truncate">
          {names.length ? `${shown}${extra}` : "Nenhuma evidência vinculada"}
        </span>
      </p>
    </div>
  );
}
