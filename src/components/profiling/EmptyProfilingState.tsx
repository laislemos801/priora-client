import { ScanFace } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

type Props = {
  onGoToRanking: () => void;
};

export default function EmptyProfilingState({ onGoToRanking }: Props) {
  return (
    <EmptyState
      icon={<ScanFace />}
      title="Nenhum suspeito cadastrado"
      description="O perfilamento criminal é gerado a partir dos suspeitos do caso. Cadastre um suspeito no ranking para começar."
      action={{ label: "Ir para Ranking de suspeitos", onClick: onGoToRanking }}
    />
  );
}
