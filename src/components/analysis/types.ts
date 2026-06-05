export type Evidence = {
  id: string;
  nome: string;
  tipo: string;
  pesoCondicional: number;
  pesoVinculo: number;
  pesoFinal: number;
  suspectIds?: string[];
  status?: string;
  dataColeta?: string;
  descricao?: string | null;
};

export type SuspectAnalysis = {
  id: string;
  nome: string;
  fotoUrl: string | null;
  probabilidadeAtual: number;
  posicaoRanking: number;
  nSuspeitos: number;
  evidencias: Evidence[];
  bayes: {
    prior: number;
    pEH: number;
    numerator: number;
    denominator: number;
    posterior: number;
    probabilityPct: number;
    uncertaintyPct: number;
    position: number;
  };
};