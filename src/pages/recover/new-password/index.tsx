import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 

export default function NewPassword() {
  const [visibilityPassword, setVisibilityPassword] = useState(false);
  const [visibilityPasswordConfirm, setVisibilityPasswordConfirm] =
    useState(false);

  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const token = searchParams.get("token");

  async function handleResetPassword() {
  if (!senha.trim() || !confirmSenha.trim()) {
    toast.error("Todos os campos são obrigatórios");
    return;
  }

  if (senha.length < 8) {
    toast.error("A senha deve conter pelo menos 8 caracteres");
    return;
  }

  if (senha !== confirmSenha) {
    toast.error("As senhas não coincidem");
    return;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/users/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          novaSenha: senha,
        }),
      }
    );

    if (!response.ok) {
      toast.error("Token inválido ou expirado");
      return;
    }

    toast.success("Senha redefinida com sucesso!");
    navigate("/recover/updated-password");
  } catch (error) {
    console.error(error);
    toast.error("Erro ao conectar");
  }
}

  return (
    <div className="dark-circuit-wrapper flex w-full h-screen justify-between items-center">
    <div className="dark-circuit-background" />
      <div className="w-[60%] ml-4 hidden lg:block  h-[95%] transition-all">
        <img
          src="..\src\assets\er.png"
          alt="imagem-decorativa"
          className=" w-full h-full hidden lg:block "
        />
      </div>
      <div className="relative z-10 flex w-full lg:w-[35%] max-w-125 h-full flex-col items-center justify-center px-10 mx-auto gap-10">
        <div className="">
          <img src="..\src\assets\logoHorizon.png" alt="logo" />
        </div>
        <div className="">
          <img src="..\src\assets\logoPadlock.png" alt="logo" />
        </div>
        <div>
          <p className="text-[#D9D9D9] text-[20px] font-semibold ">
            Redefina sua senha!
          </p>
        </div>
        <div className="flex flex-col gap-6 w-full ">
          <div className="">
            <div className="bg-[#0E0E10] w-full text-[#A6A6A6] flex py-2 rounded-full items-center justify-between px-5 border border-transparent focus-within:border-[#139C73] transition-all duration-200">
              <input
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type={visibilityPassword ? "text" : "password"}
                placeholder="Senha"
                className="w-full bg-transparent text-white outline-none border-none focus:outline-none focus:ring-0 focus:border-none"
              />
              {visibilityPassword ? (
                <i
                  className="transition-all"
                  onClick={() => {
                    setVisibilityPassword(false);
                  }}
                >
                  <MdOutlineVisibilityOff size={28} />
                </i>
              ) : (
                <i
                  className="transition-all"
                  onClick={() => {
                    setVisibilityPassword(true);
                  }}
                >
                  <MdOutlineVisibility size={28} />
                </i>
              )}
            </div>
            <p className="text-[#8B8B8B] text-sm ml-5 mt-1">
              Sua senha deve conter 8 ou mais caracteres.
            </p>
          </div>
          <div className="bg-[#0E0E10] w-full text-[#A6A6A6] flex py-2 rounded-full items-center justify-between px-5 border border-transparent focus-within:border-[#139C73] transition-all duration-200">
            <input
              type={visibilityPasswordConfirm ? "text" : "password"}
              placeholder="Confirmar Senha"
               className="w-full bg-transparent text-white outline-none border-none focus:outline-none focus:ring-0 focus:border-none"
              value={confirmSenha}
              onChange={(e) => setConfirmSenha(e.target.value)}
            />
            {visibilityPasswordConfirm ? (
              <i
                className="transition-all"
                onClick={() => {
                  setVisibilityPasswordConfirm(false);
                }}
              >
                <MdOutlineVisibilityOff size={28} />
              </i>
            ) : (
              <i
                className="transition-all"
                onClick={() => {
                  setVisibilityPasswordConfirm(true);
                }}
              >
                <MdOutlineVisibility size={28} />
              </i>
            )}
          </div>
        </div>
        <div className="w-full items-center flex flex-col gap-4">
          <button
            onClick={handleResetPassword}
            className="bg-[linear-gradient(90deg,#139C73,#136D52)] w-full py-3 rounded-full text-white font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(19,156,115,0.35)] hover:brightness-110 active:scale-[0.98] cursor-pointer"
          >
            REDEFINIR SENHA
          </button>
        </div>
      </div>
    </div>
  );
}
