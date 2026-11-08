import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AxisInfo from "@/components/profiling/AxisInfo";
import { PROFILE_AXES } from "@/components/profiling/types";
import type { ProfileAxisKey } from "@/components/profiling/types";
import type { Suspect } from "./types";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";

type Props = {
  casoId: string;
  mode?: "create" | "edit";
  suspect?: Suspect | null;
  onClose: () => void;
  onSuccess: (mode: "create" | "edit") => void;
};

export default function SuspectModal({
  casoId,
  mode = "create",
  suspect,
  onClose,
  onSuccess,
}: Props) {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const [historicoCriminal, setHistoricoCriminal] = useState(50);
  const [caracteristicasCriminais, setCaracteristicasCriminais] = useState(50);
  const [significanciaTempoLugar, setSignificanciaTempoLugar] = useState(50);
  const [coerenciaInterpessoal, setCoerenciaInterpessoal] = useState(50);
  const [conscienciaForense, setConscienciaForense] = useState(50);

  const [crimeSimilarAntes, setCrimeSimilarAntes] = useState("Não sei");
  const [histDescumprimento, setHistDescumprimento] = useState("Não sei");

  useEffect(() => {
    if (mode !== "edit" || !suspect) return;

    setNome(suspect.nome || "");
    setIdade(suspect.idade ? String(suspect.idade) : "");
    setFotoFile(null);

    setHistoricoCriminal(suspect.historicoCriminal ?? 50);
    setCaracteristicasCriminais(suspect.caracteristicasCriminais ?? 50);
    setSignificanciaTempoLugar(suspect.significanciaTempoLugar ?? 50);
    setCoerenciaInterpessoal(suspect.coerenciaInterpessoal ?? 50);
    setConscienciaForense(suspect.conscienciaForense ?? 50);

    setCrimeSimilarAntes(suspect.crimeSimilarAntes || "Não sei");
    setHistDescumprimento(suspect.histDescumprimento || "Não sei");
  }, [mode, suspect]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFotoFile(file);
  }

  // A foto vai para o backend, que a guarda (Supabase ou disco local) e
  // devolve a URL pública. O navegador não fala direto com o Supabase.
  async function uploadSuspectPhoto(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiFetch(`/suspects/case/${casoId}/photo`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        typeof data.detail === "string" ? data.detail : "Não foi possível enviar a foto.",
      );
    }

    return data.url as string;
  }

  async function handleSubmit() {
    if (!nome.trim()) {
      toast.error("Informe o nome do suspeito.");
      return;
    }

    let uploadedPhotoUrl: string | null = null;

    if (fotoFile) {
      try {
        uploadedPhotoUrl = await uploadSuspectPhoto(fotoFile);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Não foi possível enviar a foto.");
        return;
      }
    }

    const url =
      mode === "edit" && suspect
        ? `/suspects/${suspect.id}`
        : `/suspects/`;

    const response = await apiFetch(url, {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        casoId,
        nome: nome.trim(),
        idade: idade ? Number(idade) : null,
        fotoUrl:
          uploadedPhotoUrl ??
          (mode === "edit" ? suspect?.fotoUrl ?? null : null),
        historicoCriminal,
        caracteristicasCriminais,
        significanciaTempoLugar,
        coerenciaInterpessoal,
        conscienciaForense,
        crimeSimilarAntes,
        histDescumprimento,
      }),
    });

    if (!response.ok) {
      toast.error(
        mode === "edit"
          ? "Erro ao editar suspeito."
          : "Erro ao cadastrar suspeito."
      );
      return;
    }

    onSuccess(mode);
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#4a4a4a] bg-[#242424] p-4 shadow-xl scrollbar-thin scrollbar-thumb-[#139C73] scrollbar-track-transparent sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white/80">
            {mode === "edit" ? "Editar Suspeito" : "Novo Suspeito"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/65 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-5 border-t border-[#3a3a3a]" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_120px_170px]">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="mb-1 block text-xs text-white/65">
              Nome completo do suspeito
            </label>

            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
              className="w-full rounded-lg border border-[#434343] bg-[#282828] px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/65">Idade</label>

            <input
              value={idade}
              onChange={(e) => setIdade(e.target.value.replace(/\D/g, ""))}
              placeholder="Idade"
              className="w-full rounded-lg border border-[#434343] bg-[#282828] px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-white/65">
              Foto do suspeito
            </label>

            {!fotoFile ? (
              <label className="mt-1 inline-flex cursor-pointer items-center justify-center rounded-full bg-[#139C73] px-10 py-2 text-xs font-semibold text-white hover:bg-[#139C73]/80">
                {mode === "edit" && suspect?.fotoUrl ? "Trocar Foto" : "Adicionar Foto"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-xs text-white/80">
                <span className="max-w-[120px] truncate">{fotoFile.name}</span>

                <button
                  type="button"
                  onClick={() => setFotoFile(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-[#434343] p-4">
            <div className="mb-4 flex items-center justify-between gap-2">
              <p className="text-sm text-white/70">Perfil</p>
              <Link
                to={`/case/${casoId}/profiling`}
                onClick={onClose}
                className="text-xs text-[#139C73] hover:underline"
              >
                Como funciona o perfilamento
              </Link>
            </div>

            <Slider
              label="Coerência interpessoal"
              axisKey="coerenciaInterpessoal"
              value={coerenciaInterpessoal}
              setValue={setCoerenciaInterpessoal}
            />

            <Slider
              label="Significância do tempo e lugar"
              axisKey="significanciaTempoLugar"
              value={significanciaTempoLugar}
              setValue={setSignificanciaTempoLugar}
            />

            <Slider
              label="Características criminais"
              axisKey="caracteristicasCriminais"
              value={caracteristicasCriminais}
              setValue={setCaracteristicasCriminais}
            />

            <Slider
              label="Histórico criminal"
              axisKey="historicoCriminal"
              value={historicoCriminal}
              setValue={setHistoricoCriminal}
            />

            <Slider
              label="Consciência forense"
              axisKey="conscienciaForense"
              value={conscienciaForense}
              setValue={setConscienciaForense}
            />
          </div>

          <div className="rounded-lg border border-[#434343] p-4">
            <p className="text-sm text-white/70">Antecedentes</p>
            <p className="mb-4 mt-1 text-xs text-white/45">
              Informação de apoio ao investigador: aparece em “Dados do suspeito” no
              ranking, mas não entra no cálculo de probabilidade.
            </p>

            <RadioGroup
              label="O suspeito já cometeu algum crime semelhante a este antes?"
              value={crimeSimilarAntes}
              onChange={setCrimeSimilarAntes}
            />

            <RadioGroup
              label="O suspeito já descumpriu alguma medida judicial ou restritiva?"
              value={histDescumprimento}
              onChange={setHistDescumprimento}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <PrimaryButton onClick={handleSubmit}>
            {mode === "edit" ? "Salvar alterações" : "Salvar"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  axisKey,
  value,
  setValue,
}: {
  label: string;
  axisKey: ProfileAxisKey;
  value: number;
  setValue: (value: number) => void;
}) {
  const axis = PROFILE_AXES.find((a) => a.key === axisKey);

  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between text-xs text-white/65">
        <span className="flex items-center gap-1.5">
          {label}
          {axis && <AxisInfo axis={axis} size={14} />}
        </span>
        <span>{value}</span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-[#139C73]"
      />
    </div>
  );
}

function RadioGroup({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-5 text-xs text-white/70">
      <p className="mb-3">{label}</p>

      <div className="flex flex-wrap gap-4">
        {["Sim", "Não sei", "Não"].map((option) => (
          <label key={option} className="flex items-center gap-2">
            <input
              type="radio"
              checked={value === option}
              onChange={() => onChange(option)}
              className="accent-[#139C73]"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}