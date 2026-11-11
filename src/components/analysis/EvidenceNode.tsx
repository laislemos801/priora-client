import {
  Fingerprint,
  Dna,
  MessageSquare,
  FileText,
  Video,
  Microscope,
  File, Lightbulb, History, ClipboardCheck, Phone, Activity
} from "lucide-react";

import { Handle, Position } from "reactflow";

type Props = {
  data: {
    nome: string;
    tipo: string;
    peso: number;
    /** Lado do cartão voltado para o suspeito (de onde sai a conexão). */
    side?: "top" | "right" | "bottom" | "left";
  };
};

const tipoIconMap: Record<string, React.ReactNode> = {
  Digital: <Fingerprint size={16} className="text-[#139C73]" />,
  DNA: <Dna size={16} className="text-[#139C73]" />,
  Depoimento: <MessageSquare size={16} className="text-[#139C73]" />,
  Documental: <FileText size={16} className="text-[#139C73]" />,
  Audiovisual: <Video size={16} className="text-[#139C73]" />,
  Biológica: <Microscope size={16} className="text-[#139C73]" />,
  Física: <File size={16} className="text-[#139C73]" />,
  Motivação: <Lightbulb size={16} className="text-[#139C73]" />,
  Antecedente: <History size={16} className="text-[#139C73]" />,
  Pericial: <ClipboardCheck size={16} className="text-[#139C73]" />,
  Telefônica: <Phone size={16} className="text-[#139C73]" />,
  Comportamento: <Activity size={16} className="text-[#139C73]" />,
};

const SIDES: [string, Position][] = [
  ["top", Position.Top],
  ["right", Position.Right],
  ["bottom", Position.Bottom],
  ["left", Position.Left],
];

export default function EvidenceNode({ data }: Props) {
  return (
    <>
      {/* A conexão sai sempre do lado do cartão voltado para o suspeito (o de dentro). */}
      {SIDES.map(([id, position]) => (
        <Handle
          key={id}
          id={id}
          type="source"
          position={position}
          style={
            (data.side ?? "right") === id
              ? { width: 8, height: 8, background: "#ffffff", border: "2px solid #d3d3d3", borderRadius: "50%" }
              : { opacity: 0, pointerEvents: "none" }
          }
        />
      ))}

      <Handle
        type="target"
        position={Position.Left}
        className="opacity-0"
      />

      <div
        title={`${data.nome} (clique para ver os detalhes)`}
        className="w-[160px] cursor-pointer rounded-xl border border-[#2e2e2e] bg-[#1e1e1e] p-3 shadow-xl transition-colors hover:border-[#139C73]/60"
      >
        <div className="mb-1.5 flex items-center gap-1.5">
          {tipoIconMap[data.tipo] ?? (
            <File size={16} className="text-[#139C73]" />
          )}

          <span className="text-[10px] font-medium uppercase tracking-wide text-[#ffffff]/65">
            {data.tipo}
          </span>
        </div>

        <p className="truncate text-sm font-semibold text-white">
          {data.nome}
        </p>

        <div className="mt-2 border-t border-[#2a2a2a] pt-2">
          <p className="mb-0.5 text-[12px] uppercase tracking-wide text-[#ffffff]/65">
            Evidência
          </p>

          <p className="text-base font-medium text-[#ffffff]">
            {data.peso}%
          </p>
        </div>
      </div>
    </>
  );
}