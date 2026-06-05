import { useEffect, useState } from "react";
import { Edit, Trash2, X } from "lucide-react";

import Panel from "./Panel";
import SecondaryButton from "../ui/SecondaryButton";
import toast from "react-hot-toast";

const API_URL = "http://127.0.0.1:8000";

type AccessUser = {
  usuario: {
    id: string;
    primeiroNome: string;
    sobrenome: string;
    email: string;
  };
  papel: "Editor" | "Leitor";
  status: "Ativo" | "Pendente";
  tipo: "Responsavel" | "Colaborador";
};

type Props = {
  casoId: string;
};

export default function AccessCard({ casoId }: Props) {
  const [users, setUsers] = useState<AccessUser[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [papel, setPapel] = useState<"Editor" | "Leitor">("Leitor");
  const [roleOpen, setRoleOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editPapel, setEditPapel] = useState<"Editor" | "Leitor">("Leitor");

  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [editRoleOpen, setEditRoleOpen] = useState(false);

  async function fetchUsers() {
    try {
      const response = await fetch(
        `${API_URL}/access/case/${casoId}`
      );

      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [casoId]);

  function openEditModal(user: AccessUser) {
  setSelectedUserId(user.usuario.id);
  setEditPapel(user.papel);
  setEditModalOpen(true);
}

  async function handleUpdateAccess() {
    if (!selectedUserId) return;

    await fetch(`${API_URL}/access/case/${casoId}/user/${selectedUserId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ papel: editPapel }),
    });

    setEditModalOpen(false);
    setSelectedUserId(null);
    fetchUsers();
  }

  async function handleDeleteAccess(userId: string) {
    const confirmed = confirm("Deseja remover este acesso?");
    if (!confirmed) return;

    await fetch(`${API_URL}/access/case/${casoId}/user/${userId}`, {
      method: "DELETE",
    });

    fetchUsers();
  }

  function addEmail() {
    const value = emailInput.trim().toLowerCase();
    if (!value) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      toast.error("Informe um email válido.");
      return;
    }

    if (emails.includes(value)) {
      toast.error("Este email já foi adicionado.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (currentUser?.email === value) {
      toast.error("Você não pode convidar a si mesmo.");
      return;
    }

    setEmails((prev) => [...prev, value]);
    setEmailInput("");
  }

  function removeEmail(email: string) {
    setEmails((prev) => prev.filter((item) => item !== email));
  }

  async function handleInvite() {
    if (emails.length === 0) {
      toast.error("Adicione pelo menos um colaborador.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      for (const email of emails) {
        const response = await fetch(`${API_URL}/access/invite`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            casoId,
            papel,
            userId: currentUser.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`Usuário não encontrado ou convite inválido: ${email}`);
        }
      }

      setEmails([]);
      setEmailInput("");
      setPapel("Leitor");
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar convite. Verifique se o usuário existe.");
    }
  }

  return (
    <>
      <Panel
        title="Gerenciar Acesso"
        className="bg-[#2B2B2B]"
        action={
          <SecondaryButton
            onClick={() => setModalOpen(true)}
          >
            Adicionar
          </SecondaryButton>
        }
      >
        <div className="
          max-h-[300px]
          xl:h-[248px]
          space-y-4
          overflow-y-auto
          pr-1
          scrollbar-thin
          scrollbar-thumb-[#139C73]
          scrollbar-track-transparent
        ">
          {users.length === 0 && (
            <p className="text-sm text-white/65">
              Nenhum usuário com acesso.
            </p>
          )}

          {users.map((user) => (
            <div
              key={user.usuario.id}
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3A3A3A] text-xs font-semibold text-white">
                {user.usuario.primeiroNome[0]}
                {user.usuario.sobrenome[0]}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">
                  {user.usuario.primeiroNome}{" "}
                  {user.usuario.sobrenome}
                </p>

                <div className="flex items-center gap-2">
                  <p className="text-xs text-white/65">
                    {user.papel}
                  </p>
                </div>
              </div>

              {user.tipo === "Responsavel" ? (
                <span className="rounded-full bg-[#139C73]/15 px-3 py-1.5 text-[10px] text-[#139C73]">
                  Responsável
                </span>
              ) : user.status === "Ativo" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="rounded-full bg-[#3A3A3A] p-2 text-white/65 hover:text-white"
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    onClick={() => handleDeleteAccess(user.usuario.id)}
                    className="rounded-full bg-[#3A3A3A] p-2 text-red-400/70 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <span className="rounded-full bg-[#282828] px-3 py-1.5 text-[10px] text-white">
                  Pendente
                </span>
              )}
            </div>
          ))}
        </div>
      </Panel>

      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#4a4a4a] bg-[#242424] p-5 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/80">
                Adicionar Colaborador
              </h2>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-white/65 hover:bg-slate-500/10 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex justify-between pt-4 gap-1 border-t border-[#3a3a3a]"></div>
            <div className="space-y-4">
              <label className="text-sm text-white/76 font-normal px-1">
                Email do colaborador
              </label>

              <div className="flex gap-2 mt-2">
                <div className="min-h-[96px] flex-1 rounded-lg border border-[#434343] bg-[#282828] p-3">
                  <div className="flex flex-wrap gap-2">
                    {emails.map((email) => (
                      <div
                        key={email}
                        className="flex items-center gap-2 rounded-full border border-[#4a4a4a] bg-[#242424] px-3 py-1.5 text-sm font-medium text-white"
                      >
                        <span>{email}</span>

                        <button
                          onClick={() => removeEmail(email)}
                          className="text-[#FF6055] hover:text-red-400"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}

                    <input
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEmail();
                        }
                      }}
                      placeholder="Digite o email e pressione Enter"
                      className="min-w-[220px] flex-1 bg-transparent text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6]"
                    />
                  </div>
                </div>

                <div className="relative w-[155px]">
                  <div className="w-[155px]">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setRoleOpen((prev) => !prev)}
                        className="flex h-[40px] w-full items-center justify-between rounded-full border border-[#434343] bg-[#282828] px-5 text-sm text-white outline-none"
                      >
                        <span>{papel}</span>

                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      {roleOpen && (
                        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#434343] bg-[#242424] shadow-xl">
                          {["Leitor", "Editor"].map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => {
                                setPapel(role as "Editor" | "Leitor");
                                setRoleOpen(false);
                              }}
                              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                                papel === role
                                  ? "bg-[#139C73]/15 text-[#139C73]"
                                  : "text-white hover:bg-[#303030]"
                              }`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-3 gap-3 border-t border-[#3a3a3a] mt-4">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEmails([]);
                  setEmailInput("");
                  setRoleOpen(false);
                }}
                className="text-[#00a87e] w-full bg-[#136D52]/26 text-sm px-4 py-2 rounded-md hover:bg-[#136D52]/40 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleInvite}
                className="bg-[#139C73] w-full text-white hover:bg-[#139C73]/80 transition text-sm px-4 py-2 rounded-md"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#4a4a4a] bg-[#242424] p-5 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/80">
                Editar Acesso
              </h2>

              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-full p-1 text-white/65 hover:bg-slate-500/10 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-0">
              <div className="border-t border-[#3a3a3a]" />
            </div>

            <div className="space-y-4 py-5">
              <label className="block px-1 text-sm font-normal text-white/76">
                Papel do usuário
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setEditRoleOpen((prev) => !prev)}
                  className="flex h-[42px] w-full items-center justify-between rounded-lg border border-[#434343] bg-[#282828] px-3 text-sm text-[#A6A6A6]"
                >
                  <span>{editPapel}</span>

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {editRoleOpen && (
                  <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-[#434343] bg-[#242424] shadow-xl">
                    {["Leitor", "Editor"].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setEditPapel(role as "Editor" | "Leitor");
                          setEditRoleOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          editPapel === role
                            ? "bg-[#139C73]/15 text-[#139C73]"
                            : "text-white hover:bg-[#303030]"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-0">
              <div className="border-t border-[#3a3a3a]" />
            </div>

            <div className="mt-4 flex justify-between gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="w-full rounded-md bg-[#136D52]/26 px-4 py-2 text-sm text-[#00a87e] transition hover:bg-[#136D52]/40"
              >
                Cancelar
              </button>

              <button
                onClick={handleUpdateAccess}
                className="w-full rounded-md bg-[#139C73] px-4 py-2 text-sm text-white transition hover:bg-[#139C73]/80"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}