import {
  Fingerprint,
  Dna,
  MessageSquare,
  FileText,
  Video,
  Microscope,
  File,
} from "lucide-react";

import { Handle, Position } from "reactflow";

type Props = {
  data: {
    nome: string;
    tipo: string;
    peso: number;
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
};

export default function EvidenceNode({ data }: Props) {
  return (
    <>
      <Handle
        type="source"
        position={Position.Right}
        style={{
            width: 8,
            height: 8,
            background: "#ffffff",
            border: "2px solid #d3d3d3",
            borderRadius: "50%",
        }}
        />

      <Handle
        type="target"
        position={Position.Left}
        className="opacity-0"
      />

      <div className="w-[160px] rounded-xl border border-[#2e2e2e] bg-[#1e1e1e] p-3 shadow-xl">
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