import { MdOutlineMail } from "react-icons/md";

export default function Recover() {
  return (
    <div
      className="flex w-full h-screen flex-col items-center px-10 pt-25 justify-start gap-10"
      style={{
        backgroundImage: "url(src/assets/backgound.png)",
        backgroundSize: "100% 100%",
      }}
    >
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
  );
}
