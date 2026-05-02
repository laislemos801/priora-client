import { useState } from "react";
import { Fingerprint, Dna, MessageSquare } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../@/components/ui/table";
import { Checkbox } from "../../../@/components/ui/checkbox";

// ── Types ─────────────────────────────────────────

type TipoEvidencia = "Digital" | "DNA" | "Depoimento";
type Status = "Coletada" | "Em análise" | "Custodiada";

interface Suspeito {
  initials: string;
  color: string;
}

interface Evidencia {
  id: number;
  tipo: TipoEvidencia;
  descricao: string;
  data: string;
  status: Status;
  suspeitos: Suspeito[];
}

// ── Mock ──────────────────────────────────────────

const EVIDENCIAS: Evidencia[] = [
  {
    id: 1,
    tipo: "Digital",
    descricao: "Texto exemplo...",
    data: "24/04/2025",
    status: "Coletada",
    suspeitos: [
      { initials: "AL", color: "#e74c3c" },
      { initials: "BM", color: "#3498db" },
    ],
  },
  {
    id: 2,
    tipo: "DNA",
    descricao: "Texto exemplo...",
    data: "24/04/2025",
    status: "Em análise",
    suspeitos: [{ initials: "CR", color: "#2ecc71" }],
  },
  {
    id: 3,
    tipo: "Depoimento",
    descricao: "Texto exemplo...",
    data: "24/04/2025",
    status: "Custodiada",
    suspeitos: [{ initials: "TR", color: "#2ecc71" }],
  },
  {
    id: 4,
    tipo: "DNA",
    descricao: "Texto exemplo...",
    data: "24/04/2025",
    status: "Custodiada",
    suspeitos: [{ initials: "TR", color: "#2ecc71" }],
  },
  {
    id: 5,
    tipo: "Depoimento",
    descricao: "Texto exemplo...",
    data: "24/04/2025",
    status: "Em análise",
    suspeitos: [{ initials: "TR", color: "#2ecc71" }],
  },
];

// ── Helpers ───────────────────────────────────────

const tipoIconMap = {
  Digital: <Fingerprint size={18} className="text-emerald-400" />,
  DNA: <Dna size={18} className="text-emerald-400" />,
  Depoimento: <MessageSquare size={18} className="text-emerald-400" />,
};

function StatusBadge({ status }: { status: Status }) {
  const styles = {
    Coletada: "bg-[#455A64]/34 text-[#4584A3] border border-[#4584A3]",
    "Em análise": "bg-[#FFA648]/34 text-[#FFA648] border border-[#FFA648]",
    Custodiada: "bg-[#139C73]/34 text-[#139C73] border border-[#139C73]",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${styles[status]}`}>
      {status}
    </span>
  );
}

function AvatarStack({ suspeitos }: { suspeitos: Suspeito[] }) {
  return (
    <div className="flex">
      {suspeitos.map((s, i) => (
        <div
          key={i}
          style={{
            background: s.color,
            marginLeft: i === 0 ? 0 : -8,
            zIndex: suspeitos.length - i,
          }}
          className="w-7 h-7 rounded-full border-2 border-[#1e2436] flex items-center justify-center text-[10px] text-white font-semibold"
        >
          {s.initials[0]}
        </div>
      ))}
    </div>
  );
}

// ── Mobile Card ───────────────────────────────────

function EvidenciaCard({
  row,
  isSelected,
  onToggle,
}: {
  row: Evidencia;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      className="bg-[#2B2B2B] rounded-lg p-4 flex flex-col gap-3 cursor-pointer active:bg-[#313131] transition-colors"
    >
      {/* Top: checkbox + tipo + status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
            onClick={(e) => e.stopPropagation()}
            className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
          />
          <div className="flex items-center gap-2">
            {tipoIconMap[row.tipo]}
            <span className="text-white font-medium text-sm">{row.tipo}</span>
          </div>
        </div>
        <StatusBadge status={row.status} />
      </div>

      {/* Description */}
      <p className="text-[#9ca3af] text-sm line-clamp-2 pl-6">{row.descricao}</p>

      {/* Bottom: data + suspeitos */}
      <div className="flex items-center justify-between pl-6">
        <span className="text-[#9ca3af] text-xs">{row.data}</span>
        <AvatarStack suspeitos={row.suspeitos} />
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────

export default function EvidenciasTable() {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(EVIDENCIAS.map((e) => e.id)) : new Set());
  };

  const allSelected = selected.size === EVIDENCIAS.length;
  const isIndeterminate = selected.size > 0 && selected.size < EVIDENCIAS.length;

  return (
    <div className="p-2 sm:p-6 w-full">

      {/* ── Mobile: cards (visible below md) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Select all */}
        <div className="flex items-center gap-2 px-1">
          <Checkbox
            checked={isIndeterminate ? "indeterminate" : allSelected}
            onCheckedChange={(value) => toggleAll(!!value)}
            className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
          />
          <span className="text-[#9ca3af] text-xs">
            {selected.size > 0
              ? `${selected.size} selecionado${selected.size > 1 ? "s" : ""}`
              : "Selecionar todos"}
          </span>
        </div>

        {EVIDENCIAS.map((row) => (
          <EvidenciaCard
            key={row.id}
            row={row}
            isSelected={selected.has(row.id)}
            onToggle={() => toggle(row.id)}
          />
        ))}
      </div>

      {/* ── Desktop: table (visible from md+) ── */}
      <div className="hidden md:block overflow-y-auto">
        <Table className="border-separate border-spacing-y-2">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="p-3 !hover:bg-transparent">
                <Checkbox
                  checked={isIndeterminate ? "indeterminate" : allSelected}
                  onCheckedChange={(value) => toggleAll(!!value)}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-sm border-[#575757] data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
                />
              </TableHead>
              <TableHead className="text-white">Tipo</TableHead>
              <TableHead className="text-white">Descrição</TableHead>
              <TableHead className="text-white">Data</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Suspeitos</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {EVIDENCIAS.map((row) => {
              const isSelected = selected.has(row.id);
              return (
                <TableRow
                  key={row.id}
                  onClick={() => toggle(row.id)}
                  className="border-b border-[#2a2a2a] hover:bg-[#313131]/50 cursor-pointer"
                >
                  <TableCell className="p-3 bg-[#2B2B2B] first:rounded-l-lg">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggle(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
                    />
                  </TableCell>

                  <TableCell className="p-3 bg-[#2B2B2B]">
                    <div className="flex items-center gap-2">
                      {tipoIconMap[row.tipo]}
                      <span className="text-white whitespace-nowrap">{row.tipo}</span>
                    </div>
                  </TableCell>

                  <TableCell className="p-3 bg-[#2B2B2B] text-white max-w-xs truncate">
                    {row.descricao}
                  </TableCell>

                  <TableCell className="p-3 bg-[#2B2B2B] text-white whitespace-nowrap">
                    {row.data}
                  </TableCell>

                  <TableCell className="p-3 bg-[#2B2B2B]">
                    <StatusBadge status={row.status} />
                  </TableCell>

                  <TableCell className="p-3 bg-[#2B2B2B] last:rounded-r-lg">
                    <AvatarStack suspeitos={row.suspeitos} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
