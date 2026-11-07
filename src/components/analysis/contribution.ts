import type { Evidence } from "./types";

/** Nº de suspeitos ligados à evidência (fator de exclusividade = 1 / este número). */
export function linkedSuspects(ev: Evidence): number {
  return ev.suspectIds?.length || 1;
}

/**
 * Contribuição C = 1 + r × v × 1/|S| da evidência para este suspeito.
 * Vem pronta do backend (mesma função do motor bayesiano); o cálculo local é
 * só um reserva e usa o mesmo fator de exclusividade.
 */
export function contributionOf(ev: Evidence): number {
  return ev.contribuicao ?? 1 + ev.pesoFinal * (1 / linkedSuspects(ev));
}
