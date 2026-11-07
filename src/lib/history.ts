// Tipos e textos do histórico do caso, compartilhados pela página de Histórico
// e pelo "Histórico Recente" do painel do caso.

export type HistoryApiItem = {
  id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | string;
  entityType: "CASO" | "SUSPEITO" | "EVIDENCIA" | "PERFIL_ESTIMADO" | string;
  entityId: string | null;
  entityName: string | null;
  details: string | null;
  createdAt: string;
  user: {
    id: string;
    primeiroNome: string;
    sobrenome: string;
    fotoUrl: string | null;
  } | null;
};

export const VERBS: Record<string, string> = {
  CREATE: "criou",
  UPDATE: "alterou",
  DELETE: "excluiu",
};

export const ENTITY_LABELS: Record<string, { noun: string; tag: string; color: "blue" | "green" | "yellow" }> = {
  SUSPEITO: { noun: "o suspeito", tag: "Suspeitos", color: "blue" },
  EVIDENCIA: { noun: "a evidência", tag: "Evidências", color: "green" },
  CASO: { noun: "o caso", tag: "Caso", color: "yellow" },
  PERFIL_ESTIMADO: { noun: "o perfil estimado", tag: "Perfilamento", color: "blue" },
  CONTATO: { noun: "o contato", tag: "Contatos", color: "yellow" },
  ACESSO: { noun: "o acesso de colaborador", tag: "Acessos", color: "blue" },
  ACAO: { noun: "a ação investigativa", tag: "Ações", color: "green" },
  RELATORIO: { noun: "o relatório", tag: "Relatórios", color: "green" },
};


// `details` vem do backend como texto puro ("Caso criado") ou como JSON
// (lista de {campo, antes, depois} ou objeto com os campos alterados).
export function summarizeDetails(details: string | null): string {
  if (!details) return "";

  try {
    const parsed = JSON.parse(details);

    if (Array.isArray(parsed)) {
      const campos = parsed
        .map((c) => (c && typeof c === "object" ? c.campo : null))
        .filter(Boolean);
      return campos.length ? `campos: ${campos.join(", ")}` : "";
    }

    if (parsed && typeof parsed === "object") {
      const campos = Object.keys(parsed).filter((k) => k !== "id");
      return campos.length ? `campos: ${campos.join(", ")}` : "";
    }
  } catch {
    // não é JSON: texto puro
  }

  return details;
}

export function describe(item: HistoryApiItem) {
  // exportação de relatório: "exportou o relatório — Exportado em PDF"
  if (item.entityType === "RELATORIO") {
    return { action: "exportou o relatório", text: item.details ?? "" };
  }

  const verb = VERBS[item.action] ?? item.action.toLowerCase();
  const entity = ENTITY_LABELS[item.entityType];
  const action = entity ? `${verb} ${entity.noun}` : verb;

  // campos técnicos (JSON) só interessam nas alterações; em criação/exclusão
  // mostramos apenas o nome da entidade e eventuais textos livres.
  const detail = summarizeDetails(item.details);
  const isTechnical = detail.startsWith("campos:");
  const isGenericDetail = ["Caso criado", "Evidência criada", "Evidência excluída", "Caso excluído"].includes(detail);
  const showDetail = item.action === "UPDATE" ? true : !isTechnical && !isGenericDetail;

  // o perfil estimado não tem nome próprio: evita "Perfil estimado — Perfil estimado ..."
  const name = item.entityType === "PERFIL_ESTIMADO" ? "" : item.entityName;

  const text = [name, showDetail ? detail : ""]
    .filter(Boolean)
    .join(" — ");

  return { action, text };
}

// "há 5 minutos", "há 2 horas", "ontem"... para listas curtas.
export function timeAgo(iso: string | null | undefined, now: Date = new Date()): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const minutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (minutes < 1) return "agora há pouco";
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} ${hours === 1 ? "hora" : "horas"}`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "ontem";
  if (days < 7) return `há ${days} dias`;

  return new Intl.DateTimeFormat("pt-BR").format(date);
}
