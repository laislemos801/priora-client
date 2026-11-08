import { useEffect, useRef, useState } from "react";
import { MoreVertical, Ban, RotateCcw, Trash2 } from "lucide-react";
import type { ActionStatus, InvestigativeAction } from "./types";

const STATUS_CYCLE_OPTIONS: ActionStatus[] = ["Sugerida", "Em progresso", "Concluída"];

const STATUS_STYLES: Record<ActionStatus, string> = {
  "Sugerida":     "bg-[#4584A3]/20 text-[#4584A3] border border-[#4584A3]/40",
  "Em progresso": "bg-[#139C73]/20 text-[#139C73] border border-[#139C73]/40",
  "Concluída":    "bg-[#8B8B8B]/20 text-[#D9D9D9] border border-[#8B8B8B]/40",
  "Descartada":   "bg-[#FF6055]/20 text-[#FF6055] border border-[#FF6055]/40",
};

type Props = {
  action: InvestigativeAction;
  onChangeStatus: (status: ActionStatus) => void;
  onDelete: () => void;
};

export default function ActionCard({ action, onChangeStatus, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const discarded = action.status === "Descartada";
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirmDelete(false);
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
                {discarded ? (
                  <>
                    <p className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-widest text-[#777]">
                      Ação descartada
                    </p>
                    <button
                      onClick={() => { onChangeStatus("Sugerida"); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-[#ccc] hover:bg-[#333] transition-colors"
                    >
                      <RotateCcw size={13} /> Reativar sugestão
                    </button>

                    <div className="my-1 border-t border-[#3a3a3a]" />

                    {confirmDelete ? (
                      <div className="px-3 py-2">
                        <p className="mb-2 text-xs text-white/70">
                          Excluir esta ação? Ela não será sugerida novamente.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { onDelete(); setMenuOpen(false); setConfirmDelete(false); }}
                            className="rounded-md bg-red-500/90 px-3 py-1 text-xs font-medium text-white hover:bg-red-500"
                          >
                            Excluir
                          </button>
                          <button
                            onClick={() => setConfirmDelete(false)}
                            className="rounded-md border border-[#575757] px-3 py-1 text-xs text-[#ccc] hover:bg-[#333]"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={13} /> Excluir ação
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <p className="px-3 pt-1 pb-1 text-[10px] uppercase tracking-widest text-[#777]">
                      Mudar status
                    </p>
                    {STATUS_CYCLE_OPTIONS.map((status) => (
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
                      onClick={() => { onChangeStatus("Descartada"); setMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Ban size={13} /> Descartar sugestão
                    </button>
                  </>
                )}
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
