import { FiUser, FiChevronLeft } from "react-icons/fi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NotificationButton from "./NotificationButton";
import { useEffect, useState } from "react";

export default function TopBar() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [caseName, setCaseName] = useState<string | undefined>(undefined);

  
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/cases/${id}`)
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
      default:
        return null; 
    }
  };

  const label = getCurrentLabel(); 

  
  return (
    <header className="w-full h-16 flex items-center bg-[#242424] justify-between px-4 md:px-8">

      {/* LEFT */}
      <div className="flex items-center gap-1 md:gap-3 text-[#D9D9D9]">

        {/* Botão voltar */}
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-[#363636] rounded-full">
          <FiChevronLeft size={18} />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">

            <button
                onClick={() => navigate("/mycases")}
                className="hover:underline">
                Meus casos
            </button>

            <span>/</span>

              <button onClick={() => navigate(`/case/${id}`)}>
                  {caseName === undefined
                    ? <span className="w-24 h-3 bg-[#363636] rounded animate-pulse inline-block" />
                    : caseName ?? `Caso -`
                  }
              </button>

            {label && (
                <>
                <span>/</span>
                <span className="text-white font-medium">
                    {label}
                </span>
                </>
            )}

        </div>
      </div>

      {/* RIGHT */}
       <div className="flex items-center gap-1 md:gap-3 text-[#D9D9D9]">
        <NotificationButton />

        <button className="p-1.5 md:p-2 bg-[#363636] rounded-full hover:bg-[#4a4a4a]">
          <FiUser size={16} className="md:hidden" />
          <FiUser size={20} className="hidden md:block" />
        </button>
      </div>

    </header>
  );
}