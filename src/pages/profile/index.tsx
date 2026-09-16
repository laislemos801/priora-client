import TopBar from "@/components/ui/TopBar";
import { IoIosArrowBack } from "react-icons/io";
import { FiCamera } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import backImageProfile from "@/assets/backImageProfile.png";
import profileImage from "@/assets/profile.png";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1D1D1D] text-white flex flex-col">
      <TopBar />

      <main className="flex-1 flex flex-col p-[1.5vw]">
        {/* Voltar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-[0.3vw] self-start mb-[1vw] text-[0.8vw] hover:text-gray-300"
        >
          <IoIosArrowBack className="text-[1vw]" />
          Voltar
        </button>

        {/* Container */}
        <section className="flex-1 flex flex-col border border-[#575757] rounded-md overflow-hidden">
          {/* Título */}
          <header className="border-b border-[#575757] px-[1.2vw] py-[0.8vw]">
            <p className="text-[1.1vw] font-light">Minha Conta</p>
          </header>

          {/* Área da conta */}
          <div className="relative flex-1 flex flex-col">
            {/* Background */}
            <div className="absolute inset-x-0 top-0 h-[20%] border-b border-[#575757] overflow-hidden">
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
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt="Foto de perfil"
                      className="
                        w-full h-full
                      "
                    />

                    <button
                      type="button"
                      className="
                        absolute
                        bottom-0
                        right-0
                        w-[1.7vw]
                        h-[1.7vw]
                        min-w-[24px]
                        min-h-[24px]
                        rounded-full
                        bg-[#159C7C]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FiCamera className="text-[0.8vw] min-w-[12px]" />
                    </button>
                  </div>

                  <p className="mt-[0.6vw] text-[0.8vw] font-medium">
                    Carlos Mendonça
                  </p>

                  <p className="text-[0.5vw] text-gray-400">
                    Investigador Criminal ◉
                  </p>
                </div>

                {/* Informações */}
                <div className="border-t border-[#575757] px-[0.8vw] py-[0.8vw] flex justify-between text-[0.7vw]">
                  <span>ID do perfil:</span>
                  <span>#82742</span>
                </div>

                <div className="border-t border-[#575757] px-[0.8vw] py-[0.8vw] flex justify-between text-[0.7vw]">
                  <span>Casos Ativos:</span>
                  <span className="text-[#29B893]">10</span>
                </div>

                <div className="border-t border-[#575757] px-[0.8vw] py-[0.8vw] flex justify-between text-[0.7vw]">
                  <span>Casos Concluídos:</span>
                  <span className="text-[#E8CF75]">31</span>
                </div>

                <div className="border-t border-[#575757] px-[0.8vw] py-[0.8vw] flex justify-between text-[0.7vw]">
                  <span>Total de Casos:</span>
                  <span className="text-[#E8B768]">45</span>
                </div>
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
                          defaultValue="Carlos"
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
                          defaultValue="Mendonça"
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
                        type="email"
                        defaultValue="carlosmendonca@gmail.com"
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

                    <button
                      type="button"
                      className="
                        mt-[0.8vw]
                        px-[2vw]
                        py-[0.35vw]
                        rounded-md
                        bg-[#159C7C]
                        text-[0.65vw]
                        hover:bg-[#22B391]
                      "
                    >
                      Atualizar
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
                          type="password"
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
                          Senha Nova
                        </label>

                        <input
                          type="password"
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
                      className="
                        mt-[0.8vw]
                        px-[2vw]
                        py-[0.35vw]
                        rounded-md
                        bg-[#159C7C]
                        text-[0.65vw]
                        hover:bg-[#22B391]
                      "
                    >
                      Alterar
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
