import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";

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
  pesoVinculo: number;
  pesoFinal: number;

  suspectIds?: string[];

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

  bayes: {
    prior: number;
    pEH: number;
    numerator: number;
    denominator: number;
    posterior: number;
    probabilityPct: number;
    uncertaintyPct: number;
    position: number;
  };
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
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!casoId) return;
    fetch(`${API_URL}/suspects/case/${casoId}`)
      .then((r) => r.json())
      .then(async (list) => {
        if (!Array.isArray(list) || list.length === 0) return;
        setSuspects(list);

        // Se veio da query string, abre esse suspeito; senão abre o primeiro
        const suspectIdFromQuery = searchParams.get("suspect");
        const target = suspectIdFromQuery
          ? list.find((s) => s.id === suspectIdFromQuery) ?? list[0]
          : list[0];

        const first = await fetchAnalysis(target.id);
        setSelected(first);
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
          peso: Math.round((ev.pesoCondicional ?? 0) * 100),
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

            {selected && (

              selected.evidencias.length === 0 ? (
              <div className="rounded-xl border border-[#343434] bg-[#222222] p-8 text-center">
                <h3 className="text-white font-semibold mb-3">
                  Nenhuma evidência vinculada
                </h3>

                <p className="text-gray-400 text-sm max-w-xl mx-auto">
                  Este suspeito ainda não possui evidências associadas.
                  Portanto, o modelo bayesiano utiliza apenas a probabilidade
                  inicial (Prior), sem qualquer atualização baseada em evidências.
                </p>

                <div className="mt-6 inline-flex flex-col rounded-lg border border-[#333] bg-[#2A2A2A] px-6 py-4">
                  <span className="text-xs text-gray-400">
                    Probabilidade Atual
                  </span>

                  <span className="text-3xl font-bold text-[#139C73]">
                    {(selected.bayes.posterior * 100).toFixed(2)}%
                  </span>

                  <span className="text-xs text-gray-500 mt-1">
                    Igual ao Prior P(H)
                  </span>
                </div>
              </div>

              ) : (

              <div className="space-y-4">

                {/* Evidências */}
                <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">

                  <h3 className="text-white font-semibold mb-4">
                    1. Evidências Utilizadas
                  </h3>

                  <div className="mb-4 rounded-lg border border-[#333] bg-[#2A2A2A] p-4">

                    <div className="text-sm font-medium text-white mb-2">
                      Fórmula de Contribuição
                    </div>

                    <div className="text-sm text-[#139C73]">
                      1 + (Peso Evidência × Peso Vínculo × Fator de Exclusividade)
                    </div>

                    <div className="mt-3 text-xs text-gray-400">
                      <div>
                        Peso Evidência = confiabilidade da evidência
                      </div>

                      <div>
                        Peso Vínculo = força da ligação com o suspeito
                      </div>

                      <div>
                        Fator de Exclusividade = 1 / nº de suspeitos ligados à evidência
                      </div>
                    </div>

                  </div>

                  <div className="space-y-3">

                    {selected.evidencias.map((ev) => {

                      const competitors =
                        ev.suspectIds?.length || 1;

                      const contribution =
                        1 + (ev.pesoFinal * (1 / competitors));

                      return (

                        <div
                          key={ev.id}
                          className="rounded-lg border border-[#333] bg-[#2A2A2A] p-4"
                        >

                          <div className="flex items-center justify-between">

                            <div>

                              <div className="text-white font-medium">
                                {ev.nome}
                              </div>

                              <div className="text-xs text-gray-400">
                                {ev.tipo}
                              </div>

                            </div>

                            <div className="text-[#139C73] font-semibold">
                              {contribution.toFixed(2)}
                            </div>

                          </div>

                          <div className="mt-3 text-xs text-gray-400">

                            Evidência:
                            {" "}
                            {(ev.pesoCondicional * 100).toFixed(0)}%

                            {" • "}

                            Vínculo:
                            {" "}
                            {(ev.pesoVinculo * 100).toFixed(0)}%

                            {" • "}

                            Peso Final:
                            {" "}
                            {(ev.pesoFinal * 100).toFixed(0)}%

                          </div>

                          <div className="mt-3 text-sm text-white">
                            1 + (
                            {ev.pesoCondicional.toFixed(2)}
                            {" × "}
                            {ev.pesoVinculo.toFixed(2)}
                            {" × "}
                            1/{competitors}
                            )
                          </div>

                          <div className="mt-1 text-[#139C73] text-sm font-medium">
                            = {contribution.toFixed(2)}
                          </div>

                        </div>

                      );
                    })}

                  </div>

                </div>

                {/* Score LR */}
                <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">

                  <h3 className="text-white font-semibold mb-4">
                    2. Construção do Score LR (P(E|H))
                  </h3>

                  <div className="text-gray-400 text-sm text-center mb-4">
                    Multiplicação das contribuições de todas as evidências
                  </div>

                  <div className="text-center">

                    <div className="text-[#139C73] font-semibold break-all text-lg">

                      {selected.evidencias.length > 0
                        ? selected.evidencias
                            .map((ev) => {
                              const competitors =
                                ev.suspectIds?.length || 1;

                              const contribution =
                                1 + (ev.pesoFinal * (1 / competitors));

                              return contribution.toFixed(2);
                            })
                            .join(" × ")
                        : "1.00"}

                    </div>

                    <div className="mt-4 text-gray-400">
                      ↓
                    </div>

                    <div className="mt-4">

                      <div className="text-sm text-gray-400">
                        P(E|H)
                      </div>

                      <div className="text-xl font-bold text-[#139C73] mt-2">
                        {selected.bayes.pEH.toFixed(6)}
                      </div>

                    </div>

                  </div>

                </div>

                {/* Bayes */}
                <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">

                  <h3 className="text-white font-semibold mb-4">
                    3. Aplicação do Teorema de Bayes
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="rounded-lg bg-[#2A2A2A] p-4 text-center">

                      <div className="text-xs text-gray-400 mb-2">
                        Prior P(H)
                      </div>

                      <div className="text-white font-semibold">
                        {selected.bayes.prior.toFixed(6)}
                      </div>

                    </div>

                    <div className="rounded-lg bg-[#2A2A2A] p-4 text-center">

                      <div className="text-xs text-gray-400 mb-2">
                        P(E|H)
                      </div>

                      <div className="text-white font-semibold">
                        {selected.bayes.pEH.toFixed(6)}
                      </div>

                    </div>

                    <div className="rounded-lg bg-[#2A2A2A] p-4 text-center">

                      <div className="text-xs text-gray-400 mb-2">
                        Numerador
                      </div>

                      <div className="text-[#139C73] font-semibold">
                        {selected.bayes.numerator.toFixed(6)}
                      </div>

                    </div>

                  </div>

                  <div className="mt-4 rounded-lg border border-[#333] bg-[#2A2A2A] p-4">

                    <div className="text-xs text-gray-400 mb-2">
                      Cálculo do Numerador
                    </div>

                    <div className="text-white">
                      {selected.bayes.prior.toFixed(6)}
                      {" × "}
                      {selected.bayes.pEH.toFixed(6)}
                    </div>

                    <div className="mt-2 text-[#139C73] font-semibold">
                      = {selected.bayes.numerator.toFixed(6)}
                    </div>

                  </div>

                </div>

                {/* Resultado Final */}
                <div className="rounded-xl border border-[#343434] bg-[#222222] p-5">

                  <h3 className="text-white font-semibold mb-4">
                    4. Probabilidade Final
                  </h3>

                  <div className="max-w-md mx-auto">

                    <div className="rounded-lg border border-[#333] bg-[#2A2A2A] p-5">

                      <div className="text-center text-sm text-gray-400 mb-4">
                        P(H|E)
                      </div>

                      <div className="text-center">

                        <div className="border-b border-white pb-2 text-white font-medium">
                          {selected.bayes.numerator.toFixed(6)}
                        </div>

                        <div className="pt-2 text-white font-medium">
                          {selected.bayes.denominator.toFixed(6)}
                        </div>

                      </div>

                      <div className="mt-5 text-center text-[#139C73] font-semibold text-xl">
                        = {selected.bayes.posterior.toFixed(6)}
                      </div>

                    </div>

                    <div className="mt-6 text-center">

                      <div className="text-xs text-gray-400 mb-2">
                        Probabilidade Posterior
                      </div>

                      <div className="text-2xl font-bold text-[#139C73]">
                        {(selected.bayes.posterior * 100).toFixed(2)}%
                      </div>

                    </div>

                    <div className="mt-4 text-center text-xs text-gray-400 max-w-md mx-auto">
                      O denominador é a soma das pontuações de todos os suspeitos.
                      Ele normaliza o resultado para que as probabilidades finais somem 100% no conjunto.
                    </div>

                  </div>

                </div>

              </div>
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
}