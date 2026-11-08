export type Suspect = {
  id: string;
  nome: string;
  idade?: number;
  fotoUrl?: string | null;
  probabilidadeAtual?: number;
  posicaoRanking?: number | null;
  tendencia?: "Alta" | "Baixa" | "Estável";
  qtdEvidencias?: number;
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