import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiDownload, FiPrinter } from "react-icons/fi";
import toast from "react-hot-toast";

import { apiFetch } from "@/lib/api";
import { describe } from "@/lib/history";
import type { HistoryApiItem } from "@/lib/history";
import {
  HISTORY_LIMIT,
  buildCsv,
  downloadFile,
  formatDateOnly,
  formatDateTime,
  fullName,
  pct,
} from "@/lib/report";
import type { AccessRow, CaseData, ContactRow, EvidenceRow, ReportData, SuspectRow } from "@/lib/report";
import { getEstimatedProfile } from "@/services/profilingService";
import { PROFILE_AXES } from "@/components/profiling/types";
import type { InvestigativeAction } from "@/components/priority/types";

// ============================================================
// BLOCOS DO RELATÓRIO
// ============================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 break-inside-avoid-page">
      <h2 className="mb-2 border-b border-gray-300 pb-1 text-sm font-semibold uppercase tracking-wide text-gray-700">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Table({ head, rows, empty }: { head: string[]; rows: React.ReactNode[][]; empty: string }) {
  if (rows.length === 0) return <p className="text-xs italic text-gray-500">{empty}</p>;
  return (
    <table className="w-full border-collapse text-xs">
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} className="border border-gray-300 bg-gray-100 px-2 py-1 text-left font-semibold text-gray-700">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells, i) => (
          <tr key={i} className="break-inside-avoid">
            {cells.map((c, j) => (
              <td key={j} className="border border-gray-300 px-2 py-1 align-top text-gray-900">
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="text-xs">
      <span className="font-semibold text-gray-700">{label} </span>
      <span className="text-gray-900">{value || "—"}</span>
    </div>
  );
}

// ============================================================
// PÁGINA
// ============================================================

export default function ExportReport() {
  const { id } = useParams();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatedAt] = useState(() => new Date());

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    if (!id) return;

    async function getJson<T>(path: string, fallback: T): Promise<T> {
      try {
        const res = await apiFetch(path);
        if (!res.ok) return fallback;
        return (await res.json()) as T;
      } catch {
        return fallback;
      }
    }

    async function load() {
      const [caso, suspects, evidences, actions, contacts, access, history, profile] = await Promise.all([
        getJson<CaseData | null>(`/cases/${id}`, null),
        getJson<SuspectRow[]>(`/suspects/case/${id}`, []),
        getJson<EvidenceRow[]>(`/evidences/case/${id}`, []),
        getJson<InvestigativeAction[]>(`/priority-actions/case/${id}`, []),
        getJson<ContactRow[]>(`/contacts/case/${id}`, []),
        getJson<AccessRow[]>(`/access/case/${id}`, []),
        getJson<HistoryApiItem[]>(`/history/cases/${id}`, []),
        getEstimatedProfile(id!).then((p) => p.perfil).catch(() => null),
      ]);

      setData({
        caso,
        suspects: Array.isArray(suspects) ? suspects : [],
        evidences: Array.isArray(evidences) ? evidences : [],
        actions: Array.isArray(actions) ? actions : [],
        profile,
        contacts: Array.isArray(contacts) ? contacts : [],
        access: Array.isArray(access) ? access : [],
        history: Array.isArray(history) ? history : [],
      });
      setLoading(false);
    }

    load();
  }, [id]);

  async function logExport(formato: "PDF" | "CSV") {
    // registra no histórico quem exportou; uma falha aqui não impede a exportação
    try {
      await apiFetch(`/history/cases/${id}/export?formato=${formato}`, { method: "POST" });
    } catch (error) {
      console.error(error);
    }
  }

  async function handlePrint() {
    await logExport("PDF");
    window.print();
  }

  async function handleCsv() {
    if (!data) return;
    const slug = (data.caso?.nome ?? "caso").normalize("NFD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
    downloadFile(`relatorio-${slug || "caso"}.csv`, buildCsv(data), "text/csv");
    await logExport("CSV");
    toast.success("CSV baixado.");
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#242424] p-6 text-sm text-white/65">Montando o relatório…</div>
    );
  }

  const { caso, suspects, evidences, actions, profile, contacts, access, history } = data;
  const ranking = [...suspects].sort((a, b) => (a.posicaoRanking ?? 999) - (b.posicaoRanking ?? 999));
  const leader = ranking.find((s) => s.probabilidadeAtual != null);
  const address = [caso?.enderecoLogradouro, caso?.enderecoNumero, caso?.enderecoBairro, caso?.enderecoCidade, caso?.enderecoEstado]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-[#242424] px-4 pb-8 pt-3 md:px-6 print:bg-white print:p-0">
      <style>{"@media print { @page { size: A4; margin: 14mm; } }"}</style>

      {/* barra de ações (não sai na impressão) */}
      <div className="mx-auto mb-3 flex max-w-[900px] flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">Exportar Relatório</h1>
          <p className="text-xs text-white/65">
            Prévia do relatório. Use “Imprimir / Salvar PDF” e escolha “Salvar como PDF” no destino.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCsv}
            className="inline-flex items-center gap-2 rounded-md border border-[#434343] bg-[#2B2B2B] px-3 py-2 text-xs text-white hover:border-[#606060]"
          >
            <FiDownload size={14} /> Baixar CSV
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-md bg-[#139C73] px-3 py-2 text-xs font-medium text-white hover:bg-[#0f8663]"
          >
            <FiPrinter size={14} /> Imprimir / Salvar PDF
          </button>
        </div>
      </div>

      {/* folha do relatório */}
      <article className="mx-auto max-w-[900px] rounded-md bg-white p-8 text-gray-900 shadow-lg print:max-w-none print:rounded-none print:p-0 print:shadow-none">
        <header className="border-b-2 border-gray-800 pb-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">Priora · Relatório do caso</p>
          <h1 className="mt-1 text-2xl font-bold">{caso?.nome ?? "Caso"}</h1>
          <p className="mt-1 text-xs text-gray-600">
            Gerado em {formatDateTime(generatedAt)} por {fullName(user)}
          </p>
        </header>

        {/* aviso de uso responsável */}
        <div className="mt-4 rounded border border-amber-400 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <strong>Uso responsável.</strong> Este relatório é um apoio à decisão e <strong>não constitui prova</strong>. As
          probabilidades indicam prioridade investigativa sob as premissas do modelo (pesos informados pelo investigador e
          independência condicional entre evidências); não indicam culpa e exigem supervisão humana. O perfil estimado é
          uma estimativa heurística e não entra no cálculo.
        </div>

        <Section title="Dados do caso">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <Field label="Status:" value={caso?.status} />
            <Field label="Prioridade:" value={caso?.prioridade} />
            <Field label="Responsável:" value={fullName(caso?.responsavel)} />
            <Field label="Data da ocorrência:" value={formatDateOnly(caso?.dataOcorrencia)} />
            <Field label="Local:" value={address} />
            <Field label="Incerteza do caso:" value={pct(caso?.incerteza)} />
            <Field label="Suspeitos:" value={String(caso?.totalSuspeitos ?? suspects.length)} />
            <Field label="Evidências:" value={String(caso?.totalEvidencias ?? evidences.length)} />
          </div>
          {caso?.descricao && <p className="mt-2 text-xs text-gray-800">{caso.descricao}</p>}
          {leader && (
            <p className="mt-2 text-xs text-gray-800">
              Suspeito com maior probabilidade no momento: <strong>{leader.nome}</strong> ({pct(leader.probabilidadeAtual)}).
            </p>
          )}
        </Section>

        <Section title="Ranking de suspeitos">
          <Table
            head={["#", "Suspeito", "Idade", "Probabilidade", "Tendência", "Evidências"]}
            empty="Nenhum suspeito cadastrado."
            rows={ranking.map((s) => [
              s.posicaoRanking ?? "—",
              s.nome,
              s.idade ?? "—",
              pct(s.probabilidadeAtual),
              s.tendencia ?? "—",
              s.qtdEvidencias ?? 0,
            ])}
          />
        </Section>

        <Section title="Evidências">
          <Table
            head={["Evidência", "Tipo", "Status", "Coleta", "Peso", "Suspeitos vinculados (peso do vínculo)"]}
            empty="Nenhuma evidência cadastrada."
            rows={evidences.map((e) => [
              e.nome,
              e.tipo,
              e.status,
              formatDateOnly(e.dataColeta),
              e.pesoCondicional,
              (e.suspeitos ?? []).map((s) => `${s.nome} (${s.pesoVinculo ?? "—"})`).join(", ") || "—",
            ])}
          />
          <p className="mt-1 text-[10px] text-gray-500">
            O status da evidência indica o andamento da análise no sistema e não equivale à cadeia de custódia formal.
          </p>
        </Section>

        <Section title="Ações investigativas sugeridas">
          <Table
            head={["Ação", "Tipo", "Status", "Impacto", "Ganho de informação", "Esforço"]}
            empty="Nenhuma ação sugerida."
            rows={[...actions]
              .sort((a, b) => b.recompensa - a.recompensa)
              .map((a) => [a.titulo, a.tipo === "Evidencia" ? "Evidência" : a.tipo, a.status, a.impacto, pct(a.recompensa), `${Math.round(a.esforco)}/100`])}
          />
        </Section>

        <Section title="Perfil estimado do autor">
          {profile ? (
            <Table
              head={PROFILE_AXES.map((a) => a.label)}
              empty=""
              rows={[PROFILE_AXES.map((a) => `${Math.round(profile[a.key])}/100`)]}
            />
          ) : (
            <p className="text-xs italic text-gray-500">Nenhum perfil estimado definido.</p>
          )}
        </Section>

        <Section title="Contatos">
          <Table
            head={["Nome", "Cargo", "Celular"]}
            empty="Nenhum contato cadastrado."
            rows={contacts.map((c) => [c.nome, c.cargo ?? "—", c.celular ?? "—"])}
          />
        </Section>

        <Section title="Responsável e colaboradores">
          <Table
            head={["Nome", "E-mail", "Papel", "Situação"]}
            empty="Sem colaboradores."
            rows={access.map((a) => [
              fullName(a.usuario),
              a.usuario.email,
              a.tipo === "Responsavel" ? "Responsável" : a.papel,
              a.status,
            ])}
          />
        </Section>

        <Section title={`Histórico recente (últimos ${Math.min(history.length, HISTORY_LIMIT)} registros)`}>
          <Table
            head={["Data", "Usuário", "Registro"]}
            empty="Sem registros no histórico."
            rows={history.slice(0, HISTORY_LIMIT).map((h) => {
              const { action, text } = describe(h);
              return [formatDateTime(h.createdAt), fullName(h.user), `${action}${text ? ` — ${text}` : ""}`];
            })}
          />
        </Section>

        <footer className="mt-8 border-t border-gray-300 pt-2 text-[10px] text-gray-500">
          Priora — sistema probabilístico de priorização investigativa. Relatório gerado em {formatDateTime(generatedAt)}.
        </footer>
      </article>
    </div>
  );
}
