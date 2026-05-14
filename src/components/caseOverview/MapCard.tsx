import { MapPin } from "lucide-react";
import Panel from "./Panel";

export default function MapCard() {
  return (
    <Panel title="Localização Geográfica">
      <div className="flex h-[195px] items-center justify-center overflow-hidden rounded-md bg-[#303030] text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <MapPin size={34} className="text-red-500" />
          <span className="text-sm">Mapa do endereço do caso</span>
        </div>
      </div>
    </Panel>
  );
}