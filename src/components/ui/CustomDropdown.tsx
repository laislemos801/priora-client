"use client";
import { IoMdArrowDropdown } from "react-icons/io";
import React, { useEffect, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
  meta?: string;
  color?: string;
  icon?: React.ReactNode;
};

type CustomDropdownProps = {
  name: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (name: string, value: string) => void;
};

export default function CustomDropdown({
  name,
  placeholder = "Selecione",
  options,
  value,
  onChange,
}: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full select-none">

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md border transition-colors text-left
          bg-[#282828] border-[#434343]
          ${open ? "rounded-b-none border-[#606060]" : "hover:border-[#606060]"}
          ${selected ? "text-[#A6A6A6]" : "text-[#A6A6A6]"}
        `}
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              {selected.icon && <span className="shrink-0">{selected.icon}</span>}
              {selected.color && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: selected.color }}
                />
              )}
              <span
                style={selected.color ? { color: selected.color } : undefined}
                className="truncate text-[#A6A6A6]"
              >
                {selected.label}
              </span>
            </>
          ) : (
            <span className="text-[#A6A6A6]">{placeholder}</span>
          )}
        </span>

        <IoMdArrowDropdown
          size={14}
          className={`text-[#D9D9D9] transition-all duration-200 ease-out ${
            open ? "rotate-180 scale-110" : "rotate-0 scale-100"
          }`}
        />
      </button>

      {/* Menu */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-50 bg-[#282828] border border-t-0 border-[#606060] rounded-b-md overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(name, opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors
                ${
                  value === opt.value
                    ? "bg-[#333333] text-[#e8e8e8]"
                    : "text-[#A6A6A6] hover:bg-[#333333] hover:text-[#e8e8e8]"
                }
              `}
            >
              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
              {opt.color && (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: opt.color }}
                />
              )}
              <span
                style={opt.color ? { color: opt.color } : undefined}
                className="truncate"
              >
                {opt.label}
              </span>
              {opt.meta && (
                <span className="ml-auto text-xs text-[#666]">{opt.meta}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
