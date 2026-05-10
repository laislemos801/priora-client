import { loginUser } from "@/routes/user";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [visibilityPassword, setVisibilityPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("")
  const navigate = useNavigate();

  async function handleLogin() {
  try {
    const data = await loginUser({
      email,
      senha,
    });

    localStorage.setItem(
      "token",
      data.token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    navigate("/mycases");

  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
}

  return (
    <div
      className="flex w-full h-screen bg-no-repeat bg-center bg-cover justify-between items-center "
      style={{ backgroundImage: "url(src/assets/backgroundDesktop.png)" }}
    >
      <div className="w-[60%] ml-4 hidden lg:block  h-[95%] transition-all">
        <img
          src="src\assets\er.png"
          alt="imagem-decorativa"
          className=" w-full h-full hidden lg:block "
        />
      </div>
      <div className="flex w-full lg:w-[25%] h-full flex-col items-center px-10 lg:px-0 pt-13 lg:pt-0 justify-start lg:justify-center gap-10 lg:mr-20">
        <div className="">
          <img src="src\assets\logoVertical.png" alt="logo" />
        </div>
        <div>
          <p className="text-[#D9D9D9] text-[20px] font-semibold mb-4">Login</p>
        </div>
        <div className="flex flex-col gap-7 w-full ">
          <div className="bg-[#0E0E10] text-[#A6A6A6] flex py-3 rounded-full items-center justify-between px-5">
           <input
              type="text"
              placeholder="Email"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
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
            <a className="text-white underline" href="/recover">
              Esqueceu sua senha?
            </a>
          </div>
        </div>
        <div className="w-full items-center flex flex-col gap-4">
        <button
              onClick={handleLogin}
              className="bg-[linear-gradient(90deg,#139C73,#136D52)] w-full py-3 rounded-full text-white font-bold"
            >
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
    </div>
  );
}
