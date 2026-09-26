import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Checkbox } from "../../../@/components/ui/checkbox";
import { Avatar } from "./SuspectHeader";
import {
  DEFAULT_PROFILING_FILTERS,
  PROFILE_TYPE_LABEL,
} from "./types";
import type {
  ProfileType,
  ProfilingFilters,
  ProfilingSuspect,
} from "./types";

type Props = {
  suspects: ProfilingSuspect[];
  initialFilters: ProfilingFilters;
  onApply: (filters: ProfilingFilters) => void;
  onClear: () => void;
};

const ALL_TYPES: ProfileType[] = DEFAULT_PROFILING_FILTERS.tipos;

export default function FilterPanelProfiling({
  suspects,
  initialFilters,
  onApply,
  onClear,
}: Props) {
  const [local, setLocal] = useState<ProfilingFilters>(initialFilters);

  const allTypesSelected = ALL_TYPES.every((t) => local.tipos.includes(t));

  function toggleType(tipo: ProfileType) {
    setLocal((prev) => ({
      ...prev,
      tipos: prev.tipos.includes(tipo)
        ? prev.tipos.filter((t) => t !== tipo)
        : [...prev.tipos, tipo],
    }));
  }

  function toggleAllTypes() {
    setLocal((prev) => ({
      ...prev,
      tipos: ALL_TYPES.every((t) => prev.tipos.includes(t))
        ? []
        : [...ALL_TYPES],
    }));
  }

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

  // Nenhum tipo marcado equivale a mostrar os dois.
  function handleApply() {
    onApply({
      ...local,
      search: local.search.trim(),
      suspects: local.suspects.filter((id) =>
        suspects.some((s) => s.id === id)
      ),
      tipos: local.tipos.length > 0 ? local.tipos : [...ALL_TYPES],
    });
  }

  // Ignora ids que não existem mais na lista de suspeitos
  const validSuspects = local.suspects.filter((id) =>
    suspects.some((s) => s.id === id)
  );

  const typesCount =
    local.tipos.length > 0 && !allTypesSelected ? local.tipos.length : 0;

  const selectedCount =
    (local.search.trim() ? 1 : 0) + typesCount + validSuspects.length;

  return (
    <div
      id="profiling-filter-panel"
      role="dialog"
      aria-label="Filtrar perfilamento"
      className="absolute right-0 top-full z-[9999] mt-2 w-[380px] max-w-[calc(100vw-4rem)] rounded-xl border border-[#444] bg-[#242424] shadow-xl">
      <div className="flex items-center justify-between border-b border-[#3a3a3a] px-4 py-3">
        <h2 className="text-sm font-semibold text-white/80">Filtrar</h2>

        <SlidersHorizontal size={16} className="text-white/65" />
      </div>

      <div className="space-y-5 p-4">
        <div>
          <label
            htmlFor="profiling-filter-search"
            className="mb-1 block text-xs text-white/65"
          >
            Procurar
          </label>

          <div className="flex h-9 items-center gap-2 rounded-full border border-[#434343] bg-[#282828] px-3">
            <Search size={14} className="text-white/45" />

            <input
              id="profiling-filter-search"
              autoFocus
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
          <div className="mb-3 flex items-center justify-between">
            <span id="profiling-filter-types" className="text-xs text-white/65">
              Tipo de perfil
            </span>

            <div className="flex items-center gap-2">
              <label
                htmlFor="profiling-filter-all-types"
                className="text-xs text-white/70"
              >
                Todos
              </label>

              <Checkbox
                id="profiling-filter-all-types"
                aria-label="Selecionar todos os tipos de perfil"
                checked={allTypesSelected}
                onCheckedChange={toggleAllTypes}
                className="border-[#575757] data-[state=checked]:border-[#139C73] data-[state=checked]:bg-[#139C73]"
              />
            </div>
          </div>

          <div
            role="group"
            aria-labelledby="profiling-filter-types"
            className="flex flex-wrap gap-2"
          >
            {ALL_TYPES.map((tipo) => {
              const active = local.tipos.includes(tipo);

              return (
                <button
                  key={tipo}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleType(tipo)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${
                    active
                      ? "border-[#139C73] bg-[#139C73]/10 text-[#139C73]"
                      : "border-[#434343] bg-[#282828] text-white/60 hover:text-white"
                  }`}
                >
                  {PROFILE_TYPE_LABEL[tipo]}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <span id="profiling-filter-suspects" className="text-xs text-white/65">
              Suspeitos
            </span>

            <div className="flex items-center gap-2">
              <label
                htmlFor="profiling-filter-all-suspects"
                className="text-xs text-white/70"
              >
                Todos
              </label>

              <Checkbox
                id="profiling-filter-all-suspects"
                aria-label="Selecionar todos os suspeitos"
                checked={
                  suspects.length > 0 &&
                  suspects.every((s) => local.suspects.includes(s.id))
                }
                onCheckedChange={toggleAllSuspects}
                className="border-[#575757] data-[state=checked]:border-[#139C73] data-[state=checked]:bg-[#139C73]"
              />
            </div>
          </div>

          <div
            role="group"
            aria-labelledby="profiling-filter-suspects"
            className="flex flex-wrap gap-3"
          >
            {suspects.map((suspect) => {
              const active = local.suspects.includes(suspect.id);

              return (
                <button
                  key={suspect.id}
                  type="button"
                  aria-pressed={active}
                  title={suspect.nome}
                  onClick={() => toggleSuspect(suspect.id)}
                  className={`flex flex-col items-center gap-1 transition ${
                    active ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Avatar
                    suspect={suspect}
                    size="md"
                    className={`border-2 ${
                      active ? "border-[#139C73]" : "border-transparent"
                    }`}
                  />

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
            type="button"
            onClick={onClear}
            className="w-full rounded-md bg-[#136D52]/26 px-4 py-2 text-sm text-[#00a87e] transition hover:bg-[#136D52]/40"
          >
            Limpar filtros
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="w-full rounded-md bg-[#139C73] px-4 py-2 text-sm text-white transition hover:bg-[#139C73]/80"
          >
            Aplicar filtros{selectedCount > 0 ? `(${selectedCount})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
