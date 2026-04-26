import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";

export default function Register() {
  const [visibilityPassword, setVisibilityPassword] = useState(false);
  const [visibilityPasswordConfirm, setVisibilityPasswordConfirm] =
    useState(false);

  return (
    <div
      className="flex w-full h-screen flex-col items-center px-10 pt-13 justify-start gap-10"
      style={{
        backgroundImage: "url(src/assets/backgound.png)",
        backgroundSize: "100% 100%",
      }}
    >
      <div className="">
        <img src="src\assets\logoHorizon.png" alt="logo" />
      </div>
      <div>
        <p className="text-[#D9D9D9] text-[20px] font-semibold mb-4">
          Cadastro
        </p>
      </div>
      <div className="flex flex-col gap-6 w-full ">
        <div className="bg-[#0E0E10] text-[#A6A6A6] flex py-3 rounded-full items-center justify-between px-5">
          <input type="text" placeholder="Email" className="w-full" />
          <i>
            <MdOutlineMail size={28} />
          </i>
        </div>
        <div className="bg-[#0E0E10] text-[#A6A6A6] flex py-3 rounded-full items-center justify-between px-5">
          <input type="text" placeholder="Primeiro Nome" className="w-full" />
        </div>
        <div className="bg-[#0E0E10] text-[#A6A6A6] flex py-3 rounded-full items-center justify-between px-5">
          <input type="text" placeholder="Sobrenome" className="w-full" />
        </div>
        <div className="">
          <div className="bg-[#0E0E10] text-[#A6A6A6] flex py-3 rounded-full items-center justify-between px-5">
            <input
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
        <button className="bg-[linear-gradient(90deg,#139C73,#136D52)] w-full py-3 rounded-full text-white font-bold">
          CADASTRAR
        </button>
        <div>
          <p className="text-white">
            Já tem uma conta?{" "}
            <a className="text-[#139C73] underline" href="/login">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
