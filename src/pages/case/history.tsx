import TopBar from "@/components/ui/TopBar";

import {
  FiShare2,
  FiFilter,
  FiPlus,
} from "react-icons/fi";

import roseHines from "@/assets/rose.png";
import aryanRoy from "@/assets/aryan.png";
import lucasGoes from "@/assets/lucas.png";


// ============================================================
// FUNÇÕES DE DATA
// ============================================================

// Remove horas e deixa somente a data
function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}


// Segunda-feira da semana atual
function startOfWeek(date) {
  const result = startOfDay(date);

  const day = result.getDay();

  // Domingo = 0
  // Segunda = 1
  const difference = day === 0 ? 6 : day - 1;

  result.setDate(result.getDate() - difference);

  return result;
}




// Formata somente a data
function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}


// Formata somente o horário
function formatTime(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}


// ============================================================
// CLASSIFICAÇÃO DOS HISTÓRICOS
// ============================================================

function organizeHistory(items) {
  const today = startOfDay(new Date());

  const currentWeekStart = startOfWeek(today);

  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  const lastWeekEnd = new Date(currentWeekStart);
  lastWeekEnd.setMilliseconds(-1);


  const todayItems = [];
  const thisWeekItems = [];
  const lastWeekItems = [];

  // Históricos antigos serão agrupados pela data
  const oldItems = {};


  items.forEach((item) => {
    const itemDate = new Date(item.date);

    const day = startOfDay(itemDate);


    // HOJE
    if (day.getTime() === today.getTime()) {
      todayItems.push(item);
      return;
    }


    // ESSA SEMANA
    if (
      day >= currentWeekStart &&
      day <= today
    ) {
      thisWeekItems.push(item);
      return;
    }


    // SEMANA PASSADA
    if (
      day >= lastWeekStart &&
      day <= lastWeekEnd
    ) {
      lastWeekItems.push(item);
      return;
    }


    // ANTES DA SEMANA PASSADA
    const dateKey = formatDate(itemDate);

    if (!oldItems[dateKey]) {
      oldItems[dateKey] = [];
    }

    oldItems[dateKey].push(item);
  });


  const sections = [];


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


  // Datas antigas
  Object.entries(oldItems).forEach(([date, items]) => {
    sections.push({
      title: date,
      items,
    });
  });


  return sections;
}


// ============================================================
// COMPONENTE
// ============================================================

export default function History() {

  // ==========================================================
  // HISTÓRICOS
  // ==========================================================

  const history = [
    {
      date: "2026-09-16T01:09:00",
      image: roseHines,
      name: "Rose Hines",
      action: "enviou imagem",
      text: "Foto da cena do crime",
      tag: "Quadro investigativo",
      type: "blue",
    },

    {
      date: "2026-09-16T01:09:00",
      image: roseHines,
      name: "Rose Hines",
      action: "conectou",
      text: "Seta Suspeito 2 → Local do Crime",
      tag: "Quadro investigativo",
      type: "blue",
    },

    {
      date: "2026-09-15T16:40:00",
      image: aryanRoy,
      name: "Aryan Roy",
      action: "alterou status do Depoimento 01 para",
      text: "Custodiada",
      status: "green",
      tag: "Evidências",
      type: "green",
    },

    {
      date: "2026-09-14T16:07:00",
      image: lucasGoes,
      name: "Lucas Goes",
      action: "enviou um convite para",
      text: "Rhea Rull editar caso Alpha",
      tag: "Convite",
      type: "yellow",
    },

    {
      date: "2026-09-12T13:34:00",
      image: aryanRoy,
      name: "Aryan Roy",
      action: "adicionou texto",
      text: '"Horário do crime"',
      tag: "Quadro investigativo",
      type: "blue",
    },

    {
      date: "2026-09-11T13:09:00",
      image: roseHines,
      name: "Rose Hines",
      action: "adicionou Nota",
      text: '"Aguardar laudo"',
      tag: "Quadro investigativo",
      type: "blue",
    },

    {
      date: "2026-09-10T13:07:00",
      image: lucasGoes,
      name: "Lucas Goes",
      action: "enviou um convite para",
      text: "Sarika Jain editar caso Alpha",
      tag: "Convite",
      type: "yellow",
    },

    {
      date: "2026-09-09T12:40:00",
      image: lucasGoes,
      name: "Lucas Goes",
      action: "alterou status do DNA 01 para",
      text: "Em análise",
      status: "orange",
      tag: "Evidências",
      type: "green",
    },

    // ============================================
    // EXEMPLOS ANTIGOS
    // ============================================

    {
      date: "2026-09-01T09:40:00",
      image: lucasGoes,
      name: "Lucas Goes",
      action: "editou foto do suspeito",
      text: "",
      tag: "Quadro investigativo",
      type: "blue",
    },

    {
      date: "2026-08-25T15:20:00",
      image: roseHines,
      name: "Rose Hines",
      action: "adicionou documento",
      text: "Laudo pericial",
      tag: "Documentos",
      type: "blue",
    },
  ];


  // Organiza automaticamente
  const sections = organizeHistory(history);


  return (
    <div className="min-h-screen bg-[#1D1D1D] text-white flex flex-col">

      <TopBar />

      <main className="flex-1 p-[1vw] md:p-[1.2vw]">

        <div className="w-full min-h-[calc(100vh-5vw)] rounded-lg border border-[#575757] bg-[#242424] overflow-hidden">

          {/* ==================================================
              CABEÇALHO
          ================================================== */}

          <div className="flex items-center justify-between px-[1.2vw] py-[0.8vw] border-b border-[#575757]">

            <div className="flex items-center gap-[0.7vw]">

              <FiShare2
                className="text-[#12B98B] text-[1vw]"
              />

              <h1 className="font-semibold text-[1vw]">
                Histórico
              </h1>

            </div>


            <button
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
              "
            >
              <FiFilter className="text-[0.8vw]" />

              Filtrar
            </button>

          </div>


          {/* ==================================================
              LISTA
          ================================================== */}

          <div className="p-[0.8vw]">

            <div className="w-full ] overflow-hidden">

              {sections.map((section) => (

                <div key={section.title}>

                  {/* ==========================================
                      TÍTULO DA SEÇÃO
                  ========================================== */}

                  <div className="flex items-center gap-[0.4vw] px-[0.1vw]">

                    <span className="whitespace-nowrap text-[0.65vw] font-medium">
                      {section.title}
                    </span>

                    <div className="flex-1 h-[1px] bg-gray-300" />

                  </div>


                  {/* ==========================================
                      ITENS
                  ========================================== */}

                  {section.items.map((item, index) => {

                    const itemDate = new Date(item.date);

                    return (
                      <div
                        key={`${section.title}-${index}`}
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

                        <img
                          src={item.image}
                          alt=""
                          className="
                            shrink-0
                            w-[1.8vw]
                            h-[1.8vw]
                            rounded-full
                            object-cover
                          "
                        />


                        {/* TEXTO */}

                        <div className="
                          flex-1
                          min-w-0
                          flex
                          items-center
                          gap-[0.35vw]
                          text-[0.72vw]
                        ">

                          <span className="font-semibold whitespace-nowrap">
                            {item.name}
                          </span>

                          <span className="text-gray-400 whitespace-nowrap">
                            {item.action}
                          </span>


                          {/* STATUS */}

                          {item.status && (
                            <span
                              className={`
                                shrink-0
                                w-[0.35vw]
                                h-[0.35vw]
                                rounded-full

                                ${
                                  item.status === "green"
                                    ? "bg-[#19C58C]"
                                    : "bg-[#F4A340]"
                                }
                              `}
                            />
                          )}


                          {/* TEXTO */}

                          <span
                            className={`
                              whitespace-nowrap

                              ${
                                item.status
                                  ? "font-semibold"
                                  : "text-gray-200"
                              }
                            `}
                          >
                            {item.text}
                          </span>

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

                            ${
                              item.type === "blue"
                                ? "bg-[#465157] text-[#65BBDD]"
                                : ""
                            }

                            ${
                              item.type === "green"
                                ? "bg-[#155A46] text-[#18C18A]"
                                : ""
                            }

                            ${
                              item.type === "yellow"
                                ? "bg-[#B69B1A] text-[#282200]"
                                : ""
                            }
                          `}
                        >
                          {item.tag}
                        </span>


                        {/* DATA / HORA */}

                        <span className="
                          shrink-0
                          text-[0.52vw]
                          text-gray-300
                          whitespace-nowrap
                        ">
                          {formatDate(itemDate)}{" "}
                          {formatTime(itemDate)}
                        </span>

                      </div>
                    );
                  })}

                </div>
              ))}

            </div>


            {/* ==================================================
                VER MAIS
            ================================================== */}

            <button
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
              "
            >
              <FiPlus className="text-[0.8vw]" />

              Ver mais
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}