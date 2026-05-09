import { useState } from "react";
import Tag from "../ui/Tag";
import DatePicker from "../ui/DatePicker";
import { Checkbox } from "../../../@/components/ui/checkbox";

export default function FilterPanelEvidence({ onClose }: { onClose: () => void }) {
    const [date, setDate] = useState("");

    const handleDate = (name: string, value: string) => {
        setDate(value);
    };

    const [filters, setFilters] = useState({
        status: [] as string[],
        tipo: [] as string[],
        suspeitos: [] as string[],
    });
    
    const SUSPEITOS = [
        { id: "1", nome: "Isadora", avatar: "/public/suspeitos/0.svg" },
        { id: "2", nome: "Camila", avatar: "/public/suspeitos/1.svg" },
        { id: "3", nome: "Rafael", avatar: "/public/suspeitos/2.svg" },
        { id: "4", nome: "Vinícius", avatar: "/public/suspeitos/3.svg" },
        { id: "5", nome: "Eduardo", avatar: "/public/suspeitos/4.svg" },
        { id: "6", nome: "Carlos", avatar: "/public/suspeitos/5.svg" },
        { id: "7", nome: "Gustavo", avatar: "/public/suspeitos/6.svg" },
    ];

    function toggleFilter(group: "status" | "tipo" | "suspeitos", value: string) {
        setFilters((prev) => {
            const exists = prev[group].includes(value);
            return {
                ...prev,
                [group]: exists
                    ? prev[group].filter((v) => v !== value)
                    : [...prev[group], value],
            };
        });
    }

    function toggleAll(group: "status" | "tipo" | "suspeitos", values: string[]) {
        setFilters((prev) => {
            const allSelected = values.every((v) => prev[group].includes(v));
            return {
                ...prev,
                [group]: allSelected ? [] : values,
            };
        });
    }

    return (
        <div className="fixed inset-x-4 top-auto z-50 md:absolute md:inset-x-auto md:right-0 md:top-full mt-2 w-auto md:w-[calc(100vw-2rem)] md:max-w-[420px] bg-[#2b2b2b] border border-[#444] rounded-xl shadow-xl">
            {/* HEADER */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-[#3a3a3a]">
                <span className="text-sm text-white font-medium">Filtrar</span>
                 <button onClick={onClose} className="text-[#ccc] transition-colors text-base hover:bg-[#ccc]/10 rounded-full w-8 h-8 flex items-center justify-center">
                    ✕
                </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-4">

                {/* LINHA: Procurar + Data */}
                <div className="flex flex-row xs:flex-row gap-3">
                    <div className="flex-1">
                        <label className="text-xs text-[#FFFFFF]/78 block mb-1">Procurar</label>
                        <input
                            placeholder="Procurar"
                            className="w-full h-10 bg-[#242424] border border-[#434343] rounded-md px-3 text-sm text-[#aaa] outline-none focus:ring-0 focus:border-[#555]"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-xs text-[#FFFFFF]/78 block mb-1">Data</label>
                        <DatePicker
                            name="data"
                            value={date}
                            onChange={handleDate}
                            placeholder="Selecionar"
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-[#FFFFFF]/78">Status</label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#aaa]">Todos</span>
                            <Checkbox
                                checked={["coletada", "analise", "custodiada"].every((v) =>
                                    filters.status.includes(v)
                                )}
                                onCheckedChange={() =>
                                    toggleAll("status", ["coletada", "analise", "custodiada"])
                                }
                                className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Tag label="Coletada" active={filters.status.includes("coletada")} onClick={() => toggleFilter("status", "coletada")} />
                        <Tag label="Em análise" active={filters.status.includes("analise")} onClick={() => toggleFilter("status", "analise")} />
                        <Tag label="Custodiada" active={filters.status.includes("custodiada")} onClick={() => toggleFilter("status", "custodiada")} />
                    </div>
                </div>

                {/* Tipo */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-[#FFFFFF]/78">Tipo de evidência</label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#aaa]">Todos</span>
                            <Checkbox
                                checked={["dna", "digital", "depoimento"].every((v) =>
                                    filters.tipo.includes(v)
                                )}
                                onCheckedChange={() =>
                                    toggleAll("tipo", ["dna", "digital", "depoimento"])
                                }
                                className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <Tag label="DNA" active={filters.tipo.includes("dna")} onClick={() => toggleFilter("tipo", "dna")} />
                        <Tag label="Digital" active={filters.tipo.includes("digital")} onClick={() => toggleFilter("tipo", "digital")} />
                        <Tag label="Depoimento" active={filters.tipo.includes("depoimento")} onClick={() => toggleFilter("tipo", "depoimento")} />
                    </div>
                </div>

                {/* Suspeitos */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs text-[#FFFFFF]/78">Suspeitos</label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-[#aaa]">Todos</span>
                            <Checkbox
                                checked={SUSPEITOS.every((s) => filters.suspeitos.includes(s.id))}
                                onCheckedChange={() =>
                                    toggleAll("suspeitos", SUSPEITOS.map((s) => s.id))
                                }
                                className="border-[#575757] rounded-sm data-[state=checked]:bg-[#139C73] data-[state=checked]:border-[#139C73]"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {SUSPEITOS.map((s) => {
                            const active = filters.suspeitos.includes(s.id);
                            return (
                                <div
                                    key={s.id}
                                    onClick={() => toggleFilter("suspeitos", s.id)}
                                    className={`flex flex-col justify-center items-center gap-1 cursor-pointer transition ${active ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
                                >
                                    <img
                                        src={s.avatar}
                                        alt={s.nome}
                                        className={`w-9 h-9 rounded-full border-2 transition ${active ? "border-[#139C73]" : "border-transparent"}`}
                                    />
                                    <span className="text-[10px] text-[#aaa]">{s.nome}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between pt-3 gap-3 border-t border-[#3a3a3a]">
                    <button className="text-[#00a87e] w-full bg-[#136D52]/26 text-sm px-4 py-2 rounded-md hover:bg-[#136D52]/40 transition">
                        Limpar filtros
                    </button>
                    <button className="bg-[#139C73] w-full text-white hover:bg-[#139C73]/80 transition text-sm px-4 py-2 rounded-md">
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </div>
    );
}