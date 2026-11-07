import {
  Trash2,
  RefreshCw,
  Users,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import ActionButton from "@/components/ui/ActionButton";
import InfoCard from "@/components/caseOverview/InfoCard";
import MetricCard from "@/components/caseOverview/MetricCard";
import Panel from "@/components/caseOverview/Panel";
import HistoryItem from "@/components/caseOverview/HistoryItem";
import ContactsCard from "@/components/caseOverview/ContactsCard";
import MapCard from "@/components/caseOverview/MapCard";
import AccessCard from "@/components/caseOverview/AccessCard";
import ProfileCard from "@/components/caseOverview/ProfileCard";
import UncertaintyCard from "@/components/caseOverview/UncertaintyCard";
import CreateCaseModal from "@/components/mycases/CreateCaseModal";
import CaseOverviewSkeleton from "@/components/caseOverview/CaseOverviewSkeleton";
import { apiFetch } from "@/lib/api";
import { useCaseRole } from "@/hooks/useCaseRole";
import { describe, timeAgo } from "@/lib/history";
import type { HistoryApiItem } from "@/lib/history";
import { getEstimatedProfile } from "@/services/profilingService";
import type { ProfileValues } from "@/components/profiling/types";
import type { InvestigativeAction } from "@/components/priority/types";

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
};

export default function CaseOverview() {
  const { id } = useParams();
  const { canEdit, isOwner } = useCaseRole(id);
  const [caseData, setCaseData] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [editCaseOpen, setEditCaseOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoryApiItem[]>([]);
  const [actions, setActions] = useState<InvestigativeAction[]>([]);
  const [profile, setProfile] = useState<ProfileValues | null>(null);

  const navigate = useNavigate();

  async function fetchHistory() {
    if (!id) return;
    try {
      const response = await apiFetch(`/history/cases/${id}`);
      if (!response.ok) return;
      const data = await response.json();
      setHistory(Array.isArray(data) ? data : (data?.items ?? []));
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchActions() {
    if (!id) return;
    try {
      const response = await apiFetch(`/priority-actions/case/${id}`);
      if (!response.ok) return;
      const data = await response.json();
      setActions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchProfile() {
    if (!id) return;
    try {
      const estimated = await getEstimatedProfile(id);
      setProfile(estimated.perfil);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchContacts() {
    if (!id) return;

    try {
      const response = await apiFetch(`/contacts/case/${id}`);
      const data = await response.json();
        setContacts(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchCase() {
    if (!id) return;

    try {
      const response = await apiFetch(`/cases/${id}`);
      const data = await response.json();

      setCaseData(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteCase() {
    if (!id) return;

    const confirmed = confirm(
      "Deseja excluir este caso permanentemente?"
    );

    if (!confirmed) return;

    try {
      const response = await apiFetch(
        `/cases/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir caso");
      }

      navigate("/mycases");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir caso.");
    }
  }

  useEffect(() => {
    if (!id) return;

    Promise.all([fetchCase(), fetchContacts(), fetchHistory(), fetchActions(), fetchProfile()]).finally(() => {
      setLoading(false);
    });
  }, [id]);

  if (loading) return <CaseOverviewSkeleton />;

  const goToProfiling = () => navigate(`/case/${id}/profiling`);

  // Ação sugerida com maior ganho de informação (a mesma lógica da tela de Priorização).
  const nextAction = actions
    .filter((a) => a.status === "Sugerida")
    .sort((a, b) => b.recompensa - a.recompensa)[0];

  const incertezaTexto =
    caseData?.incerteza != null ? `A incerteza do caso está em ${Number(caseData.incerteza).toFixed(1)}%. ` : "";

  const nextStepText = nextAction
    ? `${incertezaTexto}Ação com maior ganho de informação: ${nextAction.titulo} (ganho estimado de ${nextAction.recompensa.toFixed(1)}% da incerteza).`
    : (caseData?.totalSuspeitos ?? 0) === 0
      ? "Cadastre suspeitos e evidências para receber sugestões de próximos passos."
      : `${incertezaTexto}Nenhuma ação sugerida no momento.`;

  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="flex-1 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <div className="overflow-hidden rounded-xl border border-[#575757] bg-[#242424]">
          <header className="border-b border-[#575757] px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400">{icons.dashboard}</span>

                  <h1 className="text-lg font-semibold text-slate-100">
                    Painel do Caso
                  </h1>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/65 md:text-sm">
                  <RefreshCw size={14} />
                  <span>Última atualização: {history[0] ? timeAgo(history[0].createdAt) : "—"}</span>
                </div>
              </div>

              {isOwner && (
                <div className="w-full md:w-auto">
                  <ActionButton
                    onClick={handleDeleteCase}
                    variant="danger"
                    icon={<Trash2 size={14} />}
                    className="w-full justify-center md:w-auto"
                  >
                    Excluir
                  </ActionButton>
                </div>
              )}
            </div>
          </header>

          <main className="grid gap-6 p-6 xl:grid-cols-[1fr_285px]">
            <section className="flex flex-col gap-6">
              <div className="grid gap-4 lg:grid-cols-[1fr_190px]">
                <InfoCard
                  caseData={caseData}
                  onEdit={canEdit ? () => setEditCaseOpen(true) : undefined}
                />

                <div className="grid gap-4">
                  <MetricCard
                    title="Total de suspeitos:"
                    value={String(caseData?.totalSuspeitos ?? 0)}
                    icon={<Users size={34} />}
                  />

                  <MetricCard
                    title="Total de evidências:"
                    value={String(caseData?.totalEvidencias ?? 0)}
                    icon={<Search size={34} />}
                  />
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_280px] xl:hidden">
                <ProfileCard perfil={profile} onEdit={goToProfiling} />
                <UncertaintyCard incerteza={caseData?.incerteza ?? null} />
              </div>

              <Panel
                title="Histórico Recente"
                action={
                  <button
                    type="button"
                    onClick={() => navigate(`/case/${id}/history`)}
                    className="text-xs text-emerald-400 underline-offset-2 hover:underline"
                  >
                    Ver histórico completo
                  </button>
                }
              >
                {history.length === 0 ? (
                  <p className="text-sm text-white/65">Nenhuma atividade registrada ainda.</p>
                ) : (
                  <ul className="space-y-3 text-sm text-white/65">
                    {history.slice(0, 4).map((item) => {
                      const { action, text } = describe(item);
                      const user = item.user
                        ? `${item.user.primeiroNome} ${item.user.sobrenome}`.trim()
                        : "Usuário removido";

                      return (
                        <HistoryItem key={item.id}>
                          <span className="text-white">{timeAgo(item.createdAt)}:</span>{" "}
                          {user} {action}
                          {text ? ` — ${text}` : ""}.
                        </HistoryItem>
                      );
                    })}
                  </ul>
                )}
              </Panel>

              <Panel
                title="Próximo Passo Sugerido"
                action={
                  <button
                    type="button"
                    onClick={() => navigate(`/case/${id}/priority`)}
                    className="text-xs text-emerald-400 underline-offset-2 hover:underline"
                  >
                    Ver priorização de ações
                  </button>
                }
              >
                <p className="text-sm text-white/65">{nextStepText}</p>
              </Panel>

              <div className="grid flex-1 gap-4 lg:grid-cols-2">
                <ContactsCard
                casoId={id!}
                contacts={contacts}
                onRefresh={fetchContacts}
                canEdit={canEdit}
                />
                <MapCard
                  endereco={[
                    caseData?.enderecoLogradouro,
                    caseData?.enderecoNumero,
                    caseData?.enderecoBairro,
                    caseData?.enderecoCidade,
                    caseData?.enderecoEstado,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                />
              </div>

              <div className="xl:hidden">
                {id && <AccessCard casoId={id} canInvite={canEdit} isOwner={isOwner} />}
              </div>
            </section>

            <aside className="hidden flex-col gap-4 xl:flex">
              {id && <AccessCard casoId={id} canInvite={canEdit} isOwner={isOwner} />}
              <ProfileCard perfil={profile} onEdit={goToProfiling} />
              <UncertaintyCard incerteza={caseData?.incerteza ?? null} className="flex-1" />
            </aside>
          </main>
        </div>
      </div>

      {editCaseOpen && caseData && (
        <CreateCaseModal
          mode="edit"
          caseData={caseData}
          onClose={() => setEditCaseOpen(false)}
          onSuccess={fetchCase}
        />
      )}
    </div>
  );
}