import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiMenu } from "react-icons/fi";
import NotificationButton from "./NotificationButton";
import { useCaseName } from "@/hooks/useCaseName";
import { GENERAL_PAGES, caseIdFromPath, caseSectionFromPath } from "@/lib/navigation";

type Crumb = { label: string; to?: string };

/**
 * Monta o breadcrumb e o destino do "voltar" a partir da URL.
 * O voltar sobe um nível na hierarquia (aba do caso → painel do caso →
 * Meus casos), em vez de depender do histórico do navegador.
 */
function useNavContext(
  pathname: string,
  caseName?: string,
): { crumbs: Crumb[]; back: { to: string; label: string } | null } {
  const caseId = caseIdFromPath(pathname);
  const cases: Crumb = { label: GENERAL_PAGES.cases.label, to: GENERAL_PAGES.cases.path };

  if (caseId) {
    const section = caseSectionFromPath(pathname);
    const caseCrumb: Crumb = { label: caseName ?? "…", to: `/case/${caseId}` };
    const atDashboard = !section || section.path === "";

    if (atDashboard) {
      return {
        crumbs: [cases, { label: caseCrumb.label }],
        back: { to: GENERAL_PAGES.cases.path, label: "Voltar para Meus casos" },
      };
    }
    return {
      crumbs: [cases, caseCrumb, { label: section.short }],
      back: { to: `/case/${caseId}`, label: "Voltar para o painel do caso" },
    };
  }

  if (pathname.startsWith(GENERAL_PAGES.profile.path)) {
    return {
      crumbs: [cases, { label: GENERAL_PAGES.profile.label }],
      back: { to: GENERAL_PAGES.cases.path, label: "Voltar para Meus casos" },
    };
  }
  if (pathname.startsWith(GENERAL_PAGES.contact.path)) {
    return {
      crumbs: [cases, { label: GENERAL_PAGES.contact.label }],
      back: { to: GENERAL_PAGES.cases.path, label: "Voltar para Meus casos" },
    };
  }
  // Meus casos: é o topo, não há para onde voltar
  return { crumbs: [{ label: GENERAL_PAGES.cases.label }], back: null };
}

type Props = {
  /** Abre o menu lateral (gaveta) no celular */
  onMenuClick?: () => void;
};

/** Barra superior única de todas as telas logadas. */
export default function AppTopBar({ onMenuClick }: Props) {
  const { pathname } = useLocation();
  const caseName = useCaseName(caseIdFromPath(pathname));
  const { crumbs, back } = useNavContext(pathname, caseName);

  return (
    <header className="flex h-16 w-full items-center justify-between gap-2 bg-[#242424] px-2 md:px-4">
      <div className="flex min-w-0 items-center gap-1 text-[#D9D9D9] md:gap-2">
        {/* Menu (só no celular, onde a sidebar vira gaveta) */}
        <button
          onClick={onMenuClick}
          aria-label="Abrir menu"
          title="Menu"
          className="shrink-0 rounded-full p-2 hover:bg-[#363636] md:hidden"
        >
          <FiMenu size={18} />
        </button>

        {back && (
          <Link
            to={back.to}
            aria-label={back.label}
            title={back.label}
            className="shrink-0 rounded-full p-2 hover:bg-[#363636]"
          >
            <FiChevronLeft size={18} />
          </Link>
        )}

        {/* Breadcrumb: onde você está */}
        <nav aria-label="Você está em" className="min-w-0">
          <ol className="flex min-w-0 items-center gap-1 whitespace-nowrap text-xs md:gap-1.5 md:text-sm">
            {crumbs.map((crumb, i) => {
              const last = i === crumbs.length - 1;
              // No celular, só os dois últimos níveis aparecem
              const hideOnMobile = !last && i < crumbs.length - 2;
              return (
                <Fragment key={`${crumb.label}-${i}`}>
                  {i > 0 && (
                    <li aria-hidden className={`shrink-0 text-white/30 ${hideOnMobile ? "hidden sm:block" : ""}`}>
                      <FiChevronRight size={13} />
                    </li>
                  )}
                  <li className={`min-w-0 ${last ? "" : "shrink-[2]"} ${hideOnMobile ? "hidden sm:block" : ""}`}>
                    {last || !crumb.to ? (
                      <span aria-current="page" className="block truncate font-medium text-white" title={crumb.label}>
                        {crumb.label}
                      </span>
                    ) : (
                      <Link to={crumb.to} className="block truncate text-white/60 hover:text-white hover:underline" title={crumb.label}>
                        {crumb.label}
                      </Link>
                    )}
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-1 text-[#D9D9D9] md:gap-3">
        <NotificationButton />
      </div>
    </header>
  );
}
