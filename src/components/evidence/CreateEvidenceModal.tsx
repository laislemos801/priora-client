"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomDropdown from "../ui/CustomDropdown";
import DatePicker from "../ui/DatePicker";
import PrimaryButton from "../ui/PrimaryButton";
import { Trash2 } from "lucide-react";
import { IoMdArrowDropdown } from "react-icons/io";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "Coletada",          label: "Coletada"          },
  { value: "Enviada a perícia", label: "Enviada a perícia" },
  { value: "Em análise",        label: "Em análise"        },
  { value: "Custodiada",        label: "Custodiada"        },
  { value: "Descartada",        label: "Descartada"        },
];

const TIPO_OPTIONS = [
  { value: "Digital",     label: "Digital"     },
  { value: "DNA",         label: "DNA"         },
  { value: "Depoimento",  label: "Depoimento"  },
  { value: "Documental",  label: "Documental"  },
  { value: "Física",      label: "Física"      },
  { value: "Audiovisual", label: "Audiovisual" },
  { value: "Biológica",   label: "Biológica"   },
];

const LABEL     = "text-[11px] font-medium text-[#888] uppercase tracking-widest block mb-1.5";
const INPUT     = "w-full bg-[#282828] border border-[#434343] rounded-md px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6] hover:border-[#606060] focus:border-[#606060] transition-colors";
const ERROR_CLASS = "text-[11px] text-red-400 mt-1";

type Suspect = { id: string; nome: string };

export type EvidenceForEdit = {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  descricao?: string | null;
  dataColeta?: string | null;
  pesoCondicional?: number | null;
  pesoVinculo?: number | null;
  suspeitos?: Suspect[];
};

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
  evidence?: EvidenceForEdit;
};

export default function CreateEvidenceModal({ onClose, onSuccess, evidence }: Props) {
  const isEdit = !!evidence;
  const { id: casoId } = useParams<{ id: string }>();

  const [form, setForm] = useState({
    nome:        evidence?.nome               ?? "",
    tipo:        evidence?.tipo               ?? "",
    status:      evidence?.status             ?? "",
    descricao:   evidence?.descricao          ?? "",
    data:        evidence?.dataColeta         ?? "",
    peso:        evidence?.pesoCondicional != null ? String(evidence.pesoCondicional) : "",
    pesoVinculo: evidence?.pesoVinculo     != null ? String(evidence.pesoVinculo)     : "",
  });

  const [suspects, setSuspects]               = useState<Suspect[]>([]);
  const [selectedSuspects, setSelected]       = useState<Suspect[]>(evidence?.suspeitos ?? []);
  const [openSuspeitos, setOpenSuspeitos]     = useState(false);
  const [suspectsLoading, setSuspectsLoading] = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState<string | null>(null);

  useEffect(() => {
    if (!casoId) return;
    setSuspectsLoading(true);
    fetch(`http://localhost:8000/suspects/case/${casoId}`)
      .then((r) => r.json())
      .then((data) => setSuspects(Array.isArray(data) ? data : []))
      .catch(() => setSuspects([]))
      .finally(() => setSuspectsLoading(false));
  }, [casoId]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDropdown = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const toggleSuspect = (s: Suspect) =>
    setSelected((prev) =>
      prev.find((x) => x.id === s.id) ? prev.filter((x) => x.id !== s.id) : [...prev, s]
    );

  const removeSuspect = (id: string) =>
    setSelected((prev) => prev.filter((s) => s.id !== id));

  const handleSubmit = async () => {
    setError(null);

    if (!form.nome.trim())             return setError("Nome é obrigatório.");
    if (!form.tipo)                    return setError("Tipo é obrigatório.");
    if (!form.status)                  return setError("Status é obrigatório.");
    if (!form.data)                    return setError("Data é obrigatória.");
    if (!form.peso)                    return setError("Peso é obrigatório.");
    if (!form.pesoVinculo)             return setError("Peso de vínculo é obrigatório.");
    if (selectedSuspects.length === 0) return setError("Selecione ao menos um suspeito.");

    const pesoNum        = parseFloat(form.peso);
    const pesoVinculoNum = parseFloat(form.pesoVinculo);

    if (isNaN(pesoNum) || pesoNum < 0 || pesoNum > 1)
      return setError("Peso deve ser entre 0 e 1.");
    if (isNaN(pesoVinculoNum) || pesoVinculoNum < 0 || pesoVinculoNum > 1)
      return setError("Peso de vínculo deve ser entre 0 e 1.");

    try {
      setLoading(true);

      if (isEdit) {
        const res = await fetch(`http://localhost:8000/evidences/${evidence!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome:        form.nome.trim(),
            tipo:        form.tipo,
            status:      form.status,
            descricao:   form.descricao.trim() || null,
            dataColeta:  form.data,
            peso:        pesoNum,
            pesoVinculo: pesoVinculoNum,
            suspeitoIds: selectedSuspects.map((s) => s.id),
          }),
        });
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        toast.success("Evidência atualizada com sucesso!");
      } else {
        const res = await fetch("http://localhost:8000/evidences/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            casoId,
            suspeitoIds: selectedSuspects.map((s) => s.id),
            nome:        form.nome.trim(),
            tipo:        form.tipo,
            status:      form.status,
            descricao:   form.descricao.trim() || null,
            dataColeta:  form.data,
            peso:        pesoNum,
            pesoVinculo: pesoVinculoNum,
          }),
        });
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        toast.success("Evidência cadastrada com sucesso!");
      }

      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao salvar evidência.";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3">
      <div className="bg-[#282828] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[10px] border border-[#2e2e2e]">

        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#2e2e2e]">
          <h2 className="text-[15px] font-medium text-[#e8e8e8]">
            {isEdit ? "Editar Evidência" : "Nova Evidência"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#ccc] transition-colors text-base hover:bg-[#ccc]/10 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className={LABEL}>Nome evidência</label>
            <input
              name="nome"
              value={form.nome}
              placeholder="Nome Evidência"
              onChange={handleInput}
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Tipo de evidência</label>
            <CustomDropdown name="tipo" placeholder="Tipo" options={TIPO_OPTIONS} value={form.tipo} onChange={handleDropdown} />
          </div>

          <div>
            <label className={LABEL}>Status</label>
            <CustomDropdown name="status" placeholder="Status" options={STATUS_OPTIONS} value={form.status} onChange={handleDropdown} />
          </div>

          <div className="md:col-span-3 grid md:grid-cols-[2fr_3fr] gap-4">
            <div className="flex flex-col gap-4">

              <div>
                <label className={LABEL}>Data de coleta</label>
                <DatePicker name="data" value={form.data} onChange={handleDropdown} />
              </div>

              <div>
                <label className={LABEL}>Peso (0 a 1)</label>
                <input
                  name="peso"
                  type="number"
                  step="0.01" min="0" max="1"
                  placeholder="ex: 0.5"
                  value={form.peso}        
                  onChange={handleInput}
                  className={INPUT}
                />
              </div>

              <div>
                <label className={LABEL}>Peso de vínculo (0 a 1)</label>
                <input
                  name="pesoVinculo"
                  type="number"
                  step="0.01" min="0" max="1"
                  placeholder="ex: 0.75"
                  value={form.pesoVinculo} 
                  onChange={handleInput}
                  className={INPUT}
                />
              </div>

              {/* Suspeitos */}
              <div>
                <label className={LABEL}>Suspeito(s)</label>
                <div className="bg-[#282828] border border-[#434343] rounded-md">
                  <button
                    type="button"
                    onClick={() => setOpenSuspeitos((p) => !p)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#A6A6A6]"
                  >
                    <span>
                      {selectedSuspects.length > 0
                        ? `${selectedSuspects.length} selecionado(s)`
                        : suspectsLoading ? "Carregando..." : "Selecionar suspeito(s)"}
                    </span>
                    <IoMdArrowDropdown
                      size={18}
                      className={`text-[#888] transition-transform duration-300 ${openSuspeitos ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openSuspeitos && (
                    <div className="border-t border-[#434343] p-2 space-y-1 max-h-40 overflow-y-auto">
                      {suspects.length === 0 ? (
                        <p className="text-xs text-gray-500 px-1">Nenhum suspeito cadastrado.</p>
                      ) : (
                        suspects.map((s) => {
                          const isSelected = !!selectedSuspects.find((x) => x.id === s.id);
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => toggleSuspect(s)}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors
                                ${isSelected ? "bg-[#139C73]/15 text-[#139C73]" : "text-[#ccc] hover:bg-[#333]"}`}
                            >
                              <span className={`w-3 h-3 rounded-sm border shrink-0 flex items-center justify-center text-[8px]
                                ${isSelected ? "bg-[#139C73] border-[#139C73]" : "border-[#555]"}`}>
                                {isSelected && "✓"}
                              </span>
                              {s.nome}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                {selectedSuspects.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedSuspects.map((s) => (
                      <span
                        key={s.id}
                        className="flex items-center gap-1 bg-[#139C73]/15 text-[#139C73] text-xs px-2 py-0.5 rounded-full"
                      >
                        {s.nome}
                        <button type="button" onClick={() => removeSuspect(s.id)}>
                          <Trash2 size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* COLUNA DIREITA */}
            <div>
              <label className={LABEL}>Descrição</label>
              <textarea
                name="descricao"
                value={form.descricao}   
                onChange={handleInput}
                placeholder="Descrição"
                className={`${INPUT} min-h-50 w-full resize-none`}
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col items-end gap-2 px-5 py-4 border-t border-[#2e2e2e]">
          {error && <p className={ERROR_CLASS}>{error}</p>}
          <PrimaryButton onClick={handleSubmit}>
            {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Salvar"}
          </PrimaryButton>
        </div>

      </div>
    </div>
  );
}