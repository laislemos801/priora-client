import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import NavIcon from "@/components/ui/NavIcon";
import EmptyState, { PAGE_BODY_FILL, PAGE_CARD_FILL } from "@/components/ui/EmptyState";
import ReactFlow, { Background, Controls, type Node, type Edge } from "reactflow";
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

const nodeTypes = { suspect: SuspectNode, evidence: EvidenceNode };
const edgeTypes = { vinculo: VinculoEdge };

export default function Analysis() {
  const { id: casoId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [suspects, setSuspects] = useState<SuspectAnalysis[]>([]);
  const [selected, setSelected] = useState<SuspectAnalysis | null>(null);
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

    const centerX = 700, centerY = 250, radius = 250;
    const n = selected.evidencias.length;

    // Até 5 evidências: semicírculo à esquerda do suspeito. Com mais que isso os cartões
    // (~190x120 px) se sobrepõem no arco, então vão para colunas lado a lado, uma abaixo da outra.
    const PER_COLUMN = 5, ROW_GAP = 150, COL_GAP = 250;
    const columns = Math.ceil(n / PER_COLUMN);
    const perColumn = Math.ceil(n / columns);

    const evidenceNodes: Node[] = selected.evidencias.map((ev, index) => {
      let position: { x: number; y: number };
      if (n <= PER_COLUMN) {
        const angle = n === 1
          ? Math.PI
          : Math.PI / 2 + (index / (n - 1)) * Math.PI;
        position = { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius };
      } else {
        const col = Math.floor(index / perColumn);
        const row = index % perColumn;
        const inColumn = Math.min(perColumn, n - col * perColumn);
        position = {
          x: 800 - 320 - col * COL_GAP,
          // centraliza cada coluna na altura do suspeito; colunas alternadas ficam meio passo deslocadas
          y: centerY - ((inColumn - 1) * ROW_GAP) / 2 + row * ROW_GAP + (col % 2) * (ROW_GAP / 2),
        };
      }
      return {
        id: ev.id, type: "evidence",
        position,
        data: { nome: ev.nome, tipo: ev.tipo, peso: Math.round((ev.pesoCondicional ?? 0) * 100) },
      };
    });

    const evidenceEdges: Edge[] = selected.evidencias.map((ev, index) => {
      const evNode = evidenceNodes[index];
      let targetHandle = "left";
      if (n > PER_COLUMN) targetHandle = "left";
      else if (evNode.position.y < centerY - 100) targetHandle = "top";
      else if (evNode.position.y > centerY + 100) targetHandle = "bottom";
      else if (evNode.position.x > centerX) targetHandle = "right";
      return {
        id: `edge-${ev.id}`, type: "vinculo",
        source: ev.id, target: selected.id, targetHandle,
        label: `${Math.round(ev.pesoVinculo * 100)}%`,
      };
    });

    setNodes([{ id: selected.id, type: "suspect", position: { x: 800, y: 250 }, data: { nome: selected.nome, fotoUrl: selected.fotoUrl } }, ...evidenceNodes]);
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
              <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} fitView>
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
    </div>
  );
}