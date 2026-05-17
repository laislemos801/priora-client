import { Edit } from "lucide-react";
import Panel from "./Panel";
import InfoRow from "./InfoRow";

type InfoCardProps = {
  caseData: any;
  onEdit: () => void;
};

export default function InfoCard({ caseData, onEdit }: InfoCardProps) {
  const local = [
    caseData?.enderecoLogradouro,
    caseData?.enderecoNumero,
    caseData?.enderecoBairro,
    caseData?.enderecoCidade,
    caseData?.enderecoEstado,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Panel
      title="Informações Gerais"
      action={
        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-md bg-[#2f2f2f] px-3 py-1.5 text-xs text-white/65 hover:text-white"
        >
          <Edit size={14} />
          Editar
        </button>
      }
    >
      <div className="space-y-3 text-sm text-white/65">
        <InfoRow label="Nome:" value={caseData?.nome || "-"} />
        <InfoRow label="Descrição:" value={caseData?.descricao || "-"} />
        <InfoRow label="Status:" value={caseData?.status || "-"} highlight />
        <InfoRow label="Prioridade:" value={caseData?.prioridade || "-"} warning />

        <InfoRow
          label="Investigador Responsável:"
          value={
            caseData?.responsavel
              ? `${caseData.responsavel.primeiroNome} ${caseData.responsavel.sobrenome}`
              : "-"
          }
        />

        <InfoRow label="Local:" value={local || "-"} />

        <InfoRow
          label="Data:"
          value={
            caseData?.dataOcorrencia
              ? new Date(caseData.dataOcorrencia).toLocaleDateString("pt-BR")
              : "-"
          }
        />
      </div>
    </Panel>
  );
}