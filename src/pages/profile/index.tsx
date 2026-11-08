import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCamera,
  FiCheck,
  FiCopy,
  FiHash,
  FiKey,
  FiLock,
  FiLogOut,
  FiMail,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import toast from "react-hot-toast";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import RecentCases from "@/components/profile/RecentCases";
import { PAGE_CARD_FILL } from "@/components/ui/EmptyState";
import { AuthField, FIELD_LABEL, PasswordField } from "@/components/auth/AuthField";
import SubmitButton, { Spinner } from "@/components/auth/SubmitButton";
import FormAlert from "@/components/auth/FormAlert";
import PasswordChecklist from "@/components/auth/PasswordChecklist";
import {
  isValid,
  validateConfirm,
  validateEmail,
  validateNewPassword,
  validateRequired,
} from "@/components/auth/validation";
import { apiFetch } from "@/lib/api";
import { apiErrorMessage } from "@/routes/user";
import { syncStoredUser } from "@/lib/navigation";

/** Só os campos que a sidebar mostra (nome, e-mail e foto). */
function pickSidebarFields(data: Partial<UserType>) {
  const out: Record<string, unknown> = {};
  for (const key of ["primeiroNome", "sobrenome", "email", "fotoUrl", "cargo"] as const) {
    if (data?.[key] !== undefined) out[key] = data[key];
  }
  return out;
}

interface UserType {
  email: string;
  fotoUrl: string;
  id: string;
  primeiroNome: string;
  sobrenome: string;
  casosAtivos: number;
  casosConcluidos: number;
  totalCasos: number;
  cargo?: string | null;
}

const CARD = "rounded-xl border border-[#3d3d3d] bg-[#2B2B2B]";

/** Mesmo limite do back-end (CARGO_MAX em user_schema.py). */
const CARGO_MAX = 60;

/** Cartão de informação da coluna lateral das abas. */
function InfoCard({
  icon,
  title,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-lg border border-[#3d3d3d] bg-[#242424] p-4 ${className}`}>
      <h3 className="flex items-center gap-2 text-sm font-medium text-white">
        <span className="text-emerald-400">{icon}</span>
        {title}
      </h3>
      <div className="mt-1.5 text-xs leading-relaxed text-white/55">{children}</div>
    </section>
  );
}

type TabId = "dados" | "seguranca";
const TABS: { id: TabId; label: string }[] = [
  { id: "dados", label: "Dados pessoais" },
  { id: "seguranca", label: "Segurança" },
];

/** Abas acessíveis (clique ou setas ← →). */
function Tabs({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  function handleKey(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.id === active);
    const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
    onChange(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <div role="tablist" aria-label="Configurações da conta" onKeyDown={handleKey} className="flex gap-1 border-b border-[#3d3d3d] px-3 sm:px-5">
      {TABS.map(({ id, label }) => {
        const selected = id === active;
        return (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(id)}
            className={`relative -mb-px px-3 py-3.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[#18C18A] ${
              selected ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            {label}
            <span
              className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full transition-colors ${
                selected ? "bg-[#18C18A]" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

async function readJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserType>();
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [loadError, setLoadError] = useState<string>("");
  const [tab, setTab] = useState<TabId>("dados");

  // ── Dados pessoais ──
  const [primeiroNome, setPrimeiroNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const cargoInputRef = useRef<HTMLInputElement>(null);
  const [profileErrors, setProfileErrors] = useState<{ primeiroNome?: string; sobrenome?: string; email?: string }>({});
  const [profileServerError, setProfileServerError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // ── Senha ──
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<{ senhaAntiga?: string; novaSenha?: string; confirmSenha?: string }>({});
  const [passwordServerError, setPasswordServerError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  // ── Foto ──
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [savingPhoto, setSavingPhoto] = useState(false);

  const [copied, setCopied] = useState(false);

  const fillProfileForm = (data: UserType) => {
    setPrimeiroNome(data.primeiroNome ?? "");
    setSobrenome(data.sobrenome ?? "");
    setEmail(data.email ?? "");
    setCargo(data.cargo ?? "");
  };

  const loadProfile = useCallback(async () => {
    setLoadState("loading");
    try {
      const response = await apiFetch("/users/me");

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const data = await readJson(response);
      if (!response.ok) throw new Error(apiErrorMessage(data, "Não foi possível carregar seu perfil."));

      setUser(data);
      fillProfileForm(data);
      syncStoredUser(pickSidebarFields(data));
      setLoadState("ready");
    } catch (error) {
      setLoadError(
        error instanceof TypeError
          ? "Não foi possível conectar ao servidor. Verifique sua conexão."
          : error instanceof Error
            ? error.message
            : "Não foi possível carregar seu perfil.",
      );
      setLoadState("error");
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Fecha o modal de recorte com Esc
  useEffect(() => {
    if (!selectedImage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !savingPhoto) setSelectedImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedImage, savingPhoto]);

  const profileDirty =
    !!user &&
    (primeiroNome.trim() !== (user.primeiroNome ?? "") ||
      sobrenome.trim() !== (user.sobrenome ?? "") ||
      email.trim() !== (user.email ?? "") ||
      cargo.trim() !== (user.cargo ?? ""));

  // ───────────────────────── Foto ─────────────────────────

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = ""; // permite escolher a mesma imagem de novo
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione um arquivo de imagem (JPG, PNG ou WEBP).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 4 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        toast.error("Não foi possível carregar a imagem.");
        return;
      }
      setSelectedImage(reader.result);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.onerror = () => toast.error("Não foi possível carregar a imagem.");
    reader.readAsDataURL(file);
  }

  async function getCroppedImage(imageSrc: string, cropArea: Area): Promise<Blob> {
    const image = new Image();
    image.src = imageSrc;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível processar a imagem.");

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;
    ctx.drawImage(image, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, cropArea.width, cropArea.height);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Não foi possível gerar a imagem."))),
        "image/jpeg",
        0.9,
      );
    });
  }

  async function handleConfirmCrop() {
    if (!selectedImage || !croppedAreaPixels) return;

    setSavingPhoto(true);
    try {
      const blob = await getCroppedImage(selectedImage, croppedAreaPixels);
      const formData = new FormData();
      formData.append("file", blob, "foto.jpg");

      const response = await apiFetch("/users/me/photo", { method: "POST", body: formData });
      const data = await readJson(response);
      if (!response.ok) throw new Error(apiErrorMessage(data, "Não foi possível atualizar a foto."));

      setUser((prev) => (prev ? { ...prev, ...data } : data));
      syncStoredUser(pickSidebarFields(data));
      setSelectedImage(null);
      toast.success("Foto de perfil atualizada!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar a foto.");
    } finally {
      setSavingPhoto(false);
    }
  }

  // ───────────────────────── Dados pessoais ─────────────────────────

  async function handleUpdateProfile(e: FormEvent) {
    e.preventDefault();
    setProfileServerError(null);

    const next = {
      primeiroNome: validateRequired(primeiroNome, "Informe seu nome."),
      sobrenome: validateRequired(sobrenome, "Informe seu sobrenome."),
      email: validateEmail(email),
    };
    setProfileErrors(next);
    if (!isValid(next)) return;

    setSavingProfile(true);
    try {
      const response = await apiFetch("/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primeiroNome: primeiroNome.trim(),
          sobrenome: sobrenome.trim(),
          email: email.trim(),
          // "" remove o cargo no back-end
          cargo: cargo.trim(),
        }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(apiErrorMessage(data, "Não foi possível salvar as alterações."));

      const updated = { ...user, ...data } as UserType;
      setUser(updated);
      fillProfileForm(updated);
      syncStoredUser(pickSidebarFields(updated));
      toast.success("Dados atualizados!");
    } catch (error) {
      setProfileServerError(
        error instanceof TypeError
          ? "Não foi possível conectar ao servidor. Tente novamente."
          : error instanceof Error
            ? error.message
            : "Não foi possível salvar as alterações.",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  function handleDiscardProfile() {
    if (user) fillProfileForm(user);
    setProfileErrors({});
    setProfileServerError(null);
  }

  // ───────────────────────── Senha ─────────────────────────

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPasswordServerError(null);

    const next = {
      senhaAntiga: validateRequired(senhaAntiga, "Informe sua senha atual."),
      novaSenha: validateNewPassword(novaSenha),
      confirmSenha: validateConfirm(novaSenha, confirmSenha),
    };
    if (!next.novaSenha && senhaAntiga && novaSenha === senhaAntiga) {
      next.novaSenha = "A nova senha precisa ser diferente da atual.";
    }
    setPasswordErrors(next);
    if (!isValid(next)) return;

    setSavingPassword(true);
    try {
      const response = await apiFetch("/users/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAntiga, novaSenha }),
      });
      const data = await readJson(response);

      if (!response.ok) {
        const message = apiErrorMessage(data, "Não foi possível alterar a senha.");
        if (/senha antiga/i.test(message)) {
          setPasswordErrors({ senhaAntiga: "Senha atual incorreta." });
        } else {
          setPasswordServerError(message);
        }
        return;
      }

      setSenhaAntiga("");
      setNovaSenha("");
      setConfirmSenha("");
      setPasswordErrors({});
      toast.success("Senha alterada!");
    } catch {
      setPasswordServerError("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setSavingPassword(false);
    }
  }

  // ───────────────────────── Outros ─────────────────────────

  async function handleCopyId() {
    if (!user?.id) return;
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Você saiu da sua conta.");
    navigate("/login");
  }

  if (loadState === "loading") return <ProfileSkeleton />;

  const header = (
    // O "voltar" fica na TopBar do layout; aqui só o título, como nas outras páginas
    <header className="flex items-center gap-3 border-b border-[#575757] px-4 py-4 md:px-6">
      <FiUser size={18} className="text-emerald-400" />
      <h1 className="text-lg font-semibold text-slate-100">Minha Conta</h1>
    </header>
  );

  // ── Estado de erro ao carregar ──
  if (loadState === "error" || !user) {
    return (
      <div className="min-h-full">
        <div className="flex flex-col px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
          <section className={`overflow-hidden rounded-xl border border-[#575757] bg-[#242424] ${PAGE_CARD_FILL}`}>
            {header}
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-red-400">
                <FiUser size={20} />
              </span>
              <div>
                <p className="text-lg font-medium">Não foi possível carregar seu perfil</p>
                <p className="mt-1 text-sm text-white/55">{loadError}</p>
              </div>
              <SubmitButton type="button" fullWidth={false} onClick={loadProfile}>
                <FiRefreshCw size={15} />
                Tentar novamente
              </SubmitButton>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const fullName = `${user.primeiroNome ?? ""} ${user.sobrenome ?? ""}`.trim();
  const initials = `${user.primeiroNome?.charAt(0) ?? ""}${user.sobrenome?.charAt(0) ?? ""}`.toUpperCase();

  const stats = [
    { label: "Casos ativos", value: user.casosAtivos, color: "text-[#29B893]" },
    { label: "Finalizados", value: user.casosConcluidos, color: "text-[#E8CF75]" },
    { label: "Total de casos", value: user.totalCasos, color: "text-[#E8B768]" },
  ];

  return (
    <div className="min-h-full">
      <div className="flex flex-col px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        {/* Ocupa a altura da tela como as outras páginas; o cartão "Seus casos" preenche o espaço */}
        <section className={`overflow-hidden rounded-xl border border-[#575757] bg-[#242424] ${PAGE_CARD_FILL}`}>
          {header}

          {/* Perfil fixo à esquerda, abas + casos no resto; as duas colunas com a mesma altura */}
          <div className="grid w-full flex-1 grid-cols-[minmax(0,1fr)] gap-5 p-4 md:p-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
            {/* ══════════ Cartão do perfil ══════════ */}
            <aside className={`${CARD} flex flex-col`}>
              <div className="flex flex-1 flex-col items-center justify-center px-6 pb-6 pt-8 text-center">
                {/* Avatar: clicar troca a foto */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={savingPhoto}
                  aria-label="Alterar foto de perfil"
                  className="group relative size-28 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#18C18A]"
                >
                  {user.fotoUrl ? (
                    <img
                      src={user.fotoUrl}
                      alt=""
                      className="size-full rounded-full object-cover ring-2 ring-[#139C73]/50 ring-offset-4 ring-offset-[#2B2B2B]"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center rounded-full bg-linear-to-br from-[#139C73] to-[#136D52] text-3xl font-semibold ring-2 ring-[#139C73]/50 ring-offset-4 ring-offset-[#2B2B2B]">
                      {initials || <FiUser />}
                    </span>
                  )}
                  <span
                    className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/55 transition-opacity ${
                      savingPhoto ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {savingPhoto ? <Spinner className="size-6" /> : <FiCamera size={20} />}
                  </span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />

                <p className="mt-5 break-words text-lg font-semibold">{fullName || "Sem nome"}</p>
                <p className="mt-0.5 max-w-full break-all text-sm text-white/55">{user.email}</p>
                {/* Cargo editável na aba Dados pessoais; sem cargo, um atalho para preencher */}
                {user.cargo ? (
                  <span className="mt-3 inline-flex max-w-full rounded-full border border-[#139C73]/40 bg-[#139C73]/12 px-2.5 py-0.5 text-xs text-emerald-300">
                    <span className="truncate" title={user.cargo}>{user.cargo}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setTab("dados");
                      setTimeout(() => cargoInputRef.current?.focus(), 0);
                    }}
                    className="mt-3 inline-flex rounded-full border border-dashed border-[#575757] px-2.5 py-0.5 text-xs text-white/55 transition-colors hover:border-[#139C73]/60 hover:text-emerald-300"
                  >
                    + Adicionar cargo
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={savingPhoto}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[#18C18A] transition-colors hover:bg-[#139C73]/10 disabled:opacity-60"
                >
                  <FiCamera size={13} />
                  Alterar foto
                </button>
              </div>

              {/* Números dos casos */}
              <dl className="grid grid-cols-3 border-t border-[#3d3d3d]">
                {stats.map(({ label, value, color }, i) => (
                  <div key={label} className={`px-2 py-4 text-center ${i > 0 ? "border-l border-[#3d3d3d]" : ""}`}>
                    <dd className={`text-xl font-semibold ${color}`}>{value ?? 0}</dd>
                    <dt className="mt-0.5 text-[11px] leading-tight text-white/50">{label}</dt>
                  </div>
                ))}
              </dl>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-b-xl border-t border-[#3d3d3d] px-5 py-3.5 text-sm text-white/65 transition-colors hover:bg-red-400/10 hover:text-red-300"
              >
                <FiLogOut size={15} />
                Sair da conta
              </button>
            </aside>

            <div className="flex min-w-0 flex-col gap-5">
            {/* ══════════ Configurações em abas ══════════ */}
            <div className={`${CARD} flex min-w-0 flex-col`}>
              <Tabs active={tab} onChange={setTab} />

              {/* ── Dados pessoais ── formulário + coluna de informações ao lado */}
              <div
                id="panel-dados"
                role="tabpanel"
                aria-labelledby="tab-dados"
                hidden={tab !== "dados"}
                className="flex-1 grid-cols-[minmax(0,1fr)] gap-8 p-5 data-[on=true]:grid sm:p-7 2xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]"
                data-on={tab === "dados"}
              >
                <form onSubmit={handleUpdateProfile} noValidate className="flex w-full min-w-0 max-w-[560px] flex-col gap-5">
                  <p className="text-sm text-white/55">
                    Mantenha seu nome e e-mail atualizados para a equipe te identificar.
                  </p>

                  {profileServerError && <FormAlert>{profileServerError}</FormAlert>}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <AuthField
                      label="Nome"
                      autoComplete="given-name"
                      value={primeiroNome}
                      onChange={(e) => {
                        setPrimeiroNome(e.target.value);
                        if (profileErrors.primeiroNome) setProfileErrors((p) => ({ ...p, primeiroNome: undefined }));
                      }}
                      error={profileErrors.primeiroNome}
                      disabled={savingProfile}
                    />
                    <AuthField
                      label="Sobrenome"
                      autoComplete="family-name"
                      value={sobrenome}
                      onChange={(e) => {
                        setSobrenome(e.target.value);
                        if (profileErrors.sobrenome) setProfileErrors((p) => ({ ...p, sobrenome: undefined }));
                      }}
                      error={profileErrors.sobrenome}
                      disabled={savingProfile}
                    />
                  </div>

                  <AuthField
                    ref={cargoInputRef}
                    label="Cargo"
                    autoComplete="organization-title"
                    placeholder="Ex.: Delegada, Perito criminal, Investigador"
                    maxLength={CARGO_MAX}
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    hint={`Aparece no seu perfil e no menu lateral. Opcional · ${cargo.length}/${CARGO_MAX}`}
                    disabled={savingProfile}
                  />

                  <AuthField
                    label="E-mail"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (profileErrors.email) setProfileErrors((p) => ({ ...p, email: undefined }));
                    }}
                    onBlur={() => email && setProfileErrors((p) => ({ ...p, email: validateEmail(email) }))}
                    error={profileErrors.email}
                    hint="Usado para entrar e para recuperar a senha."
                    disabled={savingProfile}
                  />

                  <div className="mt-auto flex flex-col-reverse items-stretch gap-3 border-t border-[#3d3d3d] pt-5 sm:flex-row sm:items-center sm:justify-end">
                    {profileDirty ? (
                      <SubmitButton
                        type="button"
                        variant="secondary"
                        fullWidth={false}
                        onClick={handleDiscardProfile}
                        disabled={savingProfile}
                      >
                        Descartar
                      </SubmitButton>
                    ) : (
                      <span className="text-xs text-white/40 sm:mr-auto">Nenhuma alteração pendente.</span>
                    )}
                    <SubmitButton
                      fullWidth={false}
                      loading={savingProfile}
                      loadingText="Salvando..."
                      disabled={!profileDirty}
                    >
                      Salvar alterações
                    </SubmitButton>
                  </div>
                </form>

                <aside className="grid grid-cols-[minmax(0,1fr)] content-start gap-3 md:grid-cols-3 2xl:grid-cols-2 2xl:border-l 2xl:border-[#3d3d3d] 2xl:pl-8" aria-label="Sobre seus dados">
                  <InfoCard icon={<FiUsers size={15} />} title="Quem vê seus dados">
                    Seu nome e sua foto aparecem para a equipe nos casos compartilhados com você.
                  </InfoCard>
                  <InfoCard icon={<FiMail size={15} />} title="E-mail de acesso">
                    É com ele que você entra no Priora e recebe o link para redefinir a senha. Se trocar,
                    use o novo e-mail no próximo login.
                  </InfoCard>
                  <InfoCard icon={<FiHash size={15} />} title="ID do perfil" className="2xl:col-span-2">
                    <span className="mt-2 flex items-center gap-2 rounded-md border border-dashed border-[#434343] px-2.5 py-2">
                      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-white/60" title={user.id}>
                        {user.id}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        aria-label="Copiar ID do perfil"
                        className="inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-0.5 text-xs text-white/55 transition-colors hover:bg-[#363636] hover:text-white"
                      >
                        {copied ? <FiCheck size={13} className="text-emerald-400" /> : <FiCopy size={13} />}
                        {copied ? "Copiado" : "Copiar"}
                      </button>
                    </span>
                    <span className="mt-2 block">Identificador da sua conta, útil ao falar com o suporte.</span>
                  </InfoCard>
                </aside>
              </div>

              {/* ── Segurança ── formulário + dicas ao lado */}
              <div
                id="panel-seguranca"
                role="tabpanel"
                aria-labelledby="tab-seguranca"
                hidden={tab !== "seguranca"}
                className="flex-1 grid-cols-[minmax(0,1fr)] gap-8 p-5 data-[on=true]:grid sm:p-7 2xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]"
                data-on={tab === "seguranca"}
              >
                <form onSubmit={handleChangePassword} noValidate className="flex w-full min-w-0 max-w-[560px] flex-col gap-5">
                  <p className="text-sm text-white/55">
                    Confirme a senha atual e escolha uma nova com pelo menos 8 caracteres.
                  </p>

                  {passwordServerError && <FormAlert>{passwordServerError}</FormAlert>}

                  <PasswordField
                    label="Senha atual"
                    autoComplete="current-password"
                    value={senhaAntiga}
                    onChange={(e) => {
                      setSenhaAntiga(e.target.value);
                      if (passwordErrors.senhaAntiga) setPasswordErrors((p) => ({ ...p, senhaAntiga: undefined }));
                    }}
                    error={passwordErrors.senhaAntiga}
                    disabled={savingPassword}
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <PasswordField
                      label="Nova senha"
                      autoComplete="new-password"
                      value={novaSenha}
                      onChange={(e) => {
                        setNovaSenha(e.target.value);
                        if (passwordErrors.novaSenha) setPasswordErrors((p) => ({ ...p, novaSenha: undefined }));
                      }}
                      error={passwordErrors.novaSenha}
                      disabled={savingPassword}
                    />
                    <PasswordField
                      label="Confirmar nova senha"
                      autoComplete="new-password"
                      value={confirmSenha}
                      onChange={(e) => {
                        setConfirmSenha(e.target.value);
                        if (passwordErrors.confirmSenha) setPasswordErrors((p) => ({ ...p, confirmSenha: undefined }));
                      }}
                      error={passwordErrors.confirmSenha}
                      disabled={savingPassword}
                    />
                  </div>

                  <PasswordChecklist password={novaSenha} confirm={confirmSenha} />

                  <div className="mt-auto flex justify-end border-t border-[#3d3d3d] pt-5">
                    <SubmitButton fullWidth={false} loading={savingPassword} loadingText="Alterando...">
                      Alterar senha
                    </SubmitButton>
                  </div>
                </form>

                <aside className="grid grid-cols-[minmax(0,1fr)] content-start gap-3 md:grid-cols-3 2xl:grid-cols-2 2xl:border-l 2xl:border-[#3d3d3d] 2xl:pl-8" aria-label="Dicas de segurança">
                  <InfoCard icon={<FiShield size={15} />} title="Senha forte">
                    <ul className="mt-1 list-disc space-y-1 pl-4">
                      <li>Prefira uma frase longa a uma palavra curta.</li>
                      <li>Misture letras, números e símbolos.</li>
                      <li>Não reutilize a senha de outros sites.</li>
                    </ul>
                  </InfoCard>
                  <InfoCard icon={<FiKey size={15} />} title="Esqueceu a senha atual?">
                    Receba um link no seu e-mail para criar uma nova.{" "}
                    <Link to="/recover" state={{ email: user.email }} className="font-medium text-[#18C18A] hover:underline">
                      Redefinir por e-mail
                    </Link>
                  </InfoCard>
                  <InfoCard icon={<FiLock size={15} />} title="Depois da troca" className="2xl:col-span-2">
                    A nova senha passa a valer no próximo login, em qualquer dispositivo.
                  </InfoCard>
                </aside>
              </div>
            </div>

            {/* ══════════ Seus casos (preenche o resto da altura) ══════════ */}
            <RecentCases userId={user.id} className="flex-1" />
            </div>
          </div>
        </section>
      </div>

      {/* ── Modal de recorte da foto ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4"
          onClick={() => !savingPhoto && setSelectedImage(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="crop-title"
            className="w-full max-w-md overflow-hidden rounded-xl border border-[#575757] bg-[#242424] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-[#3d3d3d] px-5 py-4">
              <p id="crop-title" className="text-base font-medium">Ajustar foto de perfil</p>
              <p className="mt-0.5 text-sm text-white/55">Arraste e use o zoom para enquadrar seu rosto.</p>
            </div>

            <div className="relative h-72 w-full bg-black">
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_a, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>

            <div className="px-5 pt-4">
              <label htmlFor="zoom" className={FIELD_LABEL}>Zoom</label>
              <input
                id="zoom"
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#139C73]"
              />
            </div>

            <div className="flex justify-end gap-2 px-5 py-4">
              <SubmitButton
                type="button"
                variant="secondary"
                fullWidth={false}
                onClick={() => setSelectedImage(null)}
                disabled={savingPhoto}
              >
                Cancelar
              </SubmitButton>
              <SubmitButton
                type="button"
                fullWidth={false}
                onClick={handleConfirmCrop}
                loading={savingPhoto}
                loadingText="Salvando..."
              >
                Salvar foto
              </SubmitButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
