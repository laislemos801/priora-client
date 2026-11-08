import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FiCamera, FiCheck, FiCopy, FiLock, FiLogOut, FiMail, FiRefreshCw, FiUser } from "react-icons/fi";
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
import backImageProfile from "@/assets/backImageProfile.png";

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

const CARD = "rounded-lg border border-[#3d3d3d] bg-[#2B2B2B]";

/** Seção do painel de configurações (separadas por linha, sem cartão próprio). */
function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="p-5 md:p-7">
      <h2 className="text-base font-medium text-white">{title}</h2>
      {description && <p className="mt-1 text-sm text-white/55">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
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
        <section className={`overflow-hidden rounded-xl border border-[#575757] bg-[#242424] ${PAGE_CARD_FILL}`}>
          {header}

          <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 p-4 md:p-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-8 lg:p-8">
            {/* ══════════ Coluna da identidade ══════════ */}
            <aside className={`${CARD} overflow-hidden lg:sticky lg:top-4`}>
              {/* Faixa da marca, contida no cartão */}
              <div className="h-20 overflow-hidden border-b border-[#3d3d3d]">
                <img src={backImageProfile} alt="" className="h-full w-full object-cover opacity-80" />
              </div>

              <div className="flex flex-col items-center px-6 pb-6 text-center">
                {/* Avatar */}
                <div className="relative -mt-12 size-24 shrink-0">
                  {user.fotoUrl ? (
                    <img
                      src={user.fotoUrl}
                      alt="Foto de perfil"
                      className="size-full rounded-full object-cover ring-4 ring-[#2B2B2B]"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center rounded-full bg-linear-to-br from-[#139C73] to-[#136D52] text-3xl font-semibold ring-4 ring-[#2B2B2B]">
                      {initials || <FiUser />}
                    </div>
                  )}

                  {savingPhoto && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                      <Spinner className="size-6" />
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={savingPhoto}
                    aria-label="Alterar foto de perfil"
                    title="Alterar foto de perfil"
                    className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-[#139C73] text-white ring-4 ring-[#2B2B2B] transition-colors hover:bg-[#18C18A] disabled:opacity-60"
                  >
                    <FiCamera size={14} />
                  </button>
                </div>

                <p className="mt-4 break-words text-lg font-semibold">{fullName || "Sem nome"}</p>
                <p className="mt-0.5 max-w-full break-all text-sm text-white/55">{user.email}</p>
                <span className="mt-3 inline-flex items-center rounded-full border border-[#139C73]/40 bg-[#139C73]/12 px-2.5 py-0.5 text-xs text-emerald-300">
                  Investigador Criminal
                </span>
              </div>

              {/* Números dos casos, em linha */}
              <dl className="grid grid-cols-3 border-t border-[#3d3d3d]">
                {stats.map(({ label, value, color }, i) => (
                  <div key={label} className={`px-2 py-4 text-center ${i > 0 ? "border-l border-[#3d3d3d]" : ""}`}>
                    <dd className={`text-xl font-semibold ${color}`}>{value ?? 0}</dd>
                    <dt className="mt-0.5 text-[11px] leading-tight text-white/55">{label}</dt>
                  </div>
                ))}
              </dl>

              {/* ID do perfil */}
              <div className="flex items-center justify-between gap-3 border-t border-[#3d3d3d] px-5 py-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-widest text-white/45">ID do perfil</p>
                  <p className="truncate font-mono text-xs text-white/70" title={user.id}>{user.id}</p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyId}
                  aria-label="Copiar ID do perfil"
                  title={copied ? "Copiado" : "Copiar ID"}
                  className="shrink-0 rounded-md p-2 text-white/60 transition-colors hover:bg-[#363636] hover:text-white"
                >
                  {copied ? <FiCheck size={14} className="text-emerald-400" /> : <FiCopy size={14} />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 border-t border-[#3d3d3d] px-5 py-3 text-sm text-white/65 transition-colors hover:bg-red-400/10 hover:text-red-300"
              >
                <FiLogOut size={15} />
                Sair da conta
              </button>
            </aside>

            {/* ══════════ Painel de configurações ══════════ */}
            <div className={`${CARD} divide-y divide-[#3d3d3d]`}>
              {/* Dados pessoais */}
              <Section title="Dados pessoais" description="Seu nome aparece para a equipe nos casos compartilhados.">
                <form onSubmit={handleUpdateProfile} noValidate className="flex flex-col gap-5">
                  {profileServerError && <FormAlert>{profileServerError}</FormAlert>}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <AuthField
                      label="Nome"
                      autoComplete="given-name"
                      icon={<FiUser size={16} />}
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
                    label="E-mail"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    icon={<FiMail size={16} />}
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

                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    {profileDirty && (
                      <SubmitButton
                        type="button"
                        variant="secondary"
                        fullWidth={false}
                        onClick={handleDiscardProfile}
                        disabled={savingProfile}
                      >
                        Descartar
                      </SubmitButton>
                    )}
                    <SubmitButton
                      fullWidth={false}
                      loading={savingProfile}
                      loadingText="Salvando..."
                      disabled={!profileDirty}
                      title={!profileDirty ? "Nenhuma alteração para salvar" : undefined}
                    >
                      Salvar alterações
                    </SubmitButton>
                  </div>
                </form>
              </Section>

              {/* Segurança */}
              <Section title="Senha" description="Para trocar a senha, confirme a atual e escolha uma nova.">
                <form onSubmit={handleChangePassword} noValidate className="flex flex-col gap-5">
                  {passwordServerError && <FormAlert>{passwordServerError}</FormAlert>}

                  <PasswordField
                    label="Senha atual"
                    autoComplete="current-password"
                    icon={<FiLock size={16} />}
                    value={senhaAntiga}
                    onChange={(e) => {
                      setSenhaAntiga(e.target.value);
                      if (passwordErrors.senhaAntiga) setPasswordErrors((p) => ({ ...p, senhaAntiga: undefined }));
                    }}
                    error={passwordErrors.senhaAntiga}
                    disabled={savingPassword}
                    className="sm:max-w-[calc(50%-0.625rem)]"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <PasswordField
                      label="Nova senha"
                      autoComplete="new-password"
                      icon={<FiLock size={16} />}
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
                      icon={<FiLock size={16} />}
                      value={confirmSenha}
                      onChange={(e) => {
                        setConfirmSenha(e.target.value);
                        if (passwordErrors.confirmSenha) setPasswordErrors((p) => ({ ...p, confirmSenha: undefined }));
                      }}
                      error={passwordErrors.confirmSenha}
                      disabled={savingPassword}
                    />
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <PasswordChecklist password={novaSenha} confirm={confirmSenha} />
                    <SubmitButton fullWidth={false} loading={savingPassword} loadingText="Alterando...">
                      Alterar senha
                    </SubmitButton>
                  </div>
                </form>
              </Section>
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
