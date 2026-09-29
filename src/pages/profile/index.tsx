import TopBar from "@/components/ui/TopBar";
import { IoIosArrowBack } from "react-icons/io";
import { FiCamera, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import toast from "react-hot-toast";
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

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserType>();
  const [loading, setLoading] = useState(false);

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

        const response = await fetch("http://localhost:8000/users/me", {
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
  ): Promise<string> {
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

    return canvas.toDataURL("image/jpeg", 0.9);
  }

  async function handleConfirmCrop() {
    if (!selectedImage || !croppedAreaPixels) {
      toast.error("Selecione uma área da imagem.");
      return;
    }

    try {
      setSavingPhoto(true);

      const croppedBase64 = await getCroppedImage(
        selectedImage,
        croppedAreaPixels,
      );

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8000/users/me/photo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fotoBase64: croppedBase64,
        }),
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

      const response = await fetch("http://localhost:8000/users/me/password", {
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

      const response = await fetch("http://localhost:8000/users/me", {
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

  return (
    <div className="min-h-screen bg-[#1D1D1D] text-white flex flex-col">
      <TopBar />

      <main className="flex-1 flex flex-col p-[1.5vw]">
        <section className="flex-1 flex flex-col border border-[#575757] rounded-md overflow-hidden">
          {/* Título */}
          <header className="flex items-center gap-2 border-b border-[#575757] px-[1.2vw] py-[0.8vw]">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full text-white/65 hover:bg-[#363636] hover:text-white transition-colors"
            >
              <IoIosArrowBack size={16} />
            </button>

            <p className="text-[1.1vw] font-light">Minha Conta</p>
          </header>

          {/* Área da conta */}
          <div className="relative flex-1 flex flex-col">
            {/* Background */}
            <div className="absolute inset-x-0 top-0 h-[30%] border-b border-[#575757] overflow-hidden">
              <img
                src={backImageProfile}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Conteúdo */}
            <div
              className="
                relative
                z-10
                flex
                flex-1
                gap-[3vw]
                px-[3vw]
                pt-[5vw]
                pb-[3vw]
                lg:flex-row
                flex-col
              "
            >
              {/* ================= PERFIL ================= */}
              <div
                className="
                  flex
                  flex-col
                  shrink-0
                  self-start
                  overflow-hidden
                  rounded-lg
                  border
                  border-[#575757]
                  bg-[#292929]
                  w-full
                  lg:w-[18%]
                "
              >
                {/* Foto */}
                <div className="flex flex-col items-center px-[1vw] py-[1.2vw]">
                  {/* Modal de crop */}
                  {showCropModal && selectedImage && (
                    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/70">
                      <div className="w-[35vw] rounded-lg border border-[#575757] bg-[#292929] overflow-hidden">
                        {/* Título */}
                        <div className="border-b border-[#575757] px-[1.2vw] py-[0.8vw]">
                          <p className="text-[0.9vw] font-medium">
                            Ajustar foto de perfil
                          </p>

                          <p className="text-[0.6vw] text-gray-400 mt-[0.2vw]">
                            Ajuste sua foto dentro do quadrado.
                          </p>
                        </div>

                        {/* Crop */}
                        <div className="relative w-full h-[25vw] bg-black">
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

                        {/* Zoom */}
                        <div className="px-[1.2vw] pt-[1vw]">
                          <label className="block text-[0.65vw] mb-[0.4vw]">
                            Zoom
                          </label>

                          <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>

                        {/* Botões */}
                        <div className="flex justify-end gap-[0.6vw] px-[1.2vw] py-[1vw]">
                          <button
                            type="button"
                            onClick={() => {
                              setShowCropModal(false);
                              setSelectedImage(null);
                            }}
                            disabled={savingPhoto}
                            className="
                              px-[1.5vw]
                              py-[0.4vw]
                              rounded-md
                              border
                              border-[#575757]
                              text-[0.65vw]
                              text-white/70
                              hover:bg-[#363636]
                            "
                          >
                            Cancelar
                          </button>

                          <button
                            type="button"
                            onClick={handleConfirmCrop}
                            disabled={savingPhoto}
                            className="
                              px-[1.5vw]
                              py-[0.4vw]
                              rounded-md
                              bg-[#159C7C]
                              text-[0.65vw]
                              hover:bg-[#22B391]
                              disabled:opacity-50
                            "
                          >
                            {savingPhoto ? "Salvando..." : "Salvar foto"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Foto atual */}
                  <div className="relative">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />

                    {user &&
                      (user.fotoUrl ? (
                        <img
                          src={user.fotoUrl}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex justify-center items-center w-30 h-30 bg-gray-500 rounded-full">
                          <span className="text-3xl font-semibold">
                            {user.primeiroNome.charAt(0)}
                          </span>
                        </div>
                      ))}

                    <button
                      type="button"
                      onClick={handleOpenPhotoSelector}
                      className="
                        absolute
                        bottom-2
                        right-2
                        w-[2.7vw]
                        h-[2.7vw]
                        min-w-6
                        min-h-6
                        rounded-full
                        bg-[#159C7C]
                        flex
                        items-center
                        justify-center
                        hover:bg-[#22B391]
                        transition-colors
                      "
                    >
                      <FiCamera className="text-[0.9vw] min-w-3" />
                    </button>
                  </div>

                  <p className="mt-[0.6vw] text-[0.8vw] font-medium">
                    {primeiroNome} {sobrenome}
                  </p>

                  <p className="text-[0.5vw] text-gray-400">
                    Investigador Criminal ◉
                  </p>
                </div>

                {/* Informações */}
                <div className="border-t border-[#575757] px-[0.8vw] py-[0.8vw] flex justify-between text-[0.7vw]">
                  <span>ID do perfil:</span>
                  {user && <span>{user.id}</span>}
                </div>

                <div className="border-t border-[#575757] px-[0.8vw] py-[0.8vw] flex justify-between text-[0.7vw]">
                  <span>Casos Ativos:</span>
                  {user && (
                    <span className="text-[#29B893]">{user.casosAtivos}</span>
                  )}
                </div>

                <div className="border-t border-[#575757] px-[0.8vw] py-[0.8vw] flex justify-between text-[0.7vw]">
                  <span>Casos Concluídos:</span>
                  {user && (
                    <span className="text-[#E8CF75]">
                      {user.casosConcluidos}
                    </span>
                  )}
                </div>

                <div className="border-t border-[#575757] px-[0.8vw] py-[0.8vw] flex justify-between text-[0.7vw]">
                  <span>Total de Casos:</span>
                  {user && (
                    <span className="text-[#E8B768]">{user.totalCasos}</span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="
                    border-t
                    border-[#575757]
                    px-[0.8vw]
                    py-[0.8vw]
                    flex
                    items-center
                    justify-center
                    gap-[0.5vw]
                    text-[0.7vw]
                    text-white/65
                    hover:bg-red-400/10
                    hover:text-red-400
                    transition-colors
                  "
                >
                  <FiLogOut className="text-[0.85vw]" />
                  Sair
                </button>
              </div>

              {/* ================= FORMULÁRIO ================= */}
              <div className="flex-1 min-w-0">
                <div className="w-full rounded-lg border border-[#575757] bg-[#292929] overflow-hidden">
                  {/* Dados */}
                  <div className="p-[1.2vw]">
                    <h2 className="text-[0.8vw] font-medium mb-[1vw]">
                      Dados da conta
                    </h2>

                    <div className="grid grid-cols-2 gap-[1vw]">
                      <div>
                        <label className="block mb-[0.4vw] text-[0.7vw]">
                          Primeiro Nome
                        </label>

                        <input
                          type="text"
                          value={primeiroNome}
                          onChange={(e) => setPrimeiroNome(e.target.value)}
                          className="
                            w-full
                            h-[2vw]
                            rounded-md
                            border
                            border-[#4B4B4B]
                            bg-[#292929]
                            px-[0.8vw]
                            text-[0.7vw]
                            outline-none
                            focus:border-[#2A9B82]
                          "
                        />
                      </div>

                      <div>
                        <label className="block mb-[0.4vw] text-[0.7vw]">
                          Sobrenome
                        </label>

                        <input
                          type="text"
                          value={sobrenome}
                          onChange={(e) => setSobrenome(e.target.value)}
                          className="
                            w-full
                            h-[2vw]
                            rounded-md
                            border
                            border-[#4B4B4B]
                            bg-[#292929]
                            px-[0.8vw]
                            text-[0.7vw]
                            outline-none
                            focus:border-[#2A9B82]
                          "
                        />
                      </div>
                    </div>

                    <div className="mt-[0.8vw]">
                      <label className="block mb-[0.4vw] text-[0.7vw]">
                        Email
                      </label>

                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="
                          w-full
                          h-[2vw]
                          rounded-md
                          border
                          border-[#4B4B4B]
                          px-[0.8vw]
                          text-[0.7vw]
                          outline-none
                          focus:border-[#2A9B82]
                        "
                      />
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleUpdateProfile}
                      className="
                        mt-[0.8vw]
                        px-[2vw]
                        py-[0.35vw]
                        rounded-md
                        bg-[#159C7C]
                        text-[0.65vw]
                        hover:bg-[#22B391]
                        disabled:opacity-50
                      "
                    >
                      {loading ? "Atualizando..." : "Atualizar"}
                    </button>
                  </div>

                  {/* Senha */}
                  <div className="border-t border-[#575757] p-[1.2vw]">
                    <h2 className="text-[0.8vw] font-medium">Alterar senha</h2>

                    <p className="text-[0.45vw] text-gray-400 mt-[0.1vw]">
                      (A senha deve conter 8 ou mais caracteres)
                    </p>

                    <div className="grid grid-cols-2 gap-[1vw] mt-[1vw]">
                      <div>
                        <label className="block mb-[0.4vw] text-[0.7vw]">
                          Senha Antiga
                        </label>

                        <input
                          type="text"
                          value={senhaAntiga}
                          onChange={(e) => setSenhaAntiga(e.target.value)}
                          className="
                            w-full
                            h-[2vw]
                            rounded-md
                            border
                            border-[#4B4B4B]
                            px-[0.8vw]
                            text-[0.7vw]
                            outline-none
                            focus:border-[#2A9B82]
                          "
                        />
                      </div>

                      <div>
                        <label className="block mb-[0.4vw] text-[0.7vw]">
                          Senha Nova
                        </label>

                        <input
                          type="text"
                          value={novaSenha}
                          onChange={(e) => setNovaSenha(e.target.value)}
                          className="
                            w-full
                            h-[2vw]
                            rounded-md
                            border
                            border-[#4B4B4B]
                            bg-[#292929]
                            px-[0.8vw]
                            text-[0.7vw]
                            outline-none
                            focus:border-[#2A9B82]
                          "
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleChangePassword}
                      className="
                        mt-[0.8vw]
                        px-[2vw]
                        py-[0.35vw]
                        rounded-md
                        bg-[#159C7C]
                        text-[0.65vw]
                        hover:bg-[#22B391]
                        disabled:opacity-50
                      "
                    >
                      {loading ? "Alterando..." : "Alterar"}
                    </button>
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
