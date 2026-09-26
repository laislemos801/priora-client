import PrimaryButton from "@/components/ui/PrimaryButton";
import { ScanFace } from "lucide-react";

type Props = {
  onGoToRanking: () => void;
};

export default function EmptyProfilingState({
  onGoToRanking,
}: Props) {
  return (
    <div className="flex min-h-[600px] flex-col items-center justify-center text-center">
      <ScanFace
        size={120}
        className="text-white/10"
      />

      <h2 className="mt-6 text-4xl font-medium text-white/60">
        Nenhum suspeito cadastrado
      </h2>

      <p className="mt-2 max-w-xl text-lg text-white/35">
        O perfilamento criminal é gerado a partir dos suspeitos do caso.
        Cadastre um suspeito no ranking para começar.
      </p>

      <div className="mt-8">
        <PrimaryButton onClick={onGoToRanking}>
          Ir para Ranking de suspeitos
        </PrimaryButton>
      </div>
    </div>
  );
}
