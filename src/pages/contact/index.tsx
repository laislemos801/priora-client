import TopBar from "@/components/ui/TopBar";
import { Help } from "../case/help";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1D1D1D] min-h-screen text-white flex flex-col">
      <TopBar />
      <Help onBack={() => navigate(-1)} />
    </div>
  );
}
