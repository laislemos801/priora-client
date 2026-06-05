import { loginUser } from "@/routes/user";
import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 

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
      toast.error(error.message);
    }
  }
}

  return (
    <div className="dark-circuit-wrapper flex w-full h-screen justify-between items-center">
      <div className="dark-circuit-background" />
      <div className="w-[60%] ml-4 hidden lg:block  h-[95%] transition-all">
        <img
          src="src\assets\er.png"
          alt="imagem-decorativa"
          className=" w-full h-full hidden lg:block "
        />
      </div>
      <div className="relative z-10 flex w-full lg:w-[35%] max-w-125 h-full flex-col items-center justify-center px-10 mx-auto gap-10">
        <div className="">
          <img src="src\assets\logoVertical.png" alt="logo" />
        </div>
        <div>
          <p className="text-[#D9D9D9]  sm:text-sm  md:text-2xl font-semibold mb-4">Login</p>
        </div>
        <div className="flex flex-col gap-7 w-full ">
          <div className="bg-[#0E0E10] w-full text-[#A6A6A6] flex py-2 rounded-full items-center justify-between px-5 border border-transparent focus-within:border-[#139C73] transition-all duration-200">
            <input
              type="text"
              placeholder="Email"
              className="w-full bg-transparent text-white outline-none border-none focus:outline-none focus:ring-0 focus:border-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i>
              <MdOutlineMail size={28} />
            </i>
          </div>

          <div className="flex flex-col gap-2 items-end w-full">
            <div className="bg-[#0E0E10] w-full text-[#A6A6A6] flex py-2 rounded-full items-center justify-between px-5 border border-transparent focus-within:border-[#139C73] transition-all duration-200">
            <input
              type={visibilityPassword ? "text" : "password"}
              placeholder="Senha"
              className="w-full bg-transparent text-white outline-none border-none focus:outline-none focus:ring-0 focus:border-none"
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
            <a className="text-white underline hover:text-[#139C73]" href="/recover">
              Esqueceu sua senha?
            </a>
          </div>
        </div>
        <div className="w-full items-center flex flex-col gap-4">
        <button
              onClick={handleLogin}
              className="
                bg-[linear-gradient(90deg,#139C73,#136D52)]
                w-full
                py-3
                rounded-full
                text-white
                font-bold
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-[0_0_20px_rgba(19,156,115,0.35)]
                hover:brightness-110
                active:scale-[0.98]
                cursor-pointer
              "
            >
              ENTRAR
            </button>
          <div>
            <p className="text-white">
              Não tem uma conta?{" "}
              <a className="text-[#139C73] underline hover:text-[#4ea38a]" href="/register">
                Cadastrar-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
