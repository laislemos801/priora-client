import { useNavigate } from "react-router-dom";
import { MdOutlineGroup } from "react-icons/md";
import { FaIdCardClip } from "react-icons/fa6";
import { PiMapPinAreaBold } from "react-icons/pi";
import { LuCalendarDays } from "react-icons/lu";
import { ArrowDown, Minus, ArrowUp } from "lucide-react";
import { RiAlertFill } from "react-icons/ri";

type CaseStatus = "Ativo" | "Arquivado" | "Concluído";
type CasePriority = "Baixa" | "Média" | "Alta" | "Crítica";

type CaseCardProps = {
  title: string;
  caseId: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  suspects: number;
  evidences: number;
  responsible: string;
  location: string;
  date: string;
  uncertainty: number;
  suspeitoNome: string | null;    
  suspeitoFotoUrl: string | null;  
  suspeitoProbab: number | null;
};

const PRIORITY_CONFIG: Record<
  CasePriority,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  Baixa: {
    icon: <ArrowDown size={15} />,
    color: "text-[#5b9cf6]",
    bg: "bg-[#5b9cf6]/10",
  },
  Média: {
    icon: <Minus size={15} />,
    color: "text-[#e0a030]",
    bg: "bg-[#e0a030]/10",
  },
  Alta: {
    icon: <ArrowUp size={15} />,
    color: "text-[#e05555]",
    bg: "bg-[#e05555]/10",
  },
  Crítica: {
    icon: <RiAlertFill size={15} />,
    color: "text-[#ff3b3b]",
    bg: "bg-[#ff3b3b]/10",
  },
};

export default function CaseCard({
  caseId,
  title,
  description,
  status,
  priority,
  suspects,
  evidences,
  responsible,
  location,
  date,
  uncertainty,
  suspeitoNome,
  suspeitoFotoUrl,
  suspeitoProbab,
}: CaseCardProps) {
  const p = PRIORITY_CONFIG[priority];
  const navigate = useNavigate();
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

      {/* Top suspeito */}
      <div className="flex items-center gap-3 border border-[#444] rounded-lg p-3">
        {suspeitoNome ? (
          <>
            {suspeitoFotoUrl ? (
              <img
                src={suspeitoFotoUrl}
                alt={suspeitoNome}
                className="h-8 w-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3A3A3A] text-xs font-semibold text-white">
                {suspeitoNome.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs text-white/50">Top suspeito</p>
              <p className="text-sm truncate">
                {suspeitoNome}{" "}
                <span className="text-green-400">({suspeitoProbab?.toFixed(1)}%)</span>
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-white/40 italic">Nenhum suspeito cadastrado ainda</p>
        )}
      </div>

      {/* Infos */}
      <div className="text-sm sm:text-sm md:text-lg text-gray-400 flex flex-col gap-2">

        {/* Prioridade */}
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${p.color} ${p.bg}`}>
            {p.icon}
            Prioridade {priority}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MdOutlineGroup className="text-green-400" />
          <span>{suspects} Suspeitos | {evidences} Evidências</span>
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
        <button   onClick={() => navigate(`/case/${caseId}`)} className="border border-[#525252] text-white px-3 md:px-6 lg:px-6 py-1.5 md:py-2 rounded-md text-xs md:text-sm hover:bg-green-500/10 hover:text-green hover:border-green-500 transition">
          Ver Detalhes
        </button>
      </div>

    </div>
  );
}
