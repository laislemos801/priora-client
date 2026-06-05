import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 

export default function Recover() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  async function handleRecover() {
    try {
      const response = await fetch("http://127.0.0.1:8000/users/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (!response.ok) {
        toast.error("Erro ao enviar email");
        return;
      }

      navigate("/recover/email-send");
    } catch (error) {
      console.log(error);

      toast.error("Erro ao conectar");
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
      <div className="relative z-10 flex w-full lg:w-[35%] max-w-125 h-full flex-col items-center justify-center px-6 mx-auto gap-10">
        <div className="">
          <img src="src\assets\logoHorizon.png" alt="logo" />
        </div>
        <div className="">
          <img src="src\assets\logoPadlock.png" alt="logo" />
        </div>
        <div className="w-full flex flex-col items-center">
          <p className="text-[#D9D9D9] text-[20px] font-semibold mb-4">
            Redefinição de senha
          </p>
          <p className="text-[#D9D9D9] max-w-75 text-center text-[14px]">
            Digite seu e-mail para redefinir a senha.
          </p>
        </div>
        <div className="flex flex-col gap-6 w-full ">
            <div className="bg-[#0E0E10] w-full text-[#A6A6A6] flex py-2 rounded-full items-center justify-between px-5 border border-transparent focus-within:border-[#139C73] transition-all duration-200">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent text-white outline-none border-none focus:outline-none focus:ring-0 focus:border-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i>
              <MdOutlineMail size={28} />
            </i>
          </div>
        </div>
        <div className="w-full items-center flex flex-col gap-4">
          <button
            onClick={handleRecover}
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
              "          >
            RECUPERAR SENHA
          </button>
        </div>
      </div>
    </div>
  );
}
