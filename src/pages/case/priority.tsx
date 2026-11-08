import ActionCardSkeleton from "@/components/priority/ActionCardSkeleton";
import NavIcon from "@/components/ui/NavIcon";
import EmptyState, { PAGE_CARD_FILL } from "@/components/ui/EmptyState";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ListChecks } from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";
import { IoFilterSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import Panel from "@/components/caseOverview/Panel";
import InfoTip from "@/components/ui/InfoTip";
import ActionCard from "@/components/priority/ActionCard";
import FilterPanelPriority from "@/components/priority/FilterPanelPriority";
import DecisionMatrix from "@/components/priority/DecisionMatrix";
import StrategyGauge from "@/components/priority/StrategyGauge";
import { DEFAULT_PRIORITY_FILTERS } from "@/components/priority/types";
import type {
  ActionStatus,
  ActionTypeInfo,
  InvestigativeAction,
  PriorityFilters,
} from "@/components/priority/types";
import { apiFetch } from "@/lib/api";

export default function Priority() {
  const { id: casoId } = useParams();

  const [actions, setActions] = useState<InvestigativeAction[]>([]);
  const [typeInfo, setTypeInfo] = useState<Record<string, ActionTypeInfo>>({});
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

  // Explicação de cada tipo de sugestão (quando aparece, quando some, recompensa e esforço).
  useEffect(() => {
    apiFetch("/priority-actions/types")
      .then((res) => (res.ok ? res.json() : []))
      .then((list: ActionTypeInfo[]) =>
        setTypeInfo(Object.fromEntries(list.map((t) => [t.tipo, t])))
      )
      .catch(() => {});
  }, []);

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

  async function handleDelete(id: string) {
    const previous = actions;
    setActions((prev) => prev.filter((a) => a.id !== id));

    try {
      const res = await apiFetch(`/priority-actions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      toast.success("Ação excluída.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir a ação.");
      setActions(previous);
    }
  }

  // ativas = ainda relevantes para a estratégia (exclui descartadas/concluídas)
  const activeForGauge = actions.filter((a) => a.status === "Sugerida" || a.status === "Em progresso");
  const importancia = activeForGauge.length
    ? Math.round(activeForGauge.reduce((sum, a) => sum + a.metricaValor, 0) / activeForGauge.length)
    : 0;

  return (
    <div className="min-h-full bg-[#242424]">
      <div className="flex-1 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <div className={`rounded-xl border border-[#575757] bg-[#242424] ${PAGE_CARD_FILL}`}>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 border-b border-[#575757]">
            <div className="flex items-center gap-2.5">
              <NavIcon name="priority" className="text-emerald-400" />
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
          <div className="grid flex-1 gap-6 p-6 xl:grid-cols-[1fr_320px]">
            <section className="flex flex-col space-y-4">
              {loading ? (
                <ActionCardSkeleton />
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={<ListChecks />}
                  title={actions.length === 0 ? "Nenhuma ação sugerida no momento" : "Nenhuma ação encontrada"}
                  description={
                    actions.length === 0
                      ? "O sistema sugere ações automaticamente a partir das evidências, dos suspeitos e da incerteza do caso (por exemplo, evidências a processar, suspeitos sem vínculos ou dois suspeitos empatados)."
                      : "Ajuste os filtros para ver outras ações."
                  }
                />
              ) : (
                filtered.map((action) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    typeInfo={typeInfo[action.tipo]}
                    onChangeStatus={(status) => handleChangeStatus(action.id, status)}
                    onDelete={() => handleDelete(action.id)}
                  />
                ))
              )}
            </section>

            <aside className="space-y-4">
              <Panel
                title="Matriz de decisão: Esforço vs Recompensa"
                action={
                  <InfoTip label="Como ler a matriz de decisão">
                    <p className="mb-1 font-semibold text-white">Como ler a matriz</p>
                    Cada ponto é uma ação sugerida, numerada como nos cards. Quanto mais para cima, maior a
                    recompensa (ganho de informação); quanto mais para a direita, maior o esforço. As ações
                    do quadrante superior esquerdo rendem mais com menos esforço.
                  </InfoTip>
                }
              >
                <DecisionMatrix actions={filtered} />
              </Panel>

              <Panel
                title="Resumo de estratégia"
                action={
                  <InfoTip label="Como funciona o resumo de estratégia">
                    <p className="mb-1 font-semibold text-white">Resumo de estratégia</p>
                    <p>
                      A recompensa de cada ação é o ganho de informação esperado (redução de entropia de
                      Shannon) sobre o ranking de suspeitos. O esforço é uma estimativa operacional, não
                      probabilística.
                    </p>
                    <p className="mt-2">
                      A <strong>importância</strong> é a média do ganho de informação das ações ainda ativas
                      (sugeridas ou em progresso): quanto maior, mais as ações pendentes podem reduzir a
                      incerteza do caso.
                    </p>
                  </InfoTip>
                }
              >
                <StrategyGauge importancia={importancia} />
              </Panel>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
