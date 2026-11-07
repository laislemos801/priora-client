import { useState } from "react";
import toast from "react-hot-toast";
import NavIcon from "@/components/ui/NavIcon";
import { IoIosArrowBack } from "react-icons/io";
import { FiAlertCircle, FiHelpCircle, FiInbox, FiLock, FiMessageSquare } from "react-icons/fi";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { PAGE_CARD_FILL } from "@/components/ui/EmptyState";
import { apiFetch } from "@/lib/api";

const LABEL = "mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-[#888]";
const INPUT =
  "w-full rounded-md border border-[#434343] bg-[#282828] px-3 py-2 text-sm text-white outline-none placeholder:text-[#777] transition-colors hover:border-[#606060] focus:border-[#139C73]";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MESSAGE_LIMIT = 2000;

// O backend recebe só nome, e-mail e mensagem: o assunto vai como prefixo da mensagem.
const SUBJECTS = [
  { value: "Dúvida", icon: FiHelpCircle, hint: "Como usar uma função ou entender um resultado." },
  { value: "Pedido", icon: FiInbox, hint: "Solicitar um recurso, acesso ou ajuste." },
  { value: "Reclamação", icon: FiAlertCircle, hint: "Algo que não funcionou como esperado." },
  { value: "Feedback", icon: FiMessageSquare, hint: "Sugestões e elogios para melhorar o Priora." },
] as const;

type Subject = (typeof SUBJECTS)[number]["value"];

type Props = {
  onBack?: () => void;
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export function Help({ onBack }: Props) {
  const user = getStoredUser();

  const [subject, setSubject] = useState<Subject>("Dúvida");
  const [form, setForm] = useState({
    firstName: user.primeiroNome ?? "",
    lastName: user.sobrenome ?? "",
    email: user.email ?? "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (sending) return;

    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("Informe seu nome e sobrenome.");
      return;
    }
    if (!EMAIL_REGEX.test(form.email.trim())) {
      toast.error("Informe um email válido.");
      return;
    }
    if (!form.message.trim()) {
      toast.error("Escreva sua mensagem.");
      return;
    }

    try {
      setSending(true);
      const response = await apiFetch("/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          message: `[Assunto: ${subject}]\n\n${form.message.trim()}`,
        }),
      });

      if (!response.ok) throw new Error(`Erro ${response.status}`);

      toast.success("Mensagem enviada com sucesso!");
      setForm((prev) => ({ ...prev, message: "" }));
    } catch {
      toast.error("Não foi possível enviar a mensagem. Tente novamente.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <div className={`rounded-xl border border-[#575757] bg-[#242424] ${PAGE_CARD_FILL}`}>
          {/* Cabeçalho */}
          <header className="flex items-center gap-2.5 border-b border-[#575757] px-4 py-4 md:px-6">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Voltar"
                className="-ml-2 mr-1 rounded-full p-2 text-white/65 transition-colors hover:bg-[#363636] hover:text-white"
              >
                <IoIosArrowBack size={16} />
              </button>
            )}
            <NavIcon name="help" className="text-emerald-400" />
            <h1 className="text-lg font-semibold text-slate-100">Contato</h1>
          </header>

          {/* Corpo */}
          <div className="grid flex-1 gap-6 p-4 md:p-6 lg:grid-cols-[1fr_340px]">
            {/* Formulário */}
            <section className="flex flex-col rounded-lg border border-[#3d3d3d] bg-[#2B2B2B] p-6">
              <h2 className="text-base font-medium text-white">Envie uma mensagem</h2>
              <p className="mb-6 mt-1 text-sm text-white/65">
                Preencha o formulário com pedidos, dúvidas, reclamações ou feedbacks.
              </p>

              <div className="mb-5">
                <span className={LABEL}>Assunto</span>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Assunto">
                  {SUBJECTS.map(({ value }) => {
                    const active = subject === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setSubject(value)}
                        className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                          active
                            ? "border-[#139C73] bg-[#139C73]/15 text-[#18C18A]"
                            : "border-[#434343] text-white/65 hover:border-[#606060] hover:text-white"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className={LABEL}>Primeiro nome</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Nome"
                    value={form.firstName}
                    onChange={handleChange}
                    className={INPUT}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={LABEL}>Sobrenome</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Sobrenome"
                    value={form.lastName}
                    onChange={handleChange}
                    className={INPUT}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="email" className={LABEL}>Email para resposta</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seuemail@exemplo.com"
                  value={form.email}
                  onChange={handleChange}
                  className={INPUT}
                />
              </div>

              <div className="mt-4 flex flex-1 flex-col">
                <label htmlFor="message" className={LABEL}>Mensagem</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Escreva sua mensagem"
                  maxLength={MESSAGE_LIMIT}
                  value={form.message}
                  onChange={handleChange}
                  className={`${INPUT} min-h-[180px] flex-1 resize-none`}
                />
                <span className="mt-1 text-right text-xs text-white/40">
                  {form.message.length}/{MESSAGE_LIMIT}
                </span>
              </div>

              <div className="mt-4">
                <PrimaryButton onClick={handleSubmit} disabled={sending}>
                  {sending ? "Enviando..." : "Enviar Mensagem"}
                </PrimaryButton>
              </div>
            </section>

            {/* Orientações */}
            <aside className="flex flex-col gap-4">
              <section className="rounded-lg border border-[#3d3d3d] bg-[#2B2B2B] p-6">
                <h2 className="mb-4 text-base font-medium text-white">Como podemos ajudar</h2>
                <ul className="space-y-4">
                  {SUBJECTS.map(({ value, icon: Icon, hint }) => (
                    <li key={value} className="flex gap-3">
                      <span className="mt-0.5 text-emerald-400">
                        <Icon size={16} />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">{value}</p>
                        <p className="text-sm text-white/55">{hint}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-6">
                <div className="mb-2 flex items-center gap-2 text-amber-300">
                  <FiLock size={16} />
                  <h2 className="text-base font-medium">Sigilo das informações</h2>
                </div>
                <p className="text-sm text-white/65">
                  Não envie nomes, documentos ou detalhes de inquéritos por este formulário. Descreva o problema sem
                  dados sigilosos; a equipe responde pelo e-mail informado.
                </p>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
