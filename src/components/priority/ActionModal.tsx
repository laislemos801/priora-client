import { useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import CustomDropdown from "@/components/ui/CustomDropdown";
import type { ActionStatus, ImpactLevel, InvestigativeAction } from "./types";
import { IMPACT_OPTIONS, STATUS_OPTIONS } from "./types";

const LABEL = "text-[11px] font-medium text-[#888] uppercase tracking-widest block mb-1.5";
const INPUT = "w-full bg-[#282828] border border-[#434343] rounded-md px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6] hover:border-[#606060] focus:border-[#606060] transition-colors";
const ERROR_CLASS = "text-[11px] text-red-400 mt-1";

const STATUS_DROPDOWN_OPTIONS = STATUS_OPTIONS.map((v) => ({ value: v, label: v }));
const IMPACT_DROPDOWN_OPTIONS = IMPACT_OPTIONS.map((v) => ({ value: v, label: v }));

type Props = {
  onClose: () => void;
  onSave: (action: Omit<InvestigativeAction, "id"> & { id?: string }) => void;
  action?: InvestigativeAction;
};

export default function ActionModal({ onClose, onSave, action }: Props) {
  const isEdit = !!action;

  const [form, setForm] = useState({
    titulo: action?.titulo ?? "",
    status: action?.status ?? STATUS_OPTIONS[0],
    impacto: action?.impacto ?? IMPACT_OPTIONS[0],
    metricaValor: action?.metricaValor != null ? String(action.metricaValor) : "",
    esforco: action?.esforco != null ? String(action.esforco) : "50",
    recompensa: action?.recompensa != null ? String(action.recompensa) : "50",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleDropdown = (name: string, value: string) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = () => {
    setError(null);

    if (!form.titulo.trim()) return setError("Título é obrigatório.");

    const metricaNum = parseFloat(form.metricaValor);
    if (form.metricaValor === "" || isNaN(metricaNum) || metricaNum < 0 || metricaNum > 100) {
      return setError("Ganho estimado deve ser um percentual entre 0 e 100.");
    }

    const esforcoNum = Number(form.esforco);
    const recompensaNum = Number(form.recompensa);
    if (isNaN(esforcoNum) || esforcoNum < 0 || esforcoNum > 100) {
      return setError("Esforço deve ser entre 0 e 100.");
    }
    if (isNaN(recompensaNum) || recompensaNum < 0 || recompensaNum > 100) {
      return setError("Recompensa deve ser entre 0 e 100.");
    }

    onSave({
      id: action?.id,
      titulo: form.titulo.trim(),
      status: form.status as ActionStatus,
      impacto: form.impacto as ImpactLevel,
      metricaLabel: action?.metricaLabel ?? "Ganho de informações estimados",
      metricaValor: metricaNum,
      esforco: esforcoNum,
      recompensa: recompensaNum,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3">
      <div className="bg-[#282828] w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[10px] border border-[#2e2e2e]">

        {/* HEADER */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#2e2e2e]">
          <h2 className="text-[15px] font-medium text-[#e8e8e8]">
            {isEdit ? "Editar Ação" : "Nova Ação Investigativa"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#ccc] transition-colors text-base hover:bg-[#ccc]/10 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={LABEL}>Título da ação</label>
            <input
              name="titulo"
              value={form.titulo}
              placeholder="ex: Solicitar quebra de sigilo bancário"
              onChange={handleInput}
              className={INPUT}
            />
          </div>

          <div>
            <label className={LABEL}>Status</label>
            <CustomDropdown name="status" placeholder="Status" options={STATUS_DROPDOWN_OPTIONS} value={form.status} onChange={handleDropdown} />
          </div>

          <div>
            <label className={LABEL}>Impacto</label>
            <CustomDropdown name="impacto" placeholder="Impacto" options={IMPACT_DROPDOWN_OPTIONS} value={form.impacto} onChange={handleDropdown} />
          </div>

          <div>
            <label className={LABEL}>Ganho estimado (%)</label>
            <input
              name="metricaValor"
              type="number"
              step="0.1" min="0" max="100"
              placeholder="ex: 45"
              value={form.metricaValor}
              onChange={handleInput}
              className={INPUT}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Esforço (0-100)</label>
              <input
                name="esforco"
                type="number"
                step="1" min="0" max="100"
                value={form.esforco}
                onChange={handleInput}
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Recompensa (0-100)</label>
              <input
                name="recompensa"
                type="number"
                step="1" min="0" max="100"
                value={form.recompensa}
                onChange={handleInput}
                className={INPUT}
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col items-end gap-2 px-5 py-4 border-t border-[#2e2e2e]">
          {error && <p className={ERROR_CLASS}>{error}</p>}
          <PrimaryButton onClick={handleSubmit}>
            {isEdit ? "Salvar alterações" : "Salvar"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
