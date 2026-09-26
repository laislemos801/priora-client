import {
  PROFILE_AXES,
  type ProfileAxisKey,
  type ProfileInsight,
  type ProfileValues,
  type ProfilingData,
  type ProfilingSuspect,
} from "@/components/profiling/types";

// "||" para que VITE_API_URL vazio também caia no fallback.
const API_URL: string = (
  import.meta.env.VITE_API_URL?.trim() || "http://127.0.0.1:8000"
).replace(/\/+$/, "");

// Mesmo neutro usado pelo backend para eixo sem valor
// (priora-server/app/repositories/bayes_repository.py).
const NEUTRAL_SCORE = 50;

// Enquanto não houver endpoint de perfil estimado, a UI avisa que é exemplo.
export const PROFILING_ESTIMATE_IS_MOCK = true;

type RawSuspect = {
  id?: string | number | null;
  nome?: string | null;
  fotoUrl?: string | null;
} & Partial<Record<ProfileAxisKey, number | string | null>>;

// Eixo nulo/inválido assume o neutro do backend.
function toScore(value: unknown): number {
  if (value == null || value === "") return NEUTRAL_SCORE;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : NEUTRAL_SCORE;
}

function toProfileValues(raw: RawSuspect): ProfileValues {
  return PROFILE_AXES.reduce((acc, axis) => {
    acc[axis.key] = toScore(raw[axis.key]);
    return acc;
  }, {} as ProfileValues);
}

export async function getProfilingSuspects(
  casoId: string,
): Promise<ProfilingSuspect[]> {
  const response = await fetch(
    `${API_URL}/suspects/case/${encodeURIComponent(casoId)}`,
  );

  if (!response.ok) {
    throw new Error(`Erro ao carregar suspeitos (${response.status})`);
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data)) return [];

  return (data as RawSuspect[])
    .filter((item) => item && item.id != null)
    .map((item) => ({
      id: String(item.id),
      nome: item.nome ?? "",
      fotoUrl: item.fotoUrl ?? null,
      perfil: toProfileValues(item),
    }));
}

// TODO: trocar por endpoint real quando o backend expor perfil estimado e análises.
// Valores placeholder apenas para visualização — não representam regra de negócio.
const MOCK_ESTIMATED_PROFILE: ProfileValues = {
  conexoesSociais: 50,
  proximidade: 50,
  agressividade: 50,
  comportamento: 50,
  nivelConfissao: 50,
};

// TODO: trocar por endpoint real quando o backend expor perfil estimado e análises.
export async function getProfiling(
  _casoId: string,
  suspect: ProfilingSuspect,
): Promise<ProfilingData> {
  const perfilEstimado: ProfileValues = { ...MOCK_ESTIMATED_PROFILE };

  const insights: ProfileInsight[] = PROFILE_AXES.flatMap((axis) => [
    {
      id: `${suspect.id}-suspeito-${axis.key}`,
      tipo: "suspeito" as const,
      eixo: axis.key,
      titulo: axis.label,
      texto: `Pontuação do suspeito neste eixo: ${suspect.perfil[axis.key]} de 100. A análise descritiva será fornecida pelo backend.`,
    },
    {
      id: `${suspect.id}-estimado-${axis.key}`,
      tipo: "estimado" as const,
      eixo: axis.key,
      titulo: axis.label,
      texto:
        "Perfil estimado ainda indisponível: os valores exibidos são dados de exemplo. A análise descritiva será fornecida pelo backend.",
    },
  ]);

  return { suspeito: suspect, perfilEstimado, insights };
}
