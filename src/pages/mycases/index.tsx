import CasesSection from "@/components/mycases/Casesboard";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useState } from "react";
import { FiFolder } from "react-icons/fi";
import CreateCaseModal from "@/components/mycases/CreateCaseModal";
import { PAGE_CARD_FILL } from "@/components/ui/EmptyState";

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-full px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
      {/* Mesmo cartão de página das telas do caso */}
      <div className={`rounded-xl border border-[#575757] bg-[#242424] ${PAGE_CARD_FILL}`}>
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#575757] px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <FiFolder size={18} className="text-emerald-400" />
            <h1 className="text-lg font-semibold text-slate-100">Meus casos</h1>
          </div>

          <PrimaryButton onClick={() => setOpenModal(true)}>Criar Novo Caso</PrimaryButton>
        </header>

        <div className="flex-1 p-4">
          <CasesSection key={refreshKey} onCreateCase={() => setOpenModal(true)} />
        </div>
      </div>

      {openModal && (
        <CreateCaseModal
          onClose={() => setOpenModal(false)}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
        />
      )}
    </div>
  );
}
