import { MdOutlineSupportAgent } from "react-icons/md";

export function Help() {
  return (
    <div className="flex flex-col h-full  px-6">
      <div className="flex  items-center gap-4 text-white w-full  p-5 px-12 border-2 border-[#575757] rounded-t-xl">
        <MdOutlineSupportAgent size={28} className="text-[#139C73]" />
        <p className="font-semibold text-[20px]">Contato</p>
      </div>
      <div className="flex flex-col gap-8 text-white w-full  p-7 px-12 border-2 border-t-0 border-[#575757] rounded-b-xl">
        <p className="text-[20px]">
          Preencha o formulário de contato com pedidos, dúvidas, reclamações ou
          feedbacks.
        </p>
        <div className="text-[18px] flex gap-8 w-180 ">
          <div className="flex flex-col gap-3 w-full">
            <p>Primeiro Nome</p>
            <input
              type="text"
              placeholder="Nome"
              className="border p-2 px-5 rounded-md border-[#525252]"
            />
          </div>
          <div className="flex flex-col gap-3 w-full" >
            <p>Sobrenome</p>
            <input
              type="text"
              placeholder="Nome"
              className="border p-2 px-5 rounded-md border-[#525252]"
            />
          </div>
        </div>
         <div className="text-[18px] flex gap-8 w-180 ">
          <div className="flex flex-col gap-3 w-full">
            <p>Email</p>
            <input
              type="text"
              placeholder="Email"
              className="border p-2 px-5 rounded-md border-[#525252]"
            />
          </div>
        </div>
             <div className="text-[18px] flex gap-8 w-180 h-180">
          <div className="flex flex-col items-start gap-3 w-full">
            <p>Mensagem</p>
            <textarea
              placeholder="Email"
              className="border p-2 px-5 rounded-md w-full h-full border-[#525252]"
            />
            <button className="text-[16px] bg-linear-to-r from-[#139C73] to-[#136D52] p-1 px-6 rounded-md">Enviar Mensagem</button>
          </div>
        </div>
      </div>
    </div>
  );
}
