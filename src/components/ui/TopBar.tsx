import { FiBell, FiUser } from "react-icons/fi";
import { MdOutlineSupportAgent } from "react-icons/md";

export default function TopBar() {
  return (
    <header className="w-full h-16 bg-background flex items-center justify-between px-4 md:px-8">
      
        {/* LEFT */}
        <div className="flex items-center gap-3">
            {/* Logo */}
            <img src="../../../logo.webp" alt="Logo do sistema" className="h-8" />
        </div>

      {/* RIGHT */}
        <div className="flex items-center gap-3">
            
            {/* Ajuda */}
            <button className="p-2 bg-[#363636] rounded-full hover:bg-[#4a4a4a]">
                <MdOutlineSupportAgent size={20} />
            </button>

            {/* Notificação */}
            <button className="relative p-2 bg-[#363636] rounded-full hover:bg-[#4a4a4a]">
                <FiBell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </button>

            {/* Perfil */}
            <button className="p-2 bg-[#363636] rounded-full hover:bg-[#4a4a4a]">
                <FiUser size={20} />
            </button>

        </div>
    </header>
  );
}