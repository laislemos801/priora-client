import { useState, useEffect } from "react";
import logoHorizon from "@/assets/logoHorizonSideBar.png";
import logoMobile from "@/assets/logoAlone.png";
import { useNavigate, useLocation } from "react-router-dom";

// ─── Icons ───────────────────────────────────────────────────────────────────

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  ranking: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  evidence: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  analysis: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 4-4" />
    </svg>
  ),
  profiling: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      <line x1="18" y1="8" x2="22" y2="8" /><line x1="20" y1="6" x2="20" y2="10" />
    </svg>
  ),
  priority: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  board: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="9" x2="9" y2="21" />
    </svg>
  ),
  history: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  export: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  help: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  collapse: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  ),
};

// ─── Types ───────────────────────────────────────────────────────────────────

type NavItem = {
  id: string;
  label: string;
  icon: keyof typeof icons;
  path: string;
};

export type SidebarProps = {
  activeItem?: string;
  onNavigate?: (id: string) => void;
  onLogout?: () => void;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Verifica se `pathname` é igual a `fullPath` ou uma sub-rota dele
 * (ex: /case/123/evidence/detalhe). Evita o bug de startsWith puro, onde
 * "/evidenceBoard" seria falsamente considerado ativo para o item
 * "evidence", já que "/evidenceBoard".startsWith("/evidence") === true.
 */
function isRouteActive(pathname: string, fullPath: string): boolean {
  return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
}

// ─── Nav config ──────────────────────────────────────────────────────────────

const NAV_MAIN: NavItem[] = [
  { id: "dashboard", label: "Painel do caso", icon: "dashboard", path: "" },
  { id: "ranking", label: "Ranking de Suspeitos", icon: "ranking", path: "ranking" },
  { id: "evidence", label: "Evidências", icon: "evidence", path: "evidence" },
  { id: "analysis", label: "Análise Probabilística", icon: "analysis", path: "analysis" },
  { id: "profiling", label: "Perfilamento Criminal", icon: "profiling", path: "profiling" },
  { id: "priority", label: "Priorização de Ações", icon: "priority", path: "priority" },
  { id: "board", label: "Quadro investigativo", icon: "board", path: "evidenceBoard" },
  { id: "history", label: "Histórico", icon: "history", path: "history" },
];

const NAV_SECONDARY: NavItem[] = [
  { id: "export", label: "Exportar Relatório", icon: "export", path: "export" },
  { id: "help", label: "Ajuda", icon: "help", path: "help" },
];

// ─── NavButton ───────────────────────────────────────────────────────────────

function NavButton({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={item.label}
      className={[
        "relative flex items-center gap-[12px] w-full px-[10px] py-[9px] rounded-[10px]",
        "text-[13.5px] whitespace-nowrap overflow-hidden transition-all duration-[180ms]",
        "border-none cursor-pointer text-left",
        active
          ? "bg-[#727272]/15 text-[#ffffff] font-medium"
          : "bg-transparent text-[#ffffff]/65 hover:bg-[#727272]/15 hover:text-[#ffffff]",
      ].join(" ")}
    >
      {active && (
        <span className="absolute left-0 top-[20%] h-[60%] w-[3px] bg-green-400 rounded-r-[3px]" />
      )}
      <span className={[
        "shrink-0 flex items-center justify-center w-[22px] transition-colors duration-[180ms] text-[#D9D9D9]/65",
        active ? "text-emerald-400" : "",
      ].join(" ")}>
        {icons[item.icon]}
      </span>
      <span className={[
        "transition-opacity duration-180",
        collapsed ? "opacity-0 pointer-events-none select-none" : "opacity-100",
      ].join(" ")}>
        {item.label}
      </span>
    </button>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar({ onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const pathParts = location.pathname.split("/");
  const caseId = pathParts[2];

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      setCollapsed(e.matches);
    };
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleCollapse = () => {
    if (!isMobile) setCollapsed((c) => !c);
  };

  return (
    <aside
      className={[
        "flex flex-col h-screen bg-[#1D1D1D] border-r border-[#242426] flex-shrink-0",
        "overflow-hidden transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
        collapsed ? "w-[60px] min-w-[60px]" : "w-[250px] min-w-[250px]",
      ].join(" ")}
    >
      {/* ── Header ── */}
      <div
        className={[
          "flex items-center px-[14px] py-[18px] border-b border-[#242426] min-h-[60px] flex-shrink-0",
          collapsed ? "justify-center" : "justify-between",
        ].join(" ")}
      >
        <div className="flex items-center gap-[9px] overflow-hidden">
          {!collapsed && (
            <img
              src={isMobile ? logoMobile : logoHorizon}
              alt="Priora"
              className="w-[110px] h-[40px] flex-shrink-0 object-contain"
            />
          )}
        </div>

        {!isMobile && (
          <button
            onClick={handleCollapse}
            title={collapsed ? "Expandir" : "Recolher"}
            className="flex-shrink-0 flex items-center p-1 rounded-md 
            text-[#D9D9D9]/65 hover:text-[#e8edf8] 
            hover:bg-[#181c25] transition-all duration-[180ms] 
            border-none bg-transparent cursor-pointer"
          >
            {icons.collapse}
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-2 py-[30px] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        
        <div className="flex flex-col gap-1.5 mb-4">
          {NAV_MAIN.map((item) => {
            const basePath = `/case/${caseId}`;
            const fullPath = item.path ? `${basePath}/${item.path}` : basePath;

            const isActive =
              item.path === ""
                ? location.pathname === basePath
                : isRouteActive(location.pathname, fullPath);

            return (
              <NavButton
                key={item.id}
                item={item}
                active={isActive}
                collapsed={collapsed}
                onClick={() => navigate(fullPath)}
              />
            );
          })}
        </div>

        <div className="h-px bg-[#242426] my-4" />

        <div className="flex flex-col gap-1.5">
          {NAV_SECONDARY.map((item) => {
            const fullPath = `/case/${caseId}/${item.id}`;

            const isActive = isRouteActive(location.pathname, fullPath);

            return (
              <NavButton
                key={item.id}
                item={item}
                active={isActive}
                collapsed={collapsed}
                onClick={() => navigate(fullPath)}
              />
            );
          })}
        </div>
      </nav>

      {/* ── Footer ── */}
      <footer className="flex justify-center px-2 pt-2 pb-[14px] border-t border-[#242426] flex-shrink-0">
        <button
           onClick={() => onLogout?.()}
          title="Sair"
          className={[
            "flex items-center justify-center gap-2 rounded-[10px]",
            "text-[#ffffff]/65 text-[15px] bg-transparent cursor-pointer",
            "hover:bg-red-400/8 hover:text-red-400 hover:border-red-400/25",
            "transition-all duration-180",
            collapsed
              ? "w-9.5 h-9.5 rounded-full! p-0 justify-center items-center"
              : "px-5 py-2",
          ].join(" ")}
        >
          {icons.logout}
          <span
            className={[
              "transition-opacity duration-180 whitespace-nowrap",
              collapsed ? "hidden" : "opacity-100",
            ].join(" ")}
          >
            Sair
          </span>
        </button>
      </footer>
    </aside>
  );
}
