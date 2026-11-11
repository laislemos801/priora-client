"use client";
import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

const POPUP_WIDTH = 260;
const GAP = 4;
// altura máxima do popup (vista de dias com 6 semanas), usada para decidir se abre para cima
const POPUP_HEIGHT = 340;
const YEARS_PER_PAGE = 12;

type View = "days" | "months" | "years";

type DatePickerProps = {
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
};

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function toDisplay(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

type Pos = { left: number; top?: number; bottom?: number };

export default function DatePicker({
  name,
  value,
  onChange,
  placeholder = "Selecione a data",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("days");
  const [pos, setPos] = useState<Pos | null>(null);

  const [cursor, setCursor] = useState(() => {
    const base = value ? new Date(value + "T00:00:00") : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  // primeiro ano da página exibida na grade de anos
  const [yearPage, setYearPage] = useState(() => cursor.getFullYear() - 4);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const selected = value ? new Date(value + "T00:00:00") : null;
  const today = new Date();

  // O calendário é desenhado num portal (fora do modal, que tem rolagem própria e cortaria
  // o popup) e abre para baixo ou para cima, conforme o espaço que sobra na tela.
  function place() {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const popupH = POPUP_HEIGHT;
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < popupH + GAP && r.top > spaceBelow;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - POPUP_WIDTH - 8));
    setPos(
      openUp
        ? { left, bottom: window.innerHeight - r.top + GAP }
        : { left, top: r.bottom + GAP },
    );
  }

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || popupRef.current?.contains(t)) return;
      setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const reposition = () => place();

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open]);

  function toggle() {
    if (!open) {
      const base = selected ?? new Date();
      setCursor(new Date(base.getFullYear(), base.getMonth(), 1));
      setView("days");
      place();
    }
    setOpen((p) => !p);
  }

  function changeMonth(dir: number) {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + dir, 1));
  }

  function select(day: number) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    onChange(name, toISO(date));
    setOpen(false);
  }

  function pickMonth(m: number) {
    setCursor((prev) => new Date(prev.getFullYear(), m, 1));
    setView("days");
  }

  function pickYear(y: number) {
    setCursor((prev) => new Date(y, prev.getMonth(), 1));
    setView("months");
  }

  function openYears() {
    setYearPage(cursor.getFullYear() - 4);
    setView("years");
  }

  function goToday() {
    onChange(name, toISO(new Date()));
    setOpen(false);
  }

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const BASE =
    "w-full bg-[#282828] border border-[#434343] rounded-md px-3 py-2 text-sm flex justify-between items-center text-left hover:border-[#606060] transition-colors";

  const TITLE_BTN =
    "rounded-md px-2 py-1 text-sm text-[#d0d0d0] hover:bg-[#333] transition-colors";

  const CELL =
    "rounded-md py-2 text-sm text-center transition-colors border";

  return (
    <div className="relative w-full select-none">

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`${BASE} text-[#A6A6A6]`}
      >
        <span>
          {selected ? toDisplay(selected) : placeholder}
        </span>

        <div className="w-6 h-6 flex items-center justify-center bg-[#3D3D3D] rounded-full">
            <Calendar size={12} color="#939393" />
        </div>
      </button>

      {/* Calendar */}
      {open &&
        createPortal(
          <div
            ref={popupRef}
            role="dialog"
            aria-label="Escolher data"
            style={{
              position: "fixed",
              width: POPUP_WIDTH,
              left: pos?.left ?? 0,
              top: pos?.top,
              bottom: pos?.bottom,
              visibility: pos ? "visible" : "hidden",
            }}
            className="z-[10000] select-none rounded-md border border-[#434343] bg-[#282828] p-3 shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <NavBtn
                label={view === "years" ? "Anos anteriores" : view === "months" ? "Ano anterior" : "Mês anterior"}
                onClick={() =>
                  view === "years"
                    ? setYearPage((p) => p - YEARS_PER_PAGE)
                    : view === "months"
                    ? setCursor((c) => new Date(c.getFullYear() - 1, c.getMonth(), 1))
                    : changeMonth(-1)
                }
                dir="left"
              />

              {view === "days" && (
                <div className="flex items-center gap-1">
                  <button type="button" className={TITLE_BTN} onClick={() => setView("months")}>
                    {MONTHS[month]}
                  </button>
                  <button type="button" className={TITLE_BTN} onClick={openYears}>
                    {year}
                  </button>
                </div>
              )}
              {view === "months" && (
                <button type="button" className={TITLE_BTN} onClick={openYears}>
                  {year}
                </button>
              )}
              {view === "years" && (
                <span className="text-sm text-[#d0d0d0]">
                  {yearPage} – {yearPage + YEARS_PER_PAGE - 1}
                </span>
              )}

              <NavBtn
                label={view === "years" ? "Próximos anos" : view === "months" ? "Próximo ano" : "Próximo mês"}
                onClick={() =>
                  view === "years"
                    ? setYearPage((p) => p + YEARS_PER_PAGE)
                    : view === "months"
                    ? setCursor((c) => new Date(c.getFullYear() + 1, c.getMonth(), 1))
                    : changeMonth(1)
                }
                dir="right"
              />
            </div>

            {view === "days" && (
              <>
                {/* Weekdays */}
                <div className="grid grid-cols-7 text-center text-[10px] text-[#666] mb-1">
                  {WEEKDAYS.map((d, i) => (
                    <div key={i}>{d}</div>
                  ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, i) => {
                    if (!day) return <div key={i} />;

                    const isToday =
                      day === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear();

                    const isSelected =
                      selected &&
                      day === selected.getDate() &&
                      month === selected.getMonth() &&
                      year === selected.getFullYear();

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => select(day)}
                        className={`aspect-square rounded-md text-sm flex items-center justify-center transition-colors border
                          ${
                            isSelected
                              ? "bg-white text-black border-white"
                              : isToday
                              ? "text-[#139C73] border-[#136D52]/30"
                              : "text-[#A6A6A6] border-transparent hover:bg-[#333]"
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={goToday}
                  className="mt-3 w-full rounded-md py-1.5 text-xs text-[#139C73] hover:bg-[#333] transition-colors"
                >
                  Hoje
                </button>
              </>
            )}

            {view === "months" && (
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((m, i) => {
                  const isCurrent = i === month;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => pickMonth(i)}
                      className={`${CELL} ${
                        isCurrent
                          ? "bg-white text-black border-white"
                          : "text-[#A6A6A6] border-transparent hover:bg-[#333]"
                      }`}
                    >
                      {m.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            )}

            {view === "years" && (
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPage + i).map((y) => {
                  const isCurrent = y === year;
                  const isThisYear = y === today.getFullYear();
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => pickYear(y)}
                      className={`${CELL} ${
                        isCurrent
                          ? "bg-white text-black border-white"
                          : isThisYear
                          ? "text-[#139C73] border-[#136D52]/30"
                          : "text-[#A6A6A6] border-transparent hover:bg-[#333]"
                      }`}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

/* ICONS */
function NavBtn({
  onClick,
  dir,
  label,
}: {
  onClick: () => void;
  dir: "left" | "right";
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-7 h-7 flex items-center justify-center bg-[#3D3D3D] rounded-full text-[#939393] hover:opacity-80"
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );
}
