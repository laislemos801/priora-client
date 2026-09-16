import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export type CaseRole = "Responsavel" | "Editor" | "Leitor" | null;

type AccessEntry = {
  usuario: { id: string };
  papel: "Editor" | "Leitor";
  status: "Ativo" | "Pendente";
  tipo: "Responsavel" | "Colaborador";
};

/**
 * Descobre o papel do usuário logado no caso `casoId` e deriva as
 * permissões de UI a partir dele. Espelha as regras do backend
 * (app/core/authorization.py): Leitor só pode visualizar; Editor e
 * Responsavel podem criar/editar/excluir; só o Responsavel gerencia
 * colaboradores e exclui o caso.
 */
export function useCaseRole(casoId?: string) {
  const [role, setRole] = useState<CaseRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!casoId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    apiFetch(`/access/case/${casoId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erro ao carregar acesso"))))
      .then((data: AccessEntry[]) => {
        if (!active) return;

        const mine = Array.isArray(data)
          ? data.find((a) => a.usuario?.id === currentUser.id)
          : undefined;

        if (!mine) {
          setRole(null);
        } else if (mine.tipo === "Responsavel") {
          setRole("Responsavel");
        } else {
          setRole(mine.papel);
        }
      })
      .catch(() => {
        if (active) setRole(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [casoId]);

  const isOwner = role === "Responsavel";
  const canEdit = role === "Responsavel" || role === "Editor";

  return { role, isOwner, canEdit, loading };
}
