export default function UpdatedPassword() {
  return (
    <div
      className="flex w-full h-screen flex-col items-center px-10 pt-25 justify-start gap-5"
      style={{
        backgroundImage: "url(../src/assets/backgound.png)",
        backgroundSize: "100% 100%",
      }}
    >
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
        <button onClick={()=> window.location.href = "/login"} className="bg-[linear-gradient(90deg,#139C73,#136D52)] w-full py-3 rounded-full text-white font-bold">
          VOLTAR PARA O LOGIN
        </button>
      </div>
    </div>
  );
}
