import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ProfilingSuspect } from "./types";

type Props = {
  suspect: ProfilingSuspect;
  suspects: ProfilingSuspect[];
  onSelect: (id: string) => void;
};

function initials(nome: string) {
  return nome.slice(0, 2).toUpperCase();
}

type AvatarProps = {
  suspect: ProfilingSuspect;
  size: "md" | "sm";
  className?: string;
};

export function Avatar({ suspect, size, className = "" }: AvatarProps) {
  // Guarda a URL que falhou: ao trocar de foto o fallback se desfaz sozinho
  const [brokenUrl, setBrokenUrl] = useState<string | null>(null);
  const dims = size === "md" ? "h-9 w-9 text-xs" : "h-7 w-7 text-[11px]";
  const broken = !!suspect.fotoUrl && brokenUrl === suspect.fotoUrl;

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#139C73]/20 font-bold text-[#139C73] ${dims} ${className}`}
    >
      {suspect.fotoUrl && !broken ? (
        <img
          src={suspect.fotoUrl}
          alt={suspect.nome}
          className="h-full w-full object-cover"
          onError={() => setBrokenUrl(suspect.fotoUrl ?? null)}
        />
      ) : (
        initials(suspect.nome)
      )}
    </div>
  );
}

export default function SuspectHeader({ suspect, suspects, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const canSwitch = suspects.length > 1;

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    // Ao abrir, leva o foco para a opção selecionada
    listRef.current
      ?.querySelector<HTMLButtonElement>('[aria-selected="true"]')
      ?.focus();

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function handleSelect(id: string) {
    setOpen(false);
    triggerRef.current?.focus();
    if (id !== suspect.id) onSelect(id);
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar suspect={suspect} size="md" />

      {canSwitch ? (
        <div ref={ref} className="relative min-w-0">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex min-w-0 items-center gap-2 rounded-md px-1 py-0.5 text-left transition-colors hover:bg-[#313131]"
          >
            <span className="truncate text-xl font-semibold text-white">{suspect.nome}</span>
            <ChevronDown
              size={16}
              className={`flex-shrink-0 text-[#666] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div
              ref={listRef}
              role="listbox"
              aria-label="Selecionar suspeito"
              className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-72 w-60 overflow-y-auto rounded-xl border border-[#3a3a3a] bg-[#1e1e1e] shadow-2xl scrollbar-thin scrollbar-thumb-[#139C73] scrollbar-track-transparent"
            >
              {suspects.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="option"
                  aria-selected={s.id === suspect.id}
                  onClick={() => handleSelect(s.id)}
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-[#2a2a2a] ${s.id === suspect.id ? "bg-[#139C73]/10" : ""}`}
                >
                  <Avatar suspect={s} size="sm" />
                  <span className="truncate text-sm text-white">{s.nome}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <h2 className="truncate text-xl font-semibold text-white">{suspect.nome}</h2>
      )}
    </div>
  );
}
