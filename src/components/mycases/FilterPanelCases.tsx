"use client";
import { useState } from "react";
import DatePicker from "../ui/DatePicker";
import { Checkbox } from "../../../@/components/ui/checkbox";
import { ArrowDown, Minus, ArrowUp } from "lucide-react";
import Tag from "../ui/Tag";
import { RiAlertFill } from "react-icons/ri";
type Filters = {
  status: string[];
  prioridade: string[];
  estado: string[];
  cidade: string[];
  responsavel: string;
  dataInicio: string;
  dataFim: string;
};

const EMPTY_FILTERS: Filters = {
  status:      [],
  prioridade:  [],
  estado:      [],
  cidade:      [],
  responsavel: "",
  dataInicio:  "",
  dataFim:     "",
};

const STATUS_LIST = [
  { value: "Ativo",     label: "Ativo" },
  { value: "Arquivado", label: "Arquivado" },
  { value: "Concluído", label: "Concluído" },
];

const PRIORIDADE_LIST = [
  { value: "Baixa",   label: "Baixa",   icon: <ArrowDown size={12} />, activeColor: "border-[#5b9cf6] bg-[#5b9cf6]/10 text-[#5b9cf6]",   idleColor: "border-[#434343] text-[#aaa] hover:border-[#5b9cf6]/50 hover:text-[#5b9cf6]/80" },
  { value: "Média",   label: "Média",   icon: <Minus     size={12} />, activeColor: "border-[#e0a030] bg-[#e0a030]/10 text-[#e0a030]",   idleColor: "border-[#434343] text-[#aaa] hover:border-[#e0a030]/50 hover:text-[#e0a030]/80" },
  { value: "Alta",    label: "Alta",    icon: <ArrowUp   size={12} />, activeColor: "border-[#e05555] bg-[#e05555]/10 text-[#e05555]",   idleColor: "border-[#434343] text-[#aaa] hover:border-[#e05555]/50 hover:text-[#e05555]/80" },
  { value: "Crítica", label: "Crítica", icon: <RiAlertFill size={12} />, activeColor: "border-[#ff3b3b] bg-[#ff3b3b]/10 text-[#ff3b3b]",   idleColor: "border-[#434343] text-[#aaa] hover:border-[#ff3b3b]/50 hover:text-[#ff3b3b]/80" },
];

const ESTADO_LIST = [
  { value: "São Paulo",      label: "SP" },
  { value: "Rio de Janeiro", label: "RJ" },
  { value: "Minas Gerais",   label: "MG" },
];

const CIDADE_LIST = [
  { value: "Campinas",  label: "Campinas" },
  { value: "São Paulo", label: "São Paulo" },
];

type Props = {
  onClose: () => void;
  onApply: (filters: Filters) => void;
  initialFilters?: Filters;
};

export default function FilterPanelCases({ onClose, onApply, initialFilters }: Props) {
  const [filters, setFilters] = useState<Filters>(initialFilters ?? EMPTY_FILTERS);
  // controla qual datepicker está aberto para expandir o painel
  const [openPicker, setOpenPicker] = useState<"dataInicio" | "dataFim" | null>(null);

  function toggleList(group: "status" | "prioridade" | "estado" | "cidade", value: string) {
    setFilters((prev) => {
      const exists = prev[group].includes(value);
      return {
        ...prev,
        [group]: exists ? prev[group].filter((v) => v !== value) : [...prev[group], value],
      };
    });
  }

  function toggleAll(group: "status" | "prioridade" | "estado" | "cidade", values: string[]) {
    setFilters((prev) => {
      const allSelected = values.every((v) => prev[group].includes(v));
      return { ...prev, [group]: allSelected ? [] : values };
    });
  }

  function clearAll() {
    setFilters(EMPTY_FILTERS);
  }

  function handleDateChange(name: string, value: string) {
    setFilters((p) => ({ ...p, [name]: value }));
    setOpenPicker(null);
  }

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-[420px] bg-[#2b2b2b] border border-[#444] rounded-xl shadow-xl">

      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#3a3a3a]">
        <span className="text-sm text-white font-medium">Filtrar Casos</span>
        <button onClick={onClose} className="text-[#888] hover:text-white transition">✕</button>
      </div>

      {/* CONTENT — sem overflow hidden para o calendário expandir naturalmente */}
      <div className="p-4 space-y-4">

        {/* Responsável */}
        <div>
          <label className="text-xs text-[#FFFFFF]/78 block mb-1">Responsável</label>
          <input
            placeholder="Nome do responsável"
            value={filters.responsavel}
            onChange={(e) => setFilters((p) => ({ ...p, responsavel: e.target.value }))}
            className="w-full h-9 bg-[#242424] border border-[#434343] rounded-md px-3 text-sm text-[#aaa] outline-none hover:border-[#606060] focus:border-[#606060] transition-colors"
          />
        </div>

        {/* Datas — o calendário abre para baixo dentro do painel, que cresce junto */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-[#FFFFFF]/78 block mb-1">Data inicial</label>
            <DatePicker
              name="dataInicio"
              value={filters.dataInicio}
              onChange={handleDateChange}
              placeholder="Selecionar"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-[#FFFFFF]/78 block mb-1">Data final</label>
            <DatePicker
              name="dataFim"
              value={filters.dataFim}
              onChange={handleDateChange}
              placeholder="Selecionar"
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#FFFFFF]/78">Status</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#aaa]">Todos</span>
              <Checkbox
                checked={STATUS_LIST.every((s) => filters.status.includes(s.value))}
                onCheckedChange={() => toggleAll("status", STATUS_LIST.map((s) => s.value))}
                className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_LIST.map((s) => (
              <Tag
                key={s.value}
                label={s.label}
                active={filters.status.includes(s.value)}
                onClick={() => toggleList("status", s.value)}
              />
            ))}
          </div>
        </div>

        {/* Prioridade — cada nível com sua cor própria */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#FFFFFF]/78">Prioridade</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#aaa]">Todas</span>
              <Checkbox
                checked={PRIORIDADE_LIST.every((p) => filters.prioridade.includes(p.value))}
                onCheckedChange={() => toggleAll("prioridade", PRIORIDADE_LIST.map((p) => p.value))}
                className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {PRIORIDADE_LIST.map((p) => {
              const isActive = filters.prioridade.includes(p.value);
              return (
                <button
                  key={p.value}
                  onClick={() => toggleList("prioridade", p.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all
                    ${isActive ? p.activeColor : p.idleColor}`}
                >
                  {p.icon}
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Estado */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#FFFFFF]/78">Estado</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#aaa]">Todos</span>
              <Checkbox
                checked={ESTADO_LIST.every((e) => filters.estado.includes(e.value))}
                onCheckedChange={() => toggleAll("estado", ESTADO_LIST.map((e) => e.value))}
                className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {ESTADO_LIST.map((e) => (
              <Tag
                key={e.value}
                label={e.label}
                active={filters.estado.includes(e.value)}
                onClick={() => toggleList("estado", e.value)}
              />
            ))}
          </div>
        </div>

        {/* Cidade */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-[#FFFFFF]/78">Cidade</label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#aaa]">Todas</span>
              <Checkbox
                checked={CIDADE_LIST.every((c) => filters.cidade.includes(c.value))}
                onCheckedChange={() => toggleAll("cidade", CIDADE_LIST.map((c) => c.value))}
                className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CIDADE_LIST.map((c) => (
              <Tag
                key={c.value}
                label={c.label}
                active={filters.cidade.includes(c.value)}
                onClick={() => toggleList("cidade", c.value)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="flex gap-3 px-4 py-3 border-t border-[#3a3a3a]">
        <button
          onClick={clearAll}
          className="text-[#00a87e] w-full bg-[#136D52]/26 text-sm px-4 py-2 rounded-md hover:bg-[#136D52]/40 transition"
        >
          Limpar filtros
        </button>
        <button
          onClick={() => { onApply(filters); onClose(); }}
          className="bg-[#139C73] w-full text-white hover:bg-[#139C73]/80 transition text-sm px-4 py-2 rounded-md"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}
