import { ShieldPlus } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function EmptyCasesState({ onCreate }: { onCreate: () => void }) {
  return (
    <EmptyState
      icon={<ShieldPlus />}
      title="Ainda não há casos cadastrados"
      description="Crie um caso para começar a investigar."
      action={{ label: "Criar Novo Caso", onClick: onCreate }}
      className="min-h-[55vh]"
    />
  );
}
