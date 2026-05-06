import { MdOutlineMail } from "react-icons/md";

export default function Recover() {
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
      <div className="flex w-full lg:w-[25%] h-full flex-col items-center px-10 justify-center gap-10 lg:mr-20">
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
        <p className="text-[#D9D9D9] w-[50%] text-center text-[14px]">
          Digite seu e-mail para redefinir a senha.
        </p>
      </div>
      <div className="flex flex-col gap-6 w-full ">
        <div className="bg-[#0E0E10] text-[#A6A6A6] flex py-3 rounded-full items-center justify-between px-5">
          <input type="text" placeholder="Email" className="w-full" />
          <i>
            <MdOutlineMail size={28} />
          </i>
        </div>
      </div>
      <div className="w-full items-center flex flex-col gap-4">
        <button className="bg-[linear-gradient(90deg,#139C73,#136D52)] w-full py-3 rounded-full text-white font-bold">
          RECUPERAR SENHA
        </button>
      </div>
    </div>
    </div>
  );
}
