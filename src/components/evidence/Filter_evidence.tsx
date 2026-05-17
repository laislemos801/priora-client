import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Tag from "../ui/Tag";
import DatePicker from "../ui/DatePicker";
import { Checkbox } from "../../../@/components/ui/checkbox";
import type { EvidenceFilters } from "../../pages/case/evidence";

const STATUS_VALUES = ["Coletada", "Enviada a perícia", "Em análise", "Custodiada", "Descartada"];
const TIPO_VALUES   = ["Digital", "DNA", "Depoimento", "Documental", "Física", "Audiovisual", "Biológica"];

type Suspect = { id: string; nome: string };

type Props = {
  onClose: () => void;
  initialFilters: EvidenceFilters;
  onApply: (filters: EvidenceFilters) => void;
  onClear: () => void;
};

function getInitials(nome: string): string {
  const parts = nome.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  "#e74c3c","#3498db","#2ecc71","#f39c12",
  "#9b59b6","#1abc9c","#e67e22","#e91e63",
];

function getColor(nome: string): string {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function FilterPanelEvidence({ onClose, initialFilters, onApply, onClear }: Props) {
  const { id: casoId } = useParams<{ id: string }>();

  const [local, setLocal] = useState<EvidenceFilters>(initialFilters);
  const [suspects, setSuspects] = useState<Suspect[]>([]);

  useEffect(() => {
    if (!casoId) return;
    fetch(`http://localhost:8000/suspects/case/${casoId}`)
      .then((r) => r.json())
      .then((data) => setSuspects(Array.isArray(data) ? data : []))
      .catch(() => setSuspects([]));
  }, [casoId]);

  function toggleFilter(group: "status" | "tipo" | "suspeitos", value: string) {
    setLocal((prev) => {
      const exists = prev[group].includes(value);
      return {
        ...prev,
        [group]: exists ? prev[group].filter((v) => v !== value) : [...prev[group], value],
      };
    });
  }

  function toggleAll(group: "status" | "tipo" | "suspeitos", values: string[]) {
    setLocal((prev) => {
      const allSelected = values.every((v) => prev[group].includes(v));
      return { ...prev, [group]: allSelected ? [] : values };
    });
  }

  return (
    <div className="fixed inset-x-4 top-auto z-50 md:absolute md:inset-x-auto md:right-0 md:top-full mt-2 w-auto md:w-[calc(100vw-2rem)] md:max-w-[420px] bg-[#2b2b2b] border border-[#444] rounded-xl shadow-xl">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#3a3a3a]">
        <span className="text-sm text-white font-medium">Filtrar</span>
        <button onClick={onClose} className="text-[#ccc] transition-colors text-base hover:bg-[#ccc]/10 rounded-full w-8 h-8 flex items-center justify-center">
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-4">

        {/* Procurar + Data */}
        <div className="flex flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs text-[#FFFFFF]/78 block mb-1">Procurar</label>
            <input
              placeholder="Procurar"
              value={local.search}
              onChange={(e) => setLocal((p) => ({ ...p, search: e.target.value }))}
              className="w-full h-10 bg-[#242424] border border-[#434343] rounded-md px-3 text-sm text-[#aaa] outline-none focus:border-[#555]"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-[#FFFFFF]/78 block mb-1">Data</label>
            <DatePicker
              name="date"
              value={local.date}
              onChange={(_, v) => setLocal((p) => ({ ...p, date: v }))}
              placeholder="Selecionar"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#FFFFFF]/78">Status</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#aaa]">Todos</span>
              <Checkbox
                checked={STATUS_VALUES.every((v) => local.status.includes(v))}
                onCheckedChange={() => toggleAll("status", STATUS_VALUES)}
                className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_VALUES.map((v) => (
              <Tag key={v} label={v} active={local.status.includes(v)} onClick={() => toggleFilter("status", v)} />
            ))}
          </div>
        </div>

        {/* Tipo */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#FFFFFF]/78">Tipo de evidência</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#aaa]">Todos</span>
              <Checkbox
                checked={TIPO_VALUES.every((v) => local.tipo.includes(v))}
                onCheckedChange={() => toggleAll("tipo", TIPO_VALUES)}
                className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {TIPO_VALUES.map((v) => (
              <Tag key={v} label={v} active={local.tipo.includes(v)} onClick={() => toggleFilter("tipo", v)} />
            ))}
          </div>
        </div>

        {/* Suspeitos */}
        {suspects.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#FFFFFF]/78">Suspeitos</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#aaa]">Todos</span>
                <Checkbox
                  checked={suspects.every((s) => local.suspeitos.includes(s.id))}
                  onCheckedChange={() => toggleAll("suspeitos", suspects.map((s) => s.id))}
                  className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
                />
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {suspects.map((s) => {
                const active = local.suspeitos.includes(s.id);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleFilter("suspeitos", s.id)}
                    className={`flex flex-col justify-center items-center gap-1 cursor-pointer transition ${active ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                  >
                    <div
                      style={{ background: getColor(s.nome) }}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-[11px] text-white font-semibold transition ${active ? "border-[#139C73]" : "border-transparent"}`}
                    >
                      {getInitials(s.nome)}
                    </div>
                    <span className="text-[10px] text-[#aaa]">{s.nome.split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
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
