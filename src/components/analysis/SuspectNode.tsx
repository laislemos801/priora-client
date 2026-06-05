import { Handle, Position } from "reactflow";

type Props = {
  data: {
    nome: string;
    fotoUrl?: string | null;
  };
};

export default function SuspectNode({ data }: Props) {
  return (
    <>
      <Handle
        type="target"
        id="left"
        position={Position.Left}
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
        id="right"
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
        id="top"
        position={Position.Top}
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
        id="bottom"
        position={Position.Bottom}
        style={{
          width: 8,
          height: 8,
          background: "#ffffff",
          border: "2px solid #d3d3d3",
          borderRadius: "50%",
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        className="opacity-0"
      />

      <div className="flex min-w-[180px] flex-col items-center rounded-xl border border-[#3a3a3a] bg-[#232323] px-5 py-4 shadow-2xl">
        {data.fotoUrl ? (
          <img
            src={data.fotoUrl}
            alt={data.nome}
            className="mb-2 h-11 w-11 rounded-full border-2 border-[#139C73]/40 object-cover"
          />
        ) : (
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#139C73]/30 bg-[#139C73]/20 text-sm font-bold text-[#139C73]">
            {data.nome.slice(0, 2).toUpperCase()}
          </div>
        )}

        <p className="text-[14px] font-light tracking-widest text-[#ffffff]/65">
          Suspeito
        </p>

        <p className="mt-1 text-center text-[20px] font-medium text-white">
          {data.nome}
        </p>
      </div>
    </>
  );
}