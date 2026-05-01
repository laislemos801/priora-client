import { FiSearch } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import CaseCard from "./Casescard";
import { TbHelp } from "react-icons/tb";
import { FaRegFolderOpen } from "react-icons/fa";
import { MdOutlineBrokenImage } from "react-icons/md";
import { useState } from "react";

export default function CasesSection() {

    const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="h-full rounded-md p-4 flex flex-col gap-4">

        {/* Grid principal */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
            
            {/* LEFT */}
            <div className="lg:col-span-3 flex flex-col gap-4">

                {/* Filtros */}
                <div className="flex items-center gap-3">
                    
                    {/* Input */}
                    <div className="flex items-center gap-2 border border-[#525252] rounded-md px-3 py-2 w-full">
                        <FiSearch className="text-[#FFFFFF]/65" />
                        <input
                            type="text"
                            placeholder="Procurar"
                            className="bg-transparent outline-none text-sm w-full font-medium text-[#FFFFFF]/48"
                        />
                    </div>

                    {/* Botão */}
                    <button className="flex items-center gap-2 bg-[#2A2A2A] border border-[#444] px-4 py-2 rounded-md text-sm hover:bg-[#333] transition">
                        <MdFilterList className="text-white/65" />
                        Filtrar
                    </button>
                </div>

                {/* Grid de cards */}
                <div className=" grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    
                    <CaseCard
                        title="Caso Alpha"
                        description="Furto em supermercado."
                        status="Ativo"
                        detectiveName="Elvin Bond"
                        detectiveImage="../../../elvinBond.svg"
                        confidence={81.5}
                        priority="Média"
                        suspects={8}
                        evidences={38}
                        responsible="Carlos Mendonça"
                        location="Campinas, São Paulo"
                        date="24/05/2025"
                        uncertainty={14.1}
                    />
                     <CaseCard
                        title="Caso Alpha"
                        description="Furto em supermercado."
                        status="Ativo"
                        detectiveName="Elvin Bond"
                        detectiveImage="../../../elvinBond.svg"
                        confidence={81.5}
                        priority="Média"
                        suspects={8}
                        evidences={38}
                        responsible="Carlos Mendonça"
                        location="Campinas, São Paulo"
                        date="24/05/2025"
                        uncertainty={14.1}
                    />
                     <CaseCard
                        title="Caso Alpha"
                        description="Furto em supermercado."
                        status="Ativo"
                        detectiveName="Elvin Bond"
                        detectiveImage="../../../elvinBond.svg"
                        confidence={81.5}
                        priority="Média"
                        suspects={8}
                        evidences={38}
                        responsible="Carlos Mendonça"
                        location="Campinas, São Paulo"
                        date="24/05/2025"
                        uncertainty={14.1}
                    />
                     <CaseCard
                        title="Caso Alpha"
                        description="Furto em supermercado."
                        status="Ativo"
                        detectiveName="Elvin Bond"
                        detectiveImage="../../../elvinBond.svg"
                        confidence={81.5}
                        priority="Média"
                        suspects={8}
                        evidences={38}
                        responsible="Carlos Mendonça"
                        location="Campinas, São Paulo"
                        date="24/05/2025"
                        uncertainty={14.1}
                    />
                      <CaseCard
                        title="Caso Alpha"
                        description="Furto em supermercado."
                        status="Ativo"
                        detectiveName="Elvin Bond"
                        detectiveImage="../../../elvinBond.svg"
                        confidence={81.5}
                        priority="Média"
                        suspects={8}
                        evidences={38}
                        responsible="Carlos Mendonça"
                        location="Campinas, São Paulo"
                        date="24/05/2025"
                        uncertainty={14.1}
                    />
                      <CaseCard
                        title="Caso Alpha"
                        description="Furto em supermercado."
                        status="Ativo"
                        detectiveName="Elvin Bond"
                        detectiveImage="../../../elvinBond.svg"
                        confidence={81.5}
                        priority="Média"
                        suspects={8}
                        evidences={38}
                        responsible="Carlos Mendonça"
                        location="Campinas, São Paulo"
                        date="24/05/2025"
                        uncertainty={14.1}
                    />


                </div>

            </div>

            {/* RIGHT - sidebar */}
            <div className="flex flex-col gap-4">
            
                <div className="bg-[#2A2A2A] p-6 rounded-xl border border-[#3a3a3a] relative">

                    <p className="text-sm text-white">Total de casos ativos:</p>
                    <h3 className="text-4xl md:text-6xl font-bold mt-2">10</h3>

                    <FaRegFolderOpen className="absolute bottom-3 right-3 text-[#139C73]/48 text-4xl md:text-6xl" />
                </div>

                <div className="bg-[#2A2A2A] p-6 rounded-xl border border-[#3a3a3a] relative">
      
                    {/* HELP ICON */}
                    <TbHelp
                        className="absolute top-3 right-3 text-gray-400 md:text-lg text-xl cursor-pointer"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    />

                    {/* TOOLTIP */}
                    {showTooltip && (
                        <div className="absolute top-10 right-3 bg-[#1f1f1f] text-white text-xs p-2 rounded-md shadow-lg w-48 z-50">
                        Esse valor representa a média de incerteza dos casos ativos no sistema.
                        </div>
                    )}

                    <p className="text-sm text-white">Incerteza média:</p>
                    <h3 className="text-4xl md:text-6xl font-bold mt-2">7,41%</h3>

                    <MdOutlineBrokenImage className="absolute bottom-3 right-3 text-[#139C73]/48 text-4xl md:text-6xl" />
                </div>

                <div className="bg-[#2A2A2A] flex-col justify-start items-start p-4 rounded-xl border border-[#3a3a3a] h-40 flex text-gray-500 text-sm">
                    <p className="text-sm text-white">Prioridade de Casos Ativos:</p>
                    Gráfico aqui
                </div>

                <div className="bg-[#2A2A2A] p-4 rounded-xl border border-[#3a3a3a] h-40 flex-col ustify-start items-start text-gray-500 text-sm">
                    <p className="text-sm text-white">Evolução da Incerteza Média:</p>
                    Gráfico aqui
                </div>
            </div>

        </div>
    </div>
  );
}