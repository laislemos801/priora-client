export type Suspect = {
  id: string;
  nome: string;
  idade?: number;
  fotoUrl?: string | null;
  probabilidadeAtual?: number;
  posicaoRanking?: number | null;
  tendencia?: "Alta" | "Baixa" | "Estável";
  qtdEvidencias?: number;
  comportamento?: number;
  agressividade?: number;
  proximidade?: number;
  conexoesSociais?: number;
  nivelConfissao?: number;
  crimeSimilarAntes?: string;
  histDescumprimento?: string;
};

export type RankingFilters = {
  search: string;
  minEvidences: string;
  suspects: string[];
};