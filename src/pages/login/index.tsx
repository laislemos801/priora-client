import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";

export default function Login() {
  const [visibilityPassword, setVisibilityPassword] = useState(false);

  return (
    <div
      className="flex w-full h-screen flex-col items-center px-10 pt-13 justify-start gap-10"
      style={{
        backgroundImage: "url(src/assets/backgound.png)",
        backgroundSize: "100% 100%",
      }}
    >
      <div className="">
        <img src="src\assets\logoVertical.png" alt="logo" />
      </div>
      <div>
        <p className="text-[#D9D9D9] text-[20px] font-semibold mb-4">Login</p>
      </div>
      <div className="flex flex-col gap-7 w-full ">
        <div className="bg-[#0E0E10] text-[#A6A6A6] flex py-3 rounded-full items-center justify-between px-5">
          <input type="text" placeholder="Email" className="w-full" />
          <i>
            <MdOutlineMail size={28} />
          </i>
        </div>

        <div className="flex flex-col gap-2 items-end w-full">
          <div className="bg-[#0E0E10] w-full text-[#A6A6A6] flex py-3 rounded-full items-center justify-between px-5">
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
          <a className="text-white underline" href="/recover-password">
            Esqueceu sua senha?
          </a>
        </div>
      </div>
      <div className="w-full items-center flex flex-col gap-4">
        <button className="bg-[linear-gradient(90deg,#139C73,#136D52)] w-full py-3 rounded-full text-white font-bold">
          ENTRAR
        </button>
        <div>
          <p className="text-white">
            Não tem uma conta?{" "}
            <a className="text-[#139C73] underline" href="/register">
              Cadastrar-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
