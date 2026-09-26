import {
  PROFILE_AXES,
  type EstimatedProfile,
  type ProfileAxisKey,
  type ProfileValues,
  type ProfilingSuspect,
} from "@/components/profiling/types";
import type { Suspect } from "@/components/suspect/types";
import { apiFetch } from "@/lib/api";

// Mesmo neutro usado pelo backend para eixo sem valor
// (priora-server/app/repositories/bayes_repository.py).
const NEUTRAL_SCORE = 50;

type RawSuspect = Suspect & Partial<Record<ProfileAxisKey, number | string | null>>;

type RawEstimatedProfile = {
  perfil?: Partial<Record<ProfileAxisKey, number | string | null>> | null;
  atualizadoEm?: string | null;
};

// Eixo nulo/inválido assume o neutro do backend.
function toScore(value: unknown): number {
  if (value == null || value === "") return NEUTRAL_SCORE;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : NEUTRAL_SCORE;
}

function toProfileValues(
  raw: Partial<Record<ProfileAxisKey, unknown>>,
): ProfileValues {
  return PROFILE_AXES.reduce((acc, axis) => {
    acc[axis.key] = toScore(raw[axis.key]);
    return acc;
  }, {} as ProfileValues);
}

export async function getProfilingSuspects(
  casoId: string,
): Promise<ProfilingSuspect[]> {
  const response = await apiFetch(
    `/suspects/case/${encodeURIComponent(casoId)}`,
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
      origem: item,
    }));
}

function toEstimatedProfile(raw: RawEstimatedProfile | null): EstimatedProfile {
  return {
    perfil: raw?.perfil ? toProfileValues(raw.perfil) : null,
    atualizadoEm: raw?.atualizadoEm ?? null,
  };
}

export async function getEstimatedProfile(
  casoId: string,
): Promise<EstimatedProfile> {
  const response = await apiFetch(
    `/cases/${encodeURIComponent(casoId)}/estimated-profile`,
  );

  if (!response.ok) {
    throw new Error(`Erro ao carregar perfil estimado (${response.status})`);
  }

  return toEstimatedProfile(await response.json());
}

export async function saveEstimatedProfile(
  casoId: string,
  values: ProfileValues,
): Promise<EstimatedProfile> {
  const response = await apiFetch(
    `/cases/${encodeURIComponent(casoId)}/estimated-profile`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    },
  );

  if (!response.ok) {
    throw new Error(`Erro ao salvar perfil estimado (${response.status})`);
  }

  return toEstimatedProfile(await response.json());
}
