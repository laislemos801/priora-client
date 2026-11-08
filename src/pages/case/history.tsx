import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FiFilter, FiPlus } from "react-icons/fi";
import NavIcon from "@/components/ui/NavIcon";

import Tag from "@/components/ui/Tag";
import { apiFetch } from "@/lib/api";
import HistoryListSkeleton from "@/components/history/HistorySkeleton";
import EmptyState, { PAGE_CARD_FILL } from "@/components/ui/EmptyState";
import { ENTITY_LABELS, describe } from "@/lib/history";
import type { HistoryApiItem } from "@/lib/history";


// ============================================================
// TIPOS
// ============================================================

type HistorySection = {
  title: string;
  items: HistoryApiItem[];
};

const PAGE_SIZE = 20;

const TAG_STYLES = {
  blue: "bg-[#465157] text-[#65BBDD]",
  green: "bg-[#155A46] text-[#18C18A]",
  yellow: "bg-[#B69B1A] text-[#282200]",
};


// ============================================================
// FUNÇÕES DE DATA
// ============================================================

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

// Segunda-feira da semana atual
function startOfWeek(date: Date) {
  const result = startOfDay(date);
  const day = result.getDay();
  const difference = day === 0 ? 6 : day - 1;
  result.setDate(result.getDate() - difference);
  return result;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}


// ============================================================
// TEXTO DO EVENTO
// ============================================================

// ============================================================
// CLASSIFICAÇÃO DOS HISTÓRICOS
// ============================================================

function organizeHistory(items: HistoryApiItem[]): HistorySection[] {
  const today = startOfDay(new Date());
  const currentWeekStart = startOfWeek(today);

  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const lastWeekEnd = new Date(currentWeekStart);
  lastWeekEnd.setMilliseconds(-1);

  const todayItems: HistoryApiItem[] = [];
  const thisWeekItems: HistoryApiItem[] = [];
  const lastWeekItems: HistoryApiItem[] = [];
  const oldItems: Record<string, HistoryApiItem[]> = {};

  items.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    const day = startOfDay(itemDate);

    if (day.getTime() === today.getTime()) {
      todayItems.push(item);
      return;
    }

    if (day >= currentWeekStart && day <= today) {
      thisWeekItems.push(item);
      return;
    }

    if (day >= lastWeekStart && day <= lastWeekEnd) {
      lastWeekItems.push(item);
      return;
    }

    const dateKey = formatDate(itemDate);
    (oldItems[dateKey] ??= []).push(item);
  });

  const sections: HistorySection[] = [];

  if (todayItems.length > 0) sections.push({ title: "HOJE", items: todayItems });
  if (thisWeekItems.length > 0) sections.push({ title: "ESSA SEMANA", items: thisWeekItems });
  if (lastWeekItems.length > 0) sections.push({ title: "SEMANA PASSADA", items: lastWeekItems });

  Object.entries(oldItems).forEach(([date, dateItems]) => {
    sections.push({ title: date, items: dateItems });
  });

  return sections;
}


// ============================================================
// COMPONENTE
// ============================================================

export default function History() {
  const { id: casoId } = useParams();

  const [history, setHistory] = useState<HistoryApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showFilter, setShowFilter] = useState(false);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  useEffect(() => {
    if (!casoId) return;
    let cancelled = false;

    async function loadHistory() {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch(`/history/cases/${casoId}`);
        if (!response.ok) throw new Error(`Erro ${response.status}`);
        const data = await response.json();
        if (!cancelled) setHistory(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError("Não foi possível carregar o histórico.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [casoId]);

  const filtered = useMemo(
    () =>
      activeTags.length === 0
        ? history
        : history.filter((item) => activeTags.includes(ENTITY_LABELS[item.entityType]?.tag ?? "Outros")),
    [history, activeTags]
  );

  const visible = filtered.slice(0, visibleCount);
  const sections = organizeHistory(visible);

  const toggleTag = (tag: string) => {
    setVisibleCount(PAGE_SIZE);
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <div className="min-h-screen bg-[#242424] text-white">

      <main className="flex-1 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">

        <div className={`w-full rounded-xl border border-[#575757] bg-[#242424] overflow-hidden ${PAGE_CARD_FILL}`}>

          {/* CABEÇALHO */}
          {/* Tamanhos fixos (rem) em vez de vw: em vw o texto ficava ilegível no celular */}
          <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-6 border-b border-[#575757]">

            <div className="flex items-center gap-3">
              <NavIcon name="history" className="text-[#12B98B]" />
              <h1 className="font-semibold text-lg">Histórico</h1>
            </div>

            <button
              onClick={() => setShowFilter((p) => !p)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-md
                text-sm hover:bg-[#373737]
                ${activeTags.length > 0 ? "bg-[#139C73]/20 text-[#139C73]" : "bg-[#2D2D2D] text-gray-300"}
              `}
            >
              <FiFilter className="text-sm" />
              Filtrar
              {activeTags.length > 0 && ` (${activeTags.length})`}
            </button>

          </div>

          {showFilter && (
            <div className="flex flex-wrap gap-2 px-4 py-3 md:px-6 border-b border-[#575757]">
              {Object.values(ENTITY_LABELS).map((entity) => (
                <Tag
                  key={entity.tag}
                  label={entity.tag}
                  active={activeTags.includes(entity.tag)}
                  onClick={() => toggleTag(entity.tag)}
                />
              ))}
            </div>
          )}

          {/* LISTA */}
          <div className="flex flex-1 flex-col p-3 md:p-4">

            {loading && <HistoryListSkeleton />}

            {!loading && error && <p className="p-4 text-sm text-red-400">{error}</p>}

            {!loading && !error && filtered.length === 0 && (
              <EmptyState
                icon={<NavIcon name="history" />}
                title={history.length === 0 ? "Nenhuma alteração registrada" : "Nenhum registro encontrado"}
                description={
                  history.length === 0
                    ? "As ações feitas neste caso (suspeitos, evidências, contatos, acessos...) aparecem aqui."
                    : "Ajuste os filtros para ver outros registros."
                }
              />
            )}

            <div className="w-full overflow-hidden">

              {sections.map((section) => (

                <div key={section.title}>

                  {/* TÍTULO DA SEÇÃO */}
                  <div className="flex items-center gap-2 py-2">
                    <span className="whitespace-nowrap text-xs font-medium">
                      {section.title}
                    </span>
                    <div className="flex-1 h-[1px] bg-gray-300" />
                  </div>

                  {/* ITENS */}
                  {section.items.map((item) => {

                    const itemDate = new Date(item.createdAt);
                    const { action, text } = describe(item);
                    const entity = ENTITY_LABELS[item.entityType];
                    const userName = item.user
                      ? `${item.user.primeiroNome} ${item.user.sobrenome}`.trim()
                      : "Usuário removido";

                    return (
                      <div
                        key={item.id}
                        className="
                          flex items-start sm:items-center gap-3 w-full rounded-md
                          px-3 py-2.5 bg-[#2B2B2B]
                          border-b border-[#202020] hover:bg-[#303030] transition
                        "
                      >

                        {/* FOTO */}
                        {item.user?.fotoUrl ? (
                          <img
                            src={item.user.fotoUrl}
                            alt=""
                            className="shrink-0 w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#3A3A3A] text-xs font-semibold">
                            {userName.charAt(0).toUpperCase()}
                          </span>
                        )}

                        {/* No celular: texto em cima, etiqueta e data embaixo */}
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">

                          {/* TEXTO */}
                          <div className="flex-1 min-w-0 flex flex-wrap sm:flex-nowrap items-center gap-x-1.5 text-sm">
                            <span className="font-semibold whitespace-nowrap">{userName}</span>
                            <span className="text-gray-400 whitespace-nowrap">{action}</span>
                            <span className="text-gray-200 min-w-0 break-words sm:truncate">{text}</span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* TAG */}
                            <span
                              className={`
                                shrink-0 rounded-full px-2.5 py-0.5
                                text-[11px] whitespace-nowrap
                                ${entity ? TAG_STYLES[entity.color] : "bg-[#3A3A3A] text-gray-300"}
                              `}
                            >
                              {entity?.tag ?? "Outros"}
                            </span>

                            {/* DATA / HORA */}
                            <span className="shrink-0 text-xs text-gray-300 whitespace-nowrap">
                              {formatDate(itemDate)} {formatTime(itemDate)}
                            </span>
                          </div>

                        </div>

                      </div>
                    );
                  })}

                </div>
              ))}

            </div>

            {/* VER MAIS */}
            {filtered.length > visibleCount && (
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="
                  mt-3 self-start flex items-center gap-2
                  px-3 py-1.5 border border-[#575757] rounded-md
                  bg-[#292929] text-sm hover:bg-[#353535]
                "
              >
                <FiPlus className="text-sm" />
                Ver mais
              </button>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}
