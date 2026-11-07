// Dados e formatação do relatório do caso (sem React, para poder ser testado).

import type { HistoryApiItem } from "@/lib/history";
import type { ProfileValues } from "@/components/profiling/types";
import type { InvestigativeAction } from "@/components/priority/types";

export type CaseData = {
  nome: string;
  descricao?: string | null;
  status?: string | null;
  prioridade?: string | null;
  dataOcorrencia?: string | null;
  incerteza?: number | null;
  totalSuspeitos?: number;
  totalEvidencias?: number;
  enderecoLogradouro?: string | null;
  enderecoNumero?: string | null;
  enderecoBairro?: string | null;
  enderecoCidade?: string | null;
  enderecoEstado?: string | null;
  responsavel?: { primeiroNome?: string; sobrenome?: string } | null;
};

export type SuspectRow = {
  id: string;
  nome: string;
  idade?: number;
  probabilidadeAtual?: number;
  posicaoRanking?: number | null;
  tendencia?: string;
  qtdEvidencias?: number;
};

export type EvidenceRow = {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  dataColeta: string | null;
  pesoCondicional: number;
  suspeitos?: { id: string; nome: string; pesoVinculo?: number | null }[];
};

export type ContactRow = { id: string; nome: string; cargo?: string | null; celular?: string | null };

export type AccessRow = {
  usuario: { primeiroNome: string; sobrenome: string; email: string };
  papel: string;
  status: string;
  tipo?: string;
};

export type ReportData = {
  caso: CaseData | null;
  suspects: SuspectRow[];
  evidences: EvidenceRow[];
  actions: InvestigativeAction[];
  profile: ProfileValues | null;
  contacts: ContactRow[];
  access: AccessRow[];
  history: HistoryApiItem[];
};

export const HISTORY_LIMIT = 30;

// ============================================================
// FORMATAÇÃO
// ============================================================

// "2026-09-01" -> "01/09/2026" (sem converter fuso horário)
export function formatDateOnly(value: string | null | undefined) {
  if (!value) return "—";
  const [y, m, d] = String(value).slice(0, 10).split("-");
  return y && m && d ? `${d}/${m}/${y}` : String(value);
}

export function formatDateTime(value: string | Date) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(d);
}

export function pct(value: number | null | undefined, digits = 1) {
  return value == null || Number.isNaN(Number(value)) ? "—" : `${Number(value).toFixed(digits)}%`;
}

export function fullName(u?: { primeiroNome?: string; sobrenome?: string } | null) {
  return u ? `${u.primeiroNome ?? ""} ${u.sobrenome ?? ""}`.trim() || "—" : "—";
}

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return /[;"\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function buildCsv(data: ReportData) {
  const lines: string[] = [];
  const row = (...cells: unknown[]) => lines.push(cells.map(csvCell).join(";"));

  row("Relatório do caso", data.caso?.nome ?? "");
  row("Gerado em", formatDateTime(new Date()));
  row("Aviso", "Apoio à decisão; não constitui prova. Probabilidades dependem dos pesos informados pelo investigador.");
  lines.push("");

  row("RANKING DE SUSPEITOS");
  row("Posição", "Nome", "Idade", "Probabilidade (%)", "Tendência", "Evidências vinculadas");
  [...data.suspects]
    .sort((a, b) => (a.posicaoRanking ?? 999) - (b.posicaoRanking ?? 999))
    .forEach((s) =>
      row(s.posicaoRanking ?? "", s.nome, s.idade ?? "", s.probabilidadeAtual ?? "", s.tendencia ?? "", s.qtdEvidencias ?? 0),
    );
  lines.push("");

  row("EVIDÊNCIAS");
  row("Nome", "Tipo", "Status", "Data de coleta", "Peso da evidência", "Suspeitos vinculados (peso do vínculo)");
  data.evidences.forEach((e) =>
    row(
      e.nome,
      e.tipo,
      e.status,
      formatDateOnly(e.dataColeta),
      e.pesoCondicional,
      (e.suspeitos ?? []).map((s) => `${s.nome} (${s.pesoVinculo ?? "—"})`).join(", "),
    ),
  );

  return lines.join("\r\n");
}

export function downloadFile(filename: string, content: string, type: string) {
  // BOM para o Excel abrir os acentos corretamente
  const blob = new Blob(["﻿" + content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

