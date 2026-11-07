import { ShieldPlus } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

type Props = {
  onCreate?: () => void;
};

export default function EmptySuspectState({ onCreate }: Props) {
  return (
    <EmptyState
      icon={<ShieldPlus />}
      title="Adicione um novo suspeito"
      description="E comece a priorizar suas investigações."
      action={onCreate ? { label: "Adicionar Suspeito", onClick: onCreate } : undefined}
    />
  );
}
