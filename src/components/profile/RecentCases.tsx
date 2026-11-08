import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiFolder } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import Sk from "@/components/ui/Skeleton";
import { normalizeCaseStatus } from "@/lib/caseStatus";
import type { CaseStatus } from "@/lib/caseStatus";

type CaseSummary = {
  id: string;
  nome: string;
  status: CaseStatus;
  prioridade: "Baixa" | "Média" | "Alta" | "Crítica";
  incerteza: number;
  qtdSuspeitos: number;
  qtdEvidencias: number;
};

const STATUS_STYLE: Record<CaseSummary["status"], string> = {
  Ativo: "border-[#139C73]/40 bg-[#139C73]/12 text-emerald-300",
  Finalizado: "border-[#E8CF75]/35 bg-[#E8CF75]/10 text-[#E8CF75]",
  Pendente: "border-[#575757] bg-[#333] text-white/55",
};

const PRIORITY_COLOR: Record<CaseSummary["prioridade"], string> = {
  Baixa: "bg-[#5b9cf6]",
  Média: "bg-[#e0a030]",
  Alta: "bg-[#e05555]",
  Crítica: "bg-[#ff3b3b]",
};

const MAX_ITEMS = 6;

/** Lista curta dos casos do usuário, com atalho para abrir cada um. */
export default function RecentCases({ userId, className = "" }: { userId: string; className?: string }) {
  const [cases, setCases] = useState<CaseSummary[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    apiFetch(`/cases/user/${userId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: CaseSummary[]) => alive && setCases(data.map((c) => ({ ...c, status: normalizeCaseStatus(c.status) }))))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [userId]);

  // Ativos primeiro, depois os demais
  const sorted = cases
    ? [...cases].sort((a, b) => Number(b.status === "Ativo") - Number(a.status === "Ativo"))
    : [];

  return (
    <section className={`flex flex-col rounded-xl border border-[#3d3d3d] bg-[#2B2B2B] ${className}`}>
      <header className="flex items-center justify-between gap-3 border-b border-[#3d3d3d] px-5 py-3.5 sm:px-7">
        <h2 className="flex items-center gap-2 text-sm font-medium text-white">
          <FiFolder size={15} className="text-emerald-400" />
          Seus casos
          {cases && <span className="text-white/40">({cases.length})</span>}
        </h2>
        <Link to="/mycases" className="text-xs font-medium text-[#18C18A] hover:underline">
          Ver todos
        </Link>
      </header>

      <div className="flex-1 p-3 sm:px-5">
        {!cases && !error && (
          <ul className="space-y-2" aria-label="Carregando casos">
            {[0, 1, 2].map((i) => (
              <li key={i} className="flex items-center gap-3 rounded-lg px-2 py-3">
                <Sk className="h-4 flex-1" />
                <Sk className="h-5 w-16 rounded-full" />
                <Sk className="h-4 w-24" />
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p className="px-2 py-6 text-center text-sm text-white/55">
            Não foi possível carregar seus casos.{" "}
            <Link to="/mycases" className="text-[#18C18A] hover:underline">
              Abrir Meus casos
            </Link>
          </p>
        )}

        {cases && cases.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-2 py-8 text-center">
            <FiFolder size={22} className="text-white/30" />
            <p className="text-sm text-white/60">Você ainda não participa de nenhum caso.</p>
            <Link to="/mycases" className="text-sm font-medium text-[#18C18A] hover:underline">
              Criar um caso
            </Link>
          </div>
        )}

        {sorted.length > 0 && (
          <ul className="divide-y divide-[#363636]">
            {sorted.slice(0, MAX_ITEMS).map((c) => (
              <li key={c.id}>
                <Link
                  to={`/case/${c.id}`}
                  className="group flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-[#333]"
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${PRIORITY_COLOR[c.prioridade] ?? "bg-[#575757]"}`}
                    title={`Prioridade ${c.prioridade}`}
                    aria-label={`Prioridade ${c.prioridade}`}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-white">{c.nome}</span>

                  <span
                    className={`hidden shrink-0 rounded-full border px-2 py-0.5 text-[11px] sm:inline ${STATUS_STYLE[c.status] ?? STATUS_STYLE.Pendente}`}
                  >
                    {c.status}
                  </span>
                  <span className="hidden shrink-0 text-xs text-white/50 md:inline">
                    {c.qtdSuspeitos} suspeito{c.qtdSuspeitos === 1 ? "" : "s"} · {c.qtdEvidencias} evidência
                    {c.qtdEvidencias === 1 ? "" : "s"}
                  </span>
                  <span className="w-20 shrink-0 text-right text-xs text-white/50">
                    Incerteza <span className="text-white/80">{Math.round((c.incerteza ?? 0) * 100) / 100}%</span>
                  </span>
                  <FiChevronRight className="shrink-0 text-white/30 group-hover:text-emerald-400" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {cases && cases.length > MAX_ITEMS && (
          <p className="px-2 pt-2 text-xs text-white/40">
            Mostrando {MAX_ITEMS} de {cases.length}.{" "}
            <Link to="/mycases" className="text-[#18C18A] hover:underline">
              Ver todos os casos
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
