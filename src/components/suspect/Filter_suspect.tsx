import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Checkbox } from "../../../@/components/ui/checkbox";

type Suspect = {
  id: string;
  nome: string;
  fotoUrl?: string | null;
};

export type RankingFilters = {
  search: string;
  minEvidences: string;
  suspects: string[];
};

type Props = {
  initialFilters: RankingFilters;
  onApply: (filters: RankingFilters) => void;
  onClear: () => void;
};

export default function FilterPanelRanking({
  initialFilters,
  onApply,
  onClear,
}: Props) {
  const { id: casoId } = useParams<{ id: string }>();

  const [local, setLocal] = useState<RankingFilters>(initialFilters);
  const [suspects, setSuspects] = useState<Suspect[]>([]);

  useEffect(() => {
    if (!casoId) return;

    fetch(`http://localhost:8000/suspects/case/${casoId}`)
      .then((r) => r.json())
      .then((data) => setSuspects(Array.isArray(data) ? data : []))
      .catch(() => setSuspects([]));
  }, [casoId]);

  function toggleSuspect(id: string) {
    setLocal((prev) => ({
      ...prev,
      suspects: prev.suspects.includes(id)
        ? prev.suspects.filter((s) => s !== id)
        : [...prev.suspects, id],
    }));
  }

  function toggleAllSuspects() {
    setLocal((prev) => {
      const allSelected = suspects.every((s) =>
        prev.suspects.includes(s.id)
      );

      return {
        ...prev,
        suspects: allSelected ? [] : suspects.map((s) => s.id),
      };
    });
  }

  const selectedCount =
    (local.search ? 1 : 0) +
    (local.minEvidences ? 1 : 0) +
    local.suspects.length;

  return (
    <div className="absolute right-0 top-full z-[9999] mt-2 w-[380px] rounded-xl border border-[#444] bg-[#242424] shadow-xl">
      <div className="flex items-center justify-between border-b border-[#3a3a3a] px-4 py-3">
        <h2 className="text-sm font-semibold text-white/80">
          Filtrar
        </h2>

        <SlidersHorizontal size={16} className="text-white/65" />
      </div>

      <div className="space-y-5 p-4">
        <div className="grid grid-cols-[1fr_140px] gap-3">
          <div>
            <label className="mb-1 block text-xs text-white/65">
              Procurar
            </label>

            <div className="flex h-9 items-center gap-2 rounded-full border border-[#434343] bg-[#282828] px-3">
              <Search size={14} className="text-white/45" />

              <input
                value={local.search}
                onChange={(e) =>
                  setLocal((p) => ({
                    ...p,
                    search: e.target.value,
                  }))
                }
                placeholder="Procurar"
                className="w-full bg-transparent text-xs text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/65">
              Qtd. de Evidências
            </label>

            <input
              value={local.minEvidences}
              onChange={(e) =>
                setLocal((p) => ({
                  ...p,
                  minEvidences: e.target.value.replace(/\D/g, ""),
                }))
              }
              placeholder="Mín."
              className="h-9 w-full rounded-full border border-[#434343] bg-[#282828] px-4 text-xs text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6]"
            />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-xs text-white/65">
              Suspeitos
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70">Todos</span>

              <Checkbox
                checked={
                  suspects.length > 0 &&
                  suspects.every((s) => local.suspects.includes(s.id))
                }
                onCheckedChange={toggleAllSuspects}
                className="border-[#575757] data-[state=checked]:border-[#139C73] data-[state=checked]:bg-[#139C73]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {suspects.map((suspect) => {
              const active = local.suspects.includes(suspect.id);

              return (
                <button
                  key={suspect.id}
                  type="button"
                  onClick={() => toggleSuspect(suspect.id)}
                  className={`flex flex-col items-center gap-1 transition ${
                    active ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`h-9 w-9 overflow-hidden rounded-full border-2 bg-[#3A3A3A] ${
                      active
                        ? "border-[#139C73]"
                        : "border-transparent"
                    }`}
                  >
                    {suspect.fotoUrl ? (
                      <img
                        src={suspect.fotoUrl}
                        alt={suspect.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-white">
                        {suspect.nome.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <span className="max-w-[48px] truncate text-[10px] text-white/60">
                    {suspect.nome.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 border-t border-[#3a3a3a] pt-4">
          <button
            onClick={onClear}
            className="w-full rounded-md bg-[#136D52]/26 px-4 py-2 text-sm text-[#00a87e] transition hover:bg-[#136D52]/40"
          >
            Limpar filtros
          </button>

          <button
            onClick={() => onApply(local)}
            className="w-full rounded-md bg-[#139C73] px-4 py-2 text-sm text-white transition hover:bg-[#139C73]/80"
          >
            Aplicar filtros{selectedCount > 0 ? `(${selectedCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}