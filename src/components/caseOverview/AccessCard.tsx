import { useEffect, useState } from "react";
import { Edit, Trash2, X } from "lucide-react";

import Panel from "./Panel";
import SecondaryButton from "../ui/SecondaryButton";
import PrimaryButton from "../ui/PrimaryButton";

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
};

type Props = {
  casoId: string;
};

export default function AccessCard({ casoId }: Props) {
  const [users, setUsers] = useState<AccessUser[]>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [papel, setPapel] = useState<"Editor" | "Leitor">("Leitor");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editPapel, setEditPapel] = useState<"Editor" | "Leitor">("Leitor");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);

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

  function validateFields() {
    if (!email.trim()) {
      alert("Informe um email.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Informe um email válido.");
      return false;
    }

    return true;
  }

  function addEmail() {
    const value = emailInput.trim().toLowerCase();
    if (!value) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      alert("Informe um email válido.");
      return;
    }

    if (emails.includes(value)) {
      alert("Este email já foi adicionado.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (currentUser?.email === value) {
      alert("Você não pode convidar a si mesmo.");
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
      alert("Adicione pelo menos um colaborador.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    try {
      for (const email of emails) {
        await fetch(`${API_URL}/access/invite`, {
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
      }

      setEmails([]);
      setEmailInput("");
      setPapel("Leitor");
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar convite. Verifique se o usuário existe.");
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
        <div className="h-[248px] max-h-[300px] space-y-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#139C73] scrollbar-track-transparent">
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

              {user.status === "Ativo" ? (
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
                <span className="rounded-full bg-[#282828] px-3 py-2 text-[10px] text-white">
                  Pendente
                </span>
              )}
            </div>
          ))}
        </div>
      </Panel>

      {modalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#4a4a4a] bg-[#242424] p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/80">
                Convidar Usuário
              </h2>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-500/10 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <label className="text-sm text-white/70">
                Email do colaborador
              </label>

              <div className="flex gap-4">
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
                      onBlur={addEmail}
                      placeholder="Digite o email e pressione Enter"
                      className="min-w-[220px] flex-1 bg-transparent text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6]"
                    />
                  </div>
                </div>

                <div className="relative w-[155px]">
                  <select
                    value={papel}
                    onChange={(e) =>
                      setPapel(e.target.value as "Editor" | "Leitor")
                    }
                    className="h-[48px] w-full appearance-none rounded-full border border-[#434343] bg-[#282828] px-5 pr-10 text-sm text-white outline-none"
                  >
                    <option value="Leitor">Leitor</option>
                    <option value="Editor">Editor</option>
                  </select>

                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/65">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-7">
              <SecondaryButton
                onClick={() => {
                  setModalOpen(false);
                  setEmails([]);
                  setEmailInput("");
                }}
              >
                Cancelar
              </SecondaryButton>

              <PrimaryButton
                onClick={handleInvite}
              >
                Enviar
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#4a4a4a] bg-[#242424] p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white/80">
                Editar Acesso
              </h2>

              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-500/10 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <select
              value={editPapel}
              onChange={(e) => setEditPapel(e.target.value as "Editor" | "Leitor")}
              className="w-full rounded-lg border border-[#434343] bg-[#282828] px-3 py-2 text-sm text-[#A6A6A6] outline-none"
            >
              <option value="Leitor">Leitor</option>
              <option value="Editor">Editor</option>
            </select>

            <div className="mt-6 flex justify-end">
              <PrimaryButton onClick={handleUpdateAccess}>
                Salvar
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}