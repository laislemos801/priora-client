import { Edit } from "lucide-react";
import Panel from "./Panel";
import RadarChart from "@/components/profiling/RadarChart";
import { PROFILE_AXES } from "@/components/profiling/types";
import type { ProfileValues } from "@/components/profiling/types";

type Props = {
  // Perfil estimado do autor (definido na tela de Perfilamento). null = ainda não definido.
  perfil: ProfileValues | null;
  // Abre a tela de Perfilamento para definir/alterar o perfil.
  onEdit?: () => void;
};

export default function ProfileCard({ perfil, onEdit }: Props) {
  return (
    <Panel
      title="Perfil estimado do autor:"
      className="bg-[#2B2B2B] font-medium text-white"
      action={
        onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            title="Abrir o Perfilamento Criminal"
            className="text-white/65 hover:bg-slate-500/10 hover:text-white"
          >
            <Edit size={16} />
          </button>
        ) : undefined
      }
    >
      {perfil ? (
        <RadarChart
          axes={PROFILE_AXES}
          series={[
            { id: "estimado", label: "Perfil estimado", color: "#6C7BF2", values: perfil },
          ]}
        />
      ) : (
        <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#444] px-4 text-center text-xs text-white/65">
          <p>Nenhum perfil estimado definido para este caso.</p>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-emerald-400 underline-offset-2 hover:underline"
            >
              Definir no Perfilamento Criminal
            </button>
          )}
        </div>
      )}
    </Panel>
  );
}
