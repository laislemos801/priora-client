import { HelpCircle } from "lucide-react";
import CustomCheckbox from "./CustomCheckbox";
import TrendIcon from "./TrendIcon";
import { useState } from "react";
import { Eye } from "lucide-react";
import ViewSuspectModal from "./ViewSuspectModal";
import type { Suspect } from "./types";
import { useNavigate } from "react-router-dom";

type Props = {
  suspects: Suspect[];
  selectedIds: string[];
  casoId: string;                   
  onToggleSelected: (id: string) => void;
  onToggleAll: () => void;
  getRankingDirection: (id: string) => "up" | "down" | "same";
  /** Leitor só visualiza: sem caixas de seleção (servem para editar/excluir). */
  selectable?: boolean;
};

const GRID = "lg:grid-cols-[40px_56px_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.9fr)_72px]";

export default function RankingTable({
  suspects,
  selectedIds,
  casoId,                            
  onToggleSelected,
  onToggleAll,
  getRankingDirection,
  selectable = true,
}: Props) {
  const navigate = useNavigate();
  const [viewing, setViewing] = useState<Suspect | null>(null);
  const allSelected = suspects.length > 0 && suspects.every((s) => selectedIds.includes(s.id));

  return (
    <div className="space-y-3">
      <div className={`hidden items-center gap-x-4 px-6 text-center text-sm font-medium text-white lg:grid ${GRID}`}>
        <div className="flex justify-center">
          {selectable && <CustomCheckbox checked={allSelected} onChange={onToggleAll} />}
        </div>

        <p>Posição</p>
        <p className="text-left">Nome</p>
        <p>Probabilidade Atual</p>
        <p>Qtd. Evidências</p>
        <p>Detalhes</p>
      </div>

      <div className="max-h-[670px] space-y-2 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#139C73] scrollbar-track-transparent">
        {suspects.map((suspect, index) => (
          <div
            key={suspect.id}
            className={`rounded-lg text-white ${
              index === 0 ? "bg-[#139C73]/25" : "bg-[#2A2A2A]"
            }`}
          >
            <div className="flex flex-col gap-3 p-3 lg:hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar suspect={suspect} />

                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold">
                      {suspect.nome}
                    </p>
                    <p className="text-xs text-white/55">
                      Posição #{suspect.posicaoRanking ?? index + 1}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ViewButton onClick={() => setViewing(suspect)} />
                  {selectable && (
                    <CustomCheckbox
                      checked={selectedIds.includes(suspect.id)}
                      onChange={() => onToggleSelected(suspect.id)}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-black/10 p-3">
                  <p className="text-xs text-white/50">Probabilidade</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-semibold">
                      {(suspect.probabilidadeAtual ?? 0).toFixed(1)}%
                    </span>
                    <TrendIcon trend={suspect.tendencia ?? "Estável"} />
                  </div>
                </div>

                <div className="rounded-md bg-black/10 p-3">
                  <p className="text-xs text-white/50">Evidências</p>
                  <p className="mt-1 font-semibold">
                    {suspect.qtdEvidencias ?? 0}
                  </p>
                </div>
              </div>

            </div>

            <div className={`hidden min-h-[60px] items-center gap-x-4 px-6 py-1 lg:grid ${GRID}`}>
              <div className="flex justify-center">
                {selectable && (
                  <CustomCheckbox
                    checked={selectedIds.includes(suspect.id)}
                    onChange={() => onToggleSelected(suspect.id)}
                  />
                )}
              </div>

              <p className="text-center text-base">
                {suspect.posicaoRanking ?? index + 1}
              </p>

              <div className="flex min-w-0 items-center gap-4">
                <Avatar suspect={suspect} />
                <p className="truncate text-[15px] font-medium">{suspect.nome}</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-base">
                <span>{(suspect.probabilidadeAtual ?? 0).toFixed(1)}%</span>

                {(() => {
                  const direction = getRankingDirection(suspect.id);

                  if (direction === "up") {
                    return <span className="text-green-500 font-bold">↑</span>;
                  }

                  if (direction === "down") {
                    return <span className="text-red-500 font-bold">↓</span>;
                  }

                  return <span className="text-white/30">—</span>;
                })()}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/case/${casoId}/analysis?suspect=${suspect.id}`);
                  }}
                  className="text-white/35 hover:text-[#139C73] transition-colors"
                  title="Ver análise probabilística"
                >
                  <HelpCircle size={15} />
                </button>
              </div>

              <p className="text-center text-base">{suspect.qtdEvidencias ?? 0}</p>

              <div className="flex justify-center">
                <ViewButton onClick={() => setViewing(suspect)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {viewing && (
        <ViewSuspectModal suspect={viewing} casoId={casoId} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}

function ViewButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Ver dados do suspeito"
      aria-label="Ver dados do suspeito"
      className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-black/20 hover:text-white"
    >
      <Eye size={16} />
    </button>
  );
}

function Avatar({ suspect }: { suspect: Suspect }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3A3A3A] text-xs font-semibold">
      {suspect.fotoUrl ? (
        <img
          src={suspect.fotoUrl}
          alt={suspect.nome}
          className="h-full w-full object-cover"
        />
      ) : (
        suspect.nome.slice(0, 2).toUpperCase()
      )}
    </div>
  );
}