import { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { ActionStatus, InvestigativeAction } from "./types";
import { STATUS_OPTIONS } from "./types";

const STATUS_STYLES: Record<ActionStatus, string> = {
  "Em progresso": "bg-[#139C73]/20 text-[#139C73] border border-[#139C73]/40",
  "Em aprovação": "bg-[#FFA648]/20 text-[#FFA648] border border-[#FFA648]/40",
  "Concluída":    "bg-[#4584A3]/20 text-[#4584A3] border border-[#4584A3]/40",
};

type Props = {
  action: InvestigativeAction;
  onEdit: () => void;
  onDelete: () => void;
  onChangeStatus: (status: ActionStatus) => void;
};

export default function ActionCard({ action, onEdit, onDelete, onChangeStatus }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="rounded-xl border border-[#3d3d3d] bg-[#242424] p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-white leading-snug">
          {action.titulo}
        </h3>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${STATUS_STYLES[action.status]}`}>
            {action.status}
          </span>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="p-1 rounded-md text-white/50 hover:text-white hover:bg-[#333] transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 w-56 rounded-lg border border-[#3a3a3a] bg-[#2b2b2b] shadow-xl py-1">
                <button
                  onClick={() => { onEdit(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#ccc] hover:bg-[#333] transition-colors"
                >
                  <Pencil size={13} /> Editar ação
                </button>

                <div className="my-1 border-t border-[#3a3a3a]" />

                <p className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-widest text-[#777]">
                  Mudar status
                </p>
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    onClick={() => { onChangeStatus(status); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors ${
                      status === action.status
                        ? "text-[#139C73]"
                        : "text-[#ccc] hover:bg-[#333]"
                    }`}
                  >
                    {status}
                  </button>
                ))}

                <div className="my-1 border-t border-[#3a3a3a]" />

                <button
                  onClick={() => { onDelete(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={13} /> Excluir ação
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 text-[11px] font-medium uppercase tracking-widest text-emerald-400/80">
        {action.impacto} impacto
      </p>

      <p className="mt-1 text-sm text-white/65">
        {action.metricaLabel}:{" "}
        <span className="text-emerald-400 font-medium">{action.metricaValor}%</span>
      </p>
    </div>
  );
}
