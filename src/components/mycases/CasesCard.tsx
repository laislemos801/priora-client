import { MdPriorityHigh, MdOutlineGroup } from "react-icons/md";
import { FaIdCardClip } from "react-icons/fa6";
import { PiMapPinAreaBold } from "react-icons/pi";
import { LuCalendarDays } from "react-icons/lu";

type CaseStatus = "Ativo" | "Arquivado" | "Concluído";

type CaseCardProps = {
  title: string;
  description: string;
  status: CaseStatus;

  detectiveName: string;
  detectiveImage: string;
  confidence: number;

  priority: "Baixa" | "Média" | "Alta" | "Crítica";
  suspects: number;
  evidences: number;

  responsible: string;
  location: string;
  date: string;

  uncertainty: number;
};

export default function CaseCard({
  title,
  description,
  status,
  detectiveName,
  detectiveImage,
  confidence,
  priority,
  suspects,
  evidences,
  responsible,
  location,
  date,
  uncertainty,
}: CaseCardProps) {
  return (
    <div className="bg-[#2A2A2A] rounded-xl p-4 border border-[#3a3a3a] flex flex-col gap-3 w-full max-w-md">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="md:text-lg text-2xl font-semibold">{title}</h3>
          <p className="md:text-sm text-md text-gray-400">{description}</p>
        </div>

        <span className="text-md md:text-sm bg-[#139C73]/28 font-semibold text-[#FFFFFF]/76 px-4 py-2 rounded-md">
          {status}
        </span>
      </div>

      {/* Detective */}
      <div className="flex items-center gap-3 border border-[#444] rounded-lg p-4">
        <img
          src={detectiveImage}
          alt={detectiveName}
          className="w-8 h-8 rounded-full md:text-sm text-md font-medium"
        />
        <p className="md:text-sm text-md">
          {detectiveName}{" "}
          <span className="text-green-400">({confidence}%)</span>
        </p>
      </div>

        {/* Infos */}
        <div className="text-sm sm:text-sm md:text-lg text-gray-400 flex flex-col gap-2">
            
            <div className="flex items-center gap-2">
                <MdPriorityHigh className="text-yellow-500" />
                <span>Prioridade {priority}</span>
            </div>

            <div className="flex items-center gap-2">
                <MdOutlineGroup className="text-green-400" />
                <span>
                    {suspects} Suspeitos | {evidences} Evidências
                </span>
            </div>

            <div className="flex items-center gap-2">
                <FaIdCardClip />
                <span>Responsável: {responsible}</span>
            </div>

            <div className="flex items-center gap-2">
                <PiMapPinAreaBold />
                <span>{location}</span>
            </div>

            <div className="flex items-center gap-2">
                <LuCalendarDays />
                <span>{date}</span>
            </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2">

            <span className="bg-[#3a3a3a] px-4 md:px-6 lg:px-6 py-1.5 md:py-2 rounded-md text-xs md:text-sm lg:text-base font-medium">
                Incerteza: {uncertainty}%
            </span>

            <button className="border border-[#525252] text-white px-3 md:px-6 lg:px-6 py-1.5 md:py-2 rounded-md text-xs md:text-sm hover:bg-green-500/10 hover:text-green hover:border-green-500 transition">
                Ver Detalhes
            </button>

        </div>
    </div>
  );
}