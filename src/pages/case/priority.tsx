import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Target, ListChecks } from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";
import { IoFilterSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import Panel from "@/components/caseOverview/Panel";
import ActionCard from "@/components/priority/ActionCard";
import FilterPanelPriority from "@/components/priority/FilterPanelPriority";
import DecisionMatrix from "@/components/priority/DecisionMatrix";
import StrategyGauge from "@/components/priority/StrategyGauge";
import { DEFAULT_PRIORITY_FILTERS } from "@/components/priority/types";
import type { ActionStatus, InvestigativeAction, PriorityFilters } from "@/components/priority/types";
import { apiFetch } from "@/lib/api";

export default function Priority() {
  const { id: casoId } = useParams();

  const [actions, setActions] = useState<InvestigativeAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<PriorityFilters>(DEFAULT_PRIORITY_FILTERS);

  const fetchActions = useCallback(async () => {
    if (!casoId) return;
    try {
      setLoading(true);
      const res = await apiFetch(`/priority-actions/case/${casoId}`);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const data = await res.json();
      setActions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setActions([]);
    } finally {
      setLoading(false);
    }
  }, [casoId]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  const filtered = actions.filter((a) => {
    if (filters.status.length > 0 && !filters.status.includes(a.status)) return false;
    if (filters.impacto.length > 0 && !filters.impacto.includes(a.impacto)) return false;
    return true;
  });

  const filterCount = filters.status.length + filters.impacto.length;

  async function handleChangeStatus(id: string, status: ActionStatus) {
    const previous = actions;
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

    try {
      const res = await apiFetch(`/priority-actions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar status da ação.");
      setActions(previous);
    }
  }

  // ativas = ainda relevantes para a estratégia (exclui descartadas/concluídas)
  const activeForGauge = actions.filter((a) => a.status === "Sugerida" || a.status === "Em progresso");
  const importancia = activeForGauge.length
    ? Math.round(activeForGauge.reduce((sum, a) => sum + a.metricaValor, 0) / activeForGauge.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="flex-1 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <div className="rounded-xl border border-[#575757] bg-[#242424]">

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 border-b border-[#575757]">
            <div className="flex items-center gap-2.5">
              <Target size={18} className="text-emerald-400" />
              <span className="text-slate-100 font-semibold text-base md:text-lg">
                Priorização de Ações investigativas
              </span>
            </div>

            <div className="relative w-full md:w-auto">
              <ActionButton
                icon={<IoFilterSharp size={14} />}
                onClick={() => setOpenFilter((p) => !p)}
                className={`w-full ${filterCount > 0 ? "border-[#139C73]/60 text-[#139C73] bg-[#139C73]/10" : ""}`}
              >
                Filtrar
                {filterCount > 0 && (
                  <span className="ml-1 bg-[#139C73] text-white text-[10px] rounded-full w-4 h-4 inline-flex items-center justify-center font-bold">
                    {filterCount}
                  </span>
                )}
              </ActionButton>

              {openFilter && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setOpenFilter(false)} />
                  <FilterPanelPriority
                    onClose={() => setOpenFilter(false)}
                    initialFilters={filters}
                    onApply={(f) => { setFilters(f); setOpenFilter(false); }}
                    onClear={() => setFilters(DEFAULT_PRIORITY_FILTERS)}
                  />
                </>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="grid gap-6 p-6 xl:grid-cols-[1fr_320px]">
            <section className="flex flex-col space-y-4">
              {loading ? (
                <p className="text-sm text-white/50 p-6">Calculando ganho de informação...</p>
              ) : filtered.length === 0 ? (
                <div className="flex flex-1 min-h-[400px] w-full flex-col items-center justify-center text-center">
                  <ListChecks size={90} className="text-white/10" />
                  <h2 className="mt-6 text-2xl font-medium text-white/60">
                    {actions.length === 0 ? "Nenhuma ação sugerida no momento." : "Nenhuma ação encontrada."}
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-white/35">
                    {actions.length === 0
                      ? "O sistema sugere ações automaticamente a partir de evidências pendentes de confirmação e de suspeitos que mais contribuem para a incerteza do caso."
                      : "Ajuste os filtros para ver outras ações."}
                  </p>
                </div>
              ) : (
                filtered.map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    onChangeStatus={(status) => handleChangeStatus(action.id, status)}
                  />
                ))
              )}
            </section>

            <aside className="space-y-4">
              <Panel title="Matriz de decisão: Esforço vs Recompensa">
                <DecisionMatrix actions={filtered} />
              </Panel>

              <Panel title="Resumo de estratégia">
                <StrategyGauge
                  importancia={importancia}
                  resumo="A recompensa de cada ação é o ganho de informação esperado (redução de entropia de Shannon) sobre o ranking de suspeitos. O esforço é uma estimativa operacional, não probabilística."
                />
              </Panel>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
