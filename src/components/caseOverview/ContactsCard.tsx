import { Edit, Trash2, X, Phone, Briefcase } from "lucide-react";
import { useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import Panel from "./Panel";

const API_URL = "http://127.0.0.1:8000";

type Contact = {
  id: string;
  nome: string;
  cargo: string;
  celular?: string | null;
};

type Props = {
  casoId: string;
  contacts: Contact[];
  onRefresh: () => void;
};

type ModalMode = "create" | "edit";

export default function ContactsCard({ casoId, contacts, onRefresh }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [celular, setCelular] = useState("");

  const MAX_NOME = 60;
  const MAX_CARGO = 40;

  function openCreateModal() {
    setMode("create");
    setEditingId(null);
    setNome("");
    setCargo("");
    setCelular("");
    setModalOpen(true);
  }

  function openEditModal(contact: Contact) {
    setMode("edit");
    setEditingId(contact.id);
    setNome(contact.nome);
    setCargo(contact.cargo);
    setCelular(contact.celular || "");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setNome("");
    setCargo("");
    setCelular("");
  }

  function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) {
      return `(${numbers}`;
    }

    if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)})${numbers.slice(2)}`;
    }

    return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  }

  function validateFields() {
    if (!nome.trim()) {
      alert("Informe o nome do contato.");
      return false;
    }

    if (!cargo.trim()) {
      alert("Informe o cargo do contato.");
      return false;
    }

    if (nome.trim().length > MAX_NOME) {
      alert(`O nome deve ter no máximo ${MAX_NOME} caracteres.`);
      return false;
    }

    if (cargo.trim().length > MAX_CARGO) {
      alert(`O cargo deve ter no máximo ${MAX_CARGO} caracteres.`);
      return false;
    }

    if (celular && celular.replace(/\D/g, "").length !== 11) {
      alert("Informe um celular válido.");
      return false;
    }

    return true;
  }

  async function handleSubmit() {
    if (!validateFields()) return;

    if (mode === "create") {
      await fetch(`${API_URL}/contacts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          casoId,
          nome: nome.trim(),
          cargo: cargo.trim(),
          celular: celular.trim() || null,
        }),
      });
    }

    if (mode === "edit" && editingId) {
      await fetch(`${API_URL}/contacts/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          cargo: cargo.trim(),
          celular: celular.trim() || null,
        }),
      });
    }

    closeModal();
    onRefresh();
  }

  async function handleDelete(contatoId: string) {
    const confirmed = confirm("Deseja excluir este contato?");
    if (!confirmed) return;

    await fetch(`${API_URL}/contacts/case/${casoId}/${contatoId}`, {
      method: "DELETE",
    });

    onRefresh();
  }

  return (
    <>
      <Panel
        title="Lista Rápida de Contatos"
        action={
          <SecondaryButton
            onClick={openCreateModal}
          >
            Adicionar
          </SecondaryButton>
        }
      >
        <div className="max-h-[195px] space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#139C73] scrollbar-track-transparent">
          {contacts.length === 0 && (
            <p className="text-sm text-white/65">
              Nenhum contato cadastrado.
            </p>
          )}

          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              className="rounded-lg border border-[#3a3a3a] p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-regular uppercase text-emerald-400">
                    Contato {index + 1}
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-slate-100">
                    {contact.nome}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(contact)}
                    className="rounded-full p-1.5 text-white/65 hover:bg-slate-500/10 hover:text-white"
                  >
                    <Edit size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="rounded-full p-1.5 text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Briefcase size={13} className="text-white/65" />
                  <span className="text-white/65">Cargo:</span>
                  <span className="text-slate-100">{contact.cargo}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-white/65" />
                  <span className="text-white/65">Celular:</span>
                  <span className="text-slate-100">
                    {contact.celular || "-"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-[#4a4a4a] bg-[#242424] shadow-xl overflow-hidden">
            
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-lg font-semibold text-white/76">
                {mode === "create"
                  ? "Adicionar Contato"
                  : "Editar Contato"}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-full p-1 text-white/65 hover:bg-slate-500/10 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5">
              <div className="border-t border-[#3a3a3a]" />
            </div>

            <div className="space-y-4 p-5">
              <input
                value={nome}
                maxLength={MAX_NOME}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                className="w-full rounded-lg border border-[#434343] bg-[#282828] px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6]"
              />

              <input
                value={cargo}
                maxLength={MAX_CARGO}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Cargo"
                className="w-full rounded-lg border border-[#434343] bg-[#282828] px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6]"
              />

              <input
                value={celular}
                onChange={(e) =>
                  setCelular(formatPhone(e.target.value))
                }
                placeholder="Telefone Celular"
                className="w-full rounded-lg border border-[#434343] bg-[#282828] px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6]"
              />
            </div>

            <div className="px-5">
              <div className="border-t border-[#3a3a3a]" />
            </div>

            <div className="flex gap-3 p-5">
              <button
                onClick={closeModal}
                className="w-full rounded-md bg-[#136D52]/26 px-4 py-2 text-sm text-[#00a87e] transition hover:bg-[#136D52]/40"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
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