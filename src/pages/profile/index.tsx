import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FiCamera, FiCheck, FiCopy, FiLogOut, FiRefreshCw, FiUser } from "react-icons/fi";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import toast from "react-hot-toast";
import TopBar from "@/components/ui/TopBar";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
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

interface UserType {
  email: string;
  fotoUrl: string;
  id: string;
  primeiroNome: string;
  sobrenome: string;
  casosAtivos: number;
  casosConcluidos: number;
  totalCasos: number;
}

const CARD = "rounded-xl border border-[#3d3d3d] bg-[#2B2B2B]";

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
      email.trim() !== (user.email ?? ""));

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
        }),
      });
      const data = await readJson(response);
      if (!response.ok) throw new Error(apiErrorMessage(data, "Não foi possível salvar as alterações."));

      const updated = { ...user, ...data } as UserType;
      setUser(updated);
      fillProfileForm(updated);
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
    <header className="flex items-center gap-2 border-b border-[#575757] px-4 py-4 md:px-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Voltar"
        className="-ml-2 rounded-full p-2 text-white/65 transition-colors hover:bg-[#363636] hover:text-white"
      >
        <IoIosArrowBack size={16} />
      </button>
      <h1 className="text-lg font-semibold text-slate-100">Minha Conta</h1>
    </header>
  );

  // ── Estado de erro ao carregar ──
  if (loadState === "error" || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-[#1D1D1D] text-white">
        <TopBar />
        <main className="flex flex-1 flex-col px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
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
        </main>
      </div>
    );
  }

  const fullName = `${user.primeiroNome ?? ""} ${user.sobrenome ?? ""}`.trim();
  const initials = `${user.primeiroNome?.charAt(0) ?? ""}${user.sobrenome?.charAt(0) ?? ""}`.toUpperCase();

  const stats = [
    { label: "Casos ativos", value: user.casosAtivos, color: "text-[#29B893]" },
    { label: "Concluídos", value: user.casosConcluidos, color: "text-[#E8CF75]" },
    { label: "Total de casos", value: user.totalCasos, color: "text-[#E8B768]" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#1D1D1D] text-white">
      <TopBar />

      <main className="flex flex-1 flex-col px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        {/* O cartão abraça o conteúdo (sem forçar a altura da tela), para não sobrar vazio */}
        <section className="flex flex-col overflow-hidden rounded-xl border border-[#575757] bg-[#242424]">
          {header}

          {/* Perfil fixo à esquerda, abas no resto da largura; as duas colunas com a mesma altura */}
          <div className="grid w-full gap-5 p-4 md:p-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
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
                <span className="mt-3 inline-flex rounded-full border border-[#139C73]/40 bg-[#139C73]/12 px-2.5 py-0.5 text-xs text-emerald-300">
                  Investigador Criminal
                </span>

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

            {/* ══════════ Configurações em abas ══════════ */}
            <div className={`${CARD} flex min-w-0 flex-col`}>
              <Tabs active={tab} onChange={setTab} />

              {/* ── Dados pessoais ── */}
              <div
                id="panel-dados"
                role="tabpanel"
                aria-labelledby="tab-dados"
                hidden={tab !== "dados"}
                className="flex-1 flex-col p-5 data-[on=true]:flex sm:p-7"
                data-on={tab === "dados"}
              >
                <p className="mb-6 text-sm text-white/55">
                  Seu nome aparece para a equipe nos casos compartilhados.
                </p>

                <form onSubmit={handleUpdateProfile} noValidate className="flex flex-1 flex-col gap-5">
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

                  {/* ID do perfil, só leitura */}
                  <div>
                    <span className={FIELD_LABEL}>ID do perfil</span>
                    <div className="flex items-center gap-2 rounded-md border border-dashed border-[#434343] px-3 py-2.5">
                      <span className="min-w-0 flex-1 truncate font-mono text-xs text-white/55">{user.id}</span>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded px-1.5 py-0.5 text-xs text-white/55 transition-colors hover:bg-[#363636] hover:text-white"
                      >
                        {copied ? <FiCheck size={13} className="text-emerald-400" /> : <FiCopy size={13} />}
                        {copied ? "Copiado" : "Copiar"}
                      </button>
                    </div>
                  </div>
                  </div>

                  {/* Rodapé fixo no fim do cartão */}
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
              </div>

              {/* ── Segurança ── */}
              <div
                id="panel-seguranca"
                role="tabpanel"
                aria-labelledby="tab-seguranca"
                hidden={tab !== "seguranca"}
                className="flex-1 flex-col p-5 data-[on=true]:flex sm:p-7"
                data-on={tab === "seguranca"}
              >
                <p className="mb-6 text-sm text-white/55">
                  Para trocar a senha, confirme a atual e escolha uma nova com pelo menos 8 caracteres.
                </p>

                <form onSubmit={handleChangePassword} noValidate className="flex flex-1 flex-col gap-5">
                  {passwordServerError && <FormAlert>{passwordServerError}</FormAlert>}

                  {/* Em telas largas as três senhas ficam lado a lado */}
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  <PasswordField
                    className="sm:col-span-2 xl:col-span-1"
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
              </div>
            </div>
          </div>
        </section>
      </main>

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
