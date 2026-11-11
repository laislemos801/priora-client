import type { Evidence } from "./types";

/** Nº de suspeitos que a evidência incrimina (fator de exclusividade = 1 / este número). */
export function linkedSuspects(ev: Evidence): number {
  return ev.nIncriminados ?? (ev.suspectIds?.length || 1);
}

export function isExculpatory(ev: Evidence): boolean {
  return ev.efeito === "Inocenta";
}

/**
 * Contribuição da evidência para este suspeito:
 *   incrimina: C = 1 + r × v × 1/|S|   (C ≥ 1)
 *   inocenta:  C = 1 / (1 + r × v)     (C ≤ 1)
 * Vem pronta do backend (mesma função do motor bayesiano); o cálculo local é só um reserva.
 */
export function contributionOf(ev: Evidence): number {
  if (ev.contribuicao != null) return ev.contribuicao;
  return isExculpatory(ev) ? 1 / (1 + ev.pesoFinal) : 1 + ev.pesoFinal * (1 / linkedSuspects(ev));
}
