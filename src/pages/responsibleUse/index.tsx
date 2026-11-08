import { useNavigate } from "react-router-dom";
import { ResponsibleUse } from "../case/responsibleUse";

/** Uso responsável e limitações: página geral (o "voltar" fica na TopBar do layout). */
export default function ResponsibleUsePage() {
  const navigate = useNavigate();
  return <ResponsibleUse onContact={() => navigate("/contact")} />;
}
