import TopBar from "@/components/ui/TopBar";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { PAGE_CARD_FILL } from "@/components/ui/EmptyState";
import { IoIosArrowBack } from "react-icons/io";
import { FiCamera, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/api";
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

const LABEL = "mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-[#888]";
const INPUT =
  "w-full rounded-md border border-[#434343] bg-[#282828] px-3 py-2 text-sm text-white outline-none transition-colors hover:border-[#606060] focus:border-[#139C73]";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserType>();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [primeiroNome, setPrimeiroNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");

  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  // Foto
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await apiFetch("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Erro ao carregar perfil");
        }

        const data = await response.json();

        setUser((prev) => ({
          ...prev,
          ...data,
        }));
        setPrimeiroNome(data.primeiroNome);
        setSobrenome(data.sobrenome);
        setEmail(data.email);
        setSenhaAntiga("");
      } catch (error) {
        console.error(error);

        toast.error(
          error instanceof Error ? error.message : "Erro ao carregar perfil",
        );
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  function handleOpenPhotoSelector() {
    fileInputRef.current?.click();
  }

  async function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione uma imagem válida.");
      event.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 4 MB.");
      event.target.value = "";
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
      setShowCropModal(true);
    };

    reader.onerror = () => {
      toast.error("Não foi possível carregar a imagem.");
    };

    reader.readAsDataURL(file);

    // Permite selecionar a mesma imagem novamente
    event.target.value = "";
  }

  function handleCropComplete(_croppedArea: Area, croppedAreaPixels: Area) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  async function getCroppedImage(
    imageSrc: string,
    cropArea: Area,
  ): Promise<Blob> {
    const image = new Image();

    image.src = imageSrc;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Não foi possível criar o canvas.");
    }

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height,
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Não foi possível gerar a imagem."))),
        "image/jpeg",
        0.9,
      );
    });
  }

  async function handleConfirmCrop() {
    if (!selectedImage || !croppedAreaPixels) {
      toast.error("Selecione uma área da imagem.");
      return;
    }

    try {
      setSavingPhoto(true);

      const croppedBlob = await getCroppedImage(
        selectedImage,
        croppedAreaPixels,
      );

      const formData = new FormData();
      formData.append("file", croppedBlob, "foto.jpg");

      const response = await apiFetch("/users/me/photo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao atualizar foto");
      }

      setUser((prev) => ({
        ...prev,
        ...data,
      }));
      console.log("RESPOSTA DO PUT /users/me:", data);
      console.log("casosAtivos:", data.casosAtivos);
      console.log("casosConcluidos:", data.casosConcluidos);
      console.log("totalCasos:", data.totalCasos);

      setShowCropModal(false);
      setSelectedImage(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });

      toast.success("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar foto",
      );
    } finally {
      setSavingPhoto(false);
    }
  }

  async function handleChangePassword() {
    if (!senhaAntiga.trim()) {
      toast.error("Digite sua senha atual.");
      return;
    }

    if (!novaSenha.trim()) {
      toast.error("Digite a nova senha.");
      return;
    }

    if (novaSenha.length < 8) {
      toast.error("A nova senha deve conter pelo menos 8 caracteres.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await apiFetch("/users/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          senhaAntiga,
          novaSenha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao alterar senha");
      }

      setSenhaAntiga("");
      setNovaSenha("");

      toast.success("Senha alterada com sucesso!");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Erro ao alterar senha",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile() {
    if (!primeiroNome.trim()) {
      toast.error("O primeiro nome é obrigatório.");
      return;
    }

    if (!sobrenome.trim()) {
      toast.error("O sobrenome é obrigatório.");
      return;
    }

    if (!email.trim()) {
      toast.error("O email é obrigatório.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await apiFetch("/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          primeiroNome,
          sobrenome,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao atualizar perfil");
      }

      setUser((prev) => ({
        ...prev,
        ...data,
      }));

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar perfil",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Você saiu da sua conta.");

    setTimeout(() => {
      navigate("/login");
    }, 500);
  }

  if (initialLoading) return <ProfileSkeleton />;

  return (
    <div className="flex min-h-screen flex-col bg-[#1D1D1D] text-white">
      <TopBar />

      <main className="flex flex-1 flex-col px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <section className={`overflow-hidden rounded-xl border border-[#575757] bg-[#242424] ${PAGE_CARD_FILL}`}>
          {/* Título */}
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

          {/* Área da conta */}
          <div className="relative flex flex-1 flex-col">
            {/* Faixa decorativa */}
            <div className="absolute inset-x-0 top-0 h-44 overflow-hidden border-b border-[#575757]">
              <img src={backImageProfile} alt="" className="h-full w-full object-cover" />
            </div>

            <div className="relative z-10 flex flex-1 flex-col gap-6 px-4 pb-8 pt-24 md:px-8 lg:flex-row lg:items-start">
              {/* ================= PERFIL ================= */}
              <aside className="w-full shrink-0 overflow-hidden rounded-lg border border-[#575757] bg-[#292929] lg:w-72">
                {/* Modal de crop */}
                {showCropModal && selectedImage && (
                  <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-lg border border-[#575757] bg-[#292929]">
                      <div className="border-b border-[#575757] px-5 py-3">
                        <p className="text-base font-medium">Ajustar foto de perfil</p>
                        <p className="mt-0.5 text-xs text-gray-400">Ajuste sua foto dentro do círculo.</p>
                      </div>

                      <div className="relative h-72 w-full bg-black">
                        <Cropper
                          image={selectedImage}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          cropShape="round"
                          showGrid={true}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={handleCropComplete}
                        />
                      </div>

                      <div className="px-5 pt-4">
                        <label htmlFor="zoom" className={LABEL}>Zoom</label>
                        <input
                          id="zoom"
                          type="range"
                          min={1}
                          max={3}
                          step={0.01}
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full"
                        />
                      </div>

                      <div className="flex justify-end gap-2 px-5 py-4">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCropModal(false);
                            setSelectedImage(null);
                          }}
                          disabled={savingPhoto}
                          className="rounded-md border border-[#575757] px-4 py-2 text-sm text-white/70 transition-colors hover:bg-[#363636] disabled:opacity-50"
                        >
                          Cancelar
                        </button>

                        <PrimaryButton onClick={handleConfirmCrop} disabled={savingPhoto}>
                          {savingPhoto ? "Salvando..." : "Salvar foto"}
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                )}

                {/* Foto, nome e papel */}
                <div className="flex flex-col items-center px-6 py-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />

                  <div className="relative size-28">
                    {user?.fotoUrl ? (
                      <img src={user.fotoUrl} alt="Foto de perfil" className="size-full rounded-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center rounded-full bg-gray-500">
                        <span className="text-4xl font-semibold">
                          {user?.primeiroNome?.charAt(0) ?? ""}
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleOpenPhotoSelector}
                      aria-label="Alterar foto de perfil"
                      title="Alterar foto de perfil"
                      className="absolute -bottom-1 -right-1 flex size-9 items-center justify-center rounded-full bg-[#159C7C] text-white ring-4 ring-[#292929] transition-colors hover:bg-[#22B391]"
                    >
                      <FiCamera size={16} />
                    </button>
                  </div>

                  <p className="mt-4 text-center text-lg font-medium">
                    {primeiroNome} {sobrenome}
                  </p>

                  <span className="mt-1 text-xs text-gray-400">Investigador Criminal</span>
                </div>

                {/* Informações */}
                <dl className="text-sm">
                  <div className="flex justify-between gap-4 border-t border-[#575757] px-6 py-3">
                    <dt className="whitespace-nowrap text-white/65">ID do perfil</dt>
                    <dd className="max-w-[10rem] break-all text-right text-xs text-white/80">{user?.id}</dd>
                  </div>

                  <div className="flex justify-between border-t border-[#575757] px-6 py-3">
                    <dt className="text-white/65">Casos ativos</dt>
                    <dd className="font-medium text-[#29B893]">{user?.casosAtivos}</dd>
                  </div>

                  <div className="flex justify-between border-t border-[#575757] px-6 py-3">
                    <dt className="text-white/65">Casos concluídos</dt>
                    <dd className="font-medium text-[#E8CF75]">{user?.casosConcluidos}</dd>
                  </div>

                  <div className="flex justify-between border-t border-[#575757] px-6 py-3">
                    <dt className="text-white/65">Total de casos</dt>
                    <dd className="font-medium text-[#E8B768]">{user?.totalCasos}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 border-t border-[#575757] px-6 py-3 text-sm text-white/65 transition-colors hover:bg-red-400/10 hover:text-red-400"
                >
                  <FiLogOut size={16} />
                  Sair
                </button>
              </aside>

              {/* ================= FORMULÁRIOS ================= */}
              <div className="min-w-0 flex-1 space-y-6">
                <div className="rounded-lg border border-[#575757] bg-[#292929] p-6">
                  <h2 className="mb-5 text-base font-medium">Dados da conta</h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="primeiroNome" className={LABEL}>Primeiro nome</label>
                      <input
                        id="primeiroNome"
                        type="text"
                        autoComplete="given-name"
                        value={primeiroNome}
                        onChange={(e) => setPrimeiroNome(e.target.value)}
                        className={INPUT}
                      />
                    </div>

                    <div>
                      <label htmlFor="sobrenome" className={LABEL}>Sobrenome</label>
                      <input
                        id="sobrenome"
                        type="text"
                        autoComplete="family-name"
                        value={sobrenome}
                        onChange={(e) => setSobrenome(e.target.value)}
                        className={INPUT}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="email" className={LABEL}>Email</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={INPUT}
                    />
                  </div>

                  <div className="mt-6">
                    <PrimaryButton onClick={handleUpdateProfile} disabled={loading}>
                      {loading ? "Atualizando..." : "Atualizar"}
                    </PrimaryButton>
                  </div>
                </div>

                <div className="rounded-lg border border-[#575757] bg-[#292929] p-6">
                  <h2 className="text-base font-medium">Alterar senha</h2>
                  <p className="mb-5 mt-1 text-xs text-gray-400">A senha deve conter 8 ou mais caracteres.</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="senhaAntiga" className={LABEL}>Senha antiga</label>
                      <input
                        id="senhaAntiga"
                        type="password"
                        autoComplete="current-password"
                        value={senhaAntiga}
                        onChange={(e) => setSenhaAntiga(e.target.value)}
                        className={INPUT}
                      />
                    </div>

                    <div>
                      <label htmlFor="novaSenha" className={LABEL}>Senha nova</label>
                      <input
                        id="novaSenha"
                        type="password"
                        autoComplete="new-password"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        className={INPUT}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <PrimaryButton onClick={handleChangePassword} disabled={loading}>
                      {loading ? "Alterando..." : "Alterar"}
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
