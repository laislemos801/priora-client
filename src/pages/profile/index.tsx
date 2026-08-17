import TopBar from "@/components/ui/TopBar";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#1D1D1D] min-h-screen text-white flex flex-col">
      <TopBar />

      <div className="flex-1 p-4 md:p-6 h-screen">
        <button
          className="px-6 p-2 flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack />
          Voltar
        </button>
        <div className="px-6 mt-6 h-full">
          <div className="border-2 p-5 px-7 rounded-t-md border-[#575757] ">
            <p className="text-[24px] font-thin">Minha Conta</p>
          </div>

          <div className="border-2  h-full rounded-b-md border-t-0 border-[#575757] relative flex flex-col">
            <img
              src="src\assets\backImageProfile.png"
              alt=""
              className="w-full flex border-b-2 border-[#575757]"
            />
            <div className="h-140" />

             <div className="flex justify-center items-center fixed top-[50%] right-[50%]">dwdw</div>
          </div>
        </div>
      </div>
    </div>
  );
}
