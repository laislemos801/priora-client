import TopBar from "@/components/ui/TopBar";
import { Help } from "../case/help";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1D1D1D] min-h-screen text-white flex flex-col">
      <TopBar />

      <div className="flex-1 p-4 md:p-6">
        <button
          className="px-6 p-2 flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack />
          Voltar
        </button>
        <Help />
      </div>
    </div>
  );
}
