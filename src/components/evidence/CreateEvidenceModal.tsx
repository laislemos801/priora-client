"use client";
import { useEffect, useState } from "react";
import CustomDropdown from "../ui/CustomDropdown";
import DatePicker from "../ui/DatePicker";
import PrimaryButton from "../ui/PrimaryButton";
import { Trash2 } from "lucide-react";
import { IoMdArrowDropdown } from "react-icons/io";


const STATUS_OPTIONS = [
  { value: "ativo", label: "Ativo", color: "#4caf7d" },
  { value: "pendente", label: "Pendente", color: "#e0a030" },
  { value: "finalizado", label: "Finalizado", color: "#777" },
];

const TIPO_OPTIONS = [
  { value: "foto", label: "Foto" },
  { value: "video", label: "Vídeo" },
  { value: "documento", label: "Documento" },
];

const LABEL =
  "text-[11px] font-medium text-[#888] uppercase tracking-widest block mb-1.5";

const INPUT =
  "w-full bg-[#282828] border border-[#434343] rounded-md px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6]";

export default function CreateEvidenceModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    status: "",
    descricao: "",
    data: "",
  });

  const [suspeitos, setSuspeitos] = useState<string[]>([]);

  const [openSuspeitos, setOpenSuspeitos] = useState(false);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDropdown = (name: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSuspeito = () => {
    setSuspeitos((prev) => [...prev, `Suspeito ${prev.length + 1}`]);
  };

  const removeSuspeito = (index: number) => {
    setSuspeitos((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3">
      <div className="bg-[#282828] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[10px] border border-[#2e2e2e]">

        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#2e2e2e]">
          <h2 className="text-[15px] font-medium text-[#e8e8e8]">
            Nova Evidência
          </h2>

          <button
            onClick={onClose}
            className="text-[#666] hover:text-[#ccc]"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Nome */}
            <div>
                <label className={LABEL}>Nome evidência</label>
                <input
                    name="nome"
                    placeholder="Nome Evidência"
                    onChange={handleInput}
                    className={INPUT}
                />
            </div>

            {/* Tipo */}
            <div>
                <label className={LABEL}>Tipo de evidência</label>
                <CustomDropdown
                    name="tipo"
                    placeholder="Tipo de evidência"
                    options={TIPO_OPTIONS}
                    value={form.tipo}
                    onChange={handleDropdown}
                />
            </div>

            {/* Status */}
            <div>
                <label className={LABEL}>Status</label>
                <CustomDropdown
                    name="status"
                    placeholder="Status"
                    options={STATUS_OPTIONS}
                    value={form.status}
                    onChange={handleDropdown}
                />
            </div>

            {/* BLOCO COMBINADO */}
            <div className=" md:col-span-4 grid md:grid-cols-[2fr_3fr] gap-4 md:pr-4">

                {/* COLUNA ESQUERDA */}
                <div className="flex flex-col gap-4">

                    {/* Data */}
                    <div>
                        <label className={LABEL}>Data</label>
                        <DatePicker
                            name="data"
                            value={form.data}
                            onChange={handleDropdown}
                        />
                    </div>

                    {/* Suspeitos */}
                    <div>
                        <label className={LABEL}>Adicionar suspeito(s)</label>

                        <div className="bg-[#282828] border border-[#434343] rounded-md">
                            <button
                                onClick={() => setOpenSuspeitos(!openSuspeitos)}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#A6A6A6]">
                                <span>
                                    {suspeitos.length > 0
                                    ? `${suspeitos.length} suspeito(s)`
                                    : "Adicionar Suspeito(s)"}
                                </span>

                                <IoMdArrowDropdown
                                    size={18}
                                    className={`text-[#888] transition-transform duration-300 ${
                                    openSuspeitos ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {openSuspeitos && (
                                <div className="border-t border-[#434343] p-2 space-y-2">
                                    {suspeitos.map((s, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center bg-[#2a2a2a] px-2 py-1 rounded">
                                            <span className="text-sm text-[#ccc]">{s}</span>

                                            <button onClick={() => removeSuspeito(index)}>
                                                <Trash2 size={14} className="text-[#888] hover:text-red-400" />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        onClick={addSuspeito}
                                        className="text-xs text-[#aaa] hover:text-white">
                                        + Adicionar novo suspeito
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* COLUNA DIREITA */}
                <div>
                    <label className={LABEL}>Descrição</label>
                    <textarea
                    name="descricao"
                    onChange={handleInput}
                    placeholder="Descrição"
                    className={`${INPUT} min-h-30 w-full resize-none`}
                    />
                </div>

            </div>
        </div>
        {/* FOOTER */}
        <div className="flex justify-end px-5 py-4 border-t border-[#2e2e2e]">
          <PrimaryButton>Salvar</PrimaryButton>
        </div>
      </div>
    </div>
  );
}