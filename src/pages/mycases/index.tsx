import TopBar from "../../components/ui/topbar";
import CasesSection from "../../components/mycases/casesBoard";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function Home() {
  return (
    <div className="bg-[#1D1D1D] min-h-screen text-white flex flex-col">
      <TopBar />

      {/* Área abaixo da topbar */}
      <div className="flex-1 p-4 md:p-6">
        
        {/* Div dos casos ocupando toda altura */}
        <div className="h-full border border-[#575757] rounded-md p-4">
            {/* Header */}
            <div className="flex items-center -mx-4 px-4 pb-3 mb-4 border-b border-[#575757] justify-between">
                <h2 className="md:text-lg text-2xl font-sans font-normal">Meus casos</h2>
                <PrimaryButton>Criar Novo Caso </PrimaryButton>
            </div>
            <CasesSection />
        </div>

      </div>
    </div>
  );
}