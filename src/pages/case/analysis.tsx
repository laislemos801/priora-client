import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
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

const API_URL = "http://127.0.0.1:8000";

const nodeTypes = { suspect: SuspectNode, evidence: EvidenceNode };
const edgeTypes = { vinculo: VinculoEdge };

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
  const [searchParams] = useSearchParams();

  const [suspects, setSuspects] = useState<SuspectAnalysis[]>([]);
  const [selected, setSelected] = useState<SuspectAnalysis | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAnalysis(suspeitoId: string): Promise<SuspectAnalysis> {
    const res = await fetch(`${API_URL}/analysis/case/${casoId}/suspect/${suspeitoId}`);
    return res.json();
  }

  async function handleSelectSuspect(s: { id: string }) {
    setSelected(await fetchAnalysis(s.id));
    setDropdownOpen(false);
  }

  useEffect(() => {
    if (!casoId) return;
    fetch(`${API_URL}/suspects/case/${casoId}`)
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

    const evidenceNodes: Node[] = selected.evidencias.map((ev, index) => {
      const angle = selected.evidencias.length === 1
        ? Math.PI
        : Math.PI / 2 + (index / (selected.evidencias.length - 1)) * Math.PI;
      return {
        id: ev.id, type: "evidence",
        position: { x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius },
        data: { nome: ev.nome, tipo: ev.tipo, peso: Math.round((ev.pesoCondicional ?? 0) * 100) },
      };
    });

    const evidenceEdges: Edge[] = selected.evidencias.map((ev, index) => {
      const evNode = evidenceNodes[index];
      let targetHandle = "left";
      if (evNode.position.y < centerY - 100) targetHandle = "top";
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

  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="p-4 md:p-6">
        <div className="rounded-xl border border-[#575757] bg-[#1e1e1e] overflow-hidden">
          <header className="flex flex-col gap-4 border-b border-[#575757] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#139C73]"><AnalysisIcon /></span>
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
                <Controls />
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