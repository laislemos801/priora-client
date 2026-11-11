import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import NavIcon from "@/components/ui/NavIcon";
import EmptyState, { PAGE_BODY_FILL, PAGE_CARD_FILL } from "@/components/ui/EmptyState";
import ReactFlow, { Background, Controls, useNodesInitialized, useReactFlow, type Node, type Edge } from "reactflow";
import "reactflow/dist/style.css";

import SuspectNode from "@/components/analysis/SuspectNode";
import EvidenceNode from "@/components/analysis/EvidenceNode";
import VinculoEdge from "@/components/analysis/VinculoEdge";
import SuspectDropdown from "@/components/analysis/SuspectDropdown";
import NoEvidenceState from "@/components/analysis/NoEvidenceState";
import EvidenceSection from "@/components/analysis/EvidenceSection";
import LRScoreSection from "@/components/analysis/LRScoreSection";
import BayesSection from "@/components/analysis/BayesSection";
import FinalProbabilitySection from "@/components/analysis/FinalProbabilitySection";
import type { SuspectAnalysis } from "@/components/analysis/types";
import AnalysisSkeleton from "@/components/analysis/AnalysisSkeleton";
import { apiFetch } from "@/lib/api";
import { ViewEvidenceModal, type Evidencia } from "@/components/evidence/table_evidence";

const nodeTypes = { suspect: SuspectNode, evidence: EvidenceNode };
const edgeTypes = { vinculo: VinculoEdge };

/** Enquadra o grafo depois que os cartões são medidos e sempre que troca o suspeito ou a quantidade. */
function AutoFit({ trigger }: { trigger: string }) {
  const { fitView } = useReactFlow();
  const ready = useNodesInitialized();
  useEffect(() => {
    if (ready) fitView({ padding: 0.12, duration: 0 });
  }, [ready, trigger, fitView]);
  return null;
}

export default function Analysis() {
  const { id: casoId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [suspects, setSuspects] = useState<SuspectAnalysis[]>([]);
  const [selected, setSelected] = useState<SuspectAnalysis | null>(null);
  // evidência aberta no modal de detalhes (o mesmo da página de Evidências)
  const [openEvidence, setOpenEvidence] = useState<SuspectAnalysis["evidencias"][number] | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAnalysis(suspeitoId: string): Promise<SuspectAnalysis> {
    const res = await apiFetch(`/analysis/case/${casoId}/suspect/${suspeitoId}`);
    return res.json();
  }

  async function handleSelectSuspect(s: { id: string }) {
    setSelected(await fetchAnalysis(s.id));
    setDropdownOpen(false);
  }

  useEffect(() => {
    if (!casoId) return;
    apiFetch(`/suspects/case/${casoId}`)
      .then((r) => r.json())
      .then(async (list) => {
        if (!Array.isArray(list) || list.length === 0) return;
        setSuspects(list);
        const suspectIdFromQuery = searchParams.get("suspect");
        const target = suspectIdFromQuery
          ? list.find((s) => s.id === suspectIdFromQuery) ?? list[0]
          : list[0];
        setSelected(await fetchAnalysis(target.id));
      })
      .finally(() => setLoading(false));
  }, [casoId]);

  useEffect(() => {
    if (!selected) return;

    // Evidências distribuídas em raio (elipse) ao redor do suspeito. O raio cresce com a
    // quantidade para que os cartões (~160x129 px) nunca se sobreponham.
    const SUSPECT = { x: 800, y: 250 };               // canto do nó do suspeito
    const CENTER = { x: SUSPECT.x + 129, y: SUSPECT.y + 70 };   // o nó do suspeito mede ~258x141
    const NODE = { w: 160, h: 129 };                            // cartão de evidência
    const n = selected.evidencias.length;
    const rx = Math.max(300, (n * (NODE.w + 40)) / (2 * Math.PI) * 1.35);
    const ry = Math.max(230, rx * 0.65);

    // A conexão liga o par de lados mais próximo entre o cartão e o suspeito (o lado de dentro de cada um).
    type Side = "top" | "right" | "bottom" | "left";
    const SIDE_OFFSETS = (w: number, h: number): Record<Side, [number, number]> => ({
      top: [0, -h / 2], right: [w / 2, 0], bottom: [0, h / 2], left: [-w / 2, 0],
    });
    const SUSPECT_SIZE = { w: 258, h: 141 };
    const nearestSides = (dx: number, dy: number): { ev: Side; su: Side } => {
      const evOff = SIDE_OFFSETS(NODE.w, NODE.h);
      const suOff = SIDE_OFFSETS(SUSPECT_SIZE.w, SUSPECT_SIZE.h);
      let best = { ev: "left" as Side, su: "right" as Side, d: Infinity };
      for (const ev of Object.keys(evOff) as Side[]) {
        for (const su of Object.keys(suOff) as Side[]) {
          const d = Math.hypot(dx + evOff[ev][0] - suOff[su][0], dy + evOff[ev][1] - suOff[su][1]);
          if (d < best.d) best = { ev, su, d };
        }
      }
      return best;
    };

    const placed = selected.evidencias.map((ev, index) => {
      // começa à esquerda e distribui uniformemente em volta do suspeito
      const angle = Math.PI + (index / Math.max(n, 1)) * 2 * Math.PI;
      const dx = Math.cos(angle) * rx;
      const dy = Math.sin(angle) * ry;
      return { ev, dx, dy };
    });

    const evidenceNodes: Node[] = placed.map(({ ev, dx, dy }) => ({
      id: ev.id, type: "evidence",
      position: { x: CENTER.x + dx - NODE.w / 2, y: CENTER.y + dy - NODE.h / 2 },
      data: {
        nome: ev.nome, tipo: ev.tipo, peso: Math.round((ev.pesoCondicional ?? 0) * 100),
        side: nearestSides(dx, dy).ev, // lado do cartão voltado para o suspeito
      },
    }));

    const evidenceEdges: Edge[] = placed.map(({ ev, dx, dy }) => ({
      id: `edge-${ev.id}`, type: "vinculo",
      source: ev.id, sourceHandle: nearestSides(dx, dy).ev, target: selected.id, targetHandle: nearestSides(dx, dy).su,
      label: `${Math.round(ev.pesoVinculo * 100)}%`,
    }));

    setNodes([{ id: selected.id, type: "suspect", position: SUSPECT, data: { nome: selected.nome, fotoUrl: selected.fotoUrl } }, ...evidenceNodes]);
    setEdges(evidenceEdges);
  }, [selected]);

  if (loading) return <AnalysisSkeleton />;

  // sem suspeitos não há o que analisar: mesmo estado vazio das outras abas
  if (suspects.length === 0) {
    return (
      <div className="min-h-full bg-[#242424]">
        <div className="px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
          <div className={`overflow-hidden rounded-xl border border-[#575757] bg-[#1e1e1e] ${PAGE_CARD_FILL}`}>
            <header className="flex items-center gap-3 border-b border-[#575757] px-5 py-4">
              <span className="text-[#139C73]"><NavIcon name="analysis" /></span>
              <h1 className="text-lg font-semibold text-white">Análise Probabilística</h1>
            </header>

            <main className={`${PAGE_BODY_FILL} p-4 md:p-6`}>
              <EmptyState
                icon={<NavIcon name="analysis" />}
                title="Nenhum suspeito para analisar"
                description="A análise probabilística mostra como cada evidência pesa no cálculo de um suspeito. Cadastre suspeitos e evidências para começar."
                action={{ label: "Ir para Ranking de suspeitos", onClick: () => navigate(`/case/${casoId}/ranking`) }}
              />
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#242424]">
      <div className="px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <div className="rounded-xl border border-[#575757] bg-[#1e1e1e] overflow-hidden">
          <header className="flex flex-col gap-4 border-b border-[#575757] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#139C73]"><NavIcon name="analysis" /></span>
              <h1 className="text-lg font-semibold text-white">Análise Probabilística</h1>
            </div>
            <SuspectDropdown
              suspects={suspects}
              selected={selected}
              dropdownOpen={dropdownOpen}
              onToggle={() => setDropdownOpen((p) => !p)}
              onSelect={handleSelectSuspect}
            />
          </header>

          <main className="p-4 md:p-6 space-y-6">
            <div className="h-[520px] w-full overflow-hidden rounded-xl border border-[#2a2a2a]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                onNodeClick={(_, node) => {
                  if (node.type !== "evidence") return;
                  const ev = selected?.evidencias.find((e) => e.id === node.id);
                  if (ev) setOpenEvidence(ev);
                }}
              >
                <AutoFit trigger={`${selected?.id}-${nodes.length}`} />
                <Background />
                <Controls className="bg-zinc-900! border-zinc-700 [&>button]:bg-zinc-900! [&>button]:border-zinc-700! [&>button]:text-zinc-300! [&>button:hover]:bg-zinc-800!" />
              </ReactFlow>
            </div>

            {selected && (
              selected.evidencias.length === 0 ? (
                <NoEvidenceState selected={selected} />
              ) : (
                <div className="space-y-4">
                  <EvidenceSection evidencias={selected.evidencias} />
                  <LRScoreSection evidencias={selected.evidencias} pEH={selected.bayes.pEH} />
                  <BayesSection bayes={selected.bayes} />
                  <FinalProbabilitySection bayes={selected.bayes} />
                </div>
              )
            )}
          </main>
        </div>
      </div>

      {openEvidence && (
        <ViewEvidenceModal
          evidence={{
            id: openEvidence.id,
            nome: openEvidence.nome,
            tipo: openEvidence.tipo,
            status: (openEvidence.status as Evidencia["status"]) ?? "Coletada",
            dataColeta: openEvidence.dataColeta ?? null,
            pesoCondicional: openEvidence.pesoCondicional,
            descricao: openEvidence.descricao ?? null,
            suspeitos: [],
          }}
          onClose={() => setOpenEvidence(null)}
        />
      )}
    </div>
  );
}