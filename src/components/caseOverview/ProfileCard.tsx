import { Edit } from "lucide-react";
import Panel from "./Panel";

export default function ProfileCard() {
  return (
    <Panel
      title="Perfil do criminoso:"
      className="bg-[#2B2B2B] font-medium text-white"
      action={
        <button className="text-white/65 hover:bg-slate-500/10 hover:text-white">
          <Edit size={16} />
        </button>
      }
    >
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed border-[#444] text-xs text-white">
        Radar chart do perfil
      </div>
    </Panel>
  );
}