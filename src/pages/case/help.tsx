import { useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineSupportAgent } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { apiFetch } from "@/lib/api";

const LABEL = "text-[11px] font-medium text-[#888] uppercase tracking-widest block mb-1.5";
const INPUT = "w-full bg-[#282828] border border-[#434343] rounded-md px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6] hover:border-[#606060] focus:border-[#606060] transition-colors";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
          message: form.message.trim(),
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
    <div className="min-h-screen bg-[#242424]">
      <div className="flex-1 px-4 pb-4 pt-2 md:px-6 md:pb-6 md:pt-3">
        <div className="rounded-xl border border-[#575757] bg-[#242424]">

          {/* Toolbar */}
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#575757]">
            {onBack && (
              <button
                onClick={onBack}
                className="mr-1 p-2 -ml-2 rounded-full text-white/65 hover:bg-[#363636] hover:text-white transition-colors"
              >
                <IoIosArrowBack size={16} />
              </button>
            )}
            <MdOutlineSupportAgent size={18} className="text-emerald-400" />
            <span className="text-slate-100 font-semibold text-base md:text-lg">
              Contato
            </span>
          </div>

          {/* Form */}
          <div className="p-6 max-w-2xl space-y-5">
            <p className="text-sm text-white/65">
              Preencha o formulário de contato com pedidos, dúvidas, reclamações ou feedbacks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Primeiro nome</label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="Nome"
                  value={form.firstName}
                  onChange={handleChange}
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>Sobrenome</label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Sobrenome"
                  value={form.lastName}
                  onChange={handleChange}
                  className={INPUT}
                />
              </div>
            </div>

            <div>
              <label className={LABEL}>Email</label>
              <input
                name="email"
                type="email"
                placeholder="seuemail@exemplo.com"
                value={form.email}
                onChange={handleChange}
                className={INPUT}
              />
            </div>

            <div>
              <label className={LABEL}>Mensagem</label>
              <textarea
                name="message"
                placeholder="Escreva sua mensagem"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className={`${INPUT} resize-none`}
              />
            </div>

            <PrimaryButton onClick={handleSubmit}>
              {sending ? "Enviando..." : "Enviar Mensagem"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
