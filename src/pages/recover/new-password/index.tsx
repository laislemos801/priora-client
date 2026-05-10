import { useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { useSearchParams, useNavigate } from "react-router-dom";

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
    if (senha !== confirmSenha) {
      alert("As senhas não coincidem");
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
        },
      );

      if (!response.ok) {
        alert("Token inválido ou expirado");
        return;
      }

      navigate("/recover/updated-password");
    } catch (error) {
      console.log(error);

      alert("Erro ao conectar");
    }
  }

  return (
    <div
      className="flex w-full h-screen bg-no-repeat bg-center bg-cover justify-between items-center "
      style={{ backgroundImage: "url(../src/assets/backgroundDesktop.png)" }}
    >
      <div className="w-[60%] ml-4 hidden lg:block  h-[95%] transition-all">
        <img
          src="..\src\assets\er.png"
          alt="imagem-decorativa"
          className=" w-full h-full hidden lg:block "
        />
      </div>
      <div className="flex w-full lg:w-[25%] h-full flex-col items-center px-10 lg:px-0 justify-center gap-10 lg:mr-20">
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
            <div className="bg-[#0E0E10] text-[#A6A6A6] flex py-3 rounded-full items-center justify-between px-5">
              <input
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type={visibilityPassword ? "text" : "password"}
                placeholder="Senha"
                className="w-full"
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
            <p className="text-[#8B8B8B] text-[10px] ml-5 mt-1">
              Sua senha deve conter 8 ou mais caracteres.
            </p>
          </div>
          <div className="bg-[#0E0E10] text-[#A6A6A6] flex py-3 rounded-full items-center justify-between px-5">
            <input
              type={visibilityPasswordConfirm ? "text" : "password"}
              placeholder="Confirmar Senha"
              className="w-full"
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
            className="bg-[linear-gradient(90deg,#139C73,#136D52)] w-full py-3 rounded-full text-white font-bold"
          >
            REDEFINIR SENHA
          </button>
        </div>
      </div>
    </div>
  );
}
