import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IoFilterSharp } from "react-icons/io5";
import { Edit, RotateCw } from "lucide-react";
import toast from "react-hot-toast";

import ActionButton from "@/components/ui/ActionButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SuspectModal from "@/components/suspect/SuspectModal";
import { useCaseRole } from "@/hooks/useCaseRole";

import ProfilingIcon from "@/components/profiling/ProfilingIcon";
import RadarChart from "@/components/profiling/RadarChart";
import SuspectHeader from "@/components/profiling/SuspectHeader";
import ComparisonList from "@/components/profiling/ComparisonList";
import EstimatedProfileModal from "@/components/profiling/EstimatedProfileModal";
import FilterPanelProfiling from "@/components/profiling/Filter_profiling";
import ProfilingSkeleton from "@/components/profiling/ProfilingSkeleton";
import EmptyProfilingState from "@/components/profiling/EmptyProfilingState";
import {
  getEstimatedProfile,
  getProfilingSuspects,
} from "@/services/profilingService";

import {
  DEFAULT_PROFILING_FILTERS,
  PROFILE_AXES,
  PROFILE_TYPE_LABEL,
} from "@/components/profiling/types";
import type {
  EstimatedProfile,
  ProfileType,
  ProfilingFilters,
  ProfilingSuspect,
} from "@/components/profiling/types";

const COLORS: Record<ProfileType, string> = {
  estimado: "#6C7BF2",
  suspeito: "#4CC38A",
};

// Ordem das séries no radar: estimado por baixo, suspeito por cima.
const SERIES_ORDER: ProfileType[] = ["estimado", "suspeito"];

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

// key={id} zera o estado da tela ao trocar de caso.
export default function Profiling() {
  const { id } = useParams();
  return <ProfilingContent key={id} id={id} />;
}

function ProfilingContent({ id }: { id: string | undefined }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const querySuspect = searchParams.get("suspect");

  const { canEdit } = useCaseRole(id);

  const [suspects, setSuspects] = useState<ProfilingSuspect[]>([]);
  const [estimated, setEstimated] = useState<EstimatedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingEstimated, setEditingEstimated] = useState(false);
  const [editingSuspect, setEditingSuspect] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<ProfilingFilters>(
    DEFAULT_PROFILING_FILTERS
  );

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openFilter) return;

    function closeAndFocus() {
      setOpenFilter(false);
      filterRef.current?.querySelector("button")?.focus();
    }
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setOpenFilter(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeAndFocus();
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openFilter]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchProfiling(casoId: string) {
      setError(false);

      try {
        const [list, profile] = await Promise.all([
          getProfilingSuspects(casoId),
          getEstimatedProfile(casoId),
        ]);
        if (cancelled) return;
        setSuspects(list);
        setEstimated(profile);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        toast.error("Erro ao carregar o perfilamento criminal.");
        setSuspects([]);
        setEstimated(null);
        setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfiling(id);

    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  // Só conta ids que ainda existem (ex.: após "Tentar novamente").
  const validSuspectFilter = useMemo(
    () => filters.suspects.filter((sid) => suspects.some((s) => s.id === sid)),
    [suspects, filters.suspects]
  );

  const availableSuspects = useMemo(() => {
    if (validSuspectFilter.length === 0) return suspects;
    return suspects.filter((s) => validSuspectFilter.includes(s.id));
  }, [suspects, validSuspectFilter]);

  // Se o selecionado saiu do filtro, cai para o primeiro disponível.
  const activeSuspect = useMemo<ProfilingSuspect | null>(() => {
    const preferred = selectedId ?? querySuspect;
    return (
      availableSuspects.find((s) => s.id === preferred) ??
      availableSuspects[0] ??
      null
    );
  }, [availableSuspects, selectedId, querySuspect]);

  function handleSelect(suspectId: string) {
    setSelectedId(suspectId);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("suspect", suspectId);
        return next;
      },
      { replace: true }
    );
  }

  function handleRetry() {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }

  const estimatedValues = estimated?.perfil ?? null;

  const visibleTypes = filters.tipos.length > 0
    ? filters.tipos
    : DEFAULT_PROFILING_FILTERS.tipos;

  const series = SERIES_ORDER.filter((tipo) => visibleTypes.includes(tipo))
    .map((tipo) => {
      const values =
        tipo === "suspeito"
          ? activeSuspect?.perfil
          : estimatedValues;
      if (!values) return null;
      return {
        id: tipo,
        label: PROFILE_TYPE_LABEL[tipo],
        color: COLORS[tipo],
        values,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  // Busca filtra as variáveis exibidas nos cards de comparação.
  const searchText = normalize(filters.search.trim());
  const visibleAxes = PROFILE_AXES.filter(
    (axis) => !searchText || normalize(axis.label).includes(searchText)
  );

  const filterCount =
    (filters.search ? 1 : 0) +
    (filters.tipos.length < DEFAULT_PROFILING_FILTERS.tipos.length
      ? filters.tipos.length
      : 0) +
    validSuspectFilter.length;

  if (loading) return <ProfilingSkeleton />;

  const hasError = error;
  const isEmpty = !error && suspects.length === 0;

  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="flex-1 p-4 md:p-6">
        <div className="relative rounded-xl border border-[#575757] bg-[#242424]">
          <header className="flex flex-col gap-4 border-b border-[#575757] px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#139C73]">
                <ProfilingIcon />
              </span>

              <h1 className="text-lg font-semibold text-white">
                Perfilamento Criminal
              </h1>
            </div>

            {!error && (
              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
                {canEdit && (
                  <PrimaryButton onClick={() => setEditingEstimated(true)}>
                    {estimatedValues
                      ? "Editar perfil estimado"
                      : "Definir perfil estimado"}
                  </PrimaryButton>
                )}

                {!isEmpty && (
                <div ref={filterRef} className="relative w-full md:w-auto">
                  <ActionButton
                    icon={<IoFilterSharp size={14} />}
                    onClick={() => setOpenFilter((prev) => !prev)}
                    aria-expanded={openFilter}
                    aria-haspopup="dialog"
                    aria-controls="profiling-filter-panel"
                    className={`w-full ${
                      filterCount > 0
                        ? "border-[#139C73]/60 bg-[#139C73]/10 text-[#139C73]"
                        : ""
                    }`}
                  >
                    Filtrar
                    {filterCount > 0 && (
                      <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#139C73] text-[10px] font-bold text-white">
                        {filterCount}
                      </span>
                    )}
                  </ActionButton>

                  {openFilter && (
                    <>
                      <div
                        className="fixed inset-0 z-40 bg-black/50 md:hidden"
                        onClick={() => setOpenFilter(false)}
                      />

                      <FilterPanelProfiling
                        suspects={suspects}
                        initialFilters={filters}
                        onApply={(newFilters) => {
                          // Se o suspeito atual saiu do filtro, fixa o primeiro filtrado
                          // no estado/URL para a tela não voltar sozinha depois.
                          const allowed = newFilters.suspects;
                          if (
                            activeSuspect &&
                            allowed.length > 0 &&
                            !allowed.includes(activeSuspect.id)
                          ) {
                            const next = suspects.find((s) => allowed.includes(s.id));
                            if (next) handleSelect(next.id);
                          }
                          setFilters(newFilters);
                          setOpenFilter(false);
                        }}
                        onClear={() => {
                          setFilters(DEFAULT_PROFILING_FILTERS);
                          setOpenFilter(false);
                        }}
                      />
                    </>
                  )}
                </div>
                )}
              </div>
            )}
          </header>

          <main className="p-4 md:p-6">
            {isEmpty ? (
              <EmptyProfilingState
                onGoToRanking={() => navigate(`/case/${id}/ranking`)}
              />
            ) : hasError || !activeSuspect ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-white/60">
                  Não foi possível carregar o perfilamento criminal.
                </p>
                <ActionButton
                  icon={<RotateCw size={14} />}
                  onClick={handleRetry}
                >
                  Tentar novamente
                </ActionButton>
              </div>
            ) : (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
                <section className="flex min-w-0 flex-1 flex-col gap-6 rounded-xl bg-[#2A2A2A] p-4 md:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <SuspectHeader
                      suspect={activeSuspect}
                      suspects={availableSuspects}
                      onSelect={handleSelect}
                    />

                    {canEdit && (
                      <ActionButton
                        icon={<Edit size={14} />}
                        onClick={() => setEditingSuspect(true)}
                      >
                        Editar perfil do suspeito
                      </ActionButton>
                    )}
                  </div>

                  <RadarChart axes={PROFILE_AXES} series={series} />

                  {!estimatedValues && visibleTypes.includes("estimado") && (
                    <p className="text-center text-xs text-white/60">
                      Perfil estimado ainda não definido.
                      {canEdit &&
                        " Use \"Definir perfil estimado\" para comparar com os suspeitos."}
                    </p>
                  )}
                </section>

                <aside className="w-full lg:w-[320px] lg:flex-shrink-0">
                  <ComparisonList
                    axes={visibleAxes}
                    estimado={estimatedValues}
                    suspeito={activeSuspect.perfil}
                    tipos={visibleTypes}
                    colors={COLORS}
                    className="lg:max-h-[640px]"
                  />
                </aside>
              </div>
            )}
          </main>
        </div>
      </div>

      {editingEstimated && id && (
        <EstimatedProfileModal
          casoId={id}
          initialValues={estimatedValues}
          onClose={() => setEditingEstimated(false)}
          onSuccess={(profile) => {
            setEstimated(profile);
            setEditingEstimated(false);
            toast.success("Perfil estimado salvo com sucesso!");
          }}
        />
      )}

      {editingSuspect && id && activeSuspect && (
        <SuspectModal
          casoId={id}
          mode="edit"
          suspect={activeSuspect.origem}
          onClose={() => setEditingSuspect(false)}
          onSuccess={() => {
            setEditingSuspect(false);
            setReloadKey((k) => k + 1);
            toast.success("Suspeito editado com sucesso!");
          }}
        />
      )}
    </div>
  );
}
