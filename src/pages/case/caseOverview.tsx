import {
  Trash2,
  RefreshCw,
  Users,
  Search,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

const API_URL = "http://127.0.0.1:8000";

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
  const [caseData, setCaseData] = useState<any>(null);
  const [contacts, setContacts] = useState<any[]>([]);

  async function fetchContacts() {
    if (!id) return;

    try {
      const response = await fetch(`${API_URL}/contacts/case/${id}`);
      const data = await response.json();
        setContacts(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchCase() {
      try {
        const response = await fetch(`${API_URL}/cases/${id}`);
        const data = await response.json();
        setCaseData(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (id) {
      fetchCase();
      fetchContacts();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="flex-1 p-4 md:p-6">
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
                  <span>Última atualização: há 2 horas</span>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <ActionButton
                  variant="danger"
                  icon={<Trash2 size={14} />}
                  className="w-full justify-center md:w-auto"
                >
                  Excluir
                </ActionButton>
              </div>
            </div>
          </header>

          <main className="grid gap-6 p-6 xl:grid-cols-[1fr_285px]">
            <section className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-[1fr_190px]">
                <InfoCard caseData={caseData} />

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
                <ProfileCard />
                <UncertaintyCard />
              </div>

              <Panel title="Histórico Recente">
                <ul className="space-y-3 text-sm text-white/65">
                  <HistoryItem>
                    <span className="text-white">Há 2 horas:</span> Nova evidência de DNA aumentou a probabilidade
                    de Elvin Bond em 15%.
                  </HistoryItem>

                  <HistoryItem>
                    <span className="text-white">Há 10 horas:</span> A inserção da evidência 'Digital no local'
                    elevou Elvin Bond para o topo do ranking (81,5%).
                  </HistoryItem>

                  <HistoryItem>
                    <span className="text-white">Há 17 horas:</span> A nova análise de álibi reduziu a
                    probabilidade de Louis Mason em 22%.
                  </HistoryItem>
                </ul>
              </Panel>

              <Panel title="Próximo Passo Sugerido">
                <p className="text-sm text-white/65">
                  "A incerteza ainda está em 14,1%. Tente validar o Depoimento
                  de Nicholas Roy para refinar o ranking."
                </p>
              </Panel>

              <div className="grid gap-4 lg:grid-cols-2">
                <ContactsCard
                casoId={id!}
                contacts={contacts}
                onRefresh={fetchContacts}
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
                <AccessCard />
              </div>
            </section>

            <aside className="hidden space-y-4 xl:block">
              <AccessCard />
              <ProfileCard />
              <UncertaintyCard />
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}