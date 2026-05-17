import { HelpCircle } from "lucide-react";

export default function UncertaintyCard() {
  return (
    <section className="rounded-lg border border-[#3d3d3d] bg-[#2B2B2B] p-5">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-medium text-white">
          Nível de incerteza: 14,1%
        </h2>

        <HelpCircle size={18} className="text-white/65 hover:bg-slate-500/10 hover:text-white" />
      </div>

      <div className="flex h-[200px] items-end justify-center rounded-md border border-dashed border-[#444] pb-6 text-xs text-white">
        Gauge de incerteza
      </div>
    </section>
  );
}