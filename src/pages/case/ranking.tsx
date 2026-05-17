import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { IoFilterSharp } from "react-icons/io5";

import PrimaryButton from "@/components/ui/PrimaryButton";
import ActionButton from "@/components/ui/ActionButton";

import BarIcon from "@/components/suspect/BarIcon";
import RankingTable from "@/components/suspect/RankingTable";
import SuspectModal from "@/components/suspect/SuspectModal";
import EmptySuspectState from "@/components/suspect/EmptySuspectState";
import FilterPanelRanking from "@/components/suspect/Filter_suspect";

import type {
  RankingFilters,
  Suspect,
} from "@/components/suspect/types";

const API_URL = "http://127.0.0.1:8000";

const DEFAULT_FILTERS: RankingFilters = {
  search: "",
  minEvidences: "",
  suspects: [],
};

export default function Ranking() {
  const { id } = useParams();

  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] =
    useState<RankingFilters>(DEFAULT_FILTERS);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingSuspect, setEditingSuspect] =
    useState<Suspect | null>(null);

  async function fetchSuspects() {
    if (!id) return;

    try {
      const response = await fetch(
        `${API_URL}/suspects/case/${id}`
      );

      const data = await response.json();
      setSuspects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setSuspects([]);
    }
  }

  useEffect(() => {
    fetchSuspects();
  }, [id]);

  const filtered = suspects.filter((s) => {
    const searchText = filters.search.trim();

    if (
      searchText &&
      !s.nome.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.minEvidences &&
      (s.qtdEvidencias ?? 0) < Number(filters.minEvidences)
    ) {
      return false;
    }

    if (
      filters.suspects.length > 0 &&
      !filters.suspects.includes(s.id)
    ) {
      return false;
    }

    return true;
  });

  const filterCount =
    (filters.search ? 1 : 0) +
    (filters.minEvidences ? 1 : 0) +
    filters.suspects.length;

  function toggleSelected(suspectId: string) {
    setSelectedIds((prev) =>
      prev.includes(suspectId)
        ? prev.filter((id) => id !== suspectId)
        : [...prev, suspectId]
    );
  }

  function toggleAllVisible() {
    const allVisibleSelected =
      filtered.length > 0 &&
      filtered.every((s) => selectedIds.includes(s.id));

    setSelectedIds(
      allVisibleSelected ? [] : filtered.map((s) => s.id)
    );
  }

  function openCreateModal() {
    setEditingSuspect(null);
    setModalOpen(true);
  }

  function handleEdit() {
    if (selectedIds.length !== 1) {
      alert("Selecione apenas um suspeito para editar.");
      return;
    }

    const suspect = suspects.find((s) => s.id === selectedIds[0]);
    if (!suspect) return;

    setEditingSuspect(suspect);
    setModalOpen(true);
  }

  async function handleDelete() {
    if (!id || selectedIds.length === 0) {
      alert("Selecione pelo menos um suspeito.");
      return;
    }

    const confirmed = confirm(
      "Deseja deletar os suspeitos selecionados?"
    );

    if (!confirmed) return;

    try {
      for (const suspectId of selectedIds) {
        await fetch(`${API_URL}/suspects/case/${id}/${suspectId}`, {
          method: "DELETE",
        });
      }

      setSelectedIds([]);
      fetchSuspects();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar suspeito.");
    }
  }

  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="flex-1 p-4 md:p-6">
        <div className="relative rounded-xl border border-[#575757] bg-[#242424]">
          <header className="flex flex-col gap-4 border-b border-[#575757] px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#139C73]">
                <BarIcon />
              </span>

              <h1 className="text-lg font-semibold text-white">
                Ranking de suspeitos
              </h1>
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <PrimaryButton onClick={openCreateModal}>
                  Adicionar Suspeito
                </PrimaryButton>

                <div className="relative w-full md:w-auto">
                  <ActionButton
                    icon={<IoFilterSharp size={14} />}
                    onClick={() =>
                      setOpenFilter((prev) => !prev)
                    }
                    className={`w-full ${
                      filterCount > 0
                        ? "border-[#139C73]/60 bg-[#139C73]/10 text-[#139C73]"
                        : ""
                    }`}
                  >
                    Filtrar

                    {filterCount > 0 && (
                      <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#139C73] text-[10px] font-bold text-white">
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

                      <FilterPanelRanking
                        initialFilters={filters}
                        onApply={(newFilters) => {
                          setFilters(newFilters);
                          setOpenFilter(false);
                          setSelectedIds([]);
                        }}
                        onClear={() => {
                          setFilters(DEFAULT_FILTERS);
                          setOpenFilter(false);
                          setSelectedIds([]);
                        }}
                      />
                    </>
                  )}
                </div>

                <ActionButton
                  icon={<Edit size={14} />}
                  onClick={handleEdit}
                >
                  Editar
                </ActionButton>

                <ActionButton
                  variant="danger"
                  icon={<Trash2 size={14} />}
                  onClick={handleDelete}
                >
                  {selectedIds.length > 0
                    ? `Deletar (${selectedIds.length})`
                    : "Deletar"}
                </ActionButton>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-6">
            {filtered.length === 0 ? (
              <EmptySuspectState onCreate={openCreateModal} />
            ) : (
              <RankingTable
                suspects={filtered}
                selectedIds={selectedIds}
                onToggleSelected={toggleSelected}
                onToggleAll={toggleAllVisible}
              />
            )}
          </main>
        </div>
      </div>

      {modalOpen && (
        <SuspectModal
          casoId={id!}
          mode={editingSuspect ? "edit" : "create"}
          suspect={editingSuspect}
          onClose={() => {
            setModalOpen(false);
            setEditingSuspect(null);
          }}
          onSuccess={() => {
            setModalOpen(false);
            setEditingSuspect(null);
            setSelectedIds([]);
            fetchSuspects();
          }}
        />
      )}
    </div>
  );
}