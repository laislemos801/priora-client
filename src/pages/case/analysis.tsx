import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
} from "reactflow";

import "reactflow/dist/style.css";
import SuspectNode from "@/components/analysis/SuspectNode";
import EvidenceNode from "@/components/analysis/EvidenceNode";
import VinculoEdge from "@/components/analysis/VinculoEdge";

const API_URL = "http://127.0.0.1:8000";

type Evidence = {
  id: string;
  nome: string;
  tipo: string;
  pesoCondicional: number;
  pesoEvidencia: number;
  pesoVinculo: number;
  status?: string;
  dataColeta?: string;
  descricao?: string | null;
};

type SuspectAnalysis = {
  id: string;
  nome: string;
  fotoUrl: string | null;
  probabilidadeAtual: number;
  posicaoRanking: number;
  nSuspeitos: number;
  evidencias: Evidence[];
};

const nodeTypes = {
  suspect: SuspectNode,
  evidence: EvidenceNode,
};

const edgeTypes = {
  vinculo: VinculoEdge,
};

function AnalysisIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-4 4 4 4-4" />
    </svg>
  );
}

export default function Analysis() {
  const { id: casoId } = useParams();

  const [suspects, setSuspects] = useState<SuspectAnalysis[]>([]);
  const [selected, setSelected] = useState<SuspectAnalysis | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!casoId) return;
    fetch(`${API_URL}/suspects/case/${casoId}`)
      .then((r) => r.json())
      .then(async (list) => {
        if (!Array.isArray(list) || list.length === 0) return;
        const first = await fetchAnalysis(list[0].id);
        setSuspects(list);
        setSelected(first);
      })
      .catch(() => {
        setSuspects([]);
        setSelected(null);
      });
  }, [casoId]);

  async function fetchAnalysis(suspeitoId: string): Promise<SuspectAnalysis> {
    const response = await fetch(`${API_URL}/analysis/case/${casoId}/suspect/${suspeitoId}`);
    return response.json();
  }

  async function handleSelectSuspect(s: { id: string }) {
    const data = await fetchAnalysis(s.id);
    setSelected(data);
    setDropdownOpen(false);
  }

  const formula = useCallback(() => {
    if (!selected) return null;
    const n = selected.nSuspeitos || 1;
    const prior = 1 / n;
    let pEH = 1, pENH = 1;

    if (selected.evidencias.length > 0) {
      selected.evidencias.forEach((e) => {
        const peso = e.pesoCondicional ?? 0;
        pEH *= peso;
        pENH *= 1 - peso;
      });
    } else {
      pEH = 0.001;
      pENH = 0.999;
    }

    const num = pEH * prior;
    const den = num + pENH * (1 - prior);
    const pHE = den > 0 ? num / den : 0;

    return { num, den, pHE, pENH, prior };
  }, [selected]);

  useEffect(() => {
    if (!selected) return;

    const suspectNode: Node = {
      id: selected.id,
      type: "suspect",

      position: {
        x: 800,
        y: 250,
      },

      data: {
        nome: selected.nome,
        fotoUrl: selected.fotoUrl,
     },
    };

    const centerX = 700;
    const centerY = 250;
    const radius = 250;

    const evidenceNodes: Node[] = selected.evidencias.map((ev, index) => {
      const angle =
        selected.evidencias.length === 1
          ? Math.PI
          : Math.PI / 2 +
            (index / (selected.evidencias.length - 1)) * Math.PI;

      return {
        id: ev.id,
        type: "evidence",

        position: {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
        },

        data: {
          nome: ev.nome,
          tipo: ev.tipo,
          peso: Math.round((ev.pesoEvidencia ?? 0) * 100),
        },
      };
    });

    const suspectX = 700;
    const suspectY = 250;

    const evidenceEdges: Edge[] = selected.evidencias.map((ev, index) => {

      const evNode = evidenceNodes[index];

      let targetHandle = "left";

      if (evNode.position.y < suspectY - 100) {
        targetHandle = "top";
      } else if (evNode.position.y > suspectY + 100) {
        targetHandle = "bottom";
      } else if (evNode.position.x > suspectX) {
        targetHandle = "right";
      }

      return {
        id: `edge-${ev.id}`,
        type: "vinculo",

        source: ev.id,
        target: selected.id,

        targetHandle,

        label: `${Math.round(ev.pesoVinculo * 100)}%`,
      };
    });

    setNodes([suspectNode, ...evidenceNodes]);
    setEdges(evidenceEdges);
  }, [selected]);

  const f = formula();

  const evidenciasValores =
    selected?.evidencias.length
      ? selected.evidencias
          .map((e) => e.pesoCondicional.toFixed(2))
          .join(" × ")
      : "";

  const denominatorPart =
    f ? f.pENH * (1 - f.prior) : 0;

  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-[#575757] bg-[#1e1e1e] overflow-hidden">

          {/* Header */}
          <header className="flex flex-col gap-4 border-b border-[#575757] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#139C73]"><AnalysisIcon /></span>
              <h1 className="text-lg font-semibold text-white">
                Análise Probabilística
              </h1>
            </div>

            {/* Suspect dropdown */}
            <div className="relative w-full md:w-auto">
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex w-full min-w-[220px] items-center gap-2.5 rounded-lg border border-[#3a3a3a] bg-[#252525] px-3 py-2 transition-colors hover:border-[#139C73] md:w-auto"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#139C73]/20 text-[11px] font-bold text-[#139C73]">
                  {selected?.nome.slice(0, 2).toUpperCase() ?? "—"}
                </div>
                <span className="flex-1 text-left text-sm font-medium text-white">
                  {selected?.nome ?? "Selecionar suspeito"}
                </span>
                <span className={`text-[10px] text-[#666] transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}>
                  <ChevronDown
                    size={14}
                    className={`text-[#666] transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-60 overflow-hidden rounded-xl border border-[#3a3a3a] bg-[#1e1e1e] shadow-2xl">
                  {suspects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectSuspect(s)}
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
          </header>

          {/* Main canvas */}
          <main className="p-4 md:p-6 space-y-6">
            <div className="h-[520px] w-full overflow-hidden rounded-xl border border-[#2a2a2a]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>

            {f && (
              <div className="max-w-md rounded-xl border border-[#343434] bg-[#222222] p-5">
                <div className="space-y-2 text-white">

                  {/* Equação expandida */}
                  <div className="text-[13px] font-light tracking-wide break-words">
                    P(H|E) = P(H)
                    {evidenciasValores && ` × ${evidenciasValores}`}
                  </div>

                  {/* Fração */}
                  <div className="flex items-center gap-4">

                    <span className="text-[13px] font-light whitespace-nowrap">
                      P(H|E)=
                    </span>

                    <div className="flex flex-col items-center min-w-[200px]">

                      <div className="w-full border-b border-white pb-1 text-center text-[13px] font-light">
                        {f.num.toFixed(5)}
                      </div>

                      <div className="pt-1 text-[13px] font-light">
                        {f.num.toFixed(5)} + {denominatorPart.toFixed(5)}
                      </div>

                    </div>

                  </div>

                  {/* Resultado Final */}
                  <div className="text-[15px] font-medium">
                    P(H|E) ≈
                    <span className="ml-2 text-[#139C73] font-semibold">
                      {f.pHE.toFixed(4)}
                    </span>
                  </div>

                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}