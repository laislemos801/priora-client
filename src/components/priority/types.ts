export type ActionStatus = "Sugerida" | "Em progresso" | "Concluída" | "Descartada";
export type ImpactLevel = "Alto" | "Médio" | "Baixo";
export type ActionType = "Evidencia" | "Suspeito";

export type InvestigativeAction = {
  id: string;
  tipo: ActionType;
  titulo: string;
  status: ActionStatus;
  impacto: ImpactLevel;
  /** Rótulo da métrica exibida no card (ex.: "Ganho de informação estimado (entropia)"). */
  metricaLabel: string;
  /** Valor da métrica em percentual — ganho de informação esperado (EIG), calculado pelo backend. */
  metricaValor: number;
  /** Esforço operacional estimado (0-100) — proxy de custo, não é uma grandeza probabilística. */
  esforco: number;
  /** Recompensa = metricaValor, usada como eixo Y da matriz de decisão. */
  recompensa: number;
};

export const STATUS_OPTIONS: ActionStatus[] = ["Sugerida", "Em progresso", "Concluída", "Descartada"];
export const IMPACT_OPTIONS: ImpactLevel[] = ["Alto", "Médio", "Baixo"];

export type PriorityFilters = {
  status: ActionStatus[];
  impacto: ImpactLevel[];
};

export const DEFAULT_PRIORITY_FILTERS: PriorityFilters = {
  status: [],
  impacto: [],
};
