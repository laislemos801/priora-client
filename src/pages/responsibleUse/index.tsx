import TopBar from "@/components/ui/TopBar";
import { ResponsibleUse } from "../case/responsibleUse";
import { useNavigate } from "react-router-dom";

export default function ResponsibleUsePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1D1D1D] min-h-screen text-white flex flex-col">
      <TopBar />
      <ResponsibleUse onBack={() => navigate(-1)} onContact={() => navigate("/contact")} />
    </div>
  );
}
