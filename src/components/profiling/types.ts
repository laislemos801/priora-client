import type { Suspect } from "@/components/suspect/types";

// Eixos do radar de perfilamento — mesmos campos do suspeito no backend (0–100).
export type ProfileAxisKey =
  | "coerenciaInterpessoal"
  | "significanciaTempoLugar"
  | "caracteristicasCriminais"
  | "historicoCriminal"
  | "conscienciaForense";

export type ProfileAxis = {
  key: ProfileAxisKey;
  label: string;
  /** O que a dimensão significa e de onde vem (exibido no ícone "i"). */
  info: string;
};

// Ordem no sentido horário a partir do topo, igual ao layout da tela.
export const PROFILE_AXES: ProfileAxis[] = [
  {
    key: "coerenciaInterpessoal",
    label: "Coerência interpessoal",
    info: "Quanto o jeito como o autor trata a vítima no crime se parece com a forma como ele costuma tratar as pessoas no dia a dia. Vem da leitura do investigador sobre a cena, a vítima e o relacionamento entre eles.",
  },
  {
    key: "significanciaTempoLugar",
    label: "Significância do tempo e lugar",
    info: "O que o momento e o local do crime revelam sobre o autor: familiaridade com a área, rotina e base de atividade. Vem da análise do investigador sobre onde e quando o fato ocorreu e da relação do suspeito com esse local e horário.",
  },
  {
    key: "caracteristicasCriminais",
    label: "Características criminais",
    info: "A natureza do crime em si: tipo de ofensa, planejamento, grau de violência e escolha do alvo. Vem do que as evidências e a cena indicam sobre o modo de agir.",
  },
  {
    key: "historicoCriminal",
    label: "Histórico criminal",
    info: "A trajetória criminal do autor: antecedentes e padrão de crimes anteriores. Vem dos registros e informações levantadas sobre o suspeito e, no perfil estimado, do que o crime sugere sobre a experiência do autor.",
  },
  {
    key: "conscienciaForense",
    label: "Consciência forense",
    info: "O cuidado do autor para não deixar vestígios ou ser identificado (por exemplo, ocultar objetos ou limpar a cena). Vem de indícios de preparação e de cuidado com a prova observados no crime.",
  },
];

export type ProfileValues = Record<ProfileAxisKey, number>;

export type ProfileType = "estimado" | "suspeito";

export const PROFILE_TYPE_LABEL: Record<ProfileType, string> = {
  estimado: "Perfil estimado",
  suspeito: "Perfil do suspeito",
};

export type ProfilingSuspect = {
  id: string;
  nome: string;
  fotoUrl?: string | null;
  perfil: ProfileValues;
  // Registro completo, usado para editar o suspeito pelo SuspectModal.
  origem: Suspect;
};

// Perfil estimado do criminoso, definido pelo investigador (um por caso).
export type EstimatedProfile = {
  perfil: ProfileValues | null;
  atualizadoEm: string | null;
};

export type ProfilingFilters = {
  search: string;
  tipos: ProfileType[];
  suspects: string[];
};

export const DEFAULT_PROFILING_FILTERS: ProfilingFilters = {
  search: "",
  tipos: ["estimado", "suspeito"],
  suspects: [],
};
