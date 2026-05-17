import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Search,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
  Minus,
  HelpCircle,
  Trash2,
} from "lucide-react";

import PrimaryButton from "@/components/ui/PrimaryButton";
import { supabase } from "@/lib/supabase";

const API_URL = "http://127.0.0.1:8000";

type Suspect = {
  id: string;
  nome: string;
  idade?: number;
  fotoUrl?: string | null;
  probabilidadeAtual?: number;
  posicaoRanking?: number | null;
  tendencia?: "Alta" | "Baixa" | "Estável";
  qtdEvidencias?: number;
};

export default function Ranking() {
  const { id } = useParams();

  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  async function fetchSuspects() {
    if (!id) return;

    const response = await fetch(`${API_URL}/suspects/case/${id}`);
    const data = await response.json();

    setSuspects(data);
  }

  useEffect(() => {
    fetchSuspects();
  }, [id]);

  const filtered = suspects.filter((s) =>
    s.nome.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="flex-1 p-4 md:p-6">
        <div className="overflow-hidden rounded-xl border border-[#575757] bg-[#242424]">
          {/* HEADER */}
          <header className="flex flex-col gap-4 border-b border-[#575757] px-4 py-4 md:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#139C73]">
                <BarIcon />
              </span>

              <h1 className="text-lg font-semibold text-white">
                Ranking de suspeitos
              </h1>
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
              <div className="flex h-10 w-full items-center gap-2 rounded-full border border-[#444] bg-[#242424] px-4 text-white/65 md:w-[260px]">
                <Search size={15} />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Procurar"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/45"
                />
              </div>

              <PrimaryButton onClick={() => setModalOpen(true)}>
                Adicionar Suspeito
              </PrimaryButton>
            </div>
          </header>

          {/* CONTENT */}
          <main className="p-4 md:p-6">
            {filtered.length === 0 ? (
              <EmptyState onAdd={() => setModalOpen(true)} />
            ) : (
              <RankingTable suspects={filtered} />
            )}
          </main>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <SuspectModal
          casoId={id!}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            fetchSuspects();
          }}
        />
      )}
    </div>
  );
}

function RankingTable({ suspects }: { suspects: Suspect[] }) {
  return (
    <div className="space-y-3">
      {/* DESKTOP HEADER */}
      <div className="hidden lg:grid lg:grid-cols-[60px_90px_1fr_190px_150px] items-center px-6 text-center text-sm font-medium text-white">
        <div />

        <p>Posição</p>

        <p className="text-left">Nome</p>

        <p>Probabilidade Atual</p>

        <p>Qtd. Evidências</p>
      </div>

      {/* LIST */}
      <div className="max-h-[670px] space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#139C73] scrollbar-track-transparent">
        {suspects.map((suspect, index) => (
          <div
            key={suspect.id}
            className={`rounded-lg text-white ${
              index === 0 ? "bg-[#139C73]/25" : "bg-[#2A2A2A]"
            }`}
          >
            {/* MOBILE / TABLET */}
            <div className="flex flex-col gap-4 p-4 lg:hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3A3A3A] text-sm font-semibold">
                    {suspect.fotoUrl ? (
                      <img
                        src={suspect.fotoUrl}
                        alt={suspect.nome}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      suspect.nome.slice(0, 2).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold">
                      {suspect.nome}
                    </p>

                    <p className="text-xs text-white/55">
                      Posição #{suspect.posicaoRanking ?? index + 1}
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  className="h-5 w-5 shrink-0 rounded border border-[#555] bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-black/10 p-3">
                  <p className="text-xs text-white/50">Probabilidade</p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-semibold">
                      {(suspect.probabilidadeAtual ?? 0).toFixed(1)}%
                    </span>

                    <TrendIcon
                      trend={suspect.tendencia ?? "Estável"}
                    />
                  </div>
                </div>

                <div className="rounded-md bg-black/10 p-3">
                  <p className="text-xs text-white/50">Evidências</p>

                  <p className="mt-1 font-semibold">
                    {suspect.qtdEvidencias ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden min-h-[96px] grid-cols-[60px_90px_1fr_190px_150px] items-center px-6 lg:grid">
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border border-[#555] bg-transparent"
                />
              </div>

              <p className="text-center text-xl">
                {suspect.posicaoRanking ?? index + 1}
              </p>

              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#3A3A3A] text-sm font-semibold">
                  {suspect.fotoUrl ? (
                    <img
                      src={suspect.fotoUrl}
                      alt={suspect.nome}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    suspect.nome.slice(0, 2).toUpperCase()
                  )}
                </div>

                <p className="truncate text-lg font-medium">
                  {suspect.nome}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-lg">
                <span>
                  {(suspect.probabilidadeAtual ?? 0).toFixed(1)}%
                </span>

                <TrendIcon
                  trend={suspect.tendencia ?? "Estável"}
                />

                <HelpCircle
                  size={16}
                  className="text-white/35"
                />
              </div>

              <p className="text-center text-lg">
                {suspect.qtdEvidencias ?? 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center text-center">
      <div className="mb-6 text-white/10">
        <Plus size={130} strokeWidth={1.5} />
      </div>

      <h2 className="text-2xl font-semibold text-white/45 md:text-3xl">
        Adicione um novo suspeito.
      </h2>

      <p className="mb-8 mt-3 text-sm text-white/35">
        E comece a priorizar suas investigações.
      </p>

      <PrimaryButton onClick={onAdd}>
        Adicionar Suspeito
      </PrimaryButton>
    </div>
  );
}

function SuspectModal({
  casoId,
  onClose,
  onSuccess,
}: {
  casoId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const [comportamento, setComportamento] = useState(50);
  const [agressividade, setAgressividade] = useState(50);
  const [proximidade, setProximidade] = useState(50);
  const [conexoesSociais, setConexoesSociais] = useState(50);
  const [nivelConfissao, setNivelConfissao] = useState(50);

  const [crimeSimilarAntes, setCrimeSimilarAntes] =
    useState("Não sei");

  const [histDescumprimento, setHistDescumprimento] =
    useState("Não sei");

  function handlePhotoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
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
      alert("Informe o nome do suspeito.");
      return;
    }

    let uploadedPhotoUrl: string | null = null;

    if (fotoFile) {
      uploadedPhotoUrl = await uploadSuspectPhoto(
        fotoFile
      );
    }

    const response = await fetch(`${API_URL}/suspects/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        casoId,
        nome: nome.trim(),
        idade: idade ? Number(idade) : null,
        fotoUrl: uploadedPhotoUrl,

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
      alert("Erro ao cadastrar suspeito.");
      return;
    }

    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 sm:p-4">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#4a4a4a] bg-[#242424] p-4 shadow-xl scrollbar-thin scrollbar-thumb-[#139C73] scrollbar-track-transparent sm:p-6">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white/80">
            Novo Suspeito
          </h2>

          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/65 hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-5 border-t border-[#3a3a3a]" />

        {/* TOP */}
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
            <label className="mb-1 block text-xs text-white/65">
              Idade
            </label>

            <input
              value={idade}
              onChange={(e) =>
                setIdade(
                  e.target.value.replace(/\D/g, "")
                )
              }
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
                Adicionar Foto

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-xs text-white/80">
                <span className="max-w-[120px] truncate">
                  {fotoFile.name}
                </span>

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

        {/* CONTENT */}
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {/* PERFIL */}
          <div className="rounded-lg border border-[#434343] p-4">
            <p className="mb-4 text-sm text-white/70">
              Perfil
            </p>

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

          {/* HISTÓRICO */}
          <div className="rounded-lg border border-[#434343] p-4">
            <p className="mb-4 text-sm text-white/70">
              Histórico criminal
            </p>

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

        {/* FOOTER */}
        <div className="mt-6 flex justify-end">
          <PrimaryButton onClick={handleSubmit}>
            Salvar
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
        onChange={(e) =>
          setValue(Number(e.target.value))
        }
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
          <label
            key={option}
            className="flex items-center gap-2"
          >
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

function TrendIcon({
  trend,
}: {
  trend: "Alta" | "Baixa" | "Estável";
}) {
  if (trend === "Alta") {
    return (
      <ArrowUp
        size={22}
        className="text-[#139C73]"
      />
    );
  }

  if (trend === "Baixa") {
    return (
      <ArrowDown
        size={22}
        className="text-[#FF6055]"
      />
    );
  }

  return (
    <Minus
      size={22}
      className="text-white/45"
    />
  );
}

function BarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}