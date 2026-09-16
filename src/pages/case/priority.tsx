import { useState } from "react";
import { Target, ListChecks } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ActionButton from "@/components/ui/ActionButton";
import { IoFilterSharp } from "react-icons/io5";
import Panel from "@/components/caseOverview/Panel";
import ActionCard from "@/components/priority/ActionCard";
import ActionModal from "@/components/priority/ActionModal";
import FilterPanelPriority from "@/components/priority/FilterPanelPriority";
import DecisionMatrix from "@/components/priority/DecisionMatrix";
import StrategyGauge from "@/components/priority/StrategyGauge";
import { MOCK_ACTIONS } from "@/components/priority/mockActions";
import { DEFAULT_PRIORITY_FILTERS } from "@/components/priority/types";
import type { ActionStatus, InvestigativeAction, PriorityFilters } from "@/components/priority/types";

export default function Priority() {
  const [actions, setActions] = useState<InvestigativeAction[]>(MOCK_ACTIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<InvestigativeAction | null>(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<PriorityFilters>(DEFAULT_PRIORITY_FILTERS);

  const filtered = actions.filter((a) => {
    if (filters.status.length > 0 && !filters.status.includes(a.status)) return false;
    if (filters.impacto.length > 0 && !filters.impacto.includes(a.impacto)) return false;
    return true;
  });

  const filterCount = filters.status.length + filters.impacto.length;

  function openCreateModal() {
    setEditingAction(null);
    setModalOpen(true);
  }

  function openEditModal(action: InvestigativeAction) {
    setEditingAction(action);
    setModalOpen(true);
  }

  function handleSave(data: Omit<InvestigativeAction, "id"> & { id?: string }) {
    if (data.id) {
      setActions((prev) => prev.map((a) => (a.id === data.id ? { ...a, ...data, id: data.id! } : a)));
    } else {
      setActions((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
    }
  }

  function handleDelete(id: string) {
    const confirmed = confirm("Deseja excluir esta ação investigativa?");
    if (!confirmed) return;
    setActions((prev) => prev.filter((a) => a.id !== id));
  }

  function handleChangeStatus(id: string, status: ActionStatus) {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  // importância global da estratégia = ganho médio das ações em progresso/aprovação
  const importancia = actions.length
    ? Math.round(actions.reduce((sum, a) => sum + a.metricaValor, 0) / actions.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-xl border border-[#575757] bg-[#242424]">

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 border-b border-[#575757]">
            <div className="flex items-center gap-2.5">
              <Target size={18} className="text-emerald-400" />
              <span className="text-slate-100 font-semibold text-base md:text-lg">
                Priorização de Ações investigativas
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <PrimaryButton onClick={openCreateModal}>Adicionar Ação</PrimaryButton>

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
          </div>

          {/* Content */}
          <div className="grid gap-6 p-6 xl:grid-cols-[1fr_320px]">
            <section className="space-y-4">
              {filtered.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                  <ListChecks size={90} className="text-white/10" />
                  <h2 className="mt-6 text-2xl font-medium text-white/60">
                    {actions.length === 0 ? "Nenhuma ação cadastrada." : "Nenhuma ação encontrada."}
                  </h2>
                  <p className="mt-2 text-sm text-white/35">
                    {actions.length === 0
                      ? "Adicione ações investigativas para priorizar seus próximos passos."
                      : "Ajuste os filtros para ver outras ações."}
                  </p>
                  {actions.length === 0 && (
                    <div className="mt-6">
                      <PrimaryButton onClick={openCreateModal}>Adicionar Ação</PrimaryButton>
                    </div>
                  )}
                </div>
              ) : (
                filtered.map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    onEdit={() => openEditModal(action)}
                    onDelete={() => handleDelete(action.id)}
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
                  resumo="Priorize ações de alto ganho de informação e baixo esforço — elas reduzem a incerteza do caso mais rápido."
                />
              </Panel>
            </aside>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ActionModal
          action={editingAction ?? undefined}
          onClose={() => { setModalOpen(false); setEditingAction(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
