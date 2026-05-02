import { Search, Pencil, Trash2 } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import EvidenciasTable from "@/components/evidence/table_evidence";
import ActionButton from "@/components/ui/ActionButton";
import { IoFilterSharp } from "react-icons/io5";

export default function Evidence() {

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

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <PrimaryButton>
                Adicionar Evidências
              </PrimaryButton>

              <ActionButton icon={<IoFilterSharp size={14} />}>
                Filtrar
              </ActionButton>

              <ActionButton icon={<Pencil size={14} />}>
                Editar
              </ActionButton>

              <ActionButton variant="danger" icon={<Trash2 size={14} />}>
                Deletar
              </ActionButton>
            </div>
          </div>

          {/* ── Table ── */}
          <EvidenciasTable />
        </div>
      </div>
    </div>
  );
}