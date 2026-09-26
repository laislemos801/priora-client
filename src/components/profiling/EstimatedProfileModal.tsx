import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

import PrimaryButton from "@/components/ui/PrimaryButton";
import { saveEstimatedProfile } from "@/services/profilingService";

import { PROFILE_AXES } from "./types";
import type { EstimatedProfile, ProfileAxisKey, ProfileValues } from "./types";

// Mesmo valor inicial dos sliders do SuspectModal.
const DEFAULT_VALUE = 50;

type Props = {
  casoId: string;
  initialValues: ProfileValues | null;
  onClose: () => void;
  onSuccess: (profile: EstimatedProfile) => void;
};

function buildInitial(values: ProfileValues | null): ProfileValues {
  return PROFILE_AXES.reduce((acc, axis) => {
    acc[axis.key] = Math.round(values?.[axis.key] ?? DEFAULT_VALUE);
    return acc;
  }, {} as ProfileValues);
}

export default function EstimatedProfileModal({
  casoId,
  initialValues,
  onClose,
  onSuccess,
}: Props) {
  const [values, setValues] = useState<ProfileValues>(() =>
    buildInitial(initialValues)
  );
  const [saving, setSaving] = useState(false);

  function setValue(key: ProfileAxisKey, value: number) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (saving) return;
    setSaving(true);

    try {
      const saved = await saveEstimatedProfile(casoId, values);
      onSuccess(saved);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar o perfil estimado.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="estimated-profile-title"
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-xl border border-[#4a4a4a] bg-[#242424] p-4 shadow-xl sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="estimated-profile-title"
            className="text-lg font-semibold text-white/80"
          >
            Perfil estimado do criminoso
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mb-5 text-xs text-white/60">
          Atribua de 0 a 100 para cada variável. O perfil estimado é comparado
          com o perfil de cada suspeito no gráfico.
        </p>

        <div className="rounded-lg border border-[#434343] p-4">
          {PROFILE_AXES.map((axis) => (
            <div key={axis.key} className="mb-4 last:mb-0">
              <div className="mb-1 flex justify-between text-xs text-white/65">
                <label htmlFor={`estimated-${axis.key}`}>{axis.label}</label>
                <span>{values[axis.key]}</span>
              </div>

              <input
                id={`estimated-${axis.key}`}
                type="range"
                min={0}
                max={100}
                value={values[axis.key]}
                onChange={(e) => setValue(axis.key, Number(e.target.value))}
                className="w-full accent-[#6C7BF2]"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <PrimaryButton onClick={handleSubmit}>
            {saving ? "Salvando..." : "Salvar"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
