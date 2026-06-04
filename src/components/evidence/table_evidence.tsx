import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Fingerprint, Dna, MessageSquare, FileText, Video, Microscope, File, Eye, X } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../../@/components/ui/table";
import { Checkbox } from "../../../@/components/ui/checkbox";
import type { EvidenceFilters } from "../../pages/case/evidence";

type Status = "Coletada" | "Em análise" | "Custodiada" | "Descartada" | "Enviada a perícia";

interface SuspeitoVinculo { id: string; nome: string; }

interface Evidencia {
  id: string; nome: string; tipo: string; status: Status;
  dataColeta: string | null; pesoCondicional: number; pesoVinculo?: number | null;
  descricao?: string | null; suspeitos: SuspeitoVinculo[];
}

function formatDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  const [year, month, day] = raw.split("-");
  if (!year || !month || !day) return raw;
  return `${day}/${month}/${year}`;
}

function getInitials(nome: string): string {
  const parts = nome.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = ["#e74c3c","#3498db","#2ecc71","#f39c12","#9b59b6","#1abc9c","#e67e22","#e91e63"];
function getColor(nome: string): string {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const tipoIconMap: Record<string, React.ReactNode> = {
  Digital:    <Fingerprint size={18} className="text-emerald-400" />,
  DNA:        <Dna         size={18} className="text-emerald-400" />,
  Depoimento: <MessageSquare size={18} className="text-emerald-400" />,
  Documental: <FileText    size={18} className="text-emerald-400" />,
  Audiovisual:<Video       size={18} className="text-emerald-400" />,
  Biológica:  <Microscope  size={18} className="text-emerald-400" />,
  Física:     <File        size={18} className="text-emerald-400" />,
};

const STATUS_STYLES: Record<string, string> = {
  Coletada:            "bg-[#455A64]/34 text-[#4584A3] border border-[#4584A3]",
  "Em análise":        "bg-[#FFA648]/34 text-[#FFA648] border border-[#FFA648]",
  Custodiada:          "bg-[#139C73]/34 text-[#139C73] border border-[#139C73]",
  Descartada:          "bg-[#e05555]/20 text-[#e05555] border border-[#e05555]",
  "Enviada a perícia": "bg-[#9b59b6]/20 text-[#9b59b6] border border-[#9b59b6]",
};

const LABEL = "text-[11px] font-medium text-[#888] uppercase tracking-widest block mb-1.5";

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${STATUS_STYLES[status] ?? "bg-gray-500/20 text-gray-400 border border-gray-500"}`}>
      {status}
    </span>
  );
}

function AvatarStack({ suspeitos }: { suspeitos: SuspeitoVinculo[] }) {
  if (!suspeitos || suspeitos.length === 0) return <span className="text-xs text-gray-500">—</span>;
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {suspeitos.slice(0, 3).map((s, i) => (
          <div key={s.id} title={s.nome}
            style={{ background: getColor(s.nome), marginLeft: i === 0 ? 0 : -8, zIndex: suspeitos.length - i }}
            className="w-7 h-7 rounded-full border-2 border-[#1e2436] flex items-center justify-center text-[10px] text-white font-semibold">
            {getInitials(s.nome)}
          </div>
        ))}
      </div>
      {suspeitos.length > 3 && <span className="text-xs text-gray-400">+{suspeitos.length - 3}</span>}
    </div>
  );
}

// ─── View Modal ────────────────────────────────────────────────────────────────

function ViewEvidenceModal({ evidence, onClose }: { evidence: Evidencia; onClose: () => void }) {
  const [detail, setDetail] = useState<Evidencia>(evidence);
  const [loadingDetail, setLoadingDetail] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  // Busca o detalhe completo pelo ID para garantir que descricao venha da API
  useEffect(() => {
    fetch(`http://localhost:8000/evidences/${evidence.id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => setDetail(data))
      .catch(() => { /* mantém os dados da lista como fallback */ })
      .finally(() => setLoadingDetail(false));
  }, [evidence.id]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3">
      <div className="bg-[#282828] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[10px] border border-[#2e2e2e]">

        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#2e2e2e]">
          <h2 className="text-[15px] font-medium text-[#e8e8e8]">Detalhes da evidência</h2>
          <button
            onClick={onClose}
            className="text-[#ccc] hover:bg-[#ccc]/10 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        {loadingDetail ? (
          <p className="text-sm text-gray-400 p-6">Carregando detalhes...</p>
        ) : (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div className="sm:col-span-2">
              <span className={LABEL}>Nome da evidência</span>
              <p className="text-[14px] text-[#e8e8e8]">{detail.nome}</p>
            </div>

            <div>
              <span className={LABEL}>Tipo</span>
              <div className="flex items-center gap-2">
                {tipoIconMap[detail.tipo] ?? <File size={16} className="text-emerald-400" />}
                <span className="text-[14px] text-[#e8e8e8]">{detail.tipo}</span>
              </div>
            </div>

            <div>
              <span className={LABEL}>Status</span>
              <StatusBadge status={detail.status} />
            </div>

            <div>
              <span className={LABEL}>Data de coleta</span>
              <p className="text-[14px] text-[#e8e8e8]">{formatDate(detail.dataColeta)}</p>
            </div>

            <div>
              <span className={LABEL}>Peso condicional</span>
              <p className="text-[14px] text-[#e8e8e8]">{detail.pesoCondicional ?? "—"}</p>
            </div>

            {detail.pesoVinculo != null && (
              <div>
                <span className={LABEL}>Peso de vínculo</span>
                <p className="text-[14px] text-[#e8e8e8]">{detail.pesoVinculo}</p>
              </div>
            )}

            {detail.suspeitos && detail.suspeitos.length > 0 && (
              <div className="sm:col-span-2">
                <span className={LABEL}>Suspeitos vinculados</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {detail.suspeitos.map((s) => (
                    <span
                      key={s.id}
                      className="bg-[#139C73]/15 text-[#139C73] text-xs px-3 py-1 rounded-full"
                    >
                      {s.nome}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {detail.descricao != null && detail.descricao.trim() !== "" && (
              <div className="sm:col-span-2">
                <span className={LABEL}>Descrição</span>
                <p className="text-[14px] text-[#a6a6a6] leading-relaxed whitespace-pre-wrap">
                  {detail.descricao}
                </p>
              </div>
            )}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end px-5 py-4 border-t border-[#2e2e2e]">
          <button
            onClick={onClose}
            className="bg-transparent border border-[#434343] text-[#ccc] rounded-md px-4 py-2 text-sm hover:bg-[#333] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Card ───────────────────────────────────────────────────────────────

function EvidenciaCard({
  row, isSelected, onToggle, onView,
}: {
  row: Evidencia; isSelected: boolean; onToggle: () => void; onView: () => void;
}) {
  return (
    <div onClick={onToggle} className="bg-[#2B2B2B] rounded-lg p-4 flex flex-col gap-3 cursor-pointer active:bg-[#313131] transition-colors">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(v) => { onToggle(); }}
            onClick={(e) => e.stopPropagation()}
            className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
          />
          <div className="flex items-center gap-2">
            {tipoIconMap[row.tipo] ?? <File size={18} className="text-emerald-400" />}
            <span className="text-white font-medium text-sm">{row.tipo}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={row.status} />
          <button
            onClick={(e) => { e.stopPropagation(); onView(); }}
            className="p-1.5 rounded-md hover:bg-[#444] transition-colors text-[#888] hover:text-white"
            title="Ver detalhes"
          >
            <Eye size={15} />
          </button>
        </div>
      </div>
      <p className="text-[#9ca3af] text-sm line-clamp-2 pl-6">{row.nome}</p>
      <div className="flex items-center justify-between pl-6">
        <span className="text-[#9ca3af] text-xs">{formatDate(row.dataColeta)}</span>
        <AvatarStack suspeitos={row.suspeitos} />
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function EvidenciasTable({
  filters, refreshKey, onSelectionChange,
}: {
  filters: EvidenceFilters; refreshKey: number; onSelectionChange?: (ids: string[]) => void;
}) {
  const { id: casoId } = useParams<{ id: string }>();
  const [evidencias, setEvidencias]     = useState<Evidencia[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [selected, setSelected]         = useState<Set<string>>(new Set());
  const [viewEvidence, setViewEvidence] = useState<Evidencia | null>(null);

  useEffect(() => { onSelectionChange?.([...selected]); }, [selected]);
  useEffect(() => { setSelected(new Set()); }, [refreshKey]);

  useEffect(() => {
    if (!casoId) return;
    setLoading(true);
    fetch(`http://localhost:8000/evidences/case/${casoId}`)
      .then((r) => { if (!r.ok) throw new Error(`Erro ${r.status}`); return r.json(); })
      .then((data) => setEvidencias(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [casoId, refreshKey]);

  const filtered = useMemo(() => {
    return evidencias.filter((e) => {
      if (filters.search && !e.nome.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.date && e.dataColeta && e.dataColeta !== filters.date) return false;
      if (filters.status.length && !filters.status.includes(e.status)) return false;
      if (filters.tipo.length && !filters.tipo.includes(e.tipo)) return false;
      if (filters.suspeitos.length) {
        const ids = e.suspeitos.map((s) => s.id);
        if (!filters.suspeitos.some((id) => ids.includes(id))) return false;
      }
      return true;
    });
  }, [evidencias, filters]);

  const toggle = (id: string) => {
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };
  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(filtered.map((e) => e.id)) : new Set());
  };

  const allSelected     = filtered.length > 0 && selected.size === filtered.length;
  const isIndeterminate = selected.size > 0 && selected.size < filtered.length;

  if (loading) return <p className="text-sm text-gray-400 p-6">Carregando evidências...</p>;
  if (error)   return <p className="text-sm text-red-400 p-6">{error}</p>;
  if (filtered.length === 0) return <p className="text-sm text-gray-500 p-6">Nenhuma evidência encontrada.</p>;

  return (
    <div className="p-2 sm:p-6 w-full">

      {/* Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center gap-2 px-1">
          <Checkbox
            checked={isIndeterminate ? "indeterminate" : allSelected}
            onCheckedChange={(v) => toggleAll(!!v)}
            className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
          />
          <span className="text-[#9ca3af] text-xs">
            {selected.size > 0 ? `${selected.size} selecionado${selected.size > 1 ? "s" : ""}` : "Selecionar todos"}
          </span>
        </div>
        {filtered.map((row) => (
          <EvidenciaCard
            key={row.id}
            row={row}
            isSelected={selected.has(row.id)}
            onToggle={() => toggle(row.id)}
            onView={() => setViewEvidence(row)}
          />
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-y-auto">
        <Table className="border-separate border-spacing-y-2">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="p-3">
                <Checkbox
                  checked={isIndeterminate ? "indeterminate" : allSelected}
                  onCheckedChange={(v) => toggleAll(!!v)}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-sm border-[#575757] data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
                />
              </TableHead>
              <TableHead className="text-white">Tipo</TableHead>
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">Data</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Suspeitos</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => {
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
                      {tipoIconMap[row.tipo] ?? <File size={18} className="text-emerald-400" />}
                      <span className="text-white whitespace-nowrap">{row.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="p-3 bg-[#2B2B2B] text-white max-w-xs truncate">{row.nome}</TableCell>
                  <TableCell className="p-3 bg-[#2B2B2B] text-white whitespace-nowrap">{formatDate(row.dataColeta)}</TableCell>
                  <TableCell className="p-3 bg-[#2B2B2B]"><StatusBadge status={row.status} /></TableCell>
                  <TableCell className="p-3 bg-[#2B2B2B]"><AvatarStack suspeitos={row.suspeitos} /></TableCell>
                  <TableCell className="p-3 bg-[#2B2B2B] last:rounded-r-lg">
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewEvidence(row); }}
                      className="p-1.5 rounded-md hover:bg-[#444] transition-colors text-[#888] hover:text-white"
                      title="Ver detalhes"
                    >
                      <Eye size={15} />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {viewEvidence && (
        <ViewEvidenceModal
          evidence={viewEvidence}
          onClose={() => setViewEvidence(null)}
        />
      )}
    </div>
  );
}
