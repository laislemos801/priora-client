export default function UpdatedPassword() {
  return (
    <div className="dark-circuit-wrapper flex w-full h-screen justify-between items-center">
    <div className="dark-circuit-background" />
        <div className="w-[60%] ml-4 lg:block hidden h-[95%] transition-all">
          <img
            src="..\src\assets\er.png"
            alt="imagem-decorativa"
            className=" w-full h-full lg:block hidden"
          />
        </div>
      <div className="relative z-10 flex w-full lg:w-[35%] max-w-125 h-full flex-col items-center justify-center px-10 mx-auto gap-10">
        <div className="">
          <img src="..\src\assets\logoHorizon.png" alt="logo" />
        </div>
        <div className="py-6">
          <img src="..\src\assets\folders.png" alt="logo" />
        </div>
        <div className="w-full flex flex-col items-center">
          <p className="text-[#D9D9D9] text-[24px] font-semibold mb-4 w-[60%] text-center">
          Senha redefinida com <span className="text-[#139C73]">sucesso</span>!
          </p>
        
        </div>
      
        <div className="w-full items-center flex flex-col gap-4">
          <button onClick={()=> window.location.href = "/login"}   className="
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
            VOLTAR PARA O LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
