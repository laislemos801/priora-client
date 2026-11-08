import { FiUser, FiChevronLeft, FiMenu } from "react-icons/fi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NotificationButton from "./NotificationButton";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type TopBarProps = {
  /** Abre o menu lateral (gaveta) no celular */
  onMenuClick?: () => void;
};

export default function TopBar({ onMenuClick }: TopBarProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [caseName, setCaseName] = useState<string | undefined>(undefined);


  useEffect(() => {
    if (!id) return;
    apiFetch(`/cases/${id}`)
      .then(res => res.json())
      .then(data => setCaseName(data.nome))
      .catch(() => setCaseName(undefined));
  }, [id]);

  // pega a aba atual pela URL
  const currentPath = location.pathname.split("/")[3];

  const getCurrentLabel = () => {
    switch (currentPath) {
      case "ranking":
        return "Ranking";
      case "evidence":
        return "Evidências";
      case "analysis":
        return "Análise";
      case "profiling":
        return "Perfilamento";
      case "priority":
        return "Priorização";
      case "evidenceBoard":
        return "Quadro investigativo";
      case "history":
        return "Histórico";
      case "export":
        return "Exportar";
      case "help":
        return "Ajuda";
      default:
        return null;
    }
  };

  const label = getCurrentLabel();

  return (
    <header className="w-full h-16 flex items-center bg-[#242424] justify-between gap-2 px-2 md:px-4">

      {/* LEFT */}
      <div className="flex items-center gap-1 md:gap-3 text-[#D9D9D9] min-w-0">

        {/* Menu (só no celular, onde a sidebar vira gaveta) */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            aria-label="Abrir menu"
            title="Menu"
            className="md:hidden p-2 hover:bg-[#363636] rounded-full shrink-0">
            <FiMenu size={18} />
          </button>
        )}

        {/* Botão voltar */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Voltar"
          className="p-2 hover:bg-[#363636] rounded-full shrink-0">
          <FiChevronLeft size={18} />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm min-w-0 whitespace-nowrap">

            <button
                onClick={() => navigate("/mycases")}
                className="hover:underline shrink-0 hidden sm:inline">
                Meus casos
            </button>

            <span className="hidden sm:inline">/</span>

              <button
                onClick={() => navigate(`/case/${id}`)}
                className="truncate min-w-0"
                title={caseName}>
                  {caseName === undefined
                    ? <span className="w-24 h-3 bg-[#363636] rounded animate-pulse inline-block" />
                    : caseName ?? `Caso -`
                  }
              </button>

            {label && (
                <>
                <span className="shrink-0">/</span>
                <span className="text-white font-medium truncate">
                    {label}
                </span>
                </>
            )}

        </div>
      </div>

      {/* RIGHT */}
       <div className="flex items-center gap-1 md:gap-3 text-[#D9D9D9] shrink-0">
        <NotificationButton />

        <button onClick={()=> navigate("/profile")} aria-label="Perfil" className="p-1.5 md:p-2 bg-[#363636] rounded-full hover:bg-[#4a4a4a]">
          <FiUser size={16} className="md:hidden" />
          <FiUser size={20} className="hidden md:block" />
        </button>
      </div>

    </header>
  );
}
