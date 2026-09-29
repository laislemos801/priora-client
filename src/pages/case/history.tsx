import { FiShare2, FiFilter, FiPlus, FiX } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

interface HistoryItem {
  id: string;
  userId: string;
  casoId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  entityName?: string | null;
  details?: string | null;
  createdAt: string;
  user?: {
    id: string;
    primeiroNome: string;
    sobrenome: string;
    fotoUrl?: string | null;
  };
}

interface Change {
  campo: string;
  antes: unknown;
  depois: unknown;
}

// ============================================================
// DATA
// ============================================================

function startOfDay(date: Date | string) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function startOfWeek(date: Date | string) {
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
// ORGANIZAÇÃO
// ============================================================

function organizeHistory(items: HistoryItem[]) {
  const today = startOfDay(new Date());

  const currentWeekStart = startOfWeek(today);

  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const lastWeekEnd = new Date(currentWeekStart);
  lastWeekEnd.setMilliseconds(-1);

  const todayItems: HistoryItem[] = [];
  const thisWeekItems: HistoryItem[] = [];
  const lastWeekItems: HistoryItem[] = [];

  const oldItems: Record<string, HistoryItem[]> = {};

  items.forEach((item) => {
    const itemDate = new Date(item.createdAt);
    const day = startOfDay(itemDate);

    // HOJE
    if (day.getTime() === today.getTime()) {
      todayItems.push(item);
      return;
    }

    // ESSA SEMANA
    if (day >= currentWeekStart && day <= today) {
      thisWeekItems.push(item);
      return;
    }

    // SEMANA PASSADA
    if (day >= lastWeekStart && day <= lastWeekEnd) {
      lastWeekItems.push(item);
      return;
    }

    // DATAS ANTIGAS
    const dateKey = formatDate(itemDate);

    if (!oldItems[dateKey]) {
      oldItems[dateKey] = [];
    }

    oldItems[dateKey].push(item);
  });

  const sections: {
    title: string;
    items: HistoryItem[];
  }[] = [];

  console.log(sections)

  if (todayItems.length > 0) {
    sections.push({
      title: "HOJE",
      items: todayItems,
    });
  }

  if (thisWeekItems.length > 0) {
    sections.push({
      title: "ESSA SEMANA",
      items: thisWeekItems,
    });
  }

  if (lastWeekItems.length > 0) {
    sections.push({
      title: "SEMANA PASSADA",
      items: lastWeekItems,
    });
  }

  Object.entries(oldItems).forEach(([date, items]) => {
    sections.push({
      title: date,
      items,
    });
  });

  return sections;
}

// ============================================================
// LABELS
// ============================================================

function getActionLabel(action: string) {
  switch (action) {
    case "CREATE":
      return "criou";

    case "UPDATE":
      return "atualizou";

    case "DELETE":
      return "excluiu";

    default:
      return action;
  }
}
function getEntityLabel(entityType: string) {
  switch (entityType) {
    case "EVIDENCIA":
      return "uma evidência";

    case "CASO":
      return "o caso";

    case "SUSPEITO":
      return "um suspeito";

    default:
      return entityType.toLowerCase();
  }
}

function getEntityNameFromDetails(details?: string | null) {
  if (!details) return null;

  try {
    console.log("aqui: ",details)
    const parsed = JSON.parse(details);

    return parsed.nome || null;

  } catch {
    return null;
  }
}

function getActionColor(action: string) {
  switch (action) {
    case "CREATE":
      return {
        background: "bg-[#155A46]",
        text: "text-[#18C18A]",
      };

    case "UPDATE":
      return {
        background: "bg-[#465157]",
        text: "text-[#65BBDD]",
      };

    case "DELETE":
      return {
        background: "bg-[#5A3030]",
        text: "text-[#F07878]",
      };

    default:
      return {
        background: "bg-[#465157]",
        text: "text-[#65BBDD]",
      };
  }
}

// ============================================================
// CAMPOS
// ============================================================

function getFieldLabel(field: string) {
  const labels: Record<string, string> = {
    nome: "Nome",
    descricao: "Descrição",
    status: "Status",
    prioridade: "Prioridade",
    enderecoCep: "CEP",
    enderecoLogradouro: "Logradouro",
    enderecoNumero: "Número",
    enderecoBairro: "Bairro",
    enderecoCidade: "Cidade",
    enderecoEstado: "Estado",
    dataOcorrencia: "Data da ocorrência",
  };

  return labels[field] || field;
}

// ============================================================
// ALTERAÇÕES
// ============================================================

function parseChanges(details?: string | null): Change[] | null {
  if (!details) return null;

  try {
    const parsed = JSON.parse(details);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

// ============================================================
// FORMATAR VALOR
// ============================================================

function formatChangeValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "vazio";
  }

  if (typeof value === "boolean") {
    return value ? "Sim" : "Não";
  }

  return String(value);
}

// ============================================================
// COMPONENTE
// ============================================================

export default function History() {
  const { id: caseId } = useParams<{ id: string }>();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // FILTROS
  // ==========================================================

  const [showFilters, setShowFilters] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");

  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  // ==========================================================
  // BUSCAR HISTÓRICO
  // ==========================================================

  useEffect(() => {
    async function loadHistory() {
      if (!caseId) {
        toast.error("Caso não informado.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:8000/history/cases/${caseId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Erro ao carregar histórico.");
        }

        if (!Array.isArray(data)) {
          setHistory([]);
          return;
        }

        setHistory(data);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);

        toast.error(
          error instanceof Error
            ? error.message
            : "Erro ao carregar histórico.",
        );

        setHistory([]);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [caseId]);

  // ==========================================================
  // ALTERAR TIPO DO FILTRO
  // ==========================================================

  function toggleAction(action: string) {
    setSelectedActions((current) => {
      if (current.includes(action)) {
        return current.filter((item) => item !== action);
      }

      return [...current, action];
    });
  }

  // ==========================================================
  // LIMPAR FILTROS
  // ==========================================================

  function clearFilters() {
    setSelectedDate("");
    setSelectedActions([]);
  }

  // ==========================================================
  // FILTRAR HISTÓRICO
  // ==========================================================

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // FILTRO DE AÇÃO
      if (
        selectedActions.length > 0 &&
        !selectedActions.includes(item.action)
      ) {
        return false;
      }

      // FILTRO DE DATA
      if (selectedDate) {
        const itemDate = new Date(item.createdAt);

        const year = itemDate.getFullYear();
        const month = String(itemDate.getMonth() + 1).padStart(2, "0");
        const day = String(itemDate.getDate()).padStart(2, "0");

        const itemDateString = `${year}-${month}-${day}`;

        if (itemDateString !== selectedDate) {
          return false;
        }
      }

      return true;
    });
  }, [history, selectedDate, selectedActions]);

  // ==========================================================
  // ORGANIZAR
  // ==========================================================

  const sections = organizeHistory(filteredHistory);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#242424] text-white">
        <main className="flex-1 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
          <div className="w-full rounded-xl border border-[#575757] bg-[#242424] overflow-hidden">
            <div className="flex items-center gap-[0.7vw] px-[1.2vw] py-[0.8vw] border-b border-[#575757]">
              <FiShare2 className="text-[#12B98B] text-[1vw]" />

              <h1 className="font-semibold text-[1vw]">Histórico</h1>
            </div>

            <div className="p-[1.5vw] text-center text-gray-400 text-[0.7vw]">
              Carregando histórico...
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#242424] text-white">
      <main className="flex-1 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <div className="w-full rounded-xl border border-[#575757] bg-[#242424] overflow-hidden">
          {/* ==================================================
              CABEÇALHO
          ================================================== */}

          <div className="flex items-center justify-between px-[1.2vw] py-[0.8vw] border-b border-[#575757]">
            <div className="flex items-center gap-[0.7vw]">
              <FiShare2 className="text-[#12B98B] text-[1vw]" />

              <h1 className="font-semibold text-[1vw]">Histórico</h1>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((current) => !current)}
              className="
                flex
                items-center
                gap-[0.5vw]
                px-[1vw]
                py-[0.45vw]
                rounded-md
                bg-[#2D2D2D]
                text-gray-300
                text-[0.7vw]
                hover:bg-[#373737]
                transition
              "
            >
              {showFilters ? (
                <FiX className="text-[0.8vw]" />
              ) : (
                <FiFilter className="text-[0.8vw]" />
              )}

              {showFilters ? "Fechar" : "Filtrar"}
            </button>
          </div>

          {/* ==================================================
              FILTROS
          ================================================== */}

          {showFilters && (
            <div className="px-[1.2vw] py-[0.9vw] border-b border-[#575757] bg-[#292929]">
              <div className="flex items-end gap-[1vw] flex-wrap">
                {/* DATA */}

                <div className="flex flex-col gap-[0.3vw]">
                  <label className="text-[0.58vw] text-gray-400">Data</label>

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="
                      h-[1.8vw]
                      px-[0.6vw]
                      rounded-md
                      border
                      border-[#575757]
                      bg-[#202020]
                      text-gray-200
                      text-[0.62vw]
                      outline-none
                      focus:border-[#12B98B]
                    "
                  />
                </div>

                {/* AÇÕES */}

                <div className="flex flex-col gap-[0.3vw]">
                  <span className="text-[0.58vw] text-gray-400">
                    Tipo de atividade
                  </span>

                  <div className="flex items-center gap-[0.4vw]">
                    {/* CRIADO */}

                    <button
                      type="button"
                      onClick={() => toggleAction("CRIADO")}
                      className={`
                        h-[1.8vw]
                        px-[0.7vw]
                        rounded-md
                        border
                        text-[0.6vw]
                        transition
                        ${
                          selectedActions.includes("CRIADO")
                            ? "border-[#18C18A] bg-[#155A46] text-[#18C18A]"
                            : "border-[#575757] bg-[#202020] text-gray-400 hover:bg-[#303030]"
                        }
                      `}
                    >
                      Criado
                    </button>

                    {/* ATUALIZADO */}

                    <button
                      type="button"
                      onClick={() => toggleAction("UPDATE")}
                      className={`
                        h-[1.8vw]
                        px-[0.7vw]
                        rounded-md
                        border
                        text-[0.6vw]
                        transition
                        ${
                          selectedActions.includes("UPDATE")
                            ? "border-[#65BBDD] bg-[#465157] text-[#65BBDD]"
                            : "border-[#575757] bg-[#202020] text-gray-400 hover:bg-[#303030]"
                        }
                      `}
                    >
                      Atualizado
                    </button>

                    {/* EXCLUÍDO */}

                    <button
                      type="button"
                      onClick={() => toggleAction("DELETE")}
                      className={`
                        h-[1.8vw]
                        px-[0.7vw]
                        rounded-md
                        border
                        text-[0.6vw]
                        transition
                        ${
                          selectedActions.includes("DELETE")
                            ? "border-[#F07878] bg-[#5A3030] text-[#F07878]"
                            : "border-[#575757] bg-[#202020] text-gray-400 hover:bg-[#303030]"
                        }
                      `}
                    >
                      Excluído
                    </button>
                  </div>
                </div>

                {/* LIMPAR */}

                {(selectedDate || selectedActions.length > 0) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      h-[1.8vw]
                      px-[0.8vw]
                      rounded-md
                      border
                      border-[#575757]
                      bg-[#202020]
                      text-gray-400
                      text-[0.6vw]
                      hover:bg-[#353535]
                      hover:text-white
                      transition
                    "
                  >
                    Limpar filtros
                  </button>
                )}
              </div>

              {/* RESUMO */}

              {(selectedDate || selectedActions.length > 0) && (
                <div className="mt-[0.6vw] text-[0.55vw] text-gray-500">
                  Exibindo {filteredHistory.length} de {history.length}{" "}
                  atividades
                </div>
              )}
            </div>
          )}

          {/* ==================================================
              LISTA
          ================================================== */}

          <div className="p-[0.8vw]">
            {filteredHistory.length === 0 ? (
              <div className="py-[2vw] text-center text-gray-500 text-[0.7vw]">
                {history.length === 0
                  ? "Nenhuma atividade registrada neste caso."
                  : "Nenhuma atividade encontrada com os filtros selecionados."}
              </div>
            ) : (
              <div className="w-full overflow-hidden">
                {sections.map((section) => (
                  <div key={section.title} className="mb-[0.8vw]">
                    {/* TÍTULO */}

                    <div className="flex items-center gap-[0.4vw] px-[0.1vw] mb-[0.35vw]">
                      <span className="whitespace-nowrap text-[0.65vw] font-medium">
                        {section.title}
                      </span>

                      <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    {/* ITENS */}

                    <div className="flex flex-col gap-[0.2vw]">
                      {section.items.map((item) => {
                        console.log(item)
                        const itemDate = new Date(item.createdAt);

                        const actionColor = getActionColor(item.action);

                        const firstName = item.user?.primeiroNome || "Usuário";

                        const lastName = item.user?.sobrenome || "";

                        const fullName = `${firstName} ${lastName}`.trim();

                        const changes =
                          item.action === "UPDATE"
                            ? parseChanges(item.details)
                            : null;

                        return (
                          <div
                            key={item.id}
                            className="
                              flex
                              items-center
                              gap-[0.7vw]
                              w-full
                              rounded-md
                              px-[0.7vw]
                              py-[0.55vw]
                              bg-[#2B2B2B]
                              border-b
                              border-[#202020]
                              hover:bg-[#303030]
                              transition
                            "
                          >
                            {/* FOTO */}

                            {item.user?.fotoUrl ? (
                              <img
                                src={item.user.fotoUrl}
                                alt={fullName}
                                className="
                                  shrink-0
                                  w-[1.8vw]
                                  h-[1.8vw]
                                  rounded-full
                                  object-cover
                                "
                              />
                            ) : (
                              <div
                                className="
                                  shrink-0
                                  w-[1.8vw]
                                  h-[1.8vw]
                                  rounded-full
                                  bg-[#555]
                                  flex
                                  items-center
                                  justify-center
                                  text-[0.65vw]
                                  font-semibold
                                  text-gray-200
                                "
                              >
                                {firstName.charAt(0).toUpperCase()}
                              </div>
                            )}

                            {/* TEXTO */}

                            <div
                              className="
                                flex-1
                                min-w-0
                                flex
                                items-center
                                gap-[0.35vw]
                                text-[0.72vw]
                              "
                            >
                              <span className="font-semibold whitespace-nowrap">
                                {fullName}
                              </span>

                              <span className="text-gray-400 whitespace-nowrap">
                                {getActionLabel(item.action)}
                              </span>

                              {/* ATUALIZAÇÃO */}

                              {changes ? (
                                <div className="flex items-center gap-[0.5vw] min-w-0">
                                  {item.entityType && (
                                    <span className="text-gray-200 whitespace-nowrap">
                                      {getEntityLabel(item.entityType)}
                                    </span>
                                  )}

                                  {changes.map((change, index) => (
                                    <div
                                      key={`${change.campo}-${index}`}
                                      className="
          flex
          items-center
          gap-[0.3vw]
          min-w-0
          text-[0.62vw]
        "
                                    >
                                      <span className="text-gray-400 whitespace-nowrap">
                                        {getFieldLabel(change.campo)}:
                                      </span>

                                      <span
                                        className="
            text-gray-500
            line-through
            truncate
            max-w-[10vw]
          "
                                      >
                                        {formatChangeValue(change.antes)}
                                      </span>

                                      <span className="text-gray-600">→</span>

                                      <span
                                        className="
            text-gray-200
            font-medium
            truncate
            max-w-[10vw]
          "
                                      >
                                        {formatChangeValue(change.depois)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                               <>
  {item.entityType && (
    <span className="text-gray-200 whitespace-nowrap">
      {getEntityLabel(item.entityType)}
    </span>
  )}

  { item.entityType == "CASO" && item.entityName && (
    <>
      <span className="text-gray-400">:</span>

      <span className="font-semibold text-gray-200 whitespace-nowrap">
        {item.entityName}
      </span>
    </>
  )}

  {item.entityType == "EVIDENCIA" && (
    <span className="text-gray-400 whitespace-nowrap truncate">
      — {item.details}
    </span>
  )}

  {item.entityType == "SUSPEITO" && (
    <span className="text-gray-400 whitespace-nowrap truncate">
     {getEntityNameFromDetails(item.details)}
    </span>
  )}
</>
                              )}
                            </div>

                            {/* TAG */}

                            <span
                              className={`
                                shrink-0
                                rounded-full
                                px-[0.65vw]
                                py-[0.18vw]
                                text-[0.5vw]
                                whitespace-nowrap
                                ${actionColor.background}
                                ${actionColor.text}
                              `}
                            >
                              {getActionLabel(item.action)}
                            </span>

                            {/* DATA */}

                            <span
                              className="
                                shrink-0
                                text-[0.52vw]
                                text-gray-300
                                whitespace-nowrap
                              "
                            >
                              {formatDate(itemDate)} {formatTime(itemDate)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ==================================================
                VER MAIS
            ================================================== */}

            {filteredHistory.length > 0 && (
              <button
                type="button"
                className="
                  mt-[0.7vw]
                  flex
                  items-center
                  gap-[0.4vw]
                  px-[0.7vw]
                  py-[0.35vw]
                  border
                  border-[#575757]
                  rounded-md
                  bg-[#292929]
                  text-[0.65vw]
                  hover:bg-[#353535]
                  transition
                "
              >
                <FiPlus className="text-[0.8vw]" />
                Ver mais
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
