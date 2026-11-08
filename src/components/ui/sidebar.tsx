import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiFolder, FiLogOut, FiChevronRight } from "react-icons/fi";
import { MdOutlineSupportAgent } from "react-icons/md";
import logoHorizon from "@/assets/logoHorizonSideBar.png";
import NavIcon from "@/components/ui/NavIcon";
import {
  CASE_NAV,
  GENERAL_PAGES,
  USER_UPDATED_EVENT,
  caseIdFromPath,
  casePath,
  getLastCase,
} from "@/lib/navigation";
import { useCaseName } from "@/hooks/useCaseName";

const icons = {
  collapse: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  ),
  close: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

export type SidebarProps = {
  onLogout?: () => void;
  /** Celular: a sidebar vira uma gaveta aberta pelo botão de menu da TopBar */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

type StoredUser = { primeiroNome?: string; sobrenome?: string; fotoUrl?: string; email?: string; cargo?: string | null };

function getStoredUser(): StoredUser {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

/**
 * Verifica se `pathname` é igual a `fullPath` ou uma sub-rota dele.
 * Evita o bug de startsWith puro, onde "/evidenceBoard" seria considerado
 * ativo para o item "evidence".
 */
function isRouteActive(pathname: string, fullPath: string): boolean {
  return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
}

// ─── Item de navegação ───────────────────────────────────────────────────────

function NavItem({
  to,
  label,
  icon,
  active,
  collapsed,
}: {
  to: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      to={to}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={[
        "relative flex items-center gap-3 w-full px-2.5 py-2 rounded-[10px]",
        "text-[13.5px] whitespace-nowrap overflow-hidden transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-[#18C18A]",
        active
          ? "bg-[#727272]/15 text-white font-medium"
          : "text-white/65 hover:bg-[#727272]/15 hover:text-white",
      ].join(" ")}
    >
      {active && <span className="absolute left-0 top-[20%] h-[60%] w-[3px] rounded-r-[3px] bg-green-400" />}
      <span
        className={`flex w-[22px] shrink-0 items-center justify-center ${active ? "text-emerald-400" : "text-[#D9D9D9]/65"}`}
      >
        {icon}
      </span>
      <span className={collapsed ? "sr-only" : "truncate"}>{label}</span>
    </Link>
  );
}

/** Título de grupo do menu (some quando recolhido, vira só uma linha). */
function GroupLabel({ children, collapsed }: { children: ReactNode; collapsed: boolean }) {
  if (collapsed) return <div className="mx-2 my-3 h-px bg-[#2c2c2c]" />;
  return (
    <p className="mb-1.5 mt-5 truncate px-2.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-white/35 first:mt-0">
      {children}
    </p>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar({ onLogout, mobileOpen = false, onMobileClose }: SidebarProps) {
  // Tablet (768–1023px): começa recolhida para sobrar espaço ao conteúdo
  const [collapsed, setCollapsed] = useState(() => window.matchMedia("(max-width: 1023px)").matches);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  const location = useLocation();
  const { pathname } = location;
  const caseId = caseIdFromPath(pathname);
  const caseName = useCaseName(caseId);
  const lastCase = caseId ? null : getLastCase();
  const [user, setUser] = useState<StoredUser>(getStoredUser);

  // Nome e foto atualizados na hora quando o perfil muda
  useEffect(() => {
    const refresh = () => setUser(getStoredUser());
    window.addEventListener(USER_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(USER_UPDATED_EVENT, refresh);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (!e.matches) onMobileClose?.();
    };
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [onMobileClose]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const update = (e: MediaQueryListEvent) => setCollapsed(e.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Fecha a gaveta ao trocar de página
  useEffect(() => {
    onMobileClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Fecha a gaveta com Esc
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMobileClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, mobileOpen, onMobileClose]);

  // No celular a gaveta sempre mostra os textos; "recolher" só existe a partir do tablet
  const isCollapsed = isMobile ? false : collapsed;

  const fullName = `${user.primeiroNome ?? ""} ${user.sobrenome ?? ""}`.trim() || "Minha conta";
  const initials = `${user.primeiroNome?.[0] ?? ""}${user.sobrenome?.[0] ?? ""}`.toUpperCase() || "?";
  const profileActive = isRouteActive(pathname, GENERAL_PAGES.profile.path);

  return (
    <>
      {isMobile && (
        <div
          aria-hidden
          onClick={onMobileClose}
          className={[
            "fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 print:hidden",
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
        />
      )}

      <aside
        aria-label="Menu principal"
        className={[
          "flex h-dvh shrink-0 flex-col border-r border-[#242426] bg-[#1D1D1D] print:hidden",
          "overflow-hidden transition-all duration-[180ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          isMobile
            ? [
                "fixed inset-y-0 left-0 z-50 w-[270px] max-w-[85vw]",
                mobileOpen ? "translate-x-0 shadow-2xl" : "invisible -translate-x-full",
              ].join(" ")
            : isCollapsed
              ? "w-[64px] min-w-[64px]"
              : "w-[250px] min-w-[250px]",
        ].join(" ")}
      >
        {/* ── Logo ── */}
        <div
          className={[
            "flex min-h-16 shrink-0 items-center border-b border-[#242426] px-3.5",
            isCollapsed ? "justify-center" : "justify-between",
          ].join(" ")}
        >
          {!isCollapsed && (
            <Link to={GENERAL_PAGES.cases.path} aria-label="Priora — Meus casos">
              <img src={logoHorizon} alt="Priora" className="h-10 w-[110px] object-contain" />
            </Link>
          )}

          <button
            onClick={isMobile ? onMobileClose : () => setCollapsed((c) => !c)}
            title={isMobile ? "Fechar menu" : isCollapsed ? "Expandir menu" : "Recolher menu"}
            aria-label={isMobile ? "Fechar menu" : isCollapsed ? "Expandir menu" : "Recolher menu"}
            className="flex shrink-0 items-center rounded-md p-1 text-[#D9D9D9]/65 transition-colors hover:bg-[#2a2a2a] hover:text-white"
          >
            {isMobile ? icons.close : icons.collapse}
          </button>
        </div>

        {/* ── Navegação ── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <GroupLabel collapsed={isCollapsed}>Geral</GroupLabel>
          <div className="flex flex-col gap-1">
            <NavItem
              to={GENERAL_PAGES.cases.path}
              label="Meus casos"
              icon={<FiFolder size={17} />}
              active={pathname === GENERAL_PAGES.cases.path}
              collapsed={isCollapsed}
            />
          </div>

          {caseId ? (
            <>
              <GroupLabel collapsed={isCollapsed}>
                <span className="text-white/35">Caso · </span>
                <span className="normal-case tracking-normal text-emerald-300/90" title={caseName}>
                  {caseName ?? "carregando..."}
                </span>
              </GroupLabel>
              <div className="flex flex-col gap-1">
                {CASE_NAV.map((item) => {
                  const to = casePath(caseId, item);
                  const active = item.path === "" ? pathname === to : isRouteActive(pathname, to);
                  return (
                    <NavItem
                      key={item.id}
                      to={to}
                      label={item.label}
                      icon={<NavIcon name={item.icon} />}
                      active={active}
                      collapsed={isCollapsed}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            lastCase &&
            !isCollapsed && (
              <>
                <GroupLabel collapsed={false}>Continuar</GroupLabel>
                <Link
                  to={`/case/${lastCase.id}`}
                  className="group flex items-center gap-3 rounded-[10px] border border-dashed border-[#333] px-2.5 py-2.5 text-[13px] text-white/70 transition-colors hover:border-[#139C73]/50 hover:bg-[#139C73]/8 hover:text-white"
                >
                  <span className="flex w-[22px] shrink-0 justify-center text-[#D9D9D9]/65">
                    <NavIcon name="dashboard" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] text-white/40">Último caso aberto</span>
                    <span className="block truncate">{lastCase.name}</span>
                  </span>
                  <FiChevronRight className="shrink-0 text-white/30 group-hover:text-emerald-400" />
                </Link>
              </>
            )
          )}
        </nav>

        {/* ── Rodapé: contato, perfil e sair ── */}
        <footer className="flex shrink-0 flex-col gap-1 border-t border-[#242426] px-2 py-3">
          <NavItem
            to={GENERAL_PAGES.responsible.path}
            label="Uso responsável"
            icon={<NavIcon name="responsible" />}
            active={isRouteActive(pathname, GENERAL_PAGES.responsible.path)}
            collapsed={isCollapsed}
          />

          <NavItem
            to={GENERAL_PAGES.contact.path}
            label="Contato"
            icon={<MdOutlineSupportAgent size={18} />}
            active={isRouteActive(pathname, GENERAL_PAGES.contact.path)}
            collapsed={isCollapsed}
          />

          <Link
            to={GENERAL_PAGES.profile.path}
            title={isCollapsed ? fullName : undefined}
            aria-current={profileActive ? "page" : undefined}
            className={[
              "relative flex items-center gap-3 rounded-[10px] px-2 py-2 transition-colors",
              "focus-visible:outline-2 focus-visible:outline-[#18C18A]",
              profileActive ? "bg-[#727272]/15" : "hover:bg-[#727272]/15",
              isCollapsed ? "justify-center" : "",
            ].join(" ")}
          >
            {profileActive && <span className="absolute left-0 top-[20%] h-[60%] w-[3px] rounded-r-[3px] bg-green-400" />}
            {user.fotoUrl ? (
              <img src={user.fotoUrl} alt="" className="size-8 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#139C73] to-[#136D52] text-xs font-semibold text-white">
                {initials}
              </span>
            )}
            <span className={isCollapsed ? "sr-only" : "min-w-0 flex-1"}>
              <span className="block truncate text-[13px] font-medium text-white">{fullName}</span>
              <span className="block truncate text-[11px] text-white/45">{user.cargo || "Minha conta"}</span>
            </span>
          </Link>

          <button
            onClick={() => onLogout?.()}
            title={isCollapsed ? "Sair" : undefined}
            className={[
              "flex items-center gap-3 rounded-[10px] px-2.5 py-2 text-[13.5px] text-white/55 transition-colors",
              "hover:bg-red-400/10 hover:text-red-400",
              isCollapsed ? "justify-center" : "",
            ].join(" ")}
          >
            <span className="flex w-[22px] shrink-0 justify-center">
              <FiLogOut size={16} />
            </span>
            <span className={isCollapsed ? "sr-only" : ""}>Sair</span>
          </button>
        </footer>
      </aside>
    </>
  );
}
