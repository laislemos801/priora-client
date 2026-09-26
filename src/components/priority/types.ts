export type ActionStatus = "Em progresso" | "Em aprovação" | "Concluída";
export type ImpactLevel = "Alto" | "Médio" | "Baixo";

export type InvestigativeAction = {
  id: string;
  titulo: string;
  status: ActionStatus;
  impacto: ImpactLevel;
  /** Rótulo da métrica exibida no card (ex.: "Ganho de informações estimados"). */
  metricaLabel: string;
  /** Valor da métrica em percentual. */
  metricaValor: number;
  /** Posição na matriz esforço x recompensa, 0-100. */
  esforco: number;
  recompensa: number;
};

export const STATUS_OPTIONS: ActionStatus[] = ["Em progresso", "Em aprovação", "Concluída"];
export const IMPACT_OPTIONS: ImpactLevel[] = ["Alto", "Médio", "Baixo"];

export type PriorityFilters = {
  status: ActionStatus[];
  impacto: ImpactLevel[];
};

export const DEFAULT_PRIORITY_FILTERS: PriorityFilters = {
  status: [],
  impacto: [],
};
