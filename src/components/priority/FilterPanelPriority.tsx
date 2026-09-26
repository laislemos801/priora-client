import { useState } from "react";
import Tag from "@/components/ui/Tag";
import { Checkbox } from "../../../@/components/ui/checkbox";
import { IMPACT_OPTIONS, STATUS_OPTIONS } from "./types";
import type { PriorityFilters } from "./types";

type Props = {
  onClose: () => void;
  initialFilters: PriorityFilters;
  onApply: (filters: PriorityFilters) => void;
  onClear: () => void;
};

export default function FilterPanelPriority({ onClose, initialFilters, onApply, onClear }: Props) {
  const [local, setLocal] = useState<PriorityFilters>(initialFilters);

  function toggleFilter(group: "status" | "impacto", value: string) {
    setLocal((prev) => {
      const exists = prev[group].includes(value as never);
      return {
        ...prev,
        [group]: exists
          ? prev[group].filter((v) => v !== value)
          : [...prev[group], value],
      } as PriorityFilters;
    });
  }

  function toggleAll(group: "status" | "impacto", values: string[]) {
    setLocal((prev) => {
      const allSelected = values.every((v) => prev[group].includes(v as never));
      return { ...prev, [group]: allSelected ? [] : values } as PriorityFilters;
    });
  }

  return (
    <div className="fixed inset-x-4 top-auto z-50 md:absolute md:inset-x-auto md:right-0 md:top-full mt-2 w-auto md:w-[calc(100vw-2rem)] md:max-w-[360px] bg-[#2b2b2b] border border-[#444] rounded-xl shadow-xl">
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#3a3a3a]">
        <span className="text-sm text-white font-medium">Filtrar</span>
        <button onClick={onClose} className="text-[#ccc] transition-colors text-base hover:bg-[#ccc]/10 rounded-full w-8 h-8 flex items-center justify-center">
          ✕
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#FFFFFF]/78">Status</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#aaa]">Todos</span>
              <Checkbox
                checked={STATUS_OPTIONS.every((v) => local.status.includes(v))}
                onCheckedChange={() => toggleAll("status", STATUS_OPTIONS)}
                className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map((v) => (
              <Tag key={v} label={v} active={local.status.includes(v)} onClick={() => toggleFilter("status", v)} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#FFFFFF]/78">Impacto</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#aaa]">Todos</span>
              <Checkbox
                checked={IMPACT_OPTIONS.every((v) => local.impacto.includes(v))}
                onCheckedChange={() => toggleAll("impacto", IMPACT_OPTIONS)}
                className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {IMPACT_OPTIONS.map((v) => (
              <Tag key={v} label={v} active={local.impacto.includes(v)} onClick={() => toggleFilter("impacto", v)} />
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-3 gap-3 border-t border-[#3a3a3a]">
          <button
            onClick={() => { onClear(); onClose(); }}
            className="text-[#00a87e] w-full bg-[#136D52]/26 text-sm px-4 py-2 rounded-md hover:bg-[#136D52]/40 transition"
          >
            Limpar filtros
          </button>
          <button
            onClick={() => onApply(local)}
            className="bg-[#139C73] w-full text-white hover:bg-[#139C73]/80 transition text-sm px-4 py-2 rounded-md"
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
