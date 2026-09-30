import { useState } from "react";
import { MdOutlineSupportAgent } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import toast from "react-hot-toast";

import PrimaryButton from "@/components/ui/PrimaryButton";
import { apiFetch } from "@/lib/api";

const LABEL =
  "text-[11px] font-medium text-[#888] uppercase tracking-widest block mb-1.5";

const INPUT =
  "w-full bg-[#282828] border border-[#434343] rounded-md px-3 py-2 text-sm text-[#A6A6A6] outline-none placeholder:text-[#A6A6A6] hover:border-[#606060] focus:border-[#606060] transition-colors";

type Props = {
  onBack?: () => void;
};

export function Help({ onBack }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!firstName.trim()) {
      toast.error("Digite seu primeiro nome");
      return;
    }

    if (!lastName.trim()) {
      toast.error("Digite seu sobrenome");
      return;
    }

    if (!email.trim()) {
      toast.error("Digite seu email");
      return;
    }

    if (!message.trim()) {
      toast.error("Digite sua mensagem");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch("/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          message,
        }),
      });

      if (!response.ok) {
        toast.error("Erro ao enviar mensagem");
        return;
      }

      toast.success("Mensagem enviada com sucesso!");

      setFirstName("");
      setLastName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

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

            <MdOutlineSupportAgent
              size={18}
              className="text-emerald-400"
            />

            <span className="text-slate-100 font-semibold text-base md:text-lg">
              Contato
            </span>
          </div>

          {/* Form */}
          <div className="p-6 max-w-2xl space-y-5">
            <p className="text-sm text-white/65">
              Preencha o formulário de contato com pedidos, dúvidas,
              reclamações ou feedbacks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL}>Primeiro nome</label>

                <input
                  type="text"
                  placeholder="Nome"
                  className={INPUT}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div>
                <label className={LABEL}>Sobrenome</label>

                <input
                  type="text"
                  placeholder="Sobrenome"
                  className={INPUT}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={LABEL}>Email</label>

              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                className={INPUT}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className={LABEL}>Mensagem</label>

              <textarea
                placeholder="Escreva sua mensagem"
                rows={5}
                className={`${INPUT} resize-none`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <PrimaryButton onClick={handleSubmit}>
              {loading ? "Enviando..." : "Enviar Mensagem"}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}
