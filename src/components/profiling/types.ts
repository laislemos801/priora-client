import type { Suspect } from "@/components/suspect/types";

// Eixos do radar de perfilamento — mesmos campos do suspeito no backend (0–100).
export type ProfileAxisKey =
  | "conexoesSociais"
  | "proximidade"
  | "agressividade"
  | "comportamento"
  | "nivelConfissao";

export type ProfileAxis = {
  key: ProfileAxisKey;
  label: string;
};

// Ordem no sentido horário a partir do topo, igual ao layout da tela.
export const PROFILE_AXES: ProfileAxis[] = [
  { key: "conexoesSociais", label: "Conexões sociais" },
  { key: "proximidade", label: "Proximidade" },
  { key: "agressividade", label: "Agressividade" },
  { key: "comportamento", label: "Comportamento" },
  { key: "nivelConfissao", label: "Nível de confissão" },
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
