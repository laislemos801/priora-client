"use client";
import { useEffect, useState } from "react";
import CustomDropdown from "../ui/CustomDropdown";
import DatePicker from "../ui/DatePicker";
import PrimaryButton from "../ui/PrimaryButton";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

// TODO: substituir pelo userId real vindo do contexto de autenticação
const MOCK_USER_ID = "da7be1ad-6a1f-4c56-a91c-0d24e355391b";

const STATUS_OPTIONS = [
  { value: "ativo", label: "Ativo", color: "#4caf7d" },
  { value: "pendente", label: "Pendente", color: "#e0a030" },
  { value: "finalizado", label: "Finalizado", color: "#777" },
];

const PRIORIDADE_OPTIONS = [
  { value: "baixa", label: "Baixa", icon: <ArrowDown size={14} color="#5b9cf6" /> },
  { value: "media", label: "Média", icon: <Minus size={14} color="#e0a030" /> },
  { value: "alta", label: "Alta", icon: <ArrowUp size={14} color="#e05555" /> },
];

const ESTADO_OPTIONS = [
  { value: "sp", label: "SP", meta: "São Paulo" },
  { value: "rj", label: "RJ", meta: "Rio de Janeiro" },
  { value: "mg", label: "MG", meta: "Minas Gerais" },
];

const CIDADE_OPTIONS = [
  { value: "campinas", label: "Campinas" },
  { value: "sao_paulo", label: "São Paulo" },
];

// Mapeia values do dropdown para os valores que o back espera
const STATUS_MAP: Record<string, string> = {
  ativo: "Ativo",
  pendente: "Arquivado",
  finalizado: "Concluído",
};

const PRIORIDADE_MAP: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const ESTADO_MAP: Record<string, string> = {
  sp: "São Paulo",
  rj: "Rio de Janeiro",
  mg: "Minas Gerais",
};

const CIDADE_MAP: Record<string, string> = {
  campinas: "Campinas",
  sao_paulo: "São Paulo",
};

type FormState = {
  nome: string;
  status: string;
  prioridade: string;
  descricao: string;
  endereco: string;
  numero: string;
  bairro: string;
  estado: string;
  cidade: string;
  data: string;
};

const LABEL =
  "text-[11px] font-medium text-[#888] uppercase tracking-widest block mb-1.5";

const INPUT =
  "w-full bg-[#282828] border border-[#434343] rounded-md px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6] focus:border-[#434343] transition-colors";

const ERROR_CLASS = "text-[11px] text-red-400 mt-1";

export default function CreateCaseModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<FormState>({
    nome: "",
    status: "",
    prioridade: "",
    descricao: "",
    endereco: "",
    numero: "",
    bairro: "",
    estado: "",
    cidade: "",
    data: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDropdown = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async () => {
    setError(null);

    // Validação dos campos obrigatórios
    if (!form.nome.trim())       return setError("Nome do caso é obrigatório.");
    if (!form.status)            return setError("Status é obrigatório.");
    if (!form.prioridade)        return setError("Prioridade é obrigatória.");
    if (!form.descricao.trim())  return setError("Descrição é obrigatória.");
    if (!form.data)              return setError("Data de ocorrência é obrigatória.");

    const payload = {
      userId:             MOCK_USER_ID, // TODO: trocar pelo userId do contexto de auth
      nome:               form.nome.trim(),
      descricao:          form.descricao.trim(),
      status:             STATUS_MAP[form.status],
      prioridade:         PRIORIDADE_MAP[form.prioridade],
      enderecoLogradouro: form.endereco.trim() || null,
      enderecoNumero:     form.numero.trim() || null,
      enderecoBairro:     form.bairro.trim() || null,
      enderecoCidade:     CIDADE_MAP[form.cidade] ?? null,
      enderecoEstado:     ESTADO_MAP[form.estado] ?? null,
      dataOcorrencia:     form.data, // já vem em "YYYY-MM-DD" do DatePicker
    };

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8000/cases/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.detail ?? `Erro ${res.status}`);
      }

      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar o caso.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3">
      <div className="bg-[#282828] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[10px] border border-[#2e2e2e]">

        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#2e2e2e]">
          <h2 className="text-[15px] font-medium text-[#e8e8e8]">Novo Caso</h2>
          <button onClick={onClose} className="text-[#666] hover:text-[#ccc] text-base">
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className={LABEL}>Nome do caso</label>
            <input name="nome" onChange={handleInput} placeholder="Nome caso" className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Status</label>
            <CustomDropdown name="status" placeholder="Status" options={STATUS_OPTIONS} value={form.status} onChange={handleDropdown} />
          </div>

          <div>
            <label className={LABEL}>Prioridade</label>
            <CustomDropdown name="prioridade" placeholder="Prioridade" options={PRIORIDADE_OPTIONS} value={form.prioridade} onChange={handleDropdown} />
          </div>

          <div className="md:col-span-3">
            <label className={LABEL}>Descrição</label>
            <textarea name="descricao" onChange={handleInput} className={`${INPUT} h-24 resize-none`} />
          </div>

          <div className="md:col-span-2">
            <label className={LABEL}>Endereço principal</label>
            <input name="endereco" onChange={handleInput} placeholder="Rua, Avenida..." className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Número</label>
            <input name="numero" onChange={handleInput} className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Bairro</label>
            <input name="bairro" onChange={handleInput} className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Estado</label>
            <CustomDropdown name="estado" placeholder="Estado" options={ESTADO_OPTIONS} value={form.estado} onChange={handleDropdown} />
          </div>

          <div>
            <label className={LABEL}>Cidade</label>
            <CustomDropdown name="cidade" placeholder="Cidade" options={CIDADE_OPTIONS} value={form.cidade} onChange={handleDropdown} />
          </div>

          <div>
            <label className={LABEL}>Data</label>
            <DatePicker name="data" value={form.data} onChange={handleDropdown} />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col items-end gap-2 px-5 py-4 border-t border-[#2e2e2e]">
          {error && <p className={ERROR_CLASS}>{error}</p>}
          <PrimaryButton onClick={handleSubmit}>
            {loading ? "Salvando..." : "Salvar"}
          </PrimaryButton>
        </div>

      </div>
    </div>
  );
}
