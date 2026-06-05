"use client";
import { FiSearch } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import CaseCard from "./CasesCard";
import FilterPanelCases from "./FilterPanelCases";
import { TbHelp } from "react-icons/tb";
import { FaRegFolderOpen } from "react-icons/fa";
import { MdOutlineBrokenImage } from "react-icons/md";
import { useState, useEffect, useRef } from "react";

type CaseFromAPI = {
  id: string;
  caseId:string;
  nome: string;
  descricao: string;
  status: "Ativo" | "Arquivado" | "Concluído";
  prioridade: "Baixa" | "Média" | "Alta" | "Crítica";
  incerteza: number;
  dataOcorrencia: string | null;
  cidade: string | null;
  estado: string | null;
  responsavelPrimeiroNome: string | null;
  responsavelSobrenome: string | null;
  topSuspeitoNome: string | null;
  topSuspeitoProbab: number | null;
  qtdSuspeitos: number;
  qtdEvidencias: number;
};

type Filters = {
  status: string[];
  prioridade: string[];
  estado: string[];
  cidade: string[];
  responsavel: string;
  dataInicio: string;
  dataFim: string;
};

function formatDate(raw: string | null): string {
  if (!raw) return "—";
  const str = typeof raw === "string" ? raw : String(raw);
  const [year, month, day] = str.split("-");
  if (!year || !month || !day) return str;
  return `${day}/${month}/${year}`;
}

export default function CasesSection() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [cases, setCases] = useState<CaseFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Filters>({
    status: [], prioridade: [], estado: [], cidade: [],
    responsavel: "", dataInicio: "", dataFim: "",
  });

  const filterRef = useRef<HTMLDivElement>(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = currentUser.id;

  useEffect(() => {
    async function fetchCases() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:8000/cases/user/${userId}`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();
        setCases(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erro ao buscar casos.");
      } finally {
        setLoading(false);
      }
    }
    fetchCases();
  }, []);

  // Fecha o painel ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = cases.filter((c) => {
    if (search && !c.nome.toLowerCase().includes(search.toLowerCase()) &&
        !c.descricao.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilters.status.length && !activeFilters.status.includes(c.status)) return false;
    if (activeFilters.prioridade.length && !activeFilters.prioridade.includes(c.prioridade)) return false;
    if (activeFilters.estado.length && c.estado && !activeFilters.estado.includes(c.estado)) return false;
    if (activeFilters.cidade.length && c.cidade && !activeFilters.cidade.includes(c.cidade)) return false;
    if (activeFilters.dataInicio && c.dataOcorrencia && c.dataOcorrencia < activeFilters.dataInicio) return false;
    if (activeFilters.dataFim && c.dataOcorrencia && c.dataOcorrencia > activeFilters.dataFim) return false;
    return true;
  });

  const ativos = cases.filter((c) => c.status === "Ativo");
  const incertezaMedia =
    ativos.length > 0
      ? (ativos.reduce((acc, c) => acc + c.incerteza, 0) / ativos.length).toFixed(1)
      : "—";

  const filterCount =
    activeFilters.status.length +
    activeFilters.prioridade.length +
    activeFilters.estado.length +
    activeFilters.cidade.length +
    (activeFilters.responsavel ? 1 : 0) +
    (activeFilters.dataInicio ? 1 : 0) +
    (activeFilters.dataFim ? 1 : 0);

  return (
    <div className="h-full rounded-md p-4 flex flex-col gap-4">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* LEFT */}
        <div className="lg:col-span-3 flex flex-col gap-4">

          {/* Barra de filtros */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-[#525252] rounded-md px-3 py-2 w-full">
              <FiSearch className="text-[#FFFFFF]/65" />
              <input
                type="text"
                placeholder="Procurar"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm w-full font-medium text-[#FFFFFF]/48"
              />
            </div>

            {/* Botão Filtrar */}
            <div ref={filterRef} className="relative">
              <button
                onClick={() => setShowFilter((p) => !p)}
                className={`flex items-center gap-2 border px-4 py-2 rounded-md text-sm transition
                  ${filterCount > 0
                    ? "bg-[#139C73]/15 border-[#139C73]/60 text-[#139C73]"
                    : "bg-[#2A2A2A] border-[#444] text-white hover:bg-[#333]"
                  }`}
              >
                <MdFilterList />
                Filtrar
                {filterCount > 0 && (
                  <span className="bg-[#139C73] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {filterCount}
                  </span>
                )}
              </button>

              {showFilter && (
                <FilterPanelCases
                  onClose={() => setShowFilter(false)}
                  onApply={(f) => setActiveFilters(f)}
                  initialFilters={activeFilters}
                />
              )}
            </div>
          </div>

          {loading && <p className="text-sm text-gray-400">Carregando casos...</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && filtered.length === 0 && (
            <p className="text-sm text-gray-500">Nenhum caso encontrado.</p>
          )}

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((caso) => (
              <CaseCard
                key={caso.id}
                caseId= {caso.id}
                title={caso.nome}
                description={caso.descricao}
                status={caso.status}
                priority={caso.prioridade}
                suspects={caso.qtdSuspeitos}
                evidences={caso.qtdEvidencias}
                uncertainty={caso.incerteza}
                location={
                  caso.cidade && caso.estado
                    ? `${caso.cidade}, ${caso.estado}`
                    : caso.cidade ?? caso.estado ?? "—"
                }
                date={formatDate(caso.dataOcorrencia)}
                detectiveName={caso.topSuspeitoNome ?? "—"}
                detectiveImage="../../../elvinBond.svg"
                confidence={caso.topSuspeitoProbab ?? 0}
                responsible={
                  caso.responsavelPrimeiroNome && caso.responsavelSobrenome
                    ? `${caso.responsavelPrimeiroNome} ${caso.responsavelSobrenome}`
                    : "—"
                }
              />
            ))}
          </div>
        </div>

        {/* RIGHT - sidebar */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#2A2A2A] p-6 rounded-xl border border-[#3a3a3a] relative">
            <p className="text-sm text-white">Total de casos ativos:</p>
            <h3 className="text-4xl md:text-6xl font-bold mt-2">{ativos.length}</h3>
            <FaRegFolderOpen className="absolute bottom-3 right-3 text-[#139C73]/48 text-4xl md:text-6xl" />
          </div>

          <div className="bg-[#2A2A2A] p-6 rounded-xl border border-[#3a3a3a] relative">
            <TbHelp
              className="absolute top-3 right-3 text-gray-400 md:text-lg text-xl cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
              <div className="absolute top-10 right-3 bg-[#1f1f1f] text-white text-xs p-2 rounded-md shadow-lg w-48 z-50">
                Esse valor representa a média de incerteza dos casos ativos no sistema.
              </div>
            )}
            <p className="text-sm text-white">Incerteza média:</p>
            <h3 className="text-4xl md:text-6xl font-bold mt-2">{incertezaMedia}%</h3>
            <MdOutlineBrokenImage className="absolute bottom-3 right-3 text-[#139C73]/48 text-4xl md:text-6xl" />
          </div>

          <div className="bg-[#2A2A2A] flex-col justify-start items-start p-4 rounded-xl border border-[#3a3a3a] h-40 flex text-gray-500 text-sm">
            <p className="text-sm text-white">Prioridade de Casos Ativos:</p>
            Gráfico aqui
          </div>

          <div className="bg-[#2A2A2A] p-4 rounded-xl border border-[#3a3a3a] h-40 flex-col ustify-start items-start text-gray-500 text-sm">
            <p className="text-sm text-white">Evolução da Incerteza Média:</p>
            Gráfico aqui
          </div>
        </div>

      </div>
    </div>
  );
}
