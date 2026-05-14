import {
  Trash2,
  RefreshCw,
  Edit,
  Users,
  Search,
  HelpCircle,
  MapPin,
} from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
};

const contacts = [
  { name: "Eric Mason", role: "Delegado", phone: "(19) 99032-7454" },
  { name: "Laura Goes", role: "Perita Criminal", phone: "(19) 99032-7454" },
];

const accessUsers = [
  { name: "Lucas Goes", role: "Editor", status: "Ativo" },
  { name: "Sarika Jain", role: "Leitor", status: "Pendente" },
  { name: "Rose Hines", role: "Editor", status: "Ativo" },
  { name: "Aryan Roy", role: "Leitor", status: "Ativo" },
  { name: "Rhea Rull", role: "Leitor", status: "Pendente" },
];

export default function CaseOverview() {
  return (
    <div className="min-h-screen bg-[#242424]">
      <div className="flex-1 p-4 md:p-6">
        <div className="overflow-hidden rounded-xl border border-[#575757] bg-[#242424]">
          <header className="border-b border-[#575757] px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400">
                    {icons.dashboard}
                  </span>

                  <h1 className="text-lg font-semibold text-slate-100">
                    Painel do Caso
                  </h1>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 md:text-sm md:text-slate-300">
                  <RefreshCw size={14} />
                  <span>Última atualização: há 2 horas</span>
                </div>
              </div>

              <div className="w-full md:w-auto">
                <ActionButton
                  variant="danger"
                  icon={<Trash2 size={14} />}
                  className="w-full md:w-auto justify-center"
                >
                  Excluir
                </ActionButton>
              </div>
            </div>
          </header>

          <main className="grid gap-6 p-6 xl:grid-cols-[1fr_285px]">
           <section className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_190px]">
              <InfoCard />

              <div className="grid gap-4">
                <MetricCard
                  title="Total de suspeitos:"
                  value="8"
                  icon={<Users size={34} />}
                />

                <MetricCard
                  title="Total de evidências:"
                  value="38"
                  icon={<Search size={34} />}
                />
              </div>
            </div>

            {/* mobile e tablet */}
            <div className="grid gap-6 xl:hidden md:grid-cols-[1fr_280px]">
              <ProfileCard />
              <UncertaintyCard />
            </div>

            <Panel title="Histórico Recente">
              <ul className="space-y-3 text-sm text-slate-300">
                <HistoryItem>
                  Há 2 horas: Nova evidência de DNA aumentou a probabilidade
                  de Elvin Bond em 15%.
                </HistoryItem>
                <HistoryItem>
                  Há 10 horas: A inserção da evidência 'Digital no local'
                  elevou Elvin Bond para o topo do ranking (81,5%).
                </HistoryItem>
                <HistoryItem>
                  Há 17 horas: A nova análise de álibi reduziu a
                  probabilidade de Louis Mason em 22%.
                </HistoryItem>
              </ul>
            </Panel>

            <Panel title="Próximo Passo Sugerido">
              <p className="text-sm text-slate-300">
                  "A incerteza ainda está em 14,1%. Tente validar o Depoimento
                  de Nicholas Roy para refinar o ranking."
              </p>
            </Panel>

            <div className="grid gap-4 lg:grid-cols-2">
              <ContactsCard />
              <MapCard />
            </div>

            {/* aparece só no mobile/tablet, no final */}
            <div className="xl:hidden">
              <AccessCard />
            </div>
          </section>

          {/* aparece só no desktop */}
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

function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#3d3d3d] bg-[#252525]">
      <div className="flex items-center justify-between border-b border-[#3d3d3d] px-5 py-3">
        <h2 className="font-semibold text-slate-100">{title}</h2>
        {action}
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function InfoCard() {
  return (
    <Panel
      title="Informações Gerais"
      action={
        <button className="flex items-center gap-2 rounded-md bg-[#2f2f2f] px-3 py-1.5 text-xs text-slate-200 hover:bg-[#3a3a3a]">
          <Edit size={14} />
          Editar
        </button>
      }
    >
      <div className="space-y-3 text-sm text-slate-300">
        <InfoRow label="Nome:" value="Caso Alpha" />
        <InfoRow label="Descrição:" value="Furto em supermercado." />
        <InfoRow label="Status:" value="Ativo" highlight />
        <InfoRow label="Prioridade:" value="Média" warning />
        <InfoRow label="Investigador Responsável:" value="Carlos Mendonça" />
        <InfoRow
          label="Local:"
          value="Rua Major Roberto Scatolin, 512, Campinas, São Paulo"
        />
        <InfoRow label="Data:" value="24 de maio de 2025" />
      </div>
    </Panel>
  );
}

function InfoRow({
  label,
  value,
  highlight,
  warning,
  strong,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warning?: boolean;
  strong?: boolean;
}) {
  return (
    <p>
      <span className="text-slate-400">{label} </span>
      <span
        className={
          highlight
            ? "font-medium text-emerald-400"
            : warning
              ? "font-medium text-yellow-300"
              : strong
                ? "font-semibold text-slate-100"
                : "text-slate-100"
        }
      >
        {value}
      </span>
    </p>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[112px] justify-between rounded-lg border border-[#3d3d3d] bg-[#252525] p-4">
      <div className="flex flex-col justify-between">
        <p className="text-xs font-semibold text-slate-200">
          {title}
        </p>

        <p className="text-4xl font-light leading-none text-white">
          {value}
        </p>
      </div>

      <div className="flex items-end text-emerald-900">
        {icon}
      </div>
    </div>
  );
}

function HistoryItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
      <span>{children}</span>
    </li>
  );
}

function ContactsCard() {
  return (
    <Panel
      title="Lista Rápida de Contatos"
      action={
        <button className="flex items-center gap-2 rounded-md bg-[#2f2f2f] px-3 py-1.5 text-xs text-slate-200">
          <Edit size={14} />
          Editar
        </button>
      }
    >
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="text-slate-400">
          <tr>
            <th className="pb-3 font-normal">Nome</th>
            <th className="pb-3 font-normal">Cargo</th>
            <th className="pb-3 font-normal">Celular</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.name}>
              <td className="py-2">{contact.name}</td>
              <td className="py-2">{contact.role}</td>
              <td className="py-2">{contact.phone}</td>
              <td className="py-2 text-right">
                <button className="text-red-400/70 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <InputPlaceholder text="Nome" />
        <InputPlaceholder text="Cargo" />
        <InputPlaceholder text="Celular" />
      </div>

      <button className="mt-4 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500">
        Adicionar Contato
      </button>
    </Panel>
  );
}

function InputPlaceholder({ text }: { text: string }) {
  return (
    <div className="rounded-full border border-[#4a4a4a] px-3 py-1 text-xs text-slate-500">
      {text}
    </div>
  );
}

function MapCard() {
  return (
    <Panel title="Localização Geográfica">
      <div className="flex h-[195px] items-center justify-center overflow-hidden rounded-md bg-[#303030] text-slate-400">
        <div className="flex flex-col items-center gap-2">
          <MapPin size={34} className="text-red-500" />
          <span className="text-sm">Mapa do endereço do caso</span>
        </div>
      </div>
    </Panel>
  );
}

function AccessCard() {
  return (
    <Panel
      title="Gerenciar Acesso"
      action={
        <button className="flex items-center gap-1 rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white">
          Adicionar
        </button>
      }
    >
      <div className="space-y-4">
        {accessUsers.map((user) => (
          <div key={user.name} className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-500" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-slate-100">{user.name}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>

            {user.status === "Pendente" && (
              <span className="rounded-full bg-[#303030] px-2 py-1 text-[10px] text-slate-400">
                Pendente
              </span>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function ProfileCard() {
  return (
    <Panel
      title="Perfil do criminoso:"
      action={
        <button className="text-slate-400">
          <Edit size={16} />
        </button>
      }
    >
      <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed border-[#444] text-xs text-slate-400">
        Radar chart do perfil
      </div>
    </Panel>
  );
}

function UncertaintyCard() {
  return (
    <section className="rounded-lg border border-[#3d3d3d] bg-[#252525] p-5">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-slate-100">
          Nível de incerteza: 14,1%
        </h2>
        <HelpCircle size={18} className="text-slate-500" />
      </div>

      <div className="flex h-[200px] items-end justify-center rounded-md border border-dashed border-[#444] pb-6 text-xs text-slate-400">
        Gauge de incerteza
      </div>
    </section>
  );
}