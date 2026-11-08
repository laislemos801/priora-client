import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getLastCase, setLastCase } from "@/lib/navigation";

/** Nomes já buscados nesta sessão, para a sidebar e a TopBar não piscarem ao trocar de aba. */
const cache = new Map<string, string>();

/**
 * Nome do caso pelo id. Mostra o valor em cache na hora e busca de novo em
 * segundo plano (o caso pode ter sido renomeado). Também registra o caso como
 * "último aberto" para o atalho da sidebar.
 */
export function useCaseName(caseId?: string): string | undefined {
  const [fetched, setFetched] = useState<{ id: string; name: string }>();

  useEffect(() => {
    if (!caseId) return;
    let alive = true;

    apiFetch(`/cases/${caseId}`)
      .then(async (res) => {
        if (res.status === 404) {
          // Caso apagado: some do atalho de "último caso"
          if (getLastCase()?.id === caseId) setLastCase(null);
          return "Caso não encontrado";
        }
        if (!res.ok) return undefined;
        const data = await res.json();
        return (data?.nome as string) || "Caso sem nome";
      })
      .then((name) => {
        if (!name) return;
        cache.set(caseId, name);
        if (name !== "Caso não encontrado") setLastCase({ id: caseId, name });
        if (alive) setFetched({ id: caseId, name });
      })
      .catch(() => {
        /* sem rede: mantém o nome em cache, se houver */
      });

    return () => {
      alive = false;
    };
  }, [caseId]);

  if (!caseId) return undefined;
  if (fetched?.id === caseId) return fetched.name;
  return cache.get(caseId);
}
