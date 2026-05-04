"use client";
import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

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

export default function DatePicker({
  name,
  value,
  onChange,
  placeholder = "Selecione a data",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const [cursor, setCursor] = useState(() => {
    const base = value ? new Date(value + "T00:00:00") : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? new Date(value + "T00:00:00") : null;
  const today = new Date();

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function changeMonth(dir: number) {
    setCursor((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    });
  }

  function select(day: number) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    onChange(name, toISO(date));
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
    "w-full bg-[#282828] border border-[#434343] rounded-md px-3 py-2 text-sm flex justify-between items-center text-left";

  return (
    <div ref={ref} className="relative w-full select-none">

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`${BASE} ${!selected ? "text-[#A6A6A6]" : "text-[#A6A6A6]"}`}
      >
        <span>
          {selected ? toDisplay(selected) : placeholder}
        </span>

        <div className="w-6 h-6 flex items-center justify-center bg-[#3D3D3D] rounded-full">
            <Calendar size={12} color="#939393" />
        </div>
      </button>

      {/* Calendar */}
      {open && (
        <div className="absolute top-full left-0 z-50 w-65 bg-[#282828] border border-[#434343] rounded-md p-3 mt-1">

          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <NavBtn onClick={() => changeMonth(-1)} dir="left" />

            <span className="text-sm text-[#A6A6A6]">
              {MONTHS[month]} {year}
            </span>

            <NavBtn onClick={() => changeMonth(1)} dir="right" />
          </div>

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
        </div>
      )}
    </div>
  );
}

/* ICONS */
function NavBtn({
  onClick,
  dir,
}: {
  onClick: () => void;
  dir: "left" | "right";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center bg-[#3D3D3D] rounded-full text-[#939393] hover:opacity-80"
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );
}