import { X, Fingerprint, Dna, MessageSquare, FileText, Video, Microscope, File } from "lucide-react";

type Suspect = { id: string; nome: string };

export type EvidenceForView = {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  descricao?: string | null;
  dataColeta?: string | null;
  pesoCondicional?: number | null;
  pesoVinculo?: number | null;
  suspeitos?: Suspect[];
};

const tipoIconMap: Record<string, React.ReactNode> = {
  Digital:    <Fingerprint size={16} className="text-emerald-400" />,
  DNA:        <Dna         size={16} className="text-emerald-400" />,
  Depoimento: <MessageSquare size={16} className="text-emerald-400" />,
  Documental: <FileText    size={16} className="text-emerald-400" />,
  Audiovisual:<Video       size={16} className="text-emerald-400" />,
  Biológica:  <Microscope  size={16} className="text-emerald-400" />,
  Física:     <File        size={16} className="text-emerald-400" />,
};

const STATUS_STYLES: Record<string, string> = {
  Coletada:           "bg-[#455A64]/34 text-[#4584A3] border border-[#4584A3]",
  "Em análise":       "bg-[#FFA648]/34 text-[#FFA648] border border-[#FFA648]",
  Custodiada:         "bg-[#139C73]/34 text-[#139C73] border border-[#139C73]",
  Descartada:         "bg-[#e05555]/20 text-[#e05555] border border-[#e05555]",
  "Enviada a perícia":"bg-[#9b59b6]/20 text-[#9b59b6] border border-[#9b59b6]",
};

function formatDate(raw: string | null | undefined): string {
  if (!raw) return "—";
  const [year, month, day] = raw.split("-");
  if (!year || !month || !day) return raw;
  return `${day}/${month}/${year}`;
}

const LABEL = "text-[11px] font-medium text-[#888] uppercase tracking-widest block mb-1.5";

type Props = { evidence: EvidenceForView; onClose: () => void };

export default function ViewEvidenceModal({ evidence, onClose }: Props) {
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
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div className="sm:col-span-2">
            <span className={LABEL}>Nome da evidência</span>
            <p className="text-[14px] text-[#e8e8e8]">{evidence.nome}</p>
          </div>

          <div>
            <span className={LABEL}>Tipo</span>
            <div className="flex items-center gap-2">
              {tipoIconMap[evidence.tipo] ?? <File size={16} className="text-emerald-400" />}
              <span className="text-[14px] text-[#e8e8e8]">{evidence.tipo}</span>
            </div>
          </div>

          <div>
            <span className={LABEL}>Status</span>
            <span className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${STATUS_STYLES[evidence.status] ?? "bg-gray-500/20 text-gray-400 border border-gray-500"}`}>
              {evidence.status}
            </span>
          </div>

          <div>
            <span className={LABEL}>Data de coleta</span>
            <p className="text-[14px] text-[#e8e8e8]">{formatDate(evidence.dataColeta)}</p>
          </div>

          <div>
            <span className={LABEL}>Peso condicional</span>
            <p className="text-[14px] text-[#e8e8e8]">{evidence.pesoCondicional ?? "—"}</p>
          </div>

          {evidence.pesoVinculo != null && (
            <div>
              <span className={LABEL}>Peso de vínculo</span>
              <p className="text-[14px] text-[#e8e8e8]">{evidence.pesoVinculo}</p>
            </div>
          )}

          {evidence.suspeitos && evidence.suspeitos.length > 0 && (
            <div className="sm:col-span-2">
              <span className={LABEL}>Suspeitos vinculados</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {evidence.suspeitos.map((s) => (
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

            {evidence.descricao != null && evidence.descricao.trim() !== "" && (
                <div className="sm:col-span-2">
                    <span className={LABEL}>Descrição</span>
                    <p className="text-[14px] text-[#a6a6a6] leading-relaxed whitespace-pre-wrap">
                        {evidence.descricao}
                    </p>
                </div>
            )}
        </div>

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