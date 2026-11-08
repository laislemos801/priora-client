import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import { requestPasswordReset } from "@/routes/user";
import AuthLayout, { AUTH_LINK } from "@/components/auth/AuthLayout";
import SubmitButton from "@/components/auth/SubmitButton";
import FormAlert from "@/components/auth/FormAlert";

const RESEND_WAIT = 30; // segundos entre reenvios

/** Passo 2 da recuperação: confirmação de que o e-mail foi enviado. */
export default function EmailSend() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  const [cooldown, setCooldown] = useState(RESEND_WAIT);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleResend() {
    if (!email) return;
    setError(null);
    setResending(true);
    try {
      await requestPasswordReset(email);
      toast.success("Enviamos um novo link.");
      setCooldown(RESEND_WAIT);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível reenviar o e-mail.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout
      icon={<FiMail size={20} />}
      title="Verifique seu e-mail"
      subtitle={
        email ? (
          <>
            Enviamos um link de redefinição para <span className="font-medium text-white">{email}</span>.
          </>
        ) : (
          "Enviamos um link de redefinição para o e-mail informado."
        )
      }
      footer={
        <Link to="/login" className={`${AUTH_LINK} inline-flex items-center gap-1.5`}>
          <FiArrowLeft size={14} />
          Voltar para o login
        </Link>
      }
    >
      <div className="flex flex-col gap-5">
        {error && <FormAlert>{error}</FormAlert>}

        <ol className="space-y-3 text-sm text-white/70">
          {[
            "Abra o e-mail enviado pelo Priora.",
            "Clique no link para criar uma nova senha.",
            "Não encontrou? Confira a caixa de spam ou lixo eletrônico.",
          ].map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#139C73]/15 text-[11px] font-semibold text-emerald-400">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {email ? (
          <SubmitButton
            type="button"
            onClick={handleResend}
            loading={resending}
            loadingText="Reenviando..."
            disabled={cooldown > 0}
            variant="secondary"
          >
            {cooldown > 0 ? `Reenviar e-mail em ${cooldown}s` : "Reenviar e-mail"}
          </SubmitButton>
        ) : (
          <Link
            to="/recover"
            className="inline-flex h-11 items-center justify-center rounded-md border border-[#434343] text-sm font-semibold transition-colors hover:border-[#606060] hover:bg-[#2B2B2B]"
          >
            Usar outro e-mail
          </Link>
        )}
      </div>
    </AuthLayout>
  );
}
