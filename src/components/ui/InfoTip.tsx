import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

type Props = {
  /** Nome do que está sendo explicado (usado no rótulo acessível). */
  label: string;
  children: ReactNode;
  size?: number;
  className?: string;
};

const WIDTH = 288;
const MARGIN = 12;

/**
 * Ícone "i" com explicação. Abre ao passar o mouse, ao focar (teclado) ou ao
 * tocar/clicar; fecha com Esc ou clicando fora. O balão é posicionado em
 * `fixed` (via portal) para não ser cortado por áreas com rolagem.
 */
export default function InfoTip({ label, children, size = 16, className = "" }: Props) {
  const id = useId();
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  function place() {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const left = Math.min(
      Math.max(MARGIN, r.left + r.width / 2 - WIDTH / 2),
      window.innerWidth - WIDTH - MARGIN
    );
    // Abre embaixo; se não couber, sobe para o balão não ficar escondido pelo fim da tela.
    const height = tipRef.current?.offsetHeight ?? 0;
    const fitsBelow = r.bottom + 8 + height <= window.innerHeight - MARGIN;
    const top = fitsBelow ? r.bottom + 8 : Math.max(MARGIN, r.top - 8 - height);
    setPos({ top, left });
  }

  // Depois de renderizado o balão, mede a altura real e reposiciona.
  useLayoutEffect(() => {
    if (open) place();
  }, [open]);

  function show() {
    place();
    setOpen(true);
  }

  function hide() {
    setOpen(false);
    setPinned(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    const onDown = (e: MouseEvent) => {
      if (!btnRef.current?.contains(e.target as Node)) hide();
    };
    const onMove = () => place();
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={`Explicação: ${label}`}
        aria-describedby={open ? id : undefined}
        onMouseEnter={show}
        onMouseLeave={() => !pinned && setOpen(false)}
        onFocus={show}
        onBlur={() => !pinned && setOpen(false)}
        onClick={() => {
          if (pinned) hide();
          else {
            show();
            setPinned(true);
          }
        }}
        className={`inline-flex flex-shrink-0 items-center justify-center rounded-full text-white/55 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#139C73] ${className}`}
      >
        <Info size={size} aria-hidden="true" />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            id={id}
            ref={tipRef}
            role="tooltip"
            style={{ top: pos.top, left: pos.left, width: WIDTH }}
            className="fixed z-[100] rounded-md border border-[#3a3a3a] bg-[#1f1f1f] p-3 text-left text-xs font-normal leading-relaxed text-white/90 shadow-lg"
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}
