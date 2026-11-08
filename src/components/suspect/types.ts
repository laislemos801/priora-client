export type Suspect = {
  id: string;
  nome: string;
  idade?: number;
  fotoUrl?: string | null;
  probabilidadeAtual?: number;
  posicaoRanking?: number | null;
  tendencia?: "Alta" | "Baixa" | "Estável";
  qtdEvidencias?: number;
  /** Evidências vinculadas (nome, tipo e status). */
  evidencias?: { id: string; nome: string; tipo: string; status: string }[];
  historicoCriminal?: number;
  caracteristicasCriminais?: number;
  significanciaTempoLugar?: number;
  coerenciaInterpessoal?: number;
  conscienciaForense?: number;
  crimeSimilarAntes?: string;
  histDescumprimento?: string;
};

export type RankingFilters = {
  search: string;
  minEvidences: string;
  suspects: string[];
};