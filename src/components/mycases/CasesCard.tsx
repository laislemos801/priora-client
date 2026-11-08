import { useNavigate } from "react-router-dom";
import { MdOutlineGroup } from "react-icons/md";
import { FaIdCardClip } from "react-icons/fa6";
import { PiMapPinAreaBold } from "react-icons/pi";
import { LuCalendarDays, LuSearch } from "react-icons/lu";
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
  const dot =
    status === "Ativo" ? "bg-[#139C73]" : status === "Concluído" ? "bg-[#8B8B8B]" : "bg-[#e0a030]";

  return (
    <div className="w-full max-w-sm">
      {/* Aba da pasta: situação do caso (e a prioridade, à direita) */}
      <div className="flex items-end justify-between gap-2">
        <span className="relative z-10 -mb-px inline-flex items-center gap-2 rounded-t-lg border border-b-0 border-[#3a3a3a] bg-[#2A2A2A] px-3.5 py-1.5 text-xs font-semibold text-white/80">
          <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
          {status}
        </span>
        <span
          className={`mb-1 flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${p.color} ${p.bg}`}
        >
          {p.icon}
          {priority}
        </span>
      </div>

      {/* Corpo da pasta */}
      <div className="flex flex-col gap-2.5 rounded-b-xl rounded-tr-xl border border-[#3a3a3a] bg-[#2A2A2A] p-3.5">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug" title={title}>
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 line-clamp-1 text-xs text-gray-400" title={description}>
              {description}
            </p>
          )}
        </div>

        {/* Top suspeito */}
        <div className="flex items-center gap-2.5 rounded-lg border border-[#444] px-2.5 py-2">
          {suspeitoNome ? (
            <>
              {suspeitoFotoUrl ? (
                <img
                  src={suspeitoFotoUrl}
                  alt={suspeitoNome}
                  className="h-7 w-7 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3A3A3A] text-[10px] font-semibold text-white">
                  {suspeitoNome.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-white/45">Top suspeito</p>
                <p className="truncate text-sm leading-tight">
                  {suspeitoNome}{" "}
                  <span className="text-green-400">({suspeitoProbab?.toFixed(1)}%)</span>
                </p>
              </div>
            </>
          ) : (
            <p className="text-xs italic text-white/40">Nenhum suspeito cadastrado ainda</p>
          )}
        </div>

        {/* Infos */}
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-gray-400">
          <li className="flex items-center gap-1.5">
            <MdOutlineGroup className="shrink-0 text-green-400" />
            <span className="truncate">{suspects} suspeitos</span>
          </li>
          <li className="flex items-center gap-1.5">
            <LuSearch className="shrink-0" />
            <span className="truncate">{evidences} evidências</span>
          </li>
          <li className="col-span-2 flex items-center gap-1.5" title={`Responsável: ${responsible}`}>
            <FaIdCardClip className="shrink-0" />
            <span className="truncate">{responsible}</span>
          </li>
          <li className="flex items-center gap-1.5" title={location}>
            <PiMapPinAreaBold className="shrink-0" />
            <span className="truncate">{location}</span>
          </li>
          <li className="flex items-center gap-1.5">
            <LuCalendarDays className="shrink-0" />
            <span className="truncate">{date}</span>
          </li>
        </ul>

        {/* Rodapé */}
        <div className="mt-0.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#3a3a3a] pt-2.5">
          <span className="whitespace-nowrap rounded-md bg-[#3a3a3a] px-2.5 py-1.5 text-xs font-medium">
            Incerteza {uncertainty}%
          </span>
          <button
            onClick={() => navigate(`/case/${caseId}`)}
            className="whitespace-nowrap rounded-md border border-[#525252] px-2.5 py-1.5 text-xs text-white transition hover:border-green-500 hover:bg-green-500/10"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
