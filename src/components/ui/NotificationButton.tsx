import { useState } from "react";
import { FiBell } from "react-icons/fi";

export default function NotificationButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">

      {/* BOTÃO */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 bg-[#363636] rounded-full hover:bg-[#4a4a4a]"
      >
        <FiBell size={16} className="md:hidden" />
        <FiBell size={20} className="hidden md:block" />

        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute right-0 mt-1 w-80 bg-[#2A2A2A] border border-[#3a3a3a] rounded-lg shadow-xl z-50">

          {/* HEADER */}
            <div className="p-3 border-b border-[#3a3a3a] text-white text-sm font-semibold flex items-center justify-between">
                <span>Notificações</span>
                <FiBell className="text-gray-400" />

            </div>

            {/* LISTA */}
            <div className="p-3 space-y-3 max-h-64 overflow-y-auto">

                {/* NOTIF 1 */}
                <div className="flex gap-2 items-start text-sm text-gray-300 hover:bg-[#3a3a3a] p-2 rounded-md cursor-pointer">
                
                    <span className="mt-1 h-2 w-2 rounded-full bg-green-400" />

                    <p>
                        O colaborador Lucas Goes aceitou seu convite e agora tem acesso de editor ao Caso Alpha.
                    </p>
                </div>

                {/* NOTIF 2 */}
                <div className="flex gap-2 items-start text-sm text-gray-300 hover:bg-[#3a3a3a] p-2 rounded-md cursor-pointer">
                
                    <span className="mt-1 h-2 w-2 rounded-full bg-yellow-400" />

                    <p>
                        O Caso Alpha atingiu 38 evidências. Sugerimos revisar o Quadro Investigativo para identificar novos nós de conexão.
                    </p>
                </div>

            </div>

            {/* FOOTER */}
            <div className="p-3 border-t border-[#3a3a3a]">
                <button className="w-full text-sm text-[#139C73] bg-[#136D52]/26 hover:bg-[#136D52]/50 py-2 rounded-md transition">
                Ver todas
                </button>
            </div>

        </div>
      )}
    </div>
  );
}