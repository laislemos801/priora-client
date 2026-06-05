import { ChevronDown } from "lucide-react";
import type { SuspectAnalysis } from "./types";

type Props = {
  suspects: SuspectAnalysis[];
  selected: SuspectAnalysis | null;
  dropdownOpen: boolean;
  onToggle: () => void;
  onSelect: (s: { id: string }) => void;
};

export default function SuspectDropdown({ suspects, selected, dropdownOpen, onToggle, onSelect }: Props) {
  return (
    <div className="relative w-full md:w-auto">
      <button
        onClick={onToggle}
        className="flex w-full min-w-[220px] items-center gap-2.5 rounded-lg border border-[#3a3a3a] bg-[#252525] px-3 py-2 transition-colors hover:border-[#139C73] md:w-auto"
      >
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#139C73]/20 text-[11px] font-bold text-[#139C73]">
          {selected?.nome.slice(0, 2).toUpperCase() ?? "—"}
        </div>
        <span className="flex-1 text-left text-sm font-medium text-white">
          {selected?.nome ?? "Selecionar suspeito"}
        </span>
        <ChevronDown
          size={14}
          className={`text-[#666] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-60 overflow-hidden rounded-xl border border-[#3a3a3a] bg-[#1e1e1e] shadow-2xl">
          {suspects.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className={`flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-[#2a2a2a] ${s.id === selected?.id ? "bg-[#139C73]/10" : ""}`}
            >
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#2a2a2a] text-[11px] font-bold text-white">
                {s.nome.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm text-white">{s.nome}</span>
              <span className="ml-auto text-xs font-semibold text-[#139C73]">
                {(s.probabilidadeAtual ?? 0).toFixed(1)}%
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}