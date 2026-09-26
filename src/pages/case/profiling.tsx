import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { IoFilterSharp } from "react-icons/io5";
import { RotateCw } from "lucide-react";
import toast from "react-hot-toast";

import ActionButton from "@/components/ui/ActionButton";

import ProfilingIcon from "@/components/profiling/ProfilingIcon";
import RadarChart from "@/components/profiling/RadarChart";
import SuspectHeader from "@/components/profiling/SuspectHeader";
import InsightList from "@/components/profiling/InsightList";
import FilterPanelProfiling from "@/components/profiling/Filter_profiling";
import ProfilingSkeleton from "@/components/profiling/ProfilingSkeleton";
import EmptyProfilingState from "@/components/profiling/EmptyProfilingState";
import {
  getProfiling,
  getProfilingSuspects,
  PROFILING_ESTIMATE_IS_MOCK,
} from "@/services/profilingService";

import {
  DEFAULT_PROFILING_FILTERS,
  PROFILE_AXES,
  PROFILE_TYPE_LABEL,
} from "@/components/profiling/types";
import type {
  ProfileType,
  ProfilingData,
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

  const [suspects, setSuspects] = useState<ProfilingSuspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [data, setData] = useState<ProfilingData | null>(null);
  const [profilingError, setProfilingError] = useState(false);

  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<ProfilingFilters>(
    DEFAULT_PROFILING_FILTERS
  );

  // Garante que só a última requisição de perfil atualize a tela.
  const requestRef = useRef(0);
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

    async function fetchSuspects(casoId: string) {
      setLoading(true);
      setError(false);

      try {
        const list = await getProfilingSuspects(casoId);
        if (cancelled) return;
        setSuspects(list);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        toast.error("Erro ao carregar os suspeitos do caso.");
        setSuspects([]);
        setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSuspects(id);

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

  const loadProfiling = useCallback(
    async (casoId: string, suspect: ProfilingSuspect) => {
      const requestId = ++requestRef.current;
      setProfilingError(false);

      try {
        const result = await getProfiling(casoId, suspect);
        if (requestId !== requestRef.current) return;
        setData(result);
      } catch (err) {
        if (requestId !== requestRef.current) return;
        console.error(err);
        toast.error("Erro ao carregar o perfilamento do suspeito.");
        setData(null);
        setProfilingError(true);
      }
    },
    []
  );

  useEffect(() => {
    if (!id || !activeSuspect) return;
    loadProfiling(id, activeSuspect);
  }, [id, activeSuspect, loadProfiling]);

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
    if (error) {
      setReloadKey((k) => k + 1);
      return;
    }
    if (id && activeSuspect) loadProfiling(id, activeSuspect);
  }

  const currentData =
    data && activeSuspect && data.suspeito.id === activeSuspect.id
      ? data
      : null;

  const visibleTypes = filters.tipos.length > 0
    ? filters.tipos
    : DEFAULT_PROFILING_FILTERS.tipos;

  const series = SERIES_ORDER.filter((tipo) => visibleTypes.includes(tipo))
    .map((tipo) => {
      const values =
        tipo === "suspeito"
          ? activeSuspect?.perfil
          : currentData?.perfilEstimado;
      if (!values) return null;
      return {
        id: tipo,
        label: PROFILE_TYPE_LABEL[tipo],
        color: COLORS[tipo],
        values,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  const searchText = normalize(filters.search.trim());
  const insights = (currentData?.insights ?? []).filter((insight) => {
    if (!visibleTypes.includes(insight.tipo)) return false;
    if (!searchText) return true;
    return (
      normalize(insight.titulo).includes(searchText) ||
      normalize(insight.texto).includes(searchText)
    );
  });

  const filterCount =
    (filters.search ? 1 : 0) +
    (filters.tipos.length < DEFAULT_PROFILING_FILTERS.tipos.length
      ? filters.tipos.length
      : 0) +
    validSuspectFilter.length;

  if (loading) return <ProfilingSkeleton />;

  const hasError = error || profilingError;
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

            {!isEmpty && !error && (
              <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
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
                  <SuspectHeader
                    suspect={activeSuspect}
                    suspects={availableSuspects}
                    onSelect={handleSelect}
                  />

                  <RadarChart
                    axes={PROFILE_AXES}
                    series={series}
                    className={currentData ? "" : "animate-pulse"}
                  />

                  {PROFILING_ESTIMATE_IS_MOCK &&
                    visibleTypes.includes("estimado") && (
                      <p className="text-center text-xs text-white/60">
                        O perfil estimado usa dados de exemplo até o backend
                        disponibilizar a análise.
                      </p>
                    )}
                </section>

                <aside className="w-full lg:w-[320px] lg:flex-shrink-0">
                  {currentData ? (
                    <InsightList
                      insights={insights}
                      colors={COLORS}
                      className="lg:max-h-[640px]"
                    />
                  ) : (
                    <div className="flex flex-col gap-3">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-36 animate-pulse rounded-xl bg-[#2A2A2A]"
                        />
                      ))}
                    </div>
                  )}
                </aside>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
