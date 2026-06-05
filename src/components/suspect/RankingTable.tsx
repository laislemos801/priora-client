import { HelpCircle } from "lucide-react";
import CustomCheckbox from "./CustomCheckbox";
import TrendIcon from "./TrendIcon";
import type { Suspect } from "./types";

type Props = {
  suspects: Suspect[];
  selectedIds: string[];
  onToggleSelected: (id: string) => void;
  onToggleAll: () => void;
};

export default function RankingTable({
  suspects,
  selectedIds,
  onToggleSelected,
  onToggleAll,
}: Props) {
  const allSelected =
    suspects.length > 0 && suspects.every((s) => selectedIds.includes(s.id));

  return (
    <div className="space-y-3">
      <div className="hidden items-center px-6 text-center text-sm font-medium text-white lg:grid lg:grid-cols-[60px_repeat(4,minmax(0,1fr))]">
        <div className="flex justify-center">
          <CustomCheckbox checked={allSelected} onChange={onToggleAll} />
        </div>

        <p>Posição</p>
        <p className="text-left">Nome</p>
        <p>Probabilidade Atual</p>
        <p>Qtd. Evidências</p>
      </div>

      <div className="max-h-[670px] space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#139C73] scrollbar-track-transparent">
        {suspects.map((suspect, index) => (
          <div
            key={suspect.id}
            className={`rounded-lg text-white ${
              index === 0 ? "bg-[#139C73]/25" : "bg-[#2A2A2A]"
            }`}
          >
            <div className="flex flex-col gap-4 p-4 lg:hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar suspect={suspect} />

                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                      {suspect.nome}
                    </p>
                    <p className="text-xs text-white/55">
                      Posição #{suspect.posicaoRanking ?? index + 1}
                    </p>
                  </div>
                </div>

                <CustomCheckbox
                  checked={selectedIds.includes(suspect.id)}
                  onChange={() => onToggleSelected(suspect.id)}
                />
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

            <div className="hidden min-h-[96px] items-center px-6 lg:grid lg:grid-cols-[60px_repeat(4,minmax(0,1fr))]">
              <div className="flex justify-center">
                <CustomCheckbox
                  checked={selectedIds.includes(suspect.id)}
                  onChange={() => onToggleSelected(suspect.id)}
                />
              </div>

              <p className="text-center text-xl">
                {suspect.posicaoRanking ?? index + 1}
              </p>

              <div className="flex min-w-0 items-center gap-4">
                <Avatar suspect={suspect} />
                <p className="truncate text-lg font-medium">{suspect.nome}</p>
              </div>

              <div className="flex items-center justify-center gap-2 text-lg">
                <span>{(suspect.probabilidadeAtual ?? 0).toFixed(1)}%</span>
                <TrendIcon trend={suspect.tendencia ?? "Estável"} />
                <HelpCircle size={16} className="text-white/35" />
              </div>

              <p className="text-center text-lg">{suspect.qtdEvidencias ?? 0}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Avatar({ suspect }: { suspect: Suspect }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3A3A3A] text-sm font-semibold">
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