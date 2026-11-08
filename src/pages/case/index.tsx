import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import EmptyState, { PAGE_CARD_FILL } from "@/components/ui/EmptyState";
import { useCaseRole } from "@/hooks/useCaseRole";

export default function CasePanel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, loading } = useCaseRole(id);

  // Sem acesso ao caso (ou convite ainda pendente): não renderiza as telas, que
  // dependem de dados que a API recusa (403).
  if (!loading && role === null) {
    return (
      <div className="min-h-full bg-[#242424] px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <div className={`rounded-xl border border-[#575757] bg-[#242424] ${PAGE_CARD_FILL}`}>
          <EmptyState
            icon={<Lock />}
            title="Você não tem acesso a este caso"
            description="O caso não existe ou você ainda não foi convidado. Se recebeu um convite, aceite-o pelas notificações."
            action={{ label: "Voltar para Meus casos", onClick: () => navigate("/mycases") }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#242424] print:h-auto print:bg-white">
      <Outlet />
    </div>
  );
}
