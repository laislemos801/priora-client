/** Situação de um caso. É a mesma lista do formulário de caso e do servidor. */
export type CaseStatus = "Ativo" | "Pendente" | "Finalizado";

export const CASE_STATUS_LIST: CaseStatus[] = ["Ativo", "Pendente", "Finalizado"];

// Versões antigas gravavam "Pendente" como "Arquivado" e "Finalizado" como "Concluído".
const LEGACY: Record<string, CaseStatus> = {
  Arquivado: "Pendente",
  Concluído: "Finalizado",
};

/** Converte nomes antigos para os atuais (valores desconhecidos passam como estão). */
export function normalizeCaseStatus<T extends string | undefined | null>(value: T): T | CaseStatus {
  if (!value) return value;
  return LEGACY[value] ?? (value as CaseStatus);
}
