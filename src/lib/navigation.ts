import type { NavIconName } from "@/components/ui/NavIcon";

/**
 * Configuração ÚNICA da navegação do app. A sidebar, o breadcrumb da TopBar
 * e o botão "voltar" leem daqui, para os nomes e a hierarquia nunca divergirem.
 */

export type CaseNavItem = {
  id: string;
  /** Nome no menu lateral */
  label: string;
  /** Nome curto no breadcrumb */
  short: string;
  icon: NavIconName;
  /** Segmento depois de /case/:id ("" = painel do caso) */
  path: string;
};

export const CASE_NAV: CaseNavItem[] = [
  { id: "dashboard", label: "Painel do caso", short: "Painel", icon: "dashboard", path: "" },
  { id: "ranking", label: "Ranking de Suspeitos", short: "Ranking", icon: "ranking", path: "ranking" },
  { id: "evidence", label: "Evidências", short: "Evidências", icon: "evidence", path: "evidence" },
  { id: "analysis", label: "Análise Probabilística", short: "Análise", icon: "analysis", path: "analysis" },
  { id: "profiling", label: "Perfilamento Criminal", short: "Perfilamento", icon: "profiling", path: "profiling" },
  { id: "priority", label: "Priorização de Ações", short: "Priorização", icon: "priority", path: "priority" },
  { id: "board", label: "Quadro investigativo", short: "Quadro investigativo", icon: "board", path: "evidenceBoard" },
  { id: "history", label: "Histórico", short: "Histórico", icon: "history", path: "history" },
  { id: "export", label: "Exportar Relatório", short: "Exportar", icon: "export", path: "export" },
];

/** Páginas gerais (fora de um caso). */
export const GENERAL_PAGES = {
  cases: { path: "/mycases", label: "Meus casos" },
  profile: { path: "/profile", label: "Minha conta" },
  contact: { path: "/contact", label: "Contato" },
} as const;

/** Id do caso na URL atual (/case/:id/...), ou undefined fora de um caso. */
export function caseIdFromPath(pathname: string): string | undefined {
  return pathname.match(/^\/case\/([^/]+)/)?.[1];
}

/** Item do caso correspondente à URL atual. */
export function caseSectionFromPath(pathname: string): CaseNavItem | undefined {
  if (!caseIdFromPath(pathname)) return undefined;
  const segment = pathname.split("/")[3] ?? "";
  return CASE_NAV.find((item) => item.path === segment);
}

export function casePath(caseId: string, item: CaseNavItem): string {
  return item.path ? `/case/${caseId}/${item.path}` : `/case/${caseId}`;
}

// ── Usuário logado (nome e foto na sidebar) ──

export const USER_UPDATED_EVENT = "priora:user-updated";

/** Atualiza o usuário salvo no login e avisa a sidebar (ex.: depois de trocar a foto). */
export function syncStoredUser(patch: Record<string, unknown>) {
  try {
    const current = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...current, ...patch }));
  } catch {
    /* armazenamento indisponível */
  }
  window.dispatchEvent(new Event(USER_UPDATED_EVENT));
}

// ── Último caso aberto (atalho na sidebar quando o usuário está fora de um caso) ──

const LAST_CASE_KEY = "priora:lastCase";

export type LastCase = { id: string; name: string };

export function getLastCase(): LastCase | null {
  try {
    const raw = localStorage.getItem(LAST_CASE_KEY);
    return raw ? (JSON.parse(raw) as LastCase) : null;
  } catch {
    return null;
  }
}

export function setLastCase(value: LastCase | null) {
  try {
    if (value) localStorage.setItem(LAST_CASE_KEY, JSON.stringify(value));
    else localStorage.removeItem(LAST_CASE_KEY);
  } catch {
    /* armazenamento indisponível: o atalho só não aparece */
  }
}
