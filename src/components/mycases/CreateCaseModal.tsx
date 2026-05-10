"use client";
import { useEffect, useState } from "react";
import CustomDropdown from "../ui/CustomDropdown";
import DatePicker from "../ui/DatePicker";
import PrimaryButton from "../ui/PrimaryButton";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { RiAlertFill } from "react-icons/ri";

// TODO: substituir pelo userId real vindo do contexto de autenticação
const MOCK_USER_ID = "da7be1ad-6a1f-4c56-a91c-0d24e355391b";

const STATUS_OPTIONS = [
  { value: "ativo",      label: "Ativo",      color: "#4caf7d" },
  { value: "pendente",   label: "Pendente",   color: "#e0a030" },
  { value: "finalizado", label: "Finalizado", color: "#777"    },
];

const PRIORIDADE_OPTIONS = [
  { value: "baixa",   label: "Baixa",   icon: <ArrowDown size={14} color="#5b9cf6" /> },
  { value: "media",   label: "Média",   icon: <Minus     size={14} color="#e0a030" /> },
  { value: "alta",    label: "Alta",    icon: <ArrowUp   size={14} color="#e05555" /> },
  { value: "critica", label: "Crítica", icon: <RiAlertFill size={14} color="#ff3b3b" /> },
];

const ESTADO_OPTIONS = [
  { value: "AC", label: "AC", meta: "Acre" },
  { value: "AL", label: "AL", meta: "Alagoas" },
  { value: "AP", label: "AP", meta: "Amapá" },
  { value: "AM", label: "AM", meta: "Amazonas" },
  { value: "BA", label: "BA", meta: "Bahia" },
  { value: "CE", label: "CE", meta: "Ceará" },
  { value: "DF", label: "DF", meta: "Distrito Federal" },
  { value: "ES", label: "ES", meta: "Espírito Santo" },
  { value: "GO", label: "GO", meta: "Goiás" },
  { value: "MA", label: "MA", meta: "Maranhão" },
  { value: "MT", label: "MT", meta: "Mato Grosso" },
  { value: "MS", label: "MS", meta: "Mato Grosso do Sul" },
  { value: "MG", label: "MG", meta: "Minas Gerais" },
  { value: "PA", label: "PA", meta: "Pará" },
  { value: "PB", label: "PB", meta: "Paraíba" },
  { value: "PR", label: "PR", meta: "Paraná" },
  { value: "PE", label: "PE", meta: "Pernambuco" },
  { value: "PI", label: "PI", meta: "Piauí" },
  { value: "RJ", label: "RJ", meta: "Rio de Janeiro" },
  { value: "RN", label: "RN", meta: "Rio Grande do Norte" },
  { value: "RS", label: "RS", meta: "Rio Grande do Sul" },
  { value: "RO", label: "RO", meta: "Rondônia" },
  { value: "RR", label: "RR", meta: "Roraima" },
  { value: "SC", label: "SC", meta: "Santa Catarina" },
  { value: "SP", label: "SP", meta: "São Paulo" },
  { value: "SE", label: "SE", meta: "Sergipe" },
  { value: "TO", label: "TO", meta: "Tocantins" },
];

const STATUS_MAP: Record<string, string> = {
  ativo:      "Ativo",
  pendente:   "Arquivado",
  finalizado: "Concluído",
};

const PRIORIDADE_MAP: Record<string, string> = {
  baixa:   "Baixa",
  media:   "Média",
  alta:    "Alta",
  critica: "Crítica",
};

type FormState = {
  cep: string;
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
  "w-full bg-[#282828] border border-[#434343] rounded-md px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6] hover:border-[#606060] focus:border-[#606060] transition-colors";

const ERROR_CLASS = "text-[11px] text-red-400 mt-1";

export default function CreateCaseModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<FormState>({
    cep: "",
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

  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError]     = useState<string | null>(null);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDropdown = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleCep = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
    setForm((prev) => ({ ...prev, cep: raw }));
    setCepError(null);

    if (raw.length !== 8) return;

    try {
      setCepLoading(true);
      const res  = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await res.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        endereco: data.logradouro ?? prev.endereco,
        bairro:   data.bairro    ?? prev.bairro,
        cidade:   data.localidade ?? prev.cidade,
        estado:   data.uf        ?? prev.estado,
      }));
    } catch {
      setCepError("Erro ao buscar CEP.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!form.nome.trim())      return setError("Nome do caso é obrigatório.");
    if (!form.status)           return setError("Status é obrigatório.");
    if (!form.prioridade)       return setError("Prioridade é obrigatória.");
    if (!form.descricao.trim()) return setError("Descrição é obrigatória.");
    if (!form.data)             return setError("Data de ocorrência é obrigatória.");

    const payload = {
      userId:             MOCK_USER_ID,
      nome:               form.nome.trim(),
      descricao:          form.descricao.trim(),
      status:             STATUS_MAP[form.status],
      prioridade:         PRIORIDADE_MAP[form.prioridade],
      enderecoLogradouro: form.endereco.trim() || null,
      enderecoNumero:     form.numero.trim()   || null,
      enderecoBairro:     form.bairro.trim()   || null,
      enderecoCidade:     form.cidade.trim()   || null,
      enderecoEstado:     form.estado          || null,
      dataOcorrencia:     form.data,
      enderecoCep: form.cep || null
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/cases/", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
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
          <button
            onClick={onClose}
            className="text-[#ccc] transition-colors text-base hover:bg-[#ccc]/10 rounded-full w-8 h-8 flex items-center justify-center"
          >
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

          {/* CEP */}
          <div>
            <label className={LABEL}>CEP</label>
            <div className="relative">
              <input
                name="cep"
                value={form.cep}
                onChange={handleCep}
                placeholder="00000000"
                maxLength={8}
                className={INPUT}
              />
              {cepLoading && (
                <span className="absolute right-3 top-2.5 text-[10px] text-gray-400 animate-pulse">
                  buscando...
                </span>
              )}
            </div>
            {cepError && <p className={ERROR_CLASS}>{cepError}</p>}
          </div>

          {/* Endereço preenchido pelo CEP, editável manualmente */}
          <div className="md:col-span-1">
            <label className={LABEL}>Endereço</label>
            <input
              name="endereco"
              value={form.endereco}
              onChange={handleInput}
              placeholder="Rua, Avenida..."
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Número</label>
            <input name="numero" value={form.numero} onChange={handleInput} className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Bairro</label>
            <input
              name="bairro"
              value={form.bairro}
              onChange={handleInput}
              placeholder="Bairro"
              className={INPUT}
            />
          </div>

          {/* Estado — dropdown com todos os 27 estados */}
          <div>
            <label className={LABEL}>Estado</label>
            <CustomDropdown
              name="estado"
              placeholder="Estado"
              options={ESTADO_OPTIONS}
              value={form.estado}
              onChange={handleDropdown}
              menuClassName="max-h-36"  
            />
          </div>

          {/* Cidade — input de texto livre preenchido pelo CEP */}
          <div>
            <label className={LABEL}>Cidade</label>
            <input
              name="cidade"
              value={form.cidade}
              onChange={handleInput}
              placeholder="Cidade"
              className={INPUT}
            />
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
