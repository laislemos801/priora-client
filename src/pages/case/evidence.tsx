import { Search, Pencil, Trash2 } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import EvidenciasTable from "@/components/evidence/table_evidence";
import ActionButton from "@/components/ui/ActionButton";
import { IoFilterSharp } from "react-icons/io5";
import CreateEvidenceModal from "@/components/evidence/CreateEvidenceModal";
import { useState } from "react";
import FilterPanelEvidence from "@/components/evidence/Filter_evidence";

export default function Evidence() {
  const [openModal, setOpenModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#242424] flex-col overflow-hidden">

      {/* Conteúdo */}
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

              <div className="relative w-full md:w-auto">
                <ActionButton
                  icon={<IoFilterSharp size={14} />}
                  onClick={() => setOpenFilter((prev) => !prev)}
                  className="w-full"
                >
                  Filtrar
                </ActionButton>

                {openFilter && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/50 md:hidden"
                      onClick={() => setOpenFilter(false)}
                    />
                    <FilterPanelEvidence onClose={() => setOpenFilter(false)} />
                  </>
                )}
              </div>

              <ActionButton icon={<Pencil size={14} />}>
                Editar
              </ActionButton>

              <ActionButton variant="danger" icon={<Trash2 size={14} />}>
                Deletar
              </ActionButton>
            </div>

            {/* MODAL */}
            {openModal && (
              <CreateEvidenceModal onClose={() => setOpenModal(false)} />
            )}
          </div>

          {/* ── Table ── */}
          <EvidenciasTable />
        </div>
      </div>

    </div>
  );
}