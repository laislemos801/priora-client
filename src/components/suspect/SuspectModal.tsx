import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { supabase } from "@/lib/supabase";
import type { Suspect } from "./types";
import toast from "react-hot-toast";

const API_URL = "http://127.0.0.1:8000";

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

  const [comportamento, setComportamento] = useState(50);
  const [agressividade, setAgressividade] = useState(50);
  const [proximidade, setProximidade] = useState(50);
  const [conexoesSociais, setConexoesSociais] = useState(50);
  const [nivelConfissao, setNivelConfissao] = useState(50);

  const [crimeSimilarAntes, setCrimeSimilarAntes] = useState("Não sei");
  const [histDescumprimento, setHistDescumprimento] = useState("Não sei");

  useEffect(() => {
    if (mode !== "edit" || !suspect) return;

    setNome(suspect.nome || "");
    setIdade(suspect.idade ? String(suspect.idade) : "");
    setFotoFile(null);

    setComportamento(suspect.comportamento ?? 50);
    setAgressividade(suspect.agressividade ?? 50);
    setProximidade(suspect.proximidade ?? 50);
    setConexoesSociais(suspect.conexoesSociais ?? 50);
    setNivelConfissao(suspect.nivelConfissao ?? 50);

    setCrimeSimilarAntes(suspect.crimeSimilarAntes || "Não sei");
    setHistDescumprimento(suspect.histDescumprimento || "Não sei");
  }, [mode, suspect]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFotoFile(file);
  }

  async function uploadSuspectPhoto(file: File) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `suspects/${fileName}`;

    const { error } = await supabase.storage
      .from("suspect-photos")
      .upload(filePath, file);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    const { data } = supabase.storage
      .from("suspect-photos")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit() {
    if (!nome.trim()) {
      toast.error("Informe o nome do suspeito.");
      return;
    }

    let uploadedPhotoUrl: string | null = null;

    if (fotoFile) {
      uploadedPhotoUrl = await uploadSuspectPhoto(fotoFile);
    }

    const url =
      mode === "edit" && suspect
        ? `${API_URL}/suspects/${suspect.id}`
        : `${API_URL}/suspects/`;

    const response = await fetch(url, {
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
        comportamento,
        agressividade,
        proximidade,
        conexoesSociais,
        nivelConfissao,
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
            <p className="mb-4 text-sm text-white/70">Perfil</p>

            <Slider
              label="Comportamento"
              value={comportamento}
              setValue={setComportamento}
            />

            <Slider
              label="Agressividade"
              value={agressividade}
              setValue={setAgressividade}
            />

            <Slider
              label="Proximidade"
              value={proximidade}
              setValue={setProximidade}
            />

            <Slider
              label="Conexões Sociais"
              value={conexoesSociais}
              setValue={setConexoesSociais}
            />

            <Slider
              label="Nível de Confissão"
              value={nivelConfissao}
              setValue={setNivelConfissao}
            />
          </div>

          <div className="rounded-lg border border-[#434343] p-4">
            <p className="mb-4 text-sm text-white/70">Histórico criminal</p>

            <RadioGroup
              label="O suspeito possui passagem por algum crime prévio?"
              value={crimeSimilarAntes}
              onChange={setCrimeSimilarAntes}
            />

            <RadioGroup
              label="O suspeito já cometeu algum crime similar antes?"
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
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between text-xs text-white/65">
        <span>{label}</span>
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