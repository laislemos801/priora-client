import Panel from "./Panel";
import SecondaryButton from "../ui/SecondaryButton";

const accessUsers = [
  { name: "Lucas Goes", role: "Editor", status: "Ativo" },
  { name: "Sarika Jain", role: "Leitor", status: "Pendente" },
  { name: "Rose Hines", role: "Editor", status: "Ativo" },
  { name: "Aryan Roy", role: "Leitor", status: "Ativo" },
  { name: "Rhea Rull", role: "Leitor", status: "Pendente" },
];

export default function AccessCard() {
  return (
    <Panel
      title="Gerenciar Acesso"
      className="bg-[#2B2B2B] font-medium text-white"
      action={
        <SecondaryButton>
          Adicionar
        </SecondaryButton>
      }
    >
      <div className="space-y-4">
        {accessUsers.map((user) => (
          <div key={user.name} className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/65" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-white">{user.name}</p>
              <p className="text-xs text-white/65">{user.role}</p>
            </div>

            {user.status === "Pendente" && (
              <span className="rounded-full bg-[#282828] px-2 py-1 text-[10px] text-white/76">
                Pendente
              </span>
            )}
          </div>
        ))}
      </div>
    </Panel>
  );
}