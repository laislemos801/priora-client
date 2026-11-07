import { MdOutlineSupportAgent } from "react-icons/md";

/**
 * Ícones de navegação do caso. É a ÚNICA definição: o menu lateral e o
 * cabeçalho de cada página usam este componente, para o ícone da aba ser
 * sempre o mesmo do item do menu.
 */
export type NavIconName =
  | "dashboard"
  | "ranking"
  | "evidence"
  | "analysis"
  | "profiling"
  | "priority"
  | "board"
  | "history"
  | "export"
  | "help";

type Props = {
  name: NavIconName;
  size?: number;
  className?: string;
};

export default function NavIcon({ name, size = 18, className }: Props) {
  if (name === "help") {
    return <MdOutlineSupportAgent size={size} className={className} />;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {name === "dashboard" && (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </>
      )}
      {name === "ranking" && (
        <>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </>
      )}
      {name === "evidence" && (
        <>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </>
      )}
      {name === "analysis" && (
        <>
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 4 4-4" />
        </>
      )}
      {name === "profiling" && (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          <line x1="18" y1="8" x2="22" y2="8" />
          <line x1="20" y1="6" x2="20" y2="10" />
        </>
      )}
      {name === "priority" && (
        <>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </>
      )}
      {name === "board" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="9" x2="9" y2="21" />
        </>
      )}
      {name === "history" && (
        <>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </>
      )}
      {name === "export" && (
        <>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </>
      )}
    </svg>
  );
}
