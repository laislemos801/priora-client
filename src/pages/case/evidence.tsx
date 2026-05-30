import { Search, Edit, Trash2 } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import EvidenciasTable from "@/components/evidence/table_evidence";
import ActionButton from "@/components/ui/ActionButton";
import { IoFilterSharp } from "react-icons/io5";
import CreateEvidenceModal from "@/components/evidence/CreateEvidenceModal";
import { useState } from "react";
import FilterPanelEvidence from "@/components/evidence/Filter_evidence";
import toast from "react-hot-toast";
import type { EvidenceForEdit } from "@/components/evidence/CreateEvidenceModal";

export type EvidenceFilters = {
  search: string;
  date: string;
  status: string[];
  tipo: string[];
  suspeitos: string[];
};

const DEFAULT_FILTERS: EvidenceFilters = {
  search: "",
  date: "",
  status: [],
  tipo: [],
  suspeitos: [],
};

export default function Evidence() {
  const [openModal, setOpenModal]         = useState(false);
  const [openFilter, setOpenFilter]       = useState(false);
  const [filters, setFilters]             = useState<EvidenceFilters>(DEFAULT_FILTERS);
  const [refreshKey, setRefreshKey]       = useState(0);
  const [selectedIds, setSelectedIds]     = useState<string[]>([]);
  const [editingEvidence, setEditingEvidence] = useState<EvidenceForEdit | null>(null);

  const filterCount =
    filters.status.length +
    filters.tipo.length +
    filters.suspeitos.length +
    (filters.search ? 1 : 0) +
    (filters.date ? 1 : 0);

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("Selecione ao menos uma evidência.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/evidences/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!response.ok) throw new Error("Erro ao excluir evidências.");
      toast.success(
        selectedIds.length > 1
          ? "Evidências excluídas com sucesso!"
          : "Evidência excluída com sucesso!"
      );
      setSelectedIds([]);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro ao excluir evidências.");
    }
  };

  const handleEdit = () => {
    if (selectedIds.length !== 1) {
      toast.error("Selecione exatamente uma evidência para editar.");
      return;
    }
    setEditingEvidence(null); // desmonta o modal antes de remontar com dados frescos
    fetch(`http://localhost:8000/evidences/${selectedIds[0]}`)
      .then((r) => r.json())
      .then((data) => setEditingEvidence(data))
      .catch(() => toast.error("Não foi possível carregar a evidência."));
  };

  return (
    <div className="flex min-h-screen bg-[#242424] flex-col overflow-hidden">
      <div className="flex-1 p-4 md:p-6">
        <div className="rounded-xl border border-[#575757] bg-[#242424] overflow-y">

          {/* ── Toolbar ── */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 py-4 border-b border-[#575757]">

            <div className="flex items-center gap-2.5">
              <Search size={16} className="text-emerald-400" />
              <span className="text-slate-100 font-semibold text-base md:text-lg">
                Evidências
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <PrimaryButton onClick={() => setOpenModal(true)}>
                Adicionar Evidências
              </PrimaryButton>

              {/* Filtrar */}
              <div className="relative w-full md:w-auto">
                <ActionButton
                  icon={<IoFilterSharp size={14} />}
                  onClick={() => setOpenFilter((prev) => !prev)}
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
                    <div
                      className="fixed inset-0 z-40 bg-black/50 md:hidden"
                      onClick={() => setOpenFilter(false)}
                    />
                    <FilterPanelEvidence
                      onClose={() => setOpenFilter(false)}
                      initialFilters={filters}
                      onApply={(f) => { setFilters(f); setOpenFilter(false); }}
                      onClear={() => setFilters(DEFAULT_FILTERS)}
                    />
                  </>
                )}
              </div>

              {/* Editar */}
              <ActionButton icon={<Edit size={14} />} onClick={handleEdit}>
                Editar
              </ActionButton>

              {/* Deletar */}
              <ActionButton
                variant="danger"
                icon={<Trash2 size={14} />}
                onClick={handleDelete}
              >
                {selectedIds.length > 0 ? `Deletar (${selectedIds.length})` : "Deletar"}
              </ActionButton>
            </div>
          </div>

          {/* ── Modais ── */}
          {openModal && (
            <CreateEvidenceModal
              onClose={() => setOpenModal(false)}
              onSuccess={() => setRefreshKey((k) => k + 1)}
            />
          )}

          {editingEvidence && (
            <CreateEvidenceModal
              evidence={editingEvidence}
              onClose={() => setEditingEvidence(null)}
              onSuccess={() => { setRefreshKey((k) => k + 1); setSelectedIds([]);       setEditingEvidence(null); }}
            />
          )}

          {/* ── Table ── */}
          <EvidenciasTable
            filters={filters}
            refreshKey={refreshKey}
            onSelectionChange={setSelectedIds}
          />
        </div>
      </div>
    </div>
  );
}