import TopBar from "../../components/ui/TopBar";
import CasesSection from "../../components/mycases/Casesboard";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { useState } from "react";
import CreateCaseModal from "../../components/mycases/CreateCaseModal";
import EmptyState from "../../components/mycases/EmptyState";

export default function Home() {
  const [openModal, setOpenModal] = useState(false);

  const cases: any[] = []; // mock ainda sem backend
  const hasCases = cases.length > 0;

  return (
    <div className="bg-[#1D1D1D] min-h-screen text-white flex flex-col">
      <TopBar />

      <div className="flex-1 p-4 md:p-6">
        <div className="h-full border border-[#575757] rounded-md p-4">

          {/* Header único */}
          <div className="flex items-center -mx-4 px-4 pb-3 mb-4 border-b border-[#575757] justify-between">
            <h2 className="md:text-lg text-2xl font-sans font-normal">
              Meus casos
            </h2>

            <PrimaryButton onClick={() => setOpenModal(true)}>
              Criar Novo Caso
            </PrimaryButton>
          </div>

          {/* EMPTY STATE desativado*/}
          {/* {hasCases ? (
            <CasesSection />
          ) : (
            <EmptyState onCreate={() => setOpenModal(true)} />
          )} */}

          <CasesSection />

        </div>
      </div>

      {/* MODAL */}
      {openModal && (
        <CreateCaseModal onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
}