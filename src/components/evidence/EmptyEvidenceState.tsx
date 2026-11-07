import { MdOutlineAddModerator } from "react-icons/md";
import EmptyState from "@/components/ui/EmptyState";

interface EmptyEvidenceStateProps {
  /** Chamado ao clicar em "Adicionar Evidências" (sem ele, o botão não aparece). */
  onAdd?: () => void;
}

export default function EmptyEvidenceState({ onAdd }: EmptyEvidenceStateProps) {
  return (
    <EmptyState
      icon={<MdOutlineAddModerator />}
      title="Adicione uma nova evidência"
      description="E comece a investigar seus casos."
      action={onAdd ? { label: "Adicionar Evidências", onClick: onAdd } : undefined}
    />
  );
}
